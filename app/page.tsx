'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Trophy, BookOpen, BrainCircuit, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bgPrimary grid-bg flex flex-col justify-between overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-amberGold/10 blur-3xl -z-10 animate-pulse" style={{ animationDuration: '6s' }}></div>

      {/* Header bar */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-borderColor/40 bg-bgPrimary/30 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary animate-pulse-glow" />
          <span className="font-space text-xl font-bold tracking-tight text-white">
            Prep<span className="text-primary">Arena</span>
            <span className="ml-1.5 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase">ICSE</span>
          </span>
        </div>
        
        <Link 
          href="/dashboard"
          className="rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary px-4 py-2 font-space text-xs font-bold text-white hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
        >
          Enter Arena
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center justify-center space-y-8">
        
        {/* Animated tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amberGold/30 bg-amberGold/5 px-4 py-1.5 font-space text-[10px] font-bold text-amberGold uppercase tracking-widest animate-pulse-glow">
          <Sparkles size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
          <span>The Definitive Competitive Practice Platform</span>
        </div>

        {/* Hero title */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="font-space text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight uppercase">
            Master the Class 10 <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-indigo-400 to-amberGold bg-clip-text text-transparent drop-shadow-glow">
              ICSE Board Exams
            </span>
          </h1>
          
          <p className="font-space text-sm sm:text-base text-textSecondary max-w-xl mx-auto leading-relaxed">
            Solve LeetCode-style questions across Physics, Chemistry, Computer Applications, English Literature, and more. Receive streamed AI evaluation marked strictly against official CISCE guidelines.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <Link 
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary text-white hover:bg-primary-hover hover:shadow-glow px-8 py-4 font-space font-extrabold text-sm uppercase tracking-wider transition-all duration-300 w-full sm:w-auto hover:-translate-y-0.5"
          >
            <span>Start Practice Free</span>
            <ArrowRight size={16} />
          </Link>
          
          <Link 
            href="/problems"
            className="flex items-center justify-center gap-2 rounded-xl border border-borderColor bg-bgSecondary/50 hover:bg-bgTertiary text-textSecondary hover:text-white px-8 py-4 font-space font-extrabold text-sm uppercase tracking-wider transition-all duration-300 w-full sm:w-auto"
          >
            <span>Explore Syllabus Problems</span>
          </Link>
        </div>

        {/* Premium features cards list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12 md:pt-16">
          {/* Card 1 */}
          <div className="rounded-2xl border border-borderColor bg-bgSecondary/30 p-6 flex flex-col items-center text-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BrainCircuit size={20} />
            </div>
            <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider">AI Board Examiner</h3>
            <p className="font-space text-xs text-textSecondary leading-relaxed">
              Submit descriptive short answers and get immediate scores mapped out checklist-by-checklist against real marking schemes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-borderColor bg-bgSecondary/30 p-6 flex flex-col items-center text-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amberGold/10 border border-amberGold/20 flex items-center justify-center text-amberGold">
              <Trophy size={20} />
            </div>
            <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider">Global Standings</h3>
            <p className="font-space text-xs text-textSecondary leading-relaxed">
              Practice daily to earn XP, maintain streaks, and see yourself ranked among all competitive ICSE Class 10 candidates.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-borderColor bg-bgSecondary/30 p-6 flex flex-col items-center text-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider">Offline DB Sandbox</h3>
            <p className="font-space text-xs text-textSecondary leading-relaxed">
              Full application state, user achievements, and custom problems sync instantly to localStorage, allowing 100% functionality.
            </p>
          </div>
        </div>

      </main>

      {/* Footer bar */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-borderColor/40 flex flex-col sm:flex-row items-center justify-between text-[11px] font-space text-textMuted uppercase gap-3">
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
