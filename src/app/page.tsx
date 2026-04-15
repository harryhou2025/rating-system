'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Zap,
  GraduationCap,
  Microscope,
  Globe,
  Puzzle,
  Users,
  Code,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Heart,
  School,
  Award,
  Building2,
  BookOpen,
  FileText,
  HandHeart,
  Target,
  TrendingUp
} from 'lucide-react';
const IndigoHouseHomePage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

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

    document.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1)';
      observer.observe(el);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0f172a]">
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-br from-teal-600/15 via-cyan-500/8 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-gradient-to-tr from-blue-600/15 via-purple-500/8 to-transparent rounded-full blur-[120px]" />
          
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\\'0 0 200 200\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cfilter id=\\\'noiseFilter\\\'%3E%3CfeTurbulence type=\\\'fractalNoise\\\' baseFrequency=\\\'0.65\\\' numOctaves=\\\'3\\\' stitchTiles=\\\'stitch\\\'/%3E%3C/filter%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' filter=\\\'url(%23noiseFilter)\\\'/%3E%3C/svg%3E")'
          }} />
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-32 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="reveal" style={{ transitionDelay: '0.1s' }}>
                <div className="inline-flex items-center gap-3 mb-10">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-teal-400/50" />
                  <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-teal-400" />
                    <span className="text-sm font-medium tracking-widest text-white/80">Institute of Developmental, Behavioral, and Psychosomatic Development</span>
                  </div>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-teal-400/50" />
                </div>
              </div>

              <h1 className="reveal text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8" style={{ transitionDelay: '0.2s' }}>
                <span className="block bg-gradient-to-r from-white via-teal-50 to-white bg-clip-text text-transparent drop-shadow-sm">
                  靛蓝之家
                </span>
                <span className="block mt-2 text-3xl md:text-4xl lg:text-5xl font-semibold text-white/70 tracking-wide">
                  发育行为身心发展研究院
                </span>
              </h1>

              <div className="reveal max-w-3xl mx-auto mb-12" style={{ transitionDelay: '0.3s' }}>
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 via-cyan-500 to-teal-500 rounded-full" />
                  <p className="text-lg md:text-xl text-white/65 leading-relaxed pl-8">
                    国际领先的"医-教-护-管-康"一体化整合型发育行为人才培养与行业赋能数字科技平台。我院以循证科学的发育行为管理模式与智能数字化管理系统为基础，整合全球权威专家资源，致力于推动脑智发育行为及融合教育相关行业的转型升级与专业发展。
                  </p>
                </div>
              </div>

              <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-5" style={{ transitionDelay: '0.4s' }}>
                <Link href="/experts" className="group relative px-10 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 text-white font-bold rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-teal-500/40 transition-all duration-500 transform hover:-translate-y-1.5">
                  <span className="relative z-10 flex items-center gap-2">
                    认识专家团队
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 border border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                <Link href="/scales" className="group relative px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 transform hover:-translate-y-1.5 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    体验量表测评
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-white/40 tracking-widest">SCROLL</span>
            <div className="w-7 h-12 border-2 border-white/20 rounded-full flex justify-center pt-2.5">
              <div className="w-1.5 h-3 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal">
              <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-4 block">价值主张</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">一、价值主张</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-transparent mx-auto" />
            </div>

            <div className="reveal bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-10">
              <p className="text-lg text-white/70 leading-relaxed mb-6">
                我们秉持"积极赋能、优势发掘、全面发展"的视角，以"家庭内生式干预"为核心理念，坚信家庭是儿童青少年成长最核心的场域。
              </p>
              <p className="text-lg text-white/70 leading-relaxed mb-6">
                在此基础上，研究院构建了覆盖0-18岁儿童青少年、并延展至成人老人全生命周期的 "预防-评估-干预-个别化督导管理" 全链条服务模式。
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                为神经多样性个体（如ASD孤独症谱系、ADHD、HSP高敏感、LD学习困难、DCD发育行为协调、2e双重资优人士）的全面发展和家庭支持提供系统性解决方案，最终实现以成效为导向的 "价值医疗" 与"社会融合"。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Areas Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal">
              <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-4 block">研究方向</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">二、重点研究方向</h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">研究院围绕核心使命，聚焦以下前沿领域开展深度研究与实践转化：</p>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-transparent mx-auto mt-6" />
            </div>

            <div className="space-y-6">
              <div className="reveal group relative" style={{ transitionDelay: '0.1s' }}>
                <div className="relative bg-gradient-to-r from-teal-500/10 via-white/5 to-cyan-500/10 border border-white/10 rounded-2xl p-8 hover:border-teal-500/30 hover:from-teal-500/15 hover:to-cyan-500/15 transition-all duration-500">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-l-2xl" />
                  <div className="pl-4">
                    <div className="flex items-start gap-4 mb-3">
                      <span className="text-3xl font-bold text-white/10">1</span>
                      <h3 className="text-xl font-bold text-white">神经多样性发展路径与个体化支持模型</h3>
                    </div>
                    <p className="text-white/60 leading-relaxed pl-12">
                      基于全生命周期视角，研究神经多样性个体的差异化发展轨迹，构建精准评估与个性化干预支持模型。
                    </p>
                  </div>
                </div>
              </div>

              <div className="reveal group relative" style={{ transitionDelay: '0.15s' }}>
                <div className="relative bg-gradient-to-r from-teal-500/10 via-white/5 to-cyan-500/10 border border-white/10 rounded-2xl p-8 hover:border-teal-500/30 hover:from-teal-500/15 hover:to-cyan-500/15 transition-all duration-500">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-l-2xl" />
                  <div className="pl-4">
                    <div className="flex items-start gap-4 mb-3">
                      <span className="text-3xl font-bold text-white/10">2</span>
                      <h3 className="text-xl font-bold text-white">家庭内生干预（EFBI）的循证机制与效能研究</h3>
                    </div>
                    <p className="text-white/60 leading-relaxed pl-12">
                      深入探索家庭系统在干预中的核心作用机制，通过科学实证不断优化EFBI模式，提升其可操作性、普适性与长期效果。
                    </p>
                  </div>
                </div>
              </div>

              <div className="reveal group relative" style={{ transitionDelay: '0.2s' }}>
                <div className="relative bg-gradient-to-r from-teal-500/10 via-white/5 to-cyan-500/10 border border-white/10 rounded-2xl p-8 hover:border-teal-500/30 hover:from-teal-500/15 hover:to-cyan-500/15 transition-all duration-500">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-l-2xl" />
                  <div className="pl-4">
                    <div className="flex items-start gap-4 mb-3">
                      <span className="text-3xl font-bold text-white/10">3</span>
                      <h3 className="text-xl font-bold text-white">发育行为数字智能应用</h3>
                    </div>
                    <p className="text-white/60 leading-relaxed pl-12">
                      研发与验证基于人工智能与大数据的智能筛查工具、数字疗法、个性化干预方案推荐系统及预后预测模型，推动服务模式的数字化革命。
                    </p>
                  </div>
                </div>
              </div>

              <div className="reveal group relative" style={{ transitionDelay: '0.25s' }}>
                <div className="relative bg-gradient-to-r from-teal-500/10 via-white/5 to-cyan-500/10 border border-white/10 rounded-2xl p-8 hover:border-teal-500/30 hover:from-teal-500/15 hover:to-cyan-500/15 transition-all duration-500">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-l-2xl" />
                  <div className="pl-4">
                    <div className="flex items-start gap-4 mb-3">
                      <span className="text-3xl font-bold text-white/10">4</span>
                      <h3 className="text-xl font-bold text-white">跨学科整合服务的标准与成效评价体系</h3>
                    </div>
                    <p className="text-white/60 leading-relaxed pl-12">
                      建立并完善"医-教-护-管-康"跨学科团队协作的服务标准、流程与成本效益评价体系，为"价值医疗"在发育行为领域的落地提供科学依据。
                    </p>
                  </div>
                </div>
              </div>

              <div className="reveal group relative" style={{ transitionDelay: '0.3s' }}>
                <div className="relative bg-gradient-to-r from-teal-500/10 via-white/5 to-cyan-500/10 border border-white/10 rounded-2xl p-8 hover:border-teal-500/30 hover:from-teal-500/15 hover:to-cyan-500/15 transition-all duration-500">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-l-2xl" />
                  <div className="pl-4">
                    <div className="flex items-start gap-4 mb-3">
                      <span className="text-3xl font-bold text-white/10">5</span>
                      <h3 className="text-xl font-bold text-white">融合教育生态构建与社会支持系统研究</h3>
                    </div>
                    <p className="text-white/60 leading-relaxed pl-12">
                      研究如何有效构建学校、家庭、社区联动的融合教育支持生态，并探索促进神经多样性群体社会融合的政策与环境支持路径。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal">
              <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-4 block">核心架构</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">三、核心支柱与业务成果</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-transparent mx-auto" />
            </div>

            {/* Pillar 1 */}
            <div className="reveal mb-12" style={{ transitionDelay: '0.1s' }}>
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-10 hover:border-teal-500/30 transition-all duration-500">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-teal-400 flex-shrink-0">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-5xl font-bold text-white/10 leading-none">01</span>
                    <h3 className="text-2xl font-bold text-white">数字化智能平台驱动</h3>
                  </div>
                </div>
                <p className="text-white/70 leading-relaxed pl-22">
                  成功研发覆盖0-18岁的儿童青少年发育行为综合管理SaaS平台与数字智能处方库。该平台集在线评估、个性化干预计划生成、远程咨询及随访管理于一体，实现了发育行为数字智能的落地，打破地域限制，为家庭和从业者提供精准、高效的工具支持。
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="reveal mb-12" style={{ transitionDelay: '0.15s' }}>
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-10 hover:border-teal-500/30 transition-all duration-500">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-teal-400 flex-shrink-0">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-5xl font-bold text-white/10 leading-none">02</span>
                    <h3 className="text-2xl font-bold text-white">DBC专业人才培训体系</h3>
                  </div>
                </div>
                <p className="text-white/70 leading-relaxed pl-22 mb-4">
                  联合海内外顶尖学术机构，打造了 "导师-督导-教练"三师体系及PBL智能化学习督导平台。
                </p>
                <p className="text-white/70 leading-relaxed pl-22">
                  系统化培养跨学科的整合型发育行为教练（DBC）人才体系：儿童早期发展顾问（ECDC）、孤独症早期干预顾问（COPC）、家校支持顾问（HSSC）、运动与学习发展顾问（MLDC）、感官康护顾问（SHCC）、积极艺术疗愈顾问（PAC）等不同专业方向的体系化人才培养路径。该体系是行业专业人才标准化、规模化培养的核心引擎。
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="reveal mb-12" style={{ transitionDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-10 hover:border-teal-500/30 transition-all duration-500">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-teal-400 flex-shrink-0">
                    <Microscope className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-5xl font-bold text-white/10 leading-none">03</span>
                    <h3 className="text-2xl font-bold text-white">产学研创新与模式落地</h3>
                  </div>
                </div>
                
                <div className="pl-22 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <Award className="w-5 h-5 text-teal-400" />
                      科研合作：
                    </h4>
                    <p className="text-white/60 leading-relaxed">
                      围绕重点研究方向，与北京中医药大学、北京大学联合申报国家级课题，开展前沿研究。
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-teal-400" />
                      项目实践：
                    </h4>
                    <p className="text-white/60 leading-relaxed">
                      联合北京中医药大学创建了"乡村振兴"基层妇幼ECD儿童早期发展实践样板基地（云南双柏县）、EPPC体验式儿童保健教学督导基地（西安）、"悦亲庭学堂"融合教育试点样板（成都、重庆等），形成了可复制、可推广的EFBI家庭内生干预模式与融合教育服务范式。
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-teal-400" />
                      知识输出：
                    </h4>
                    <p className="text-white/60 leading-relaxed">
                      联合出版《PLAY孤独症幼儿游戏和语言干预》等行业权威著作，并研发配套的发育行为及融合教辅工具包，将理论转化为实践生产力。
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-teal-400" />
                      学术产出：
                    </h4>
                    <p className="text-white/60 leading-relaxed">
                      在核心期刊发表相关专业论著，2025年在《中华现代护理杂志》的儿童公共健康专题策划版块发表《护理主导的儿童早期发展支持路径探索：从孤独症干预到乡村家庭赋能》；《家庭内生干预在孤独症谱系障碍儿童中的应用》写入国家卫生健康委员会"十五五"规划教材全国高等中医药教育教材《儿科护理学》中；并申请20多项软件著作。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="reveal" style={{ transitionDelay: '0.25s' }}>
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-10 hover:border-teal-500/30 transition-all duration-500">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-teal-400 flex-shrink-0">
                    <Globe className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-5xl font-bold text-white/10 leading-none">04</span>
                    <h3 className="text-2xl font-bold text-white">国际化专家智库支持</h3>
                  </div>
                </div>
                <p className="text-white/70 leading-relaxed pl-22">
                  与香港教育大学特殊需要与融合教育研究所（ISNIE）、香港自闭症联盟（Autism HK）、美国PLAY官方机构、北京中医药大学、北京大学、南开大学孤独症研究中心等国内外顶尖学术与专业机构建立深度战略合作，确保我们的理念、课程、研究与实践与国际前沿同步，构建了强大的国际化专家团队网络。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Welfare Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal">
              <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-4 block">社会责任</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">四、社会公益实践与倡导</h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">研究院积极履行社会责任，通过公益行动践行社会融合理念：</p>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-transparent mx-auto mt-6" />
            </div>

            <div className="grid md:grid-cols-1 gap-6">
              <div className="reveal" style={{ transitionDelay: '0.1s' }}>
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-10 hover:border-teal-500/30 transition-all duration-500">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-teal-400 flex-shrink-0">
                      <HandHeart className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">1、精准帮扶实践</h3>
                  </div>
                  <p className="text-white/70 leading-relaxed pl-16">
                    在云南双柏县"乡村振兴-家庭赋能"基地，我们不仅进行机构转型赋能，更组织跨学科专家团队，为当地困境儿童提供直接的专业评估与干预支持，将优质资源深入基层。
                  </p>
                </div>
              </div>

              <div className="reveal" style={{ transitionDelay: '0.15s' }}>
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-10 hover:border-teal-500/30 transition-all duration-500">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-teal-400 flex-shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">2、社会倡导与文化建设</h3>
                  </div>
                  <p className="text-white/70 leading-relaxed pl-16">
                    联合国内外学术机构、公益组织及家长团体，发起并举办了中国第一届"国际自闭谱系自豪日"大型公益论坛活动；联合组织了第18界联合国2025年【WAAD世界孤独谱系关注日】艺术多元化主题WAAD纪念封及心思心意邮票图案设计比赛活动；通过公众宣传、主题论坛和社群庆祝，旨在转变社会认知，倡导神经多样性观点，发掘谱系人士的独特优势，推动建立一个更加包容、理解与支持的社会环境。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Empowerment Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal">
              <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-4 block">行业价值</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">五、行业赋能与社会价值</h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">研究院专注于为以下合作提供数字化"咨询-评估-干预-管理"整体解决方案：</p>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-transparent mx-auto mt-6" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="reveal" style={{ transitionDelay: '0.1s' }}>
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-teal-500/30 transition-all duration-500">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-teal-400 mb-6">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">1、机构转型赋能与科室共建</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    为医疗机构、特教机构提供业务模式升级与专业能力建设。
                  </p>
                </div>
              </div>

              <div className="reveal" style={{ transitionDelay: '0.15s' }}>
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-teal-500/30 transition-all duration-500">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-teal-400 mb-6">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">2、人才培养与联合科研</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    为医院、高校提供从课程体系到科研合作的全方位支持。
                  </p>
                </div>
              </div>

              <div className="reveal" style={{ transitionDelay: '0.2s' }}>
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-teal-500/30 transition-all duration-500">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-teal-400 mb-6">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">3、成果转化与社会融合</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    通过示范基地建设、公益项目与社会倡导，持续推动神经多样性包容理念，促进社会融合，创造广泛的社会价值。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outlook Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal">
              <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-4 block">展望未来</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">六、展望</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-transparent mx-auto" />
            </div>

            <div className="reveal bg-gradient-to-br from-teal-500/10 via-white/[0.02] to-cyan-500/10 border border-white/10 rounded-3xl p-12">
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-white/70 leading-relaxed mb-6">
                  靛蓝之家发育行为身心发展研究院，不仅是理论研发中心，更是连接全球智慧、本土实践、公益行动与未来科技的枢纽。
                </p>
                <p className="text-lg text-white/70 leading-relaxed mb-6">
                  我们以明确的重点研究方向为引领，以跨学科的整合视角、全生命周期的服务链条、科技赋能的创新手段及温暖坚定的公益之心，持续深耕发育行为领域。
                </p>
                <p className="text-lg text-white/70 leading-relaxed">
                  我们赋能每一个家庭，培养每一位专业工作者，助力每一个合作机构，携手社会各界，共同推动行业的专业化、数字化与人性化发展，致力于构建一个真正理解、接纳并欣赏神经多样性的美好社会。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/50 via-[#0f172a] to-cyan-900/50" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center reveal">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              开启科学养育之旅
            </h2>
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              与我们一起,用专业的力量,守护每一个孩子的成长
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/experts" className="group px-8 py-4 bg-white text-[#0f172a] font-semibold rounded-xl hover:shadow-2xl hover:shadow-white/20 transition-all duration-500 transform hover:-translate-y-1 flex items-center gap-2">
                了解更多
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/scales" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                开始测评
              </Link>
            </div>
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

export default IndigoHouseHomePage;
