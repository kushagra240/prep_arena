'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Trophy, BookOpen, BrainCircuit, ArrowRight, ShieldCheck, GraduationCap, Laptop, Compass, Activity, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] grid-bg flex flex-col justify-between overflow-hidden relative select-none">
      
      {/* Background Neon Blurs / Glow circles */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#06B6D4]/10 blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#4F6EF7]/15 blur-[150px] -z-10" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-[#06B6D4]/10 blur-[130px] -z-10 animate-pulse" style={{ animationDuration: '6s' }}></div>

      {/* Header bar */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-[#1F294D]/40 bg-[#0A0F1E]/30 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary animate-pulse-glow" />
          <span className="font-space text-xl font-bold tracking-tight text-white">
            Prep<span className="text-primary">Arena</span>
            <span className="ml-1.5 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase">ICSE</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/problems" 
            className="hidden sm:inline font-space text-xs font-bold text-textSecondary hover:text-white transition-colors"
          >
            Syllabus
          </Link>
          <Link 
            href="/leaderboard" 
            className="hidden sm:inline font-space text-xs font-bold text-textSecondary hover:text-white transition-colors"
          >
            Leaderboard
          </Link>
          <Link 
            href="/dashboard"
            className="rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary px-4 py-2 font-space text-xs font-bold text-white hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
          >
            Enter Arena
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-12 pb-24 flex flex-col items-center justify-center text-center space-y-12 relative z-10">
        
        {/* Title Section (Cyan Glow - Stacked - With Period) */}
        <div className="space-y-2 select-text">
          <h1 className="font-space text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none text-cyan-400 text-neon-cyan uppercase">
            Prep
          </h1>
          <h1 className="font-space text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none text-cyan-400 text-neon-cyan uppercase">
            Arena<span className="text-white">.</span>
          </h1>
        </div>

        {/* Browser Mock Address Bar */}
        <div className="w-full max-w-xl mx-auto transition-transform duration-500 hover:scale-[1.01]">
          <div className="bg-[#12182B]/85 backdrop-blur-xl border border-[#1F294D] rounded-full py-2 px-4 flex items-center gap-3.5 text-textSecondary text-xs shadow-glow">
            {/* Double page copy icon */}
            <button className="text-textMuted hover:text-white transition-colors shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
            </button>
            {/* Left and Right navigation buttons */}
            <button className="h-6 w-6 rounded-full border border-[#1F294D] flex items-center justify-center text-textMuted hover:text-white transition-all hover:bg-[#1E2640] shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="h-6 w-6 rounded-full border border-[#1F294D] flex items-center justify-center text-textMuted hover:text-white transition-all hover:bg-[#1E2640] shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
            {/* Address bar input */}
            <div className="flex-1 bg-[#0A0F1E]/80 border border-[#1F294D]/80 rounded-full px-4 py-1.5 flex items-center justify-between text-textSecondary gap-2 font-space text-[11px] h-8 shadow-inner">
              <svg className="w-3.5 h-3.5 text-textMuted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              <span className="flex-1 text-center font-bold tracking-wider text-white select-all">preparena.org</span>
              <button className="text-textMuted hover:text-white transition-colors shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Subtitle & Info */}
        <div className="space-y-6 max-w-2xl select-text">
          <p className="font-space text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-xl mx-auto">
            Transform your study sheets into clear summaries, test your knowledge with smart board mock exams, and progress dynamically with:
          </p>

          {/* Premium White Pill Button (Tariq IA style) */}
          <div className="flex justify-center pt-2">
            <Link href="/dashboard">
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-white to-[#E2E8F0] text-[#0A0F1E] font-space text-xs font-black uppercase tracking-widest shadow-[0_4px_25px_rgba(255,255,255,0.4)] hover:shadow-[0_4px_35px_rgba(79,110,247,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2 border border-white">
                <BrainCircuit size={14} className="text-[#4F6EF7]" />
                <span>PrepArena AI</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Overlapping 3D Perspective Device Mockup Container */}
        <div className="relative w-full max-w-3xl h-[450px] md:h-[500px] mt-16 scale-95 md:scale-100 flex items-center justify-center">
          
          {/* Floating Sparkle Stars */}
          <div className="absolute right-0 md:right-10 top-1/4 z-30 text-cyan-300 animate-pulse pointer-events-none">
            <svg className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
            </svg>
          </div>
          <div className="absolute left-6 bottom-1/4 z-30 text-cyan-400 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}>
            <svg className="w-5 h-5 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
            </svg>
          </div>

          {/* Floating Pill labels / Badges */}
          <div className="absolute top-1/3 -left-2 md:-left-12 z-40 bg-white text-black font-space font-extrabold text-[10px] sm:text-xs px-5 py-2.5 rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.6)] border border-white/80 tracking-widest uppercase hover:scale-105 transition-transform cursor-pointer">
            📋 Course Practice
          </div>
          <div className="absolute top-20 -right-2 md:-right-12 z-40 bg-white text-black font-space font-extrabold text-[10px] sm:text-xs px-5 py-2.5 rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.6)] border border-white/80 tracking-widest uppercase hover:scale-105 transition-transform cursor-pointer">
            📝 AI Review
          </div>
          <div className="absolute bottom-16 right-6 md:right-0 z-40 bg-white text-black font-space font-extrabold text-[10px] sm:text-xs px-5 py-2.5 rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.6)] border border-white/80 tracking-widest uppercase hover:scale-105 transition-transform cursor-pointer">
            🏆 Global Ranks
          </div>

          {/* Bottom Overlapping Panel (Light Mode Mockup) */}
          <div className="absolute inset-0 bg-[#F8FAFC] border border-slate-200 rounded-3xl p-5 shadow-2xl flex flex-col justify-between anim-mock-light overflow-hidden max-w-2xl h-[340px] md:h-[380px] w-full text-slate-800">
            {/* Mock browser header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex gap-1.5 items-center">
                <span className="h-3 w-3 rounded-full bg-slate-300"></span>
                <span className="h-3 w-3 rounded-full bg-slate-300"></span>
                <span className="h-3 w-3 rounded-full bg-slate-300"></span>
              </div>
              <div className="flex gap-4 text-[10px] font-space font-bold text-slate-400 uppercase">
                <span>Practices</span>
                <span>Exams</span>
                <span>Leaderboard</span>
              </div>
              <span className="h-6 w-6 rounded-full bg-slate-200"></span>
            </div>

            {/* Core Card */}
            <div className="my-auto space-y-4 max-w-md mx-auto text-center py-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 font-space text-[9px] font-extrabold text-blue-600 uppercase tracking-wider">
                ⚡ Intelligence Artificielle de Pointe
              </span>
              <h2 className="font-space text-xl md:text-2xl font-black text-slate-900 leading-snug">
                Réussissez vos études avec l&apos;IA
              </h2>
              <p className="font-space text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Transformez vos cours en résumés clairs, testez vos connaissances avec des quiz intelligents et progressez.
              </p>
              <div className="pt-2">
                <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-space text-xs font-bold shadow-md hover:bg-blue-700 transition-colors">
                  Commencer
                </button>
              </div>
            </div>
            
            {/* Mock status bar */}
            <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[8px] font-space text-slate-400 uppercase font-bold tracking-wider">
              <span>Syllabus Active Tracker</span>
              <span>Class 10 candidate module</span>
            </div>
          </div>

          {/* Top Overlapping Panel (Dark Mode Mockup) */}
          <div className="absolute inset-0 bg-[#12182B] border border-[#1F294D] rounded-3xl p-5 flex flex-col justify-between anim-mock-dark overflow-hidden max-w-2xl h-[340px] md:h-[380px] w-full text-white">
            {/* Mock browser header */}
            <div className="flex items-center justify-between border-b border-[#1F294D]/60 pb-3">
              <div className="flex gap-1.5 items-center">
                <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
              </div>
              <div className="flex gap-4 text-[10px] font-space font-bold text-textSecondary uppercase">
                <span>Syllabus</span>
                <span>Timed Exams</span>
                <span className="text-primary font-black">AI Solver</span>
              </div>
              <span className="h-6 w-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary">K</span>
            </div>

            {/* Core Card */}
            <div className="my-auto space-y-4 max-w-md mx-auto text-center py-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 font-space text-[9px] font-extrabold text-primary uppercase tracking-wider">
                🤖 Artificial Intelligence Examiner
              </span>
              <h2 className="font-space text-xl md:text-2xl font-black text-white leading-snug uppercase tracking-tight">
                Succeed in your Board Exams with AI
              </h2>
              <p className="font-space text-xs text-textSecondary max-w-sm mx-auto leading-relaxed">
                Solve past paper distributions, get streamed feedback, and achieve scholastic excellence with official CISCE scoring.
              </p>
              <div className="pt-2">
                <button className="px-5 py-2.5 rounded-xl bg-primary text-white font-space text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-colors">
                  Launch Simulator
                </button>
              </div>
            </div>
            
            {/* Mock status bar */}
            <div className="border-t border-[#1F294D]/40 pt-2 flex items-center justify-between text-[8px] font-space text-textMuted uppercase font-bold tracking-wider">
              <span>Candidate: @kushagra_icse</span>
              <span>XP score: 1450 pts</span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer bar */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-[#1F294D]/40 flex flex-col sm:flex-row items-center justify-between text-[11px] font-space text-textMuted uppercase gap-3 relative z-10 bg-[#0A0F1E]">
        <span>© {new Date().getFullYear()} PrepArena Platforms. Made for ICSE Scholars.</span>
        <div className="flex gap-4">
          <Link href="/problems" className="hover:text-white transition-colors">Practice</Link>
          <Link href="/leaderboard" className="hover:text-white transition-colors">Ranks</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </div>
      </footer>

    </div>
  );
}
