#!/usr/bin/env node
/**
 * Documentation Drift Check — 文档漂移检查（零依赖，纯静态，不读业务代码内容）
 *
 * 检查"当前"文档中声称的事实是否与仓库一致：
 *   1. 当前文档清单本身存在（含 decisions/ 下新增的 ADR）
 *   2. 文档中反引号引用的 src/ scripts/ tests/ docs/ 路径存在
 *   3. 文档中反引号引用的裸 .md 文件名可解析（仓库根目录或所在文档目录）
 *   4. 文档中的 `npm run <script>` 命令存在于 package.json scripts
 *   5. package.json 中 `npx tsx <file>` 类脚本的目标文件存在
 *
 * 有意豁免：历史文档（HANDOFF.md / PERFORMANCE.md / docs/agents/）、通配符路径、
 * 服务器侧路径、语义性声明（功能是否存在、数字口径）——后者靠人工/AI 判断。
 *
 * 用法：npm run check:docs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const CURRENT_DOCS = [
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  'CURRENT_STATE.md',
  'PROJECT_CONTEXT.md',
  'docs/architecture/ARCHITECTURE.md',
  'docs/architecture/decisions/TEMPLATE.md',
  'docs/engineering/AI_HANDOFF.md',
  'docs/engineering/CRITICAL_BUSINESS_RULES.md',
  'docs/engineering/CRITICAL_AREAS.md',
];

// decisions/ 下新增 ADR 自动纳入检查
const decisionsDir = path.join(ROOT, 'docs/architecture/decisions');
if (fs.existsSync(decisionsDir)) {
  for (const f of fs.readdirSync(decisionsDir)) {
    const rel = 'docs/architecture/decisions/' + f;
    if (!CURRENT_DOCS.includes(rel)) CURRENT_DOCS.push(rel);
  }
}

const problems = [];

// 1. 当前文档存在性
const existingDocs = [];
for (const doc of CURRENT_DOCS) {
  if (fs.existsSync(path.join(ROOT, doc))) {
    existingDocs.push(doc);
  } else {
    problems.push(`[doc-missing] 当前文档不存在: ${doc}`);
  }
}

// 提取规则：反引号内、以 src/ scripts/ tests/ docs/ 开头（可带 ./ 前缀），
// 字符不含 * { ( 等，因此通配符与花括号展开写法天然跳过
const PATH_RE = /`\.?(src|scripts|tests|docs)\/[A-Za-z0-9_./\-[\]]+`/g;
const MD_RE = /`([A-Za-z0-9_\-]+\.md)`/g;
const RUN_RE = /npm run ([a-zA-Z:\-]+)/g;

/** doc -> 引用集合，用于去重与定位 */
const pathRefs = new Map(); // 路径 -> Set(文档)
const mdRefs = new Map(); // .md 文件名 -> Set(文档)
const runRefs = new Map(); // npm script 名 -> Set(文档)

function add(map, key, doc) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(doc);
}

for (const doc of existingDocs) {
  const content = fs.readFileSync(path.join(ROOT, doc), 'utf8');
  for (const m of content.matchAll(PATH_RE)) {
    add(pathRefs, m[0].slice(1, -1).replace(/^\.\//, ''), doc);
  }
  for (const m of content.matchAll(MD_RE)) {
    if (/^NNNN/.test(m[1])) continue; // ADR 命名占位符（如 NNNN-short-title.md），非真实文件
    add(mdRefs, m[1], doc);
  }
  for (const m of content.matchAll(RUN_RE)) {
    add(runRefs, m[1], doc);
  }
}

// 2. 路径存在性
for (const [p, docs] of pathRefs) {
  if (!fs.existsSync(path.join(ROOT, p))) {
    problems.push(`[path-missing] ${p}（被引用于: ${[...docs].join(', ')}）`);
  }
}

// 3. 裸 .md 文件名解析（仓库根目录 或 引用文档所在目录）
for (const [name, docs] of mdRefs) {
  const ok = [...docs].some((doc) => {
    const base = path.dirname(path.join(ROOT, doc));
    return fs.existsSync(path.join(ROOT, name)) || fs.existsSync(path.join(base, name));
  });
  if (!ok) {
    problems.push(`[md-missing] ${name}（被引用于: ${[...docs].join(', ')}）`);
  }
}

// 4. npm run 命令存在性
for (const [script, docs] of runRefs) {
  if (!pkg.scripts || !(script in pkg.scripts)) {
    problems.push(`[script-missing] npm run ${script}（被引用于: ${[...docs].join(', ')}）`);
  }
}

// 5. package.json 中 npx tsx 类脚本的目标文件存在性
for (const [name, cmd] of Object.entries(pkg.scripts || {})) {
  const m = /npx tsx (\S+)/.exec(cmd);
  if (m && !fs.existsSync(path.join(ROOT, m[1]))) {
    problems.push(`[script-target-missing] npm run ${name} 指向不存在的文件: ${m[1]}`);
  }
}

// 输出
if (problems.length > 0) {
  console.error(`✗ 文档漂移检查发现 ${problems.length} 个问题：\n`);
  for (const p of problems) console.error('  - ' + p);
  console.error('\n修复方式：以代码/仓库事实为准修正文档（或修正坏掉的 script），禁止反向迁就文档改正确代码。');
  process.exit(1);
} else {
  console.log(
    `✓ 文档漂移检查通过：${existingDocs.length} 个当前文档、` +
      `${pathRefs.size} 个路径引用、${mdRefs.size} 个文档引用、${runRefs.size} 个 npm 命令、package.json tsx 目标全部一致`
  );
}
