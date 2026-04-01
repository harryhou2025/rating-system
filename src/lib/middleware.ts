import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function withAuth(handler: (req: NextRequest, userId: string, role: string) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: '未授权访问' },
          { status: 401 }
        );
      }
      
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return NextResponse.json(
          { error: '无效的令牌' },
          { status: 401 }
        );
      }
      
      return handler(req, decoded.userId, decoded.role);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: '认证失败' },
        { status: 500 }
      );
    }
  };
}

export function withAdminAuth(handler: (req: NextRequest, userId: string) => Promise<NextResponse>) {
  return withAuth(async (req, userId, role) => {
    if (role !== 'admin') {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }
    
    return handler(req, userId);
  });
}

export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}
