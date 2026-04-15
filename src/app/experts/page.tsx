'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  Briefcase,
  Heart,
  Brain,
  Users,
  Sparkles,
  Palette,
  Microscope,
  ChevronLeft,
  ArrowRight,
  Menu,
  X,
  School,
  Globe,
  Code,
  Star,
  User
} from 'lucide-react';
const ExpertsPage: React.FC = () => {
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

  const positions = [
    {
      icon: <School className="w-5 h-5" />,
      title: '世界中医药学会联合会儿童心理卫生专业委员会 理事',
      description: '推动中医药在儿童心理健康领域的应用与发展'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: '国际应用心理分析协会 (IAAP) 认证沙盘游戏治疗师',
      description: '国际权威认证,专业沙盘游戏治疗资质'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: '国际依恋关系与创伤研究学会 (SESAME) 认证治疗师',
      description: '专注依恋关系与创伤治疗的专业认证'
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: '国际认证DISC行为风格分析师',
      description: '专业行为分析与评估资质'
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: '国家二级心理咨询师',
      description: '中国心理学会认证,专业心理咨询资质'
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: '美国心理学会 (APA) 儿童发展心理学认证',
      description: '国际顶尖医学期刊认可,表彰在公共卫生领域的杰出贡献'
    }
  ];

  const specialties = [
    {
      icon: <Heart className="w-7 h-7" />,
      title: '儿童保健',
      description: '儿童体格生长发育、儿童早期发展、儿童营养及喂养',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: <Brain className="w-7 h-7" />,
      title: '神经多样性干预',
      description: 'ASD/ADHD/学习困难/高敏感的全生命周期脑智发育行为干预管理',
      gradient: 'from-teal-500 to-cyan-600'
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: '特需儿童医教融合',
      description: '特需儿童青少年的医教融合教育家校支持管理',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: '2e双重资优儿童',
      description: '2e双重资优天赋儿童青少年的识别以及个别化家庭养育支持管理',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      icon: <Palette className="w-7 h-7" />,
      title: '感官康护与艺术治疗',
      description: '青少年及成人感官康护与积极艺术治疗',
      gradient: 'from-orange-500 to-amber-600'
    }
  ];

  const research = [
    {
      icon: <Users className="w-7 h-7" />,
      title: '2e双重资优儿童的神经认知研究',
      description: '探索双重资优儿童的认知机制与发展规律',
      details: '符艳蓉博士重点关注2e双重资优儿童的神经认知机制,通过脑科学研究与临床实践相结合,揭示这类特殊儿童的认知特点与发展需求,为个性化教育干预提供科学依据。'
    },
    {
      icon: <Brain className="w-7 h-7" />,
      title: '神经多样性全生命周期支持',
      description: '构建神经多样性人群从儿童到成人的完整支持体系',
      details: '致力于建立神经多样性人群的全生命周期支持模式,涵盖早期筛查、干预、教育、职业发展等各个阶段,为ASD、ADHD、学习困难等高敏感人群提供连续性专业支持。'
    },
    {
      icon: <Code className="w-7 h-7" />,
      title: '数字化干预工具研发',
      description: '开发基于AI的智能干预与评估系统',
      details: '利用最新的数字技术,开发智能筛查、诊断、干预与评估工具,将专业知识转化为可规模化的数字产品,让更多家庭能够获得专业支持。'
    }
  ];

  const bioContent = [
    {
      paragraph: '符艳蓉博士拥有20余年儿童青少年发育行为领域的临床与研究经验,深耕于儿童神经发育障碍、学习困难、情绪行为问题等领域的评估、诊断与干预工作。'
    },
    {
      paragraph: '作为国内儿童发育行为领域的领军人物,符博士整合国际前沿的评估工具与干预方法,结合中国文化背景与家庭需求,建立了一套独特的评估干预体系。'
    },
    {
      paragraph: '符博士不仅在临床一线工作,还积极投身于专业人才培养、科学研究与产品开发,致力于推动中国儿童青少年心理健康事业的发展。'
    }
  ];

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
      <section className="relative pt-32 pb-20 overflow-hidden">
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

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="reveal" style={{ transitionDelay: '0.1s' }}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/60 hover:text-teal-400 transition-colors mb-10"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">返回首页</span>
              </Link>
            </div>

            <div className="text-center mb-12">
              <div className="reveal" style={{ transitionDelay: '0.15s' }}>
                <div className="inline-flex items-center gap-3">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-400/50" />
                  <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-teal-400" />
                    <span className="text-sm font-medium tracking-widest text-white/80">EXPERT TEAM</span>
                  </div>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-teal-400/50" />
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
              <div className="reveal" style={{ transitionDelay: '0.25s' }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-full blur-xl" />
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 p-0.5 shadow-xl shadow-teal-500/20">
                    <Image
                      src="/fu-yanrong.jpg"
                      alt="符艳蓉博士"
                      fill
                      className="object-cover rounded-full"
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-emerald-500 rounded-full border-3 border-[#0f172a] flex items-center justify-center">
                    <Star className="w-4.5 h-4.5 text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-left flex-1">
                <div className="reveal" style={{ transitionDelay: '0.3s' }}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full mb-4">
                    <Star className="w-4 h-4 text-teal-400" />
                    <span className="text-sm text-teal-400 tracking-wide">首席专家</span>
                  </div>
                </div>

                <h1 className="reveal text-4xl md:text-5xl font-bold leading-tight mb-3" style={{ transitionDelay: '0.35s' }}>
                  <span className="bg-gradient-to-r from-white via-teal-50 to-white bg-clip-text text-transparent">
                    符艳蓉
                  </span>
                </h1>

                <p className="reveal text-2xl md:text-3xl text-white/70 font-medium mb-4" style={{ transitionDelay: '0.4s' }}>
                  博士 · 首席专家
                </p>

                <p className="reveal text-lg text-white/55 max-w-xl leading-relaxed" style={{ transitionDelay: '0.45s' }}>
                  20余年儿童青少年发育行为领域临床与研究经验,深耕神经多样性支持与干预
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 reveal">
              <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-4 block">专业资质</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">职务与荣誉</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-transparent mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {positions.map((position, index) => (
                <div
                  key={index}
                  className="reveal group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-teal-500/30 hover:bg-white/[0.08] transition-all duration-500"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform duration-500">
                    {position.icon}
                  </div>
                  <p className="text-white/90 font-medium leading-relaxed text-sm mb-2">
                    {position.title}
                  </p>
                  <p className="text-white/40 text-xs leading-relaxed">
                    {position.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 reveal">
              <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-4 block">个人简介</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">关于符博士</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-transparent mx-auto" />
            </div>

            <div className="space-y-6">
              {bioContent.map((item, index) => (
                <div
                  key={index}
                  className="reveal bg-gradient-to-r from-teal-500/10 via-white/5 to-cyan-500/10 border border-white/10 rounded-2xl p-8"
                  style={{ transitionDelay: `${index * 0.15}s` }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-l-2xl" />
                  <p className="text-lg text-white/70 leading-relaxed pl-4">
                    {item.paragraph}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-4 block">专业领域</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">临床专业及擅长</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-transparent mx-auto" />
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {specialties.map((specialty, index) => (
                <div
                  key={index}
                  className="reveal group relative overflow-hidden"
                  style={{ transitionDelay: `${index * 0.15}s` }}
                >
                  <div className={`relative h-32 bg-gradient-to-br ${specialty.gradient}`}>
                    <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <div className="text-white/90 transform group-hover:scale-110 transition-transform duration-500">
                          {specialty.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/10 border-t-0 rounded-b-3xl">
                    <h3 className="text-xl font-bold text-white mb-3">
                      {specialty.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      {specialty.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-4 block">研究创新</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">重点研究及创新方向</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-transparent mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {research.map((item, index) => (
                <div
                  key={index}
                  className="reveal relative"
                  style={{ transitionDelay: `${index * 0.15}s` }}
                >
                  <div className="relative bg-gradient-to-r from-teal-500/10 via-white/5 to-cyan-500/10 border border-white/10 rounded-2xl p-8 hover:border-teal-500/30 hover:from-teal-500/15 hover:to-cyan-500/15 transition-all duration-500">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-l-2xl" />
                    <div className="pl-6">
                      <div className="flex items-start gap-5 mb-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform duration-500">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {item.title}
                          </h3>
                          <p className="text-lg text-white/70 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="pl-16">
                        <p className="text-white/50 leading-relaxed text-sm">
                          {item.details}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16 bg-gradient-to-br from-teal-900/50 via-[#0f172a] to-cyan-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="reveal">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
                探索更多
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="group px-8 py-4 bg-white text-[#0f172a] font-semibold rounded-xl hover:shadow-2xl hover:shadow-white/20 transition-all duration-500 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  返回首页
                </Link>
                <Link href="/scales" className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                  量表测评
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
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

export default ExpertsPage;
