'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const ScalesPage: React.FC = () => {
  const router = useRouter();
  const [scales, setScales] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 加载量表数据
  React.useEffect(() => {
    const fetchScales = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/scales');
        if (!response.ok) {
          throw new Error('获取量表失败');
        }
        const data = await response.json();
        setScales(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScales();
  }, []);

  // 过滤量表（只显示激活的量表）
  const filteredScales = scales.filter(scale => scale.isActive);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">加载失败</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-teal-600 hover:bg-teal-700">
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* 导航栏 */}
      <Navbar />
      <div className="container mx-auto px-4 py-4 flex justify-end">
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="border-teal-600 text-teal-700 hover:bg-teal-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回首页
        </Button>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* 页面标题 */}
        <h1 className="text-3xl font-bold text-center text-teal-800 mb-8">
          心理测评量表
        </h1>

        {/* 量表列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScales.map((scale) => (
            <Card key={scale.id} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-teal-500">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-teal-700">
                  {scale.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {scale.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {scale.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-teal-600" />
                    <span className="text-xs text-gray-600">{scale.targetAudience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-teal-600" />
                    <span className="text-xs text-gray-600">约{scale.estimatedTime}分钟</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-teal-600" />
                    <span className="text-xs text-gray-600">{scale.instructions.substring(0, 20)}...</span>
                  </div>
                </div>
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-2"
                  onClick={() => router.push(`/assessment/${scale.id}`)}
                >
                  开始测评
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScalesPage;
