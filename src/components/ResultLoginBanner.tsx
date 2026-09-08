'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

/**
 * 结果页顶部登录引导条（仅未登录时显示，可关闭）。
 * 点击登录/注册后回跳当前结果页；结果页本身保持公开，不做强制拦截。
 */
const ResultLoginBanner: React.FC<{ assessmentId: string }> = ({ assessmentId }) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem('token')) setVisible(true);
  }, []);

  if (!visible) return null;

  const redirect = `/result/${assessmentId}`;

  return (
    <div className="relative z-20 border-b border-indigo-500/30 bg-indigo-600/15">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-indigo-200">
          登录后可保存本次测评记录，并在个人中心随时回看历史报告。
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            立即登录
          </Link>
          <Link
            href={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="rounded-lg border border-indigo-400/40 px-4 py-1.5 text-sm font-medium text-indigo-200 hover:bg-indigo-500/10 transition-colors"
          >
            注册
          </Link>
          <button
            onClick={() => setVisible(false)}
            aria-label="关闭"
            className="p-1 text-indigo-300/70 hover:text-indigo-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultLoginBanner;
