'use client';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Clock, Users, BookOpen } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import React from 'react';

const AssessmentPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [scale, setScale] = React.useState(null);
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
    // 找到对应的题目，使用 order 作为答案的键
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
      router.push(`/result/${data.id}`);
    } catch (err) {
      alert('提交失败，请重试');
    }
  };

  if (isLoading) {
    return React.createElement('div', {
      className: 'min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center'
    }, React.createElement('div', {
      className: 'text-center'
    }, React.createElement('div', {
      className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4'
    }), React.createElement('p', {
      className: 'text-gray-600'
    }, '加载中...')));
  }

  if (error) {
    return React.createElement('div', {
      className: 'min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center'
    }, React.createElement('div', {
      className: 'text-center'
    }, React.createElement('h1', {
      className: 'text-2xl font-semibold text-red-600 mb-4'
    }, '加载失败'), React.createElement('p', {
      className: 'text-gray-600 mb-6'
    }, error), React.createElement(Button, {
      onClick: () => router.push('/scales'),
      className: 'bg-teal-600 hover:bg-teal-700 text-white'
    }, '返回量表列表')));
  }

  if (!scale || questions.length === 0) {
    return React.createElement('div', {
      className: 'min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center'
    }, React.createElement('div', {
      className: 'text-center'
    }, React.createElement('h1', {
      className: 'text-2xl font-semibold text-gray-600 mb-4'
    }, '量表不存在'), React.createElement(Button, {
      onClick: () => router.push('/scales'),
      className: 'bg-teal-600 hover:bg-teal-700 text-white'
    }, '返回量表列表')));
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return React.createElement('div', {
    className: 'min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50'
  }, React.createElement('div', {
    className: 'container mx-auto px-4 py-12'
  }, React.createElement('div', {
    className: 'flex justify-between items-center mb-8'
  }, React.createElement('h1', {
    className: 'text-2xl md:text-3xl font-bold text-teal-800'
  }, scale.title), React.createElement(Button, {
    onClick: () => router.push('/'),
    variant: 'outline',
    className: 'border-teal-600 text-teal-700 hover:bg-teal-50 flex items-center gap-2'
  }, React.createElement(ArrowLeft, {
    className: 'h-4 w-4'
  }), '返回首页')), React.createElement('div', {
    className: 'mb-8'
  }, React.createElement('div', {
    className: 'flex justify-between mb-2'
  }, React.createElement('span', {
    className: 'text-sm text-gray-600'
  }, `题目 ${currentQuestion + 1} / ${questions.length}`), React.createElement('span', {
    className: 'text-sm text-gray-600'
  }, `${Math.round(progress)}%`)), React.createElement('div', {
    className: 'w-full bg-gray-200 rounded-full h-2.5'
  }, React.createElement('div', {
    className: 'bg-teal-600 h-2.5 rounded-full transition-all duration-300 ease-in-out',
    style: { width: `${progress}%` }
  }))), React.createElement(Card, {
    className: 'mb-8 shadow-lg border-t-4 border-teal-600'
  }, React.createElement(CardHeader, {}, React.createElement(CardDescription, {
    className: 'text-gray-600'
  }, scale.description)), React.createElement(CardContent, {}, React.createElement('div', {
    className: 'flex flex-wrap gap-4 mb-4'
  }, React.createElement('div', {
    className: 'flex items-center gap-2'
  }, React.createElement(Users, {
    className: 'h-4 w-4 text-teal-600'
  }), React.createElement('span', {
    className: 'text-sm'
  }, scale.targetAudience)), React.createElement('div', {
    className: 'flex items-center gap-2'
  }, React.createElement(Clock, {
    className: 'h-4 w-4 text-teal-600'
  }), React.createElement('span', {
    className: 'text-sm'
  }, `约${scale.estimatedTime}分钟`)), React.createElement('div', {
    className: 'flex items-center gap-2'
  }, React.createElement(BookOpen, {
    className: 'h-4 w-4 text-teal-600'
  }), React.createElement('span', {
    className: 'text-sm'
  }, scale.category))), React.createElement('p', {
    className: 'text-sm text-gray-700 mb-4'
  }, React.createElement('strong', {}, '测评说明：'), scale.instructions))), React.createElement(Card, {
    className: 'shadow-lg mb-8 border-t-4 border-cyan-600'
  }, React.createElement(CardContent, {
    className: 'p-6'
  }, React.createElement('h3', {
    className: 'text-xl font-semibold mb-6 text-teal-700'
  }, `第 ${currentQuestion + 1} 题`), React.createElement('p', {
    className: 'text-lg mb-8'
  }, currentQ.content), React.createElement('div', {
    className: 'space-y-4'
  }, currentQ.options?.map((option) => React.createElement('div', {
    key: option.value,
    className: 'flex items-center'
  }, React.createElement('input', {
    type: 'radio',
    id: `option-${option.value}`,
    name: `question-${currentQ.id}`,
    value: option.value,
    checked: answers[`q${currentQ.order}`] === option.value,
    onChange: () => handleAnswerChange(currentQ.id, option.value),
    className: 'w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300'
  }), React.createElement('label', {
    htmlFor: `option-${option.value}`,
    className: 'ml-3 text-gray-700 cursor-pointer'
  }, option.label)))))), React.createElement('div', {
    className: 'flex justify-between'
  }, React.createElement(Button, {
    onClick: () => setCurrentQuestion(prev => Math.max(0, prev - 1)),
    disabled: currentQuestion === 0,
    variant: 'outline',
    className: 'border-teal-600 text-teal-700 hover:bg-teal-50 flex items-center gap-2'
  }, React.createElement(ArrowLeft, {
    className: 'h-4 w-4'
  }), '上一题'), currentQuestion === questions.length - 1 ? React.createElement(Button, {
    onClick: handleSubmit,
    className: 'bg-teal-600 hover:bg-teal-700 text-white'
  }, '提交') : React.createElement(Button, {
    onClick: () => {
      if (answers[`q${currentQ.order}`] === undefined) {
        alert('请先选择答案');
        return;
      }
      setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1));
    },
    className: 'bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2'
  }, '下一题', React.createElement(ArrowRight, {
    className: 'h-4 w-4'
  })))));
};

export default AssessmentPage;