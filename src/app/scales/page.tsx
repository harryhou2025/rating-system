'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  Users,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Menu,
  X,
  ClipboardList
} from 'lucide-react';

const ScalesPage: React.FC = () => {
  const [scales, setScales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  useEffect(() => {
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

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const applyAnimations = () => {
      document.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1)';
        observer.observe(el);
      });
    };

    // 初次应用
    applyAnimations();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeCategory]);

  // 提取所有分类
  const allCategories = Array.from(new Set(scales.map(s => s.category)));
  
  // 过滤量表
  const filteredScales = scales.filter(scale => {
    if (!scale.isActive) return false;
    if (activeCategory === 'all') return true;
    return scale.category === activeCategory;
  });

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
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans">
      {/* Navigation */}
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
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/profile" className="px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                    个人中心
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300">
                    退出
                  </button>
                </div>
              ) : (
                <Link href="/login" className="px-5 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  登录
                </Link>
              )}
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
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="block text-lg text-white/90 hover:text-teal-400 transition-colors">
                    个人中心
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block text-lg text-red-400 hover:text-red-300 transition-colors">
                    退出
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block text-lg text-white/90 hover:text-teal-400 transition-colors">
                  登录
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[#0f172a]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-teal-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-purple-500/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
          
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
          
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\\'0 0 200 200\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cfilter id=\\\'noiseFilter\\\'%3E%3CfeTurbulence type=\\\'fractalNoise\\\' baseFrequency=\\\'0.65\\\' numOctaves=\\\'3\\\' stitchTiles=\\\'stitch\\\'/%3E%3C/filter%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' filter=\\\'url(%23noiseFilter)\\\'/%3E%3C/svg%3E")'
          }} />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="reveal" style={{ transitionDelay: '0.1s' }}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/60 hover:text-teal-400 transition-colors mb-8"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">返回首页</span>
              </Link>
            </div>

            <div className="reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
                <ClipboardList className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-white/80 tracking-wide">专业测评</span>
              </div>
            </div>

            <h1 className="reveal text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ transitionDelay: '0.3s' }}>
              <span className="block text-white/95">心理测评量表</span>
            </h1>

            <p className="reveal text-lg text-white/60 max-w-2xl mx-auto leading-relaxed" style={{ transitionDelay: '0.4s' }}>
              科学、专业的心理测评工具，帮助您更好地了解儿童青少年的发育行为状况
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              全部
            </button>
            {allCategories.map((category, index) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'
                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Scales List */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScales.map((scale, index) => (
              <div
                key={scale.id}
                className="reveal group relative"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:border-teal-500/30 hover:bg-white/[0.08] transition-all duration-500">
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform duration-500">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {scale.title}
                        </h3>
                        <p className="text-teal-400 text-sm">
                          {scale.category}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3">
                      {scale.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-teal-400" />
                        <span className="text-xs text-white/50">{scale.targetAudience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-400" />
                        <span className="text-xs text-white/50">约{scale.estimatedTime}分钟</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-teal-400" />
                        <span className="text-xs text-white/50">{scale.instructions.substring(0, 25)}...</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/assessment/${scale.id}`}
                      className="w-full relative flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/30"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        开始测评
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 rounded-full p-2">
                <Image
                  src="/logo.png"
                  alt="靛蓝之家"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">靛蓝之家发育行为身心发展研究院</p>
              </div>
            </div>
            <p className="text-sm text-white/40">
              © 2024 靛蓝之家发育行为身心发展研究院. 保留所有权利.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ScalesPage;
