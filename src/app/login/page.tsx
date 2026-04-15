'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Lock, Mail } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('请填写所有字段');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '登录失败');
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans">
      {/* Background */}
      <div className="fixed inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-teal-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-purple-500/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-teal-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">返回首页</span>
          </Link>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 rounded-full p-3 shadow-lg shadow-teal-500/20">
              <Image
                src="/logo.png"
                alt="靛蓝之家"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
          </div>
          
          {/* Login Card */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">用户登录</h1>
              <p className="text-white/60 text-sm">登录账号以使用心理测评系统</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80">邮箱</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="请输入邮箱"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-white/30 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80">密码</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="请输入密码"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-white/30 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full group relative px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 transform hover:-translate-y-1"
                disabled={isLoading}
              >
                <span className="relative z-10">
                  {isLoading ? '登录中...' : '登录'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
              
              <div className="text-center text-sm text-white/50">
                还没有账号？{' '}
                <Link
                  href="/register"
                  className="text-teal-400 hover:text-teal-300 transition-colors"
                >
                  注册
                </Link>
              </div>
            </form>
          </div>
          
          <p className="text-center text-sm text-white/40 mt-8">
            靛蓝之家发育行为身心发展研究院
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
