'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Heart, Users, Activity, Clock, BookOpen, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [scales, setScales] = React.useState<any[]>([]);
  const [isLoadingScales, setIsLoadingScales] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState('全部');
  const [categories, setCategories] = React.useState<string[]>(['全部']);

  React.useEffect(() => {
    // 加载量表数据
    const fetchScales = async () => {
      try {
        setIsLoadingScales(true);
        const response = await fetch('/api/scales');
        if (!response.ok) {
          throw new Error('获取量表失败');
        }
        const data = await response.json();
        const activeScales = data.filter((scale: any) => scale.isActive);
        setScales(activeScales);
        
        // 提取所有分类
        const uniqueCategories = ['全部', ...new Set(activeScales.map((scale: any) => scale.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('加载量表失败:', err);
      } finally {
        setIsLoadingScales(false);
      }
    };

    fetchScales();
  }, []);

  // 过滤量表
  const filteredScales = selectedCategory === '全部' 
    ? scales 
    : scales.filter((scale) => scale.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* 导航栏 */}
      <Navbar />

      {/* 英雄区域 */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24 bg-white rounded-full p-2">
              <Image
                src="/logo.png"
                alt="靛蓝之家"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            靛蓝之家发育行为身心研究院
          </h1>
          <p className="text-xl mb-4 max-w-3xl mx-auto text-teal-100">
            专业的心理测评与发育行为评估服务
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-teal-100">
            提供ASD、ADHD等多种标准化心理测评工具，帮助您了解身心发展状况
          </p>
        </div>
      </section>

      {/* 分类浏览 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-teal-800">
              量表分类
            </h2>
            <div className="flex items-center gap-2 text-teal-700">
              <Filter className="h-5 w-5" />
              <span className="font-medium">筛选</span>
            </div>
          </div>
          
          {/* 分类标签 */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'secondary'}
                className={`px-6 py-2 rounded-full ${selectedCategory === category ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* 量表列表 */}
          {isLoadingScales ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">加载中...</p>
            </div>
          ) : filteredScales.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">该分类下暂无量表</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredScales.map((scale) => (
                <Card key={scale.id} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-teal-500">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-teal-700 line-clamp-2">
                      {scale.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {scale.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 line-clamp-3 text-sm">
                      {scale.description}
                    </p>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-teal-600" />
                        <span className="text-xs text-gray-600">{scale.targetAudience}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-teal-600" />
                        <span className="text-xs text-gray-600">约{scale.estimatedTime}分钟</span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-2 text-sm"
                      onClick={() => router.push(`/assessment/${scale.id}`)}
                    >
                      开始测评
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 功能特点 */}
      <section className="py-16 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-teal-800 mb-12">
            我们的服务
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-teal-500">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-teal-700 flex items-center gap-2">
                  <Brain className="h-6 w-6" />
                  专业量表
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  集成多种标准化心理测评量表，包括情绪评估、发展障碍等专业工具
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-cyan-500">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-teal-700 flex items-center gap-2">
                  <Heart className="h-6 w-6" />
                  科学评估
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  基于循证医学的评估方法，提供准确可靠的测评结果
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-emerald-500">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-teal-700 flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  个性化建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  根据测评结果提供个性化的干预建议和发展指导
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-teal-700 flex items-center gap-2">
                  <Activity className="h-6 w-6" />
                  持续跟踪
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  支持多次测评记录，追踪发展和改善情况
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-teal-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="靛蓝之家"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-semibold">靛蓝之家发育行为身心研究院</span>
          </div>
          <p className="text-teal-200">
            专业的心理测评与发育行为评估服务
          </p>
          <p className="text-teal-300 text-sm mt-2">
            © 2024 靛蓝之家发育行为身心研究院. 保留所有权利.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
