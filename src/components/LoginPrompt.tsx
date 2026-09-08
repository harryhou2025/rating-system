'use client';

import React from 'react';

interface Props {
  open: boolean;
  /** 登录/注册成功后回跳的答题页地址，如 /assessment/gad7-scale */
  redirectPath: string;
  /** 用户选择"匿名查看结果"时回调（答案暂存由父组件负责） */
  onAnonymous: () => void;
}

/**
 * 提交测评前的登录软引导弹窗：
 * 未登录用户可选「登录/注册」（保存记录到账号）或「匿名查看结果」（不关联账号，与原行为一致）。
 * 结果页与分享链接保持公开，不做强制拦截。
 */
const LoginPrompt: React.FC<Props> = ({ open, redirectPath, onAnonymous }) => {
  if (!open) return null;

  const goAuth = (path: string) => {
    window.location.href = `${path}?redirect=${encodeURIComponent(redirectPath)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-800">登录后可保存测评记录</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          登录/注册后，本次及以后的测评记录会保存到账号，可在个人中心随时回看。
          也可以选择匿名查看本次结果，不会关联任何账号。
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={() => goAuth('/login')}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            登录 / 注册
          </button>
          <button
            onClick={onAnonymous}
            className="w-full rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            匿名查看结果
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
