'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, LogOut, Scale, FileText, Activity, Shield, Home, Download, List, BarChart3, ChevronUp, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const AdminPage = () => {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState('dashboard');
  const [users, setUsers] = React.useState<any[]>([]);
  const [scales, setScales] = React.useState<any[]>([]);
  const [assessments, setAssessments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [createFormData, setCreateFormData] = React.useState({
    title: '',
    description: '',
    category: '',
    targetAudience: '',
    estimatedTime: '',
    instructions: '',
    resultInterpretation: '',
    isActive: true
  });
  const [createFormError, setCreateFormError] = React.useState<string | null>(null);
  const [createFormLoading, setCreateFormLoading] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editFormData, setEditFormData] = React.useState({
    id: '',
    title: '',
    description: '',
    category: '',
    targetAudience: '',
    estimatedTime: '',
    instructions: '',
    resultInterpretation: '',
    isActive: true
  });
  const [editFormError, setEditFormError] = React.useState<string | null>(null);
  const [editFormLoading, setEditFormLoading] = React.useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = React.useState(false);
  const [currentScaleId, setCurrentScaleId] = React.useState('');
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [questionsLoading, setQuestionsLoading] = React.useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = React.useState(false);
  const [addQuestionFormData, setAddQuestionFormData] = React.useState({
    content: '',
    type: 'single',
    options: '',
    order: 1
  });
  const [addQuestionError, setAddQuestionError] = React.useState<string | null>(null);
  const [addQuestionLoading, setAddQuestionLoading] = React.useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = React.useState(false);
  const [editQuestionFormData, setEditQuestionFormData] = React.useState({
    id: '',
    content: '',
    type: 'single',
    options: '',
    order: 1
  });
  const [editQuestionError, setEditQuestionError] = React.useState<string | null>(null);
  const [editQuestionLoading, setEditQuestionLoading] = React.useState(false);
  const [showPreviewModal, setShowPreviewModal] = React.useState(false);
  const [previewScale, setPreviewScale] = React.useState<any>(null);
  const [previewQuestions, setPreviewQuestions] = React.useState<any[]>([]);
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [previewAnswers, setPreviewAnswers] = React.useState<any>({});
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    totalAssessments: 0,
    completedAssessments: 0,
    abandonedAssessments: 0,
    scaleStats: [],
    dailyTrends: [],
  });
  const [statsLoading, setStatsLoading] = React.useState(false);
  const [searchTitle, setSearchTitle] = React.useState('');
  const [searchCategory, setSearchCategory] = React.useState('');

  React.useEffect(() => {
    // 检查用户是否已登录且是管理员
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      router.push('/admin-login');
      return;
    }

    const userData = JSON.parse(userStr);
    if (userData.role !== 'admin') {
      router.push('/');
      return;
    }

    setUser(userData);
    setIsAuthorized(true);

    // 获取真实统计数据
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await fetch('/api/admin/statistics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('获取统计数据失败');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const COLORS = ['#0d9488', '#0891b2', '#059669', '#d97706', '#7c3aed', '#dc2626', '#ea580c', '#65a30d'];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin-login');
  };

  const handleCreateScale = async () => {
    // 表单验证
    if (!createFormData.title || !createFormData.category) {
      setCreateFormError('量表名称和分类不能为空');
      return;
    }

    if (!createFormData.estimatedTime || isNaN(Number(createFormData.estimatedTime))) {
      setCreateFormError('预计时间必须是有效的数字');
      return;
    }

    try {
      setCreateFormLoading(true);
      setCreateFormError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/scales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: createFormData.title,
          description: createFormData.description,
          category: createFormData.category,
          targetAudience: createFormData.targetAudience,
          estimatedTime: Number(createFormData.estimatedTime),
          instructions: createFormData.instructions,
          resultInterpretation: createFormData.resultInterpretation,
          isActive: createFormData.isActive
        })
      });

      if (response.ok) {
        // 关闭模态框
        setShowCreateModal(false);
        // 重置表单
        setCreateFormData({
          title: '',
          description: '',
          category: '',
          targetAudience: '',
          estimatedTime: '',
          instructions: '',
          resultInterpretation: '',
          isActive: true
        });
        // 重新获取量表列表
        handleMenuClick('scales');
        alert('量表创建成功');
      } else {
        const errorData = await response.json();
        setCreateFormError(errorData.error || '创建量表失败');
      }
    } catch (error) {
      console.error('Error creating scale:', error);
      setCreateFormError('创建量表失败');
    } finally {
      setCreateFormLoading(false);
    }
  };

  const handleEditScale = async () => {
    // 表单验证
    if (!editFormData.title || !editFormData.category) {
      setEditFormError('量表名称和分类不能为空');
      return;
    }

    if (!editFormData.estimatedTime || isNaN(Number(editFormData.estimatedTime))) {
      setEditFormError('预计时间必须是有效的数字');
      return;
    }

    try {
      setEditFormLoading(true);
      setEditFormError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/scales', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editFormData.id,
          title: editFormData.title,
          description: editFormData.description,
          category: editFormData.category,
          targetAudience: editFormData.targetAudience,
          estimatedTime: Number(editFormData.estimatedTime),
          instructions: editFormData.instructions,
          resultInterpretation: editFormData.resultInterpretation,
          isActive: editFormData.isActive
        })
      });

      if (response.ok) {
        // 关闭模态框
        setShowEditModal(false);
        // 重置表单
        setEditFormData({
          id: '',
          title: '',
          description: '',
          category: '',
          targetAudience: '',
          estimatedTime: '',
          instructions: '',
          resultInterpretation: '',
          isActive: true
        });
        // 重新获取量表列表
        handleMenuClick('scales');
        alert('量表编辑成功');
      } else {
        const errorData = await response.json();
        setEditFormError(errorData.error || '编辑量表失败');
      }
    } catch (error) {
      console.error('Error editing scale:', error);
      setEditFormError('编辑量表失败');
    } finally {
      setEditFormLoading(false);
    }
  };

  const handleOpenQuestionsModal = async (scaleId: string) => {
    setCurrentScaleId(scaleId);
    setQuestionsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/scales/${scaleId}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        alert('获取题目列表失败');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('获取题目列表失败');
    } finally {
      setQuestionsLoading(false);
      setShowQuestionsModal(true);
    }
  };

  const handleAddQuestion = async () => {
    // 表单验证
    if (!addQuestionFormData.content || !addQuestionFormData.type) {
      setAddQuestionError('题目内容和类型不能为空');
      return;
    }

    if ((addQuestionFormData.type === 'single' || addQuestionFormData.type === 'multiple') && !addQuestionFormData.options) {
      setAddQuestionError('选择题需要设置选项');
      return;
    }

    try {
      setAddQuestionLoading(true);
      setAddQuestionError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/scales/${currentScaleId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: addQuestionFormData.content,
          type: addQuestionFormData.type,
          options: addQuestionFormData.options,
          order: addQuestionFormData.order
        })
      });

      if (response.ok) {
        // 关闭模态框
        setShowAddQuestionModal(false);
        // 重置表单
        setAddQuestionFormData({
          content: '',
          type: 'single',
          options: '',
          order: questions.length + 1
        });
        // 重新获取题目列表
        handleOpenQuestionsModal(currentScaleId);
        alert('题目添加成功');
      } else {
        const errorData = await response.json();
        setAddQuestionError(errorData.error || '添加题目失败');
      }
    } catch (error) {
      console.error('Error adding question:', error);
      setAddQuestionError('添加题目失败');
    } finally {
      setAddQuestionLoading(false);
    }
  };

  const handleEditQuestion = async () => {
    // 表单验证
    if (!editQuestionFormData.content || !editQuestionFormData.type) {
      setEditQuestionError('题目内容和类型不能为空');
      return;
    }

    if ((editQuestionFormData.type === 'single' || editQuestionFormData.type === 'multiple') && !editQuestionFormData.options) {
      setEditQuestionError('选择题需要设置选项');
      return;
    }

    try {
      setEditQuestionLoading(true);
      setEditQuestionError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/scales/${currentScaleId}/questions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          questionId: editQuestionFormData.id,
          content: editQuestionFormData.content,
          type: editQuestionFormData.type,
          options: editQuestionFormData.options,
          order: editQuestionFormData.order
        })
      });

      if (response.ok) {
        // 关闭模态框
        setShowEditQuestionModal(false);
        // 重置表单
        setEditQuestionFormData({
          id: '',
          content: '',
          type: 'single',
          options: '',
          order: 1
        });
        // 重新获取题目列表
        handleOpenQuestionsModal(currentScaleId);
        alert('题目编辑成功');
      } else {
        const errorData = await response.json();
        setEditQuestionError(errorData.error || '编辑题目失败');
      }
    } catch (error) {
      console.error('Error editing question:', error);
      setEditQuestionError('编辑题目失败');
    } finally {
      setEditQuestionLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm('确定要删除该题目吗？')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/scales/${currentScaleId}/questions`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            questionId
          })
        });

        if (response.ok) {
          // 重新获取题目列表
          handleOpenQuestionsModal(currentScaleId);
          alert('题目删除成功');
        } else {
          const errorData = await response.json();
          alert(errorData.error || '删除题目失败');
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('删除题目失败');
      }
    }
  };

  const handleReorderQuestions = async (newQuestions: any[]) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/scales/${currentScaleId}/questions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          questions: newQuestions.map(q => ({ id: q.id }))
        })
      });

      if (response.ok) {
        // 重新获取题目列表
        handleOpenQuestionsModal(currentScaleId);
        alert('题目顺序调整成功');
      } else {
        const errorData = await response.json();
        alert(errorData.error || '调整题目顺序失败');
      }
    } catch (error) {
      console.error('Error reordering questions:', error);
      alert('调整题目顺序失败');
    }
  };

  const handleOpenPreviewModal = async (scale: any) => {
    setPreviewLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      // 获取题目列表
      const questionsResponse = await fetch(`/api/admin/scales/${scale.id}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        setPreviewScale(scale);
        setPreviewQuestions(questionsData);
        setPreviewAnswers({});
      } else {
        alert('获取题目列表失败');
      }
    } catch (error) {
      console.error('Error fetching preview data:', error);
      alert('获取预览数据失败');
    } finally {
      setPreviewLoading(false);
      setShowPreviewModal(true);
    }
  };

  const handlePreviewSubmit = () => {
    // 模拟提交
    alert('预览提交成功！这只是一个预览，不会保存实际数据。');
    setShowPreviewModal(false);
    setPreviewScale(null);
    setPreviewQuestions([]);
    setPreviewAnswers({});
  };

  const handleMenuClick = async (menu: string) => {
    setActiveMenu(menu);
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      switch (menu) {
        case 'dashboard':
          // 已经在首页
          break;
        case 'users':
          // 获取用户列表
          const usersResponse = await fetch('/api/admin/users', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            setUsers(usersData);
          } else {
            alert('获取用户列表失败');
          }
          break;
        case 'assessments':
          // 获取测评记录
          const assessmentsResponse = await fetch('/api/admin/assessments', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (assessmentsResponse.ok) {
            const assessmentsData = await assessmentsResponse.json();
            setAssessments(assessmentsData);
          } else {
            alert('获取测评记录失败');
          }
          break;
        case 'scales':
          // 获取量表列表
          const scalesResponse = await fetch('/api/admin/scales', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (scalesResponse.ok) {
            const scalesData = await scalesResponse.json();
            setScales(scalesData);
          } else {
            alert('获取量表列表失败');
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-400">验证权限中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 左侧导航栏 */}
      <div className="w-64 bg-slate-800 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-700">
        {/*  logo和标题 */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="靛蓝之家"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold">管理后台</h1>
              <p className="text-xs text-slate-400">靛蓝之家研究院</p>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Button
                onClick={() => handleMenuClick('dashboard')}
                className={`w-full justify-start ${activeMenu === 'dashboard' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                variant={activeMenu === 'dashboard' ? 'default' : 'ghost'}
              >
                <Home className="h-4 w-4 mr-3" />
                数据概览
              </Button>
            </li>
            <li>
              <Button
                onClick={() => handleMenuClick('users')}
                className={`w-full justify-start ${activeMenu === 'users' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                variant={activeMenu === 'users' ? 'default' : 'ghost'}
              >
                <Users className="h-4 w-4 mr-3" />
                用户列表
              </Button>
            </li>
            <li>
              <Button
                onClick={() => handleMenuClick('assessments')}
                className={`w-full justify-start ${activeMenu === 'assessments' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                variant={activeMenu === 'assessments' ? 'default' : 'ghost'}
              >
                <FileText className="h-4 w-4 mr-3" />
                测评记录
              </Button>
            </li>
            <li>
              <Button
                onClick={() => handleMenuClick('export')}
                className={`w-full justify-start ${activeMenu === 'export' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                variant={activeMenu === 'export' ? 'default' : 'ghost'}
              >
                <Download className="h-4 w-4 mr-3" />
                导出数据
              </Button>
            </li>
            <li>
              <Button
                onClick={() => handleMenuClick('scales')}
                className={`w-full justify-start ${activeMenu === 'scales' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                variant={activeMenu === 'scales' ? 'default' : 'ghost'}
              >
                <Scale className="h-4 w-4 mr-3" />
                量表管理
              </Button>
            </li>
            <li>
              <Button
                onClick={() => handleMenuClick('statistics')}
                className={`w-full justify-start ${activeMenu === 'statistics' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                variant={activeMenu === 'statistics' ? 'default' : 'ghost'}
              >
                <BarChart3 className="h-4 w-4 mr-3" />
                统计分析
              </Button>
            </li>
          </ul>
        </nav>

        {/* 底部信息 */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">管理员: {user?.name}</span>
          </div>
          <Button
            onClick={handleLogout}
            className="w-full justify-start text-slate-300 hover:bg-slate-700"
            variant="ghost"
          >
            <LogOut className="h-4 w-4 mr-3" />
            登出
          </Button>
        </div>
      </div>

      {/* 右侧主内容区 */}
      <div className="flex-1 ml-64">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">
              {activeMenu === 'dashboard' && '数据统计概览'}
              {activeMenu === 'users' && '用户列表'}
              {activeMenu === 'assessments' && '测评记录'}
              {activeMenu === 'export' && '导出数据'}
              {activeMenu === 'scales' && '量表管理'}
              {activeMenu === 'statistics' && '统计分析'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{new Date().toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        </header>

        {/* 主内容 */}
        <div className="container mx-auto px-6 py-8">
          {activeMenu === 'dashboard' && (
            <>
              {statsLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="shadow-md border-t-4 border-teal-500">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-700">总用户数</CardTitle>
                        <CardDescription>系统注册用户总数</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-teal-100 rounded-full">
                            <Users className="h-8 w-8 text-teal-600" />
                          </div>
                          <div className="text-3xl font-bold text-slate-800">{stats.totalUsers}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md border-t-4 border-cyan-500">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-700">总测评数</CardTitle>
                        <CardDescription>系统测评总数</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-cyan-100 rounded-full">
                            <Scale className="h-8 w-8 text-cyan-600" />
                          </div>
                          <div className="text-3xl font-bold text-slate-800">{stats.totalAssessments}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md border-t-4 border-emerald-500">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-700">已完成测评</CardTitle>
                        <CardDescription>已完成的测评数量</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-100 rounded-full">
                            <FileText className="h-8 w-8 text-emerald-600" />
                          </div>
                          <div className="text-3xl font-bold text-slate-800">{stats.completedAssessments}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md border-t-4 border-amber-500">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-700">完成率</CardTitle>
                        <CardDescription>测评完成率</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-amber-100 rounded-full">
                            <Activity className="h-8 w-8 text-amber-600" />
                          </div>
                          <div className="text-3xl font-bold text-slate-800">
                            {stats.totalAssessments > 0 ? Math.round((stats.completedAssessments / stats.totalAssessments) * 100) : 0}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-700">
                      量表使用情况
                    </CardTitle>
                    <CardDescription>
                      各量表的使用次数
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stats.scaleStats}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="scale_title" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="total_participants" fill="#0d9488" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-700">
                      每日测评趋势
                    </CardTitle>
                    <CardDescription>
                      近30天测评数量变化
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stats.dailyTrends}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="assessments" fill="#0891b2" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-700">
                    量表分布
                  </CardTitle>
                  <CardDescription>
                    各量表使用比例
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.scaleStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#0d9488"
                          dataKey="total_participants"
                          nameKey="scale_title"
                          label={({ scale_title, percent }: { scale_title: string; percent: number }) => `${scale_title} ${(percent * 100).toFixed(0)}%`}
                        >
                          {stats.scaleStats.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
                </>
              )}
            </>
          )}

          {activeMenu === 'users' && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-700">用户列表</CardTitle>
                <CardDescription>系统所有注册用户</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                      <Users className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                      暂无用户数据
                    </h3>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">ID</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">邮箱</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">姓名</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">角色</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">注册时间</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user.id || `user-${index}`} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-600">{user.id}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{user.name || '-'}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-teal-100 text-teal-800'
                              }`}>
                                {user.role === 'admin' ? '管理员' : '普通用户'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {new Date(user.created_at + ' UTC').toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeMenu === 'assessments' && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-700">测评记录</CardTitle>
                <CardDescription>系统所有测评记录</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                  </div>
                ) : assessments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                      暂无测评记录
                    </h3>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">ID</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">用户</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">量表</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">类型</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">完成时间</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">IP地址</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assessments.map((assessment, index) => (
                          <tr key={assessment.id || `assessment-${index}`} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-600">{assessment.id}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{assessment.user_name || '-'}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{assessment.scale_title}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{assessment.scale_category}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {assessment.completed_at ? new Date(assessment.completed_at + ' UTC').toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">{assessment.ip_address}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeMenu === 'export' && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-700">导出数据</CardTitle>
                <CardDescription>导出系统数据</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <Download className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    数据导出功能开发中
                  </h3>
                  <p className="text-slate-600 mb-6">
                    此功能正在开发中，敬请期待
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeMenu === 'scales' && (
            <Card className="shadow-md">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-700">量表管理</CardTitle>
                  <CardDescription>管理系统中的量表</CardDescription>
                </div>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  创建量表
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="searchTitle">量表名称</Label>
                    <Input
                      id="searchTitle"
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                      placeholder="输入量表名称查询"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="searchCategory">量表分类</Label>
                    <Input
                      id="searchCategory"
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      placeholder="输入量表分类查询"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => {
                        setSearchTitle('');
                        setSearchCategory('');
                      }}
                      variant="outline"
                      className="h-10"
                    >
                      重置
                    </Button>
                  </div>
                </div>
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                    </div>
                  ) : scales.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                        <Scale className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700 mb-2">
                        暂无量表数据
                      </h3>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">名称</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">分类</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">目标人群</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">预计时间</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">状态</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">创建时间</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scales
                            .filter(scale => {
                              const matchTitle = !searchTitle || scale.title.toLowerCase().includes(searchTitle.toLowerCase());
                              const matchCategory = !searchCategory || scale.category.toLowerCase().includes(searchCategory.toLowerCase());
                              return matchTitle && matchCategory;
                            })
                            .map((scale) => (
                          <tr key={scale.id} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-600">{scale.id}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{scale.title}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{scale.category}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{scale.target_audience || '-'}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{scale.estimated_time} 分钟</td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${scale.is_active ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-800'}`}>
                                {scale.is_active ? '启用' : '禁用'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {new Date(scale.created_at + ' UTC').toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => {
                                    setEditFormData({
                                      id: scale.id,
                                      title: scale.title,
                                      description: scale.description || '',
                                      category: scale.category,
                                      targetAudience: scale.target_audience || '',
                                      estimatedTime: scale.estimated_time?.toString() || '',
                                      instructions: scale.instructions || '',
                                      resultInterpretation: scale.result_interpretation || '',
                                      isActive: scale.is_active === 1
                                    });
                                    setShowEditModal(true);
                                  }}
                                  variant="ghost"
                                  className="h-8 px-2 text-xs text-blue-600 hover:text-blue-800"
                                >
                                  编辑
                                </Button>
                                <Button
                                  onClick={() => handleOpenQuestionsModal(scale.id)}
                                  variant="ghost"
                                  className="h-8 px-2 text-xs text-green-600 hover:text-green-800"
                                >
                                  题目
                                </Button>
                                <Button
                                  onClick={() => handleOpenPreviewModal(scale)}
                                  variant="ghost"
                                  className="h-8 px-2 text-xs text-purple-600 hover:text-purple-800"
                                >
                                  预览
                                </Button>
                                <Button
                                  onClick={async () => {
                                    if (confirm(`确定要${scale.is_active ? '禁用' : '启用'}该量表吗？`)) {
                                      try {
                                        const token = localStorage.getItem('token');
                                        const response = await fetch('/api/admin/scales', {
                                          method: 'PATCH',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                          },
                                          body: JSON.stringify({
                                            id: scale.id,
                                            isActive: !scale.is_active
                                          })
                                        });
                                        if (response.ok) {
                                          // 重新获取量表列表
                                          handleMenuClick('scales');
                                        } else {
                                          alert('操作失败');
                                        }
                                      } catch (error) {
                                        console.error('Error toggling scale status:', error);
                                        alert('操作失败');
                                      }
                                    }
                                  }}
                                  variant="ghost"
                                  className={`h-8 px-2 text-xs ${scale.is_active ? 'text-amber-600 hover:text-amber-800' : 'text-teal-600 hover:text-teal-800'}`}
                                >
                                  {scale.is_active ? '禁用' : '启用'}
                                </Button>
                                <Button
                                  onClick={async () => {
                                    if (confirm('确定要删除该量表吗？\n注意：已被使用的量表无法删除。')) {
                                      try {
                                        const token = localStorage.getItem('token');
                                        const response = await fetch('/api/admin/scales', {
                                          method: 'DELETE',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                          },
                                          body: JSON.stringify({
                                            id: scale.id
                                          })
                                        });
                                        if (response.ok) {
                                          // 重新获取量表列表
                                          handleMenuClick('scales');
                                          alert('量表删除成功');
                                        } else {
                                          const errorData = await response.json();
                                          alert(errorData.error || '删除量表失败');
                                        }
                                      } catch (error) {
                                        console.error('Error deleting scale:', error);
                                        alert('删除量表失败');
                                      }
                                    }
                                  }}
                                  variant="ghost"
                                  className="h-8 px-2 text-xs text-red-600 hover:text-red-800"
                                >
                                  删除
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeMenu === 'statistics' && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-700">统计分析</CardTitle>
                <CardDescription>系统详细统计数据</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <BarChart3 className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    统计分析功能开发中
                  </h3>
                  <p className="text-slate-600 mb-6">
                    此功能正在开发中，敬请期待
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 创建量表模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">创建量表</h3>
            </div>
            <div className="p-6">
              {createFormError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                  {createFormError}
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">量表名称 *</Label>
                  <Input
                    id="title"
                    value={createFormData.title}
                    onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                    placeholder="请输入量表名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">量表描述</Label>
                  <textarea
                    id="description"
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                    placeholder="请输入量表描述"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">分类 *</Label>
                  <Input
                    id="category"
                    value={createFormData.category}
                    onChange={(e) => setCreateFormData({ ...createFormData, category: e.target.value })}
                    placeholder="请输入量表分类"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">目标人群</Label>
                  <Input
                    id="targetAudience"
                    value={createFormData.targetAudience}
                    onChange={(e) => setCreateFormData({ ...createFormData, targetAudience: e.target.value })}
                    placeholder="请输入目标人群"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">预计完成时间（分钟） *</Label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    value={createFormData.estimatedTime}
                    onChange={(e) => setCreateFormData({ ...createFormData, estimatedTime: e.target.value })}
                    placeholder="请输入预计完成时间"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">测试说明</Label>
                  <textarea
                    id="instructions"
                    value={createFormData.instructions}
                    onChange={(e) => setCreateFormData({ ...createFormData, instructions: e.target.value })}
                    placeholder="请输入测试说明"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resultInterpretation">结果解释</Label>
                  <textarea
                    id="resultInterpretation"
                    value={createFormData.resultInterpretation}
                    onChange={(e) => setCreateFormData({ ...createFormData, resultInterpretation: e.target.value })}
                    placeholder="请输入结果解释"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={createFormData.isActive}
                    onChange={(e) => setCreateFormData({ ...createFormData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <Label htmlFor="isActive">启用量表</Label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateFormError(null);
                  setCreateFormData({
                    title: '',
                    description: '',
                    category: '',
                    targetAudience: '',
                    estimatedTime: '',
                    instructions: '',
                    resultInterpretation: '',
                    isActive: true
                  });
                }}
                variant="outline"
                className="border-slate-300"
              >
                取消
              </Button>
              <Button
                onClick={handleCreateScale}
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={createFormLoading}
              >
                {createFormLoading ? '创建中...' : '创建'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* 编辑量表模态框 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">编辑量表</h3>
            </div>
            <div className="p-6">
              {editFormError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                  {editFormError}
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">量表名称 *</Label>
                  <Input
                    id="edit-title"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    placeholder="请输入量表名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">量表描述</Label>
                  <textarea
                    id="edit-description"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    placeholder="请输入量表描述"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">分类 *</Label>
                  <Input
                    id="edit-category"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    placeholder="请输入量表分类"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-targetAudience">目标人群</Label>
                  <Input
                    id="edit-targetAudience"
                    value={editFormData.targetAudience}
                    onChange={(e) => setEditFormData({ ...editFormData, targetAudience: e.target.value })}
                    placeholder="请输入目标人群"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-estimatedTime">预计完成时间（分钟） *</Label>
                  <Input
                    id="edit-estimatedTime"
                    type="number"
                    value={editFormData.estimatedTime}
                    onChange={(e) => setEditFormData({ ...editFormData, estimatedTime: e.target.value })}
                    placeholder="请输入预计完成时间"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-instructions">测试说明</Label>
                  <textarea
                    id="edit-instructions"
                    value={editFormData.instructions}
                    onChange={(e) => setEditFormData({ ...editFormData, instructions: e.target.value })}
                    placeholder="请输入测试说明"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-resultInterpretation">结果解释</Label>
                  <textarea
                    id="edit-resultInterpretation"
                    value={editFormData.resultInterpretation}
                    onChange={(e) => setEditFormData({ ...editFormData, resultInterpretation: e.target.value })}
                    placeholder="请输入结果解释"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="edit-isActive"
                    type="checkbox"
                    checked={editFormData.isActive}
                    onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <Label htmlFor="edit-isActive">启用量表</Label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormError(null);
                  setEditFormData({
                    id: '',
                    title: '',
                    description: '',
                    category: '',
                    targetAudience: '',
                    estimatedTime: '',
                    instructions: '',
                    resultInterpretation: '',
                    isActive: true
                  });
                }}
                variant="outline"
                className="border-slate-300"
              >
                取消
              </Button>
              <Button
                onClick={handleEditScale}
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={editFormLoading}
              >
                {editFormLoading ? '编辑中...' : '保存'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 题目管理模态框 */}
      {showQuestionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">题目管理</h3>
              <Button
                onClick={() => {
                  setShowQuestionsModal(false);
                  setCurrentScaleId('');
                  setQuestions([]);
                }}
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-slate-700">题目列表</h4>
                <Button
                  onClick={() => {
                    setAddQuestionFormData({
                      content: '',
                      type: 'single',
                      options: '',
                      order: questions.length + 1
                    });
                    setAddQuestionError(null);
                    setShowAddQuestionModal(true);
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  添加题目
                </Button>
              </div>
              {questionsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    暂无题目
                  </h3>
                  <p className="text-slate-600 mb-6">
                    点击「添加题目」按钮添加题目
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-medium">
                            {question.order}
                          </span>
                          <h5 className="font-semibold text-slate-800">{question.content}</h5>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setEditQuestionFormData({
                                id: question.id,
                                content: question.content,
                                type: question.type,
                                options: question.options || '',
                                order: question.order
                              });
                              setEditQuestionError(null);
                              setShowEditQuestionModal(true);
                            }}
                            variant="ghost"
                            className="h-8 px-2 text-xs text-blue-600 hover:text-blue-800"
                          >
                            编辑
                          </Button>
                          <Button
                            onClick={() => handleDeleteQuestion(question.id)}
                            variant="ghost"
                            className="h-8 px-2 text-xs text-red-600 hover:text-red-800"
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                      <div className="ml-8">
                        <div className="text-sm text-slate-600 mb-2">
                          类型：{question.type === 'single' ? '单选题' : question.type === 'multiple' ? '多选题' : '评分题'}
                        </div>
                        {question.options && (
                          <div className="text-sm text-slate-600">
                            选项：{question.options}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 添加题目模态框 */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">添加题目</h3>
            </div>
            <div className="p-6">
              {addQuestionError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                  {addQuestionError}
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="add-content">题目内容 *</Label>
                  <textarea
                    id="add-content"
                    value={addQuestionFormData.content}
                    onChange={(e) => setAddQuestionFormData({ ...addQuestionFormData, content: e.target.value })}
                    placeholder="请输入题目内容"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-type">题目类型 *</Label>
                  <select
                    id="add-type"
                    value={addQuestionFormData.type}
                    onChange={(e) => setAddQuestionFormData({ ...addQuestionFormData, type: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="single">单选题</option>
                    <option value="multiple">多选题</option>
                    <option value="rating">评分题</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-options">选项（选择题必填，用逗号分隔）</Label>
                  <textarea
                    id="add-options"
                    value={addQuestionFormData.options}
                    onChange={(e) => setAddQuestionFormData({ ...addQuestionFormData, options: e.target.value })}
                    placeholder="请输入选项，用逗号分隔（例如：选项1,选项2,选项3）"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-order">题目顺序 *</Label>
                  <Input
                    id="add-order"
                    type="number"
                    value={addQuestionFormData.order}
                    onChange={(e) => setAddQuestionFormData({ ...addQuestionFormData, order: Number(e.target.value) })}
                    placeholder="请输入题目顺序"
                    min="1"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowAddQuestionModal(false);
                  setAddQuestionError(null);
                  setAddQuestionFormData({
                    content: '',
                    type: 'single',
                    options: '',
                    order: questions.length + 1
                  });
                }}
                variant="outline"
                className="border-slate-300"
              >
                取消
              </Button>
              <Button
                onClick={handleAddQuestion}
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={addQuestionLoading}
              >
                {addQuestionLoading ? '添加中...' : '添加'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑题目模态框 */}
      {showEditQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">编辑题目</h3>
            </div>
            <div className="p-6">
              {editQuestionError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                  {editQuestionError}
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-question-content">题目内容 *</Label>
                  <textarea
                    id="edit-question-content"
                    value={editQuestionFormData.content}
                    onChange={(e) => setEditQuestionFormData({ ...editQuestionFormData, content: e.target.value })}
                    placeholder="请输入题目内容"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-question-type">题目类型 *</Label>
                  <select
                    id="edit-question-type"
                    value={editQuestionFormData.type}
                    onChange={(e) => setEditQuestionFormData({ ...editQuestionFormData, type: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="single">单选题</option>
                    <option value="multiple">多选题</option>
                    <option value="rating">评分题</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-question-options">选项（选择题必填，用逗号分隔）</Label>
                  <textarea
                    id="edit-question-options"
                    value={editQuestionFormData.options}
                    onChange={(e) => setEditQuestionFormData({ ...editQuestionFormData, options: e.target.value })}
                    placeholder="请输入选项，用逗号分隔（例如：选项1,选项2,选项3）"
                    className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-question-order">题目顺序 *</Label>
                  <Input
                    id="edit-question-order"
                    type="number"
                    value={editQuestionFormData.order}
                    onChange={(e) => setEditQuestionFormData({ ...editQuestionFormData, order: Number(e.target.value) })}
                    placeholder="请输入题目顺序"
                    min="1"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowEditQuestionModal(false);
                  setEditQuestionError(null);
                  setEditQuestionFormData({
                    id: '',
                    content: '',
                    type: 'single',
                    options: '',
                    order: 1
                  });
                }}
                variant="outline"
                className="border-slate-300"
              >
                取消
              </Button>
              <Button
                onClick={handleEditQuestion}
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={editQuestionLoading}
              >
                {editQuestionLoading ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 量表预览模态框 */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">量表预览</h3>
              <Button
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewScale(null);
                  setPreviewQuestions([]);
                  setPreviewAnswers({});
                }}
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            {previewLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              </div>
            ) : previewScale ? (
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{previewScale.title}</h4>
                  <p className="text-slate-600 mb-4">{previewScale.description}</p>
                  <div className="bg-slate-50 p-4 rounded-md mb-4">
                    <h5 className="font-semibold text-slate-700 mb-2">测试说明</h5>
                    <p className="text-slate-600">{previewScale.instructions}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {previewQuestions.map((question, index) => (
                    <div key={question.id} className="border border-slate-200 rounded-lg p-4">
                      <h5 className="font-semibold text-slate-800 mb-3">
                        {index + 1}. {question.content}
                      </h5>
                      {question.type === 'single' && (
                        <div className="space-y-2">
                          {question.options.split(',').map((option: string, optionIndex: number) => (
                            <div key={optionIndex} className="flex items-center">
                              <input
                                type="radio"
                                id={`preview-single-${question.id}-${optionIndex}`}
                                name={`preview-${question.id}`}
                                value={option}
                                checked={previewAnswers[question.id] === option}
                                onChange={(e) => setPreviewAnswers({
                                  ...previewAnswers,
                                  [question.id]: e.target.value
                                })}
                                className="mr-2"
                              />
                              <label htmlFor={`preview-single-${question.id}-${optionIndex}`} className="text-slate-600">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {question.type === 'multiple' && (
                        <div className="space-y-2">
                          {question.options.split(',').map((option: string, optionIndex: number) => (
                            <div key={optionIndex} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`preview-multiple-${question.id}-${optionIndex}`}
                                name={`preview-${question.id}`}
                                value={option}
                                checked={(previewAnswers[question.id] || []).includes(option)}
                                onChange={(e) => {
                                  const currentAnswers = previewAnswers[question.id] || [];
                                  if (e.target.checked) {
                                    setPreviewAnswers({
                                      ...previewAnswers,
                                      [question.id]: [...currentAnswers, option]
                                    });
                                  } else {
                                    setPreviewAnswers({
                                      ...previewAnswers,
                                      [question.id]: currentAnswers.filter(item => item !== option)
                                    });
                                  }
                                }}
                                className="mr-2"
                              />
                              <label htmlFor={`preview-multiple-${question.id}-${optionIndex}`} className="text-slate-600">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {question.type === 'rating' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setPreviewAnswers({
                                  ...previewAnswers,
                                  [question.id]: rating
                                })}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${previewAnswers[question.id] === rating ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                          <p className="text-sm text-slate-500">1=非常不符合，5=非常符合</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={handlePreviewSubmit}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6"
                  >
                    提交测评
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Scale className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  预览数据加载失败
                </h3>
                <p className="text-slate-600 mb-6">
                  请重试或检查网络连接
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
