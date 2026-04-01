'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Calendar, User, Scale } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

const ResultPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;
  
  const [assessment, setAssessment] = React.useState<any>(null);
  const [scale, setScale] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 加载测评结果数据
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 获取测评结果
        const assessmentResponse = await fetch(`/api/assessments/${assessmentId}`);
        if (!assessmentResponse.ok) {
          throw new Error('获取测评结果失败');
        }
        const assessmentData = await assessmentResponse.json();
        setAssessment(assessmentData);

        // 获取量表信息
        if (assessmentData.scale_id) {
          const scaleResponse = await fetch(`/api/scales/${assessmentData.scale_id}`);
          if (!scaleResponse.ok) {
            throw new Error('获取量表信息失败');
          }
          const scaleData = await scaleResponse.json();
          setScale(scaleData);
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    if (assessmentId) {
      fetchData();
    }
  }, [assessmentId]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + ' UTC');
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Shanghai'
    });
  };

  // 计算严重程度颜色
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case '无焦虑':
      case '无抑郁':
      case '无明显症状':
      case '低风险':
      case '非自闭症':
        return 'bg-green-100 text-green-800';
      case '轻度焦虑':
      case '轻度抑郁':
      case '轻度症状':
      case '中度风险':
      case '轻度自闭症':
        return 'bg-yellow-100 text-yellow-800';
      case '中度焦虑':
      case '中度抑郁':
      case '中度症状':
      case '高风险':
      case '中度自闭症':
        return 'bg-orange-100 text-orange-800';
      case '重度焦虑':
      case '重度抑郁':
      case '重度症状':
      case '重度自闭症':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">加载失败</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/scales')}>
            返回量表列表
          </Button>
        </div>
      </div>
    );
  }

  if (!assessment || !scale) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-600 mb-4">测评结果不存在</h1>
          <Button onClick={() => router.push('/scales')}>
            返回量表列表
          </Button>
        </div>
      </div>
    );
  }

  const result = assessment.result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* 标题和返回按钮 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
            {scale.title} 测评结果
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/scales')}
              variant="outline"
              className="border-blue-600 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              返回量表列表
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="border-blue-600 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Button>
          </div>
        </div>

        {/* 测评信息 */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardDescription className="text-gray-600">
              {scale.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  测评时间：{formatDate(assessment.completed_at)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  测评用户：{assessment.user_id ? '已登录用户' : '匿名用户'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  测评状态：已完成
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 结果摘要 */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-700">
              测评结果摘要
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">总得分：</span>
                <span className="text-2xl font-bold text-blue-600">
                  {result.totalScore}
                </span>
              </div>
              
              {result.severity && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">严重程度：</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                    {result.severity}
                  </span>
                </div>
              )}
              
              {result.riskLevel && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">风险等级：</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.riskLevel)}`}>
                    {result.riskLevel}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">建议：</span>
                <span className="text-gray-700">{result.recommendation}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 详细结果 */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-700">
              详细结果
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.details && (
              <div className="space-y-3">
                {Object.entries(result.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">
                      {key === 'range' ? '得分范围' :
                       key === 'cutoff' ? '临界值' :
                       key === 'factorScores' ? '因子分' :
                       key === 'positiveItems' ? '阳性项目数' :
                       key === 'riskCount' ? '风险题数量' :
                       key === 'dimensionScores' ? '维度得分' :
                       key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <span className="text-gray-700">
                      {typeof value === 'object' ? JSON.stringify(value) : (value as React.ReactNode)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">结果解释</h4>
              <p className="text-gray-700 text-sm">
                {scale.result_interpretation}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <Button
            onClick={() => router.push('/scales')}
            variant="secondary"
          >
            选择其他量表
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => {
              // 打印结果
              window.print();
            }}
          >
            <FileText className="h-4 w-4" />
            打印结果
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
