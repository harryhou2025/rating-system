'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';

import Image from 'next/image';
import { Shield, AlertCircle } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
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
    
    // 验证表单
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
      
      // 检查是否是管理员
      if (data.user.role !== 'admin') {
        setError('您没有管理员权限');
        setIsLoading(false);
        return;
      }
      
      // 保存token到localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // 跳转到管理后台
      window.location.href = '/admin';
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 bg-white rounded-full p-2">
            <Image
              src="/logo.png"
              alt="靛蓝之家"
              fill
              className="object-contain rounded-full"
              priority
            />
          </div>
        </div>
        
        <Card className="shadow-lg border-t-4 border-amber-500">
          <CardHeader>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-amber-600" />
              <CardTitle className="text-2xl font-bold text-center text-slate-800">
                管理员登录
              </CardTitle>
            </div>
            <CardDescription className="text-center">
              此页面仅限管理员使用
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">管理员邮箱</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="请输入管理员邮箱"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="请输入密码"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '管理员登录'}
              </Button>
              
              <div className="text-center">
                <Link href="/" className="text-sm text-gray-500 hover:text-amber-600">
                  返回首页
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-slate-400 mt-6">
          靛蓝之家发育行为身心研究院 · 管理后台
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
