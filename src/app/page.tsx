"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Map,
  Sparkles,
  Calendar,
  Wallet,
  Users,
  Camera,
  ChevronRight,
  Star,
  Compass,
  Plane,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI智能规划",
    description: "基于您的偏好和需求，AI为您生成独一无二的旅行方案",
  },
  {
    icon: Map,
    title: "可视化路线",
    description: "精美的地图展示，让您的行程一目了然",
  },
  {
    icon: Camera,
    title: "精美图片导出",
    description: "一键生成可分享的旅行攻略图片，留下美好回忆",
  },
  {
    icon: Calendar,
    title: "灵活调整",
    description: "拖拽即可调整景点顺序，打造专属行程",
  },
];

const testimonials = [
  {
    name: "林小姐",
    avatar: "林",
    rating: 5,
    text: "太棒了！帮我规划了完美的上海之旅，每一个景点都是精华，强烈推荐！",
  },
  {
    name: "张先生",
    avatar: "张",
    rating: 5,
    text: "第一次用就被惊艳到了，生成的行程非常专业，还帮我省了不少预算。",
  },
  {
    name: "王女士",
    avatar: "王",
    rating: 5,
    text: "界面设计非常精美，操作流畅，关键是生成的攻略太实用了！",
  },
];

export default function HomePage() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="container-width">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <Compass className="w-8 h-8 text-accent" />
              <span className="text-xl font-display font-bold text-primary">
                悦途
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
              >
                功能介绍
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
              >
                如何使用
              </a>
              <a
                href="#reviews"
                className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
              >
                用户评价
              </a>
            </nav>
            <Link
              href="/plan"
              className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-light transition-colors"
            >
              开始规划
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container-width relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6"
              >
                <Plane className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">
                  AI驱动的旅行规划新时代
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary leading-tight"
              >
                您的专属
                <br />
                <span className="text-gradient">旅行规划师</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-lg text-text-muted max-w-xl mx-auto lg:mx-0"
              >
                告诉我们要去哪里、待多久、预算多少，我们的AI将为您的每一次旅行打造独一无二的专属方案。
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/plan"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-full text-base font-medium hover:bg-primary-light transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span>开始智能规划</span>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isHovering ? "translate-x-1" : ""
                    }`}
                  />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-full text-base font-medium hover:bg-primary hover:text-white transition-all duration-300"
                >
                  了解更多
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 flex items-center gap-8 justify-center lg:justify-start"
              >
                <div>
                  <div className="text-3xl font-bold text-primary">10,000+</div>
                  <div className="text-sm text-text-muted">用户信赖</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-text-muted">覆盖城市</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <div className="text-3xl font-bold text-primary">4.9</div>
                  <div className="text-sm text-text-muted flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent fill-accent" />
                    评分
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Main card */}
                <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                        <Map className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-primary">上海 5日游</div>
                        <div className="text-sm text-text-muted">4月1日 - 4月5日</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { time: "Day 1", title: "外滩 → 南京路", type: "城市观光" },
                        { time: "Day 2", title: "豫园 → 田子坊", type: "文化体验" },
                        { time: "Day 3", title: "陆家嘴 → 新天地", type: "现代都市" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-3 bg-white rounded-xl"
                        >
                          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-sm font-medium text-accent">
                            {item.time}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-primary">
                              {item.title}
                            </div>
                            <div className="text-xs text-text-muted">{item.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">预计花费</span>
                        <span className="font-semibold text-accent">¥8,500</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium">AI优化路线</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4"
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">精美图片导出</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-white">
        <div className="container-width">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              为什么选择悦途？
            </h2>
            <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
              我们融合先进的人工智能技术与深度的旅行专业知识，为您打造前所未有的规划体验
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 bg-surface rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section-padding">
        <div className="container-width">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              三步，开启您的专属旅程
            </h2>
            <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
              简单几步，告诉我们您的旅行偏好，剩下的交给我们
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "填写偏好",
                description: "选择目的地、时间、预算和旅行风格，我们会为您生成最合适的方案",
                icon: Calendar,
              },
              {
                step: "02",
                title: "AI智能规划",
                description: "我们的AI系统将分析海量数据，为您打造独一无二的专属行程",
                icon: Sparkles,
              },
              {
                step: "03",
                title: "调整与导出",
                description: "根据需要自由调整景点顺序，一键导出精美的图片版攻略",
                icon: Wallet,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-8xl font-display font-bold text-accent/10 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-12">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/plan"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-full text-base font-medium hover:bg-accent-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>立即开始规划</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="section-padding bg-white">
        <div className="container-width">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
              用户怎么说
            </h2>
            <p className="mt-4 text-lg text-text-muted">
              来自真实用户的反馈，是我们前进的动力
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-surface rounded-2xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-accent fill-accent"
                    />
                  ))}
                </div>
                <p className="text-text-primary leading-relaxed mb-6">
                  &quot;{review.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-sm font-medium text-accent">
                    {review.avatar}
                  </div>
                  <span className="font-medium text-primary">{review.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-primary rounded-3xl p-12 md:p-16 overflow-hidden"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />

            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                准备好开启您的专属旅程了吗？
              </h2>
              <p className="text-lg text-white/70 mb-8">
                告诉我们您想要的旅行体验，剩下的交给我们
              </p>
              <Link
                href="/plan"
                className="inline-flex items-center gap-2 px-10 py-4 bg-accent text-white rounded-full text-base font-medium hover:bg-accent-dark transition-all duration-300 shadow-lg"
              >
                <span>开始智能规划</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="container-width">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-accent" />
              <span className="text-lg font-display font-bold text-primary">
                悦途
              </span>
            </div>
            <p className="text-sm text-text-muted">
              © 2024 悦途 Travel. 保留所有权利。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
