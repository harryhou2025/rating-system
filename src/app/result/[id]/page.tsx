'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, Calendar, User, Scale } from 'lucide-react';
import Image from 'next/image';

const ResultPage: React.FC = () => {
  const params = useParams();
  const assessmentId = params.id as string;
  
  const [assessment, setAssessment] = React.useState<any>(null);
  const [scale, setScale] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('正在获取测评数据，ID:', assessmentId);
        
        const assessmentResponse = await fetch(`/api/assessments/${assessmentId}`);
        if (!assessmentResponse.ok) {
          const errorText = await assessmentResponse.text();
          console.error('获取测评结果失败:', assessmentResponse.status, errorText);
          throw new Error(`获取测评结果失败 (${assessmentResponse.status})`);
        }
        const assessmentData = await assessmentResponse.json();
        console.log('获取到的测评数据:', assessmentData);
        setAssessment(assessmentData);

        if (assessmentData.scale_id) {
          const scaleResponse = await fetch(`/api/scales/${assessmentData.scale_id}`);
          if (!scaleResponse.ok) {
            const errorText = await scaleResponse.text();
            console.error('获取量表信息失败:', scaleResponse.status, errorText);
            throw new Error(`获取量表信息失败 (${scaleResponse.status})`);
          }
          const scaleData = await scaleResponse.json();
          console.log('获取到的量表数据:', scaleData);
          setScale(scaleData);
        } else {
          console.warn('测评数据中没有 scale_id');
        }

        setError(null);
      } catch (err) {
        console.error('加载数据时发生错误:', err);
        setError(err instanceof Error ? err.message : '加载数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    if (assessmentId) {
      fetchData();
    }
  }, [assessmentId]);

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case '无焦虑':
      case '无抑郁':
      case '无明显症状':
      case '低风险':
      case '非自闭症':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case '轻度焦虑':
      case '轻度抑郁':
      case '轻度症状':
      case '中度风险':
      case '轻度自闭症':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case '中度焦虑':
      case '中度抑郁':
      case '中度症状':
      case '高风险':
      case '中度自闭症':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case '重度焦虑':
      case '重度抑郁':
      case '重度症状':
      case '重度自闭症':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-white/60">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-400 mb-4">加载失败</h1>
          <p className="text-white/60 mb-6">{error}</p>
          <Link 
            href="/scales"
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
          >
            返回量表列表
          </Link>
        </div>
      </div>
    );
  }

  if (!assessment || !scale) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white/60 mb-4">测评结果不存在</h1>
          <Link 
            href="/scales"
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
          >
            返回量表列表
          </Link>
        </div>
      </div>
    );
  }

  const result = assessment.result || {};

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

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 rounded-full p-1.5">
              <Image
                src="/logo.png"
                alt="靛蓝之家"
                fill
                className="object-contain rounded-full"
              />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">{scale.title} 测评结果</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/scales"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              返回量表列表
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Link>
          </div>
        </div>

        {/* Assessment Info */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8 shadow-xl">
          <p className="text-white/70 mb-6">{scale.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-400" />
              <span className="text-sm text-white/60">
                测评时间：{formatDate(assessment.completed_at)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-teal-400" />
              <span className="text-sm text-white/60">
                测评用户：{assessment.user_id ? '已登录用户' : '匿名用户'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-teal-400" />
              <span className="text-sm text-white/60">
                测评状态：已完成
              </span>
            </div>
          </div>
        </div>

        {/* Result Summary */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">测评结果摘要</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70">总得分：</span>
              <span className="text-2xl font-bold text-teal-400">{result.totalScore ?? '-'}</span>
            </div>
            
            {result.severity && (
              <div className="flex justify-between items-center">
                <span className="text-white/70">严重程度：</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getSeverityColor(result.severity)}`}>
                  {result.severity}
                </span>
              </div>
            )}
            
            {result.riskLevel && (
              <div className="flex justify-between items-center">
                <span className="text-white/70">风险等级：</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getSeverityColor(result.riskLevel)}`}>
                  {result.riskLevel}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-start">
              <span className="text-white/70">建议：</span>
              <span className="text-white/70 text-right max-w-md">{result.recommendation ?? '暂无建议'}</span>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">详细结果</h2>
          {result.details && typeof result.details === 'object' && (
            <div className="space-y-3 mb-6">
              {Object.entries(result.details).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-white/60">
                    {key === 'range' ? '得分范围' :
                     key === 'cutoff' ? '临界值' :
                     key === 'factorScores' ? '因子分' :
                     key === 'positiveItems' ? '阳性项目数' :
                     key === 'riskCount' ? '风险题数量' :
                     key === 'dimensionScores' ? '维度得分' :
                     key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span className="text-white/70">
                    {typeof value === 'object' ? JSON.stringify(value) : (value as React.ReactNode)}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 p-6 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
            <h4 className="font-semibold text-teal-400 mb-3">结果解释</h4>
            <p className="text-white/60 text-sm">
              {scale.result_interpretation ?? '暂无结果解释'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/scales"
            className="px-6 py-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300"
          >
            选择其他量表
          </Link>
          <button
            className="group relative px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 transform hover:-translate-y-1 flex items-center gap-2"
            onClick={() => window.print()}
          >
            <span className="relative z-10">
              <FileText className="h-4 w-4" />
              打印结果
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
