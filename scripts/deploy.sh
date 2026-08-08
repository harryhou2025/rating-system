#!/usr/bin/env bash
# =============================================================
# 半自动部署脚本（HANDOFF 第八节 · 方案 A）
# 流程：本地 build -> push 代码 -> 打包 .next -> scp 上传 -> 服务器
#       git pull + 备份 db + 解压 .next + 重启 + 健康检查
# 用法：
#   export RS_SERVER_PASSWORD='服务器密码'   # 或配置 SSH 免密
#   ./scripts/deploy.sh
# 前置：工作区无未提交改动；GitHub 仓库为公开可读（服务器 HTTPS pull）
# =============================================================
set -euo pipefail

SERVER="root@42.121.164.189"
DEPLOY_DIR="/var/www/rating-sys"
STAMP="$(date +%Y%m%d-%H%M%S)"
TAR=".deploy_tmp/next-${STAMP}.tar.gz"
REMOTE_SCRIPT=".deploy_tmp/server-deploy.sh"

mkdir -p .deploy_tmp

# 0) 认证：优先 SSH 免密；否则需要 RS_SERVER_PASSWORD
if [[ -z "${RS_SERVER_PASSWORD:-}" ]]; then
  echo "提示：未设置 RS_SERVER_PASSWORD，将依赖 SSH 密钥免密登录。"
fi

# 1) 工作区检查（半自动：有未提交改动则中止，避免部署到未确认的代码）
if ! git diff --quiet HEAD; then
  echo "!! 工作区有未提交改动，先提交或 stash："
  git status --short
  exit 1
fi

# 2) 本地构建（服务器 1.6GB 内存不能 build，产物必须本地生成）
echo "==> [1/6] 本地构建 npm run build ..."
npm run build

# 3) 推送代码到 GitHub（服务器将通过 git pull 获取）
echo "==> [2/6] 推送 main 到 origin ..."
git push origin main

# 4) 打包 .next（排除 cache，减小体积；node_modules/db/env 一律不进包）
echo "==> [3/6] 打包 .next ..."
tar czf "$TAR" --exclude='.next/cache' .next

# 5) 生成服务器端执行脚本（独立文件，避免 expect 嵌套转义问题）
cat > "$REMOTE_SCRIPT" <<'SCRIPT'
#!/bin/bash
# 服务器端执行：git pull + 备份 db + 解压 .next + 重启 + 健康检查
# 用法：bash server-deploy.sh <next-tar-文件名>
set -euo pipefail
DEPLOY_DIR="/var/www/rating-sys"
TAR_FILE="$1"
cd "$DEPLOY_DIR"

echo "==> [4/6] git pull origin main"
git pull origin main

echo "==> 备份数据库"
cp rating_sys.db "rating_sys.db.bak-$(date +%Y%m%d-%H%M%S)"

echo "==> 停服"
pm2 stop rating-sys

echo "==> 解压 .next（覆盖构建产物）"
tar xzf "$TAR_FILE"

echo "==> 依赖处理（仅当 package.json 变化时手动执行）"
echo "    npm install --omit=dev --registry=https://registry.npmmirror.com"
echo "    如需导入新量表数据：npx tsx scripts/import-cdmm.ts './5 里程碑定稿 2~8岁 20220217.xlsx'（先 npm install --no-save tsx --registry=...）"

echo "==> 重启"
pm2 restart rating-sys
sleep 6

echo "==> 健康检查"
curl -s -o /dev/null -w 'http_code=%{http_code}\n' http://localhost:3000/
SCRIPT
chmod +x "$REMOTE_SCRIPT"

# 6) 上传 tar + 远程脚本
echo "==> [5/6] scp 上传 ..."
expect <<EOF
set timeout 300
spawn scp -o StrictHostKeyChecking=no "$TAR" "$REMOTE_SCRIPT" $SERVER:$DEPLOY_DIR/
expect {
  "password:" { send "$RS_SERVER_PASSWORD\r"; exp_continue }
  "assword:" { send "$RS_SERVER_PASSWORD\r"; exp_continue }
  eof
}
EOF

# 7) 服务器执行
echo "==> [6/6] 服务器执行部署 ..."
expect <<EOF
set timeout 600
spawn ssh -o StrictHostKeyChecking=no $SERVER "cd $DEPLOY_DIR && bash server-deploy.sh $(basename "$TAR") && rm -f $(basename "$TAR") server-deploy.sh"
expect {
  "password:" { send "$RS_SERVER_PASSWORD\r"; exp_continue }
  "assword:" { send "$RS_SERVER_PASSWORD\r"; exp_continue }
  eof
}
EOF

# 8) 清理本地临时文件
rm -f "$TAR" "$REMOTE_SCRIPT"
echo "==> 部署流程完成，请核对健康检查 http_code（应为 200）"
