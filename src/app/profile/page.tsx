'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserCircle, 
  LogOut, 
  FileText, 
  Calendar, 
  ArrowLeft, 
  ChevronRight,
  BarChart3,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [assessments, setAssessments] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // 检查用户是否已登录
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    setUser(user);
    
    // 检查token是否有效（userId不为null）
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.userId === null) {
        // 清除无效token并重新登录
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
    } catch {
      // token解析失败，重新登录
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
      return;
    }
    
    // 获取用户的测评历史
    const fetchAssessments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/assessments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '获取测评记录失败');
        }
        
        const data = await response.json();
        setAssessments(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '未知';
    const date = new Date(dateString + ' UTC');
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Shanghai'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '情绪评估':
        return 'bg-teal-100 text-teal-800';
      case '发展障碍':
        return 'bg-cyan-100 text-cyan-800';
      case '心理健康':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* 导航栏 */}
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
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="border-teal-600 text-teal-700 hover:bg-teal-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-400"
            >
              <LogOut className="h-4 w-4 mr-2" />
              登出
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* 个人信息卡片 */}
        <Card className="shadow-lg mb-8 border-t-4 border-teal-600">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-teal-100 rounded-full">
                <UserCircle className="h-12 w-12 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-teal-800">
                  {user?.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {user?.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-teal-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-teal-700">{assessments.length}</p>
                <p className="text-gray-600">已完成测评</p>
              </div>
              <div className="bg-cyan-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-cyan-700">
                  {new Set(assessments.map(a => a.scale_id)).size}
                </p>
                <p className="text-gray-600">测评量表种类</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-emerald-700">
                  {assessments.length > 0 ? formatDate(assessments[0].completed_at).split(' ')[0] : '无'}
                </p>
                <p className="text-gray-600">最近测评时间</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 测评历史 */}
        <Card className="shadow-lg border-t-4 border-cyan-600">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-teal-800 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              测评历史
            </CardTitle>
            <CardDescription>
              查看您所有的测评记录和结果
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <BarChart3 className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  获取测评记录失败
                </h3>
                <p className="text-gray-600 mb-6">
                  {error}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  重新加载
                </Button>
              </div>
            ) : assessments.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  暂无测评记录
                </h3>
                <p className="text-gray-600 mb-6">
                  您还没有完成任何测评，开始您的第一次测评吧
                </p>
                <Button
                  onClick={() => router.push('/scales')}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  去测评
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/result/${assessment.id}`)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-800">
                            {assessment.scale_title}
                          </h3>
                          <Badge className={getCategoryColor(assessment.scale_category)}>
                            {assessment.scale_category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(assessment.completed_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            已完成
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {assessment.result && (
                          <div className="text-right">
                            <p className="text-sm text-gray-600">测评结果</p>
                            <p className="font-semibold text-teal-700">
                              {assessment.result.level || assessment.result.interpretation || '查看详情'}
                            </p>
                          </div>
                        )}
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
