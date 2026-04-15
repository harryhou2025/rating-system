'use client';

import React from 'react';
import { 
  UserCircle, 
  LogOut, 
  FileText, 
  Calendar, 
  ArrowLeft, 
  ChevronRight,
  BarChart3,
  Clock,
  Menu,
  X,
  CheckCircle2,
  LayoutDashboard,
  Activity,
  User
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ProfilePage: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const [assessments, setAssessments] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      window.location.href = '/login';
      return;
    }

    const user = JSON.parse(userStr);
    setUser(user);
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.userId === null) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }
    
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
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

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case '情绪评估':
        return 'from-teal-500/20 to-cyan-500/20 border-teal-500/30';
      case '发展障碍':
        return 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30';
      case '心理健康':
        return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30';
      default:
        return 'from-white/5 to-white/10 border-white/10';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-teal-500/30 rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-teal-500 rounded-full animate-spin" />
            <div className="absolute inset-2 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-white/60 text-lg tracking-wide">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 rounded-full p-2 shadow-lg shadow-teal-500/20">
                <Image
                  src="/logo.png"
                  alt="靛蓝之家"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-wider text-white">靛蓝之家</span>
                <span className="text-xs text-teal-400 tracking-wider">发育行为身心发展研究院</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-white/90 hover:text-teal-400 transition-colors relative group">
                首页
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/experts" className="text-sm text-white/90 hover:text-teal-400 transition-colors relative group">
                专家团队
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/scales" className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 transform hover:-translate-y-0.5">
                量表测评
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/profile" className="px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  个人中心
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300">
                  退出
                </button>
              </div>
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0f172a] border-t border-white/10">
            <div className="container mx-auto px-6 py-6 space-y-4">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-lg text-white/90 hover:text-teal-400 transition-colors">
                首页
              </Link>
              <Link href="/experts" onClick={() => setIsMenuOpen(false)} className="block text-lg text-white/90 hover:text-teal-400 transition-colors">
                专家团队
              </Link>
              <Link href="/scales" onClick={() => setIsMenuOpen(false)} className="block text-lg text-white/90 hover:text-teal-400 transition-colors">
                量表测评
              </Link>
              <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="block text-lg text-white/90 hover:text-teal-400 transition-colors">
                个人中心
              </Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block text-lg text-red-400 hover:text-red-300 transition-colors">
                退出
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10 pt-32 pb-24">
        <section className="container mx-auto px-6 mb-16">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-teal-400 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm tracking-wide">返回首页</span>
            </Link>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                        <UserCircle className="w-14 h-14 text-teal-400" />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-[#0f172a] flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                      {user?.name}
                    </h1>
                    <p className="text-white/60 text-lg mb-4">{user?.email}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
                        <User className="w-4 h-4 text-teal-400" />
                        <span className="text-sm text-teal-400">认证用户</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link 
                      href="/scales"
                      className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 flex items-center gap-2"
                    >
                      <Activity className="w-4 h-4" />
                      开始测评
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="px-6 py-3 bg-white/5 border border-white/10 text-white/70 font-medium rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-2xl group-hover:from-teal-500/20 transition-all duration-500" />
                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-teal-500/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-teal-500/10 rounded-xl">
                      <LayoutDashboard className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{assessments.length}</p>
                      <p className="text-white/50 text-sm">已完成测评</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" style={{ width: `${Math.min(assessments.length * 10, 100)}%` }} />
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl group-hover:from-cyan-500/20 transition-all duration-500" />
                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-cyan-500/10 rounded-xl">
                      <FileText className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">
                        {new Set(assessments.map(a => a.scale_id)).size}
                      </p>
                      <p className="text-white/50 text-sm">测评量表种类</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${Math.min(new Set(assessments.map(a => a.scale_id)).size * 20, 100)}%` }} />
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl group-hover:from-emerald-500/20 transition-all duration-500" />
                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                      <Clock className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">
                        {assessments.length > 0 ? formatDate(assessments[0].completed_at).split(' ')[0] : '无'}
                      </p>
                      <p className="text-white/50 text-sm">最近测评时间</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <h2 className="text-2xl font-bold tracking-tight">测评历史</h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/20 to-transparent" />
            </div>

            {error ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-3xl blur-2xl" />
                <div className="relative bg-white/5 border border-red-500/20 rounded-3xl p-12 text-center backdrop-blur-xl">
                  <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-10 h-10 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-red-400">获取测评记录失败</h3>
                  <p className="text-white/60 mb-6">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                  >
                    重新加载
                  </button>
                </div>
              </div>
            ) : assessments.length === 0 ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent rounded-3xl blur-2xl" />
                <div className="relative bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-xl">
                  <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-10 h-10 text-white/40" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white/80">暂无测评记录</h3>
                  <p className="text-white/50 mb-6">您还没有完成任何测评，开始您的第一次测评吧</p>
                  <Link 
                    href="/scales"
                    className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
                  >
                    去测评
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment, index) => (
                  <Link
                    key={assessment.id}
                    href={`/result/${assessment.id}`}
                    className="group relative overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryGradient(assessment.scale_category)} rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                    <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-white/20 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-lg text-white group-hover:text-teal-400 transition-colors">
                              {assessment.scale_title}
                            </h3>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                              assessment.scale_category === '情绪评估' 
                                ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' 
                                : assessment.scale_category === '发展障碍'
                                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                                : assessment.scale_category === '心理健康'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-white/5 border-white/10 text-white/60'
                            }`}>
                              {assessment.scale_category}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-white/50">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(assessment.completed_at)}
                            </span>
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              已完成
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {assessment.result && (
                            <div className="text-right">
                              <p className="text-xs text-white/40 mb-1">测评结果</p>
                              <p className="font-medium text-teal-400">
                                {assessment.result.level || assessment.result.interpretation || '查看详情'}
                              </p>
                            </div>
                          )}
                          <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-[#0f172a]/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="靛蓝之家"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <span className="text-white/70">靛蓝之家发育行为身心发展研究院</span>
            </div>
            <p className="text-white/40 text-sm">
              © 2024 靛蓝之家发育行为身心发展研究院. 保留所有权利.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
