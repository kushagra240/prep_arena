'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { 
  Search, LayoutDashboard, BookOpen, Trophy, Settings, 
  Trash2, BookMarked, LogOut, Layers, Sparkles, GraduationCap 
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';

export function CommandPalette() {
  const router = useRouter();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  // Toggle palette with Cmd+K or Ctrl+K
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleToggle);
    };
  }, []);

  const runCommand = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to clear your local study XP history and reset the store? This action is permanent.')) {
      localStorage.removeItem('preparena_profile');
      localStorage.removeItem('preparena_submissions');
      localStorage.removeItem('preparena_user_achievements');
      localStorage.removeItem('prep_arena_mock_exams');
      toast.success('Local data cleared successfully.');
      window.location.reload();
    }
  };

  const handleToggleFormulaSheet = () => {
    window.dispatchEvent(new Event('toggle-formula-drawer'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-[#060814]/80 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Dialog container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-borderColor bg-[#0D1527] shadow-wrongGlow animate-in fade-in zoom-in-95 duration-200">
        <Command label="Global Command Menu" className="flex flex-col h-full max-h-[380px] font-space">
          
          {/* Input field */}
          <div className="flex items-center border-b border-borderColor/60 px-4 py-3 bg-[#090E1C]/60">
            <Search className="mr-3 h-4 w-4 shrink-0 text-textMuted" />
            <Command.Input 
              autoFocus
              placeholder="Search sections, subjects, or actions..." 
              className="flex-1 bg-transparent text-xs text-white placeholder-textMuted outline-none focus:ring-0 focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-borderColor/80 bg-bgTertiary px-1.5 font-mono text-[9px] font-bold text-textMuted">
              ESC
            </kbd>
          </div>

          {/* List items */}
          <Command.List className="flex-1 overflow-y-auto p-2 space-y-2 select-none custom-scrollbar">
            <Command.Empty className="py-6 text-center text-xs text-textMuted font-space">
              No matching shortcuts found.
            </Command.Empty>

            {/* Pages Section */}
            <Command.Group heading="Navigation Workspace" className="text-[10px] font-bold text-textMuted uppercase tracking-wider px-2 py-1">
              
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-textSecondary hover:text-white hover:bg-primary/10 cursor-pointer transition-all duration-150"
              >
                <LayoutDashboard size={14} className="text-primary" />
                <span>Dashboard Home</span>
              </Command.Item>

              <Command.Item 
                onSelect={() => runCommand(() => router.push('/problems'))}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-textSecondary hover:text-white hover:bg-primary/10 cursor-pointer transition-all duration-150"
              >
                <BookOpen size={14} className="text-correct" />
                <span>Practice Problems List</span>
              </Command.Item>

              <Command.Item 
                onSelect={() => runCommand(() => router.push('/subjects'))}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-textSecondary hover:text-white hover:bg-primary/10 cursor-pointer transition-all duration-150"
              >
                <Layers size={14} className="text-primary-hover" />
                <span>ICSE Subject Syllabi</span>
              </Command.Item>

              <Command.Item 
                onSelect={() => runCommand(() => router.push('/leaderboard'))}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-textSecondary hover:text-white hover:bg-primary/10 cursor-pointer transition-all duration-150"
              >
                <Trophy size={14} className="text-amberGold" />
                <span>Competitive Leaderboards</span>
              </Command.Item>

              <Command.Item 
                onSelect={() => runCommand(() => router.push('/dashboard/settings'))}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-textSecondary hover:text-white hover:bg-primary/10 cursor-pointer transition-all duration-150"
              >
                <Settings size={14} className="text-textSecondary" />
                <span>Settings & Profile Edit</span>
              </Command.Item>

            </Command.Group>

            {/* Subjects Section */}
            <Command.Group heading="Direct Subject Syllabus" className="text-[10px] font-bold text-textMuted uppercase tracking-wider px-2 py-1 pt-2 border-t border-borderColor/20">
              
              {[
                { name: 'Mathematics', slug: 'mathematics', icon: '📐' },
                { name: 'Physics', slug: 'physics', icon: '⚡' },
                { name: 'Chemistry', slug: 'chemistry', icon: '🧪' },
                { name: 'Biology', slug: 'biology', icon: '🧬' },
                { name: 'Computer Applications', slug: 'computer-applications', icon: '💻' },
                { name: 'English Literature', slug: 'english-literature', icon: '🎭' },
                { name: 'English Language', slug: 'english-language', icon: '✍️' }
              ].map((sub) => (
                <Command.Item 
                  key={sub.slug}
                  onSelect={() => runCommand(() => router.push(`/subjects/${sub.slug}`))}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-textSecondary hover:text-white hover:bg-primary/10 cursor-pointer transition-all duration-150"
                >
                  <span className="text-sm shrink-0 leading-none">{sub.icon}</span>
                  <span>{sub.name} Syllabus</span>
                </Command.Item>
              ))}

            </Command.Group>

            {/* Direct Actions Section */}
            <Command.Group heading="Control Room Utilities" className="text-[10px] font-bold text-textMuted uppercase tracking-wider px-2 py-1 pt-2 border-t border-borderColor/20">
              
              <Command.Item 
                onSelect={() => runCommand(handleToggleFormulaSheet)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-textSecondary hover:text-white hover:bg-primary/10 cursor-pointer transition-all duration-150"
              >
                <BookMarked size={14} className="text-primary" />
                <span>Toggle Board Grimoire formulas</span>
              </Command.Item>

              <Command.Item 
                onSelect={() => runCommand(handleResetData)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-wrong hover:text-wrong hover:bg-wrong/10 cursor-pointer transition-all duration-150"
              >
                <Trash2 size={14} className="text-wrong" />
                <span>Hard Reset Local XP Store</span>
              </Command.Item>

              <Command.Item 
                onSelect={() => runCommand(() => signOut())}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-textSecondary hover:text-white hover:bg-wrong/10 cursor-pointer transition-all duration-150"
              >
                <LogOut size={14} className="text-textMuted" />
                <span>Secure Sign Out</span>
              </Command.Item>

            </Command.Group>

          </Command.List>

        </Command>
      </div>
    </div>
  );
}
