'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);

  // 检查token是否过期
  const checkTokenExpiry = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() < expiry;
    } catch {
      return false;
    }
  };

  // 检查登录状态
  const checkLoginStatus = () => {
    const userStr = localStorage.getItem('user');
    const tokenValid = checkTokenExpiry();

    if (userStr && tokenValid) {
      setUser(JSON.parse(userStr));
    } else {
      // 清除无效的登录信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  // 初始化时检查登录状态
  React.useEffect(() => {
    checkLoginStatus();

    // 定期检查登录状态（每30秒）
    const interval = setInterval(checkLoginStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white shadow-md border-b-4 border-teal-600">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image
              src="/logo.png"
              alt="靛蓝之家"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold text-teal-800">靛蓝之家发育行为身心研究院</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/profile">
              <Button
                variant="ghost"
                className="rounded-full p-2 hover:bg-teal-100"
              >
                <UserCircle className="h-6 w-6 text-teal-700" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button 
                  variant="outline"
                  className="border-teal-600 text-teal-700 hover:bg-teal-50"
                >
                  登录
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="rounded-full p-2 hover:bg-teal-100"
                >
                  <UserCircle className="h-6 w-6 text-teal-700" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
