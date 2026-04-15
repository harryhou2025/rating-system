'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, Users, BookOpen } from 'lucide-react';
import Image from 'next/image';

const AssessmentPage = () => {
  const params = useParams();
  const id = params.id as string;
  
  const [scale, setScale] = React.useState<{ id: string; title: string; description: string; category: string; targetAudience: string; estimatedTime: number; instructions: string; resultInterpretation: string; isActive: boolean; questions: any[] } | null>(null);
  const [questions, setQuestions] = React.useState<Array<{ id: string; scaleId: string; content: string; type: string; options: any; order: number; scoringType: string; dimension: string }>>([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string | string[]>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const scaleResponse = await fetch(`/api/scales/${id}`);
        if (!scaleResponse.ok) {
          throw new Error('获取量表信息失败');
        }
        const scaleData = await scaleResponse.json();
        setScale(scaleData);
        setQuestions(scaleData.questions || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAnswerChange = (questionId: string, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      setAnswers(prev => ({
        ...prev,
        [`q${question.order}`]: value
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const allAnswered = questions.every(q => answers[`q${q.order}`] !== undefined);
      if (!allAnswered) {
        alert('请回答所有题目');
        return;
      }

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          scaleId: id,
          answers,
          ipAddress: '127.0.0.1'
        }),
      });

      if (!response.ok) {
        throw new Error('提交失败');
      }

      const data = await response.json();
      window.location.href = `/result/${data.id}`;
    } catch (err) {
      alert('提交失败，请重试');
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

  if (!scale || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white/60 mb-4">量表不存在</h1>
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

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

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

      <div className="relative z-10 container mx-auto px-4 pt-6 pb-12">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-8">
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <div className="relative w-12 h-12 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 rounded-full p-1.5 shadow-lg shadow-teal-500/20">
              <Image
                src="/logo.png"
                alt="靛蓝之家"
                fill
                className="object-contain rounded-full"
              />
            </div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-snug break-words">
              {scale.title}
            </h1>
          </div>
          <Link
            href="/scales"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">返回量表列表</span>
            <span className="sm:hidden">返回</span>
          </Link>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-white/60">题目 {currentQuestion + 1} / {questions.length}</span>
            <span className="text-sm text-white/60">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Scale Info */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 mb-8 shadow-xl">
          <p className="text-white/70 mb-4">{scale.description}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-400" />
              <span className="text-sm text-white/60">{scale.targetAudience}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-400" />
              <span className="text-sm text-white/60">约{scale.estimatedTime}分钟</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-teal-400" />
              <span className="text-sm text-white/60">{scale.category}</span>
            </div>
          </div>
          <p className="text-sm text-white/50">
            <strong className="text-white/70">测评说明：</strong>{scale.instructions}
          </p>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 mb-8 shadow-xl">
          <h3 className="text-xl font-semibold mb-6 text-teal-400">第 {currentQuestion + 1} 题</h3>
          <p className="text-lg mb-8 text-white">{currentQ.content}</p>
          <div className="space-y-3">
            {currentQ.options?.map((option: { value: string; label: string }) => (
              <div
                key={option.value}
                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  answers[`q${currentQ.order}`] === option.value 
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
                onClick={() => handleAnswerChange(currentQ.id, option.value)}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300 ${
                  answers[`q${currentQ.order}`] === option.value 
                    ? 'border-teal-500 bg-teal-500' 
                    : 'border-white/30'
                }`}>
                  {answers[`q${currentQ.order}`] === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <label className="text-white cursor-pointer flex-1">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
              currentQuestion === 0 
                ? 'opacity-50 cursor-not-allowed bg-white/5 border border-white/10 text-white/40' 
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            上一题
          </button>
          
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="group relative px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 transform hover:-translate-y-1"
            >
              <span className="relative z-10">提交</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (answers[`q${currentQ.order}`] === undefined) {
                  alert('请先选择答案');
                  return;
                }
                setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1));
              }}
              className="group relative px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span className="relative z-10">下一题</span>
              <ArrowRight className="h-4 w-4 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
