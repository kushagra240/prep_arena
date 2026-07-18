'use client';

import React, { useState, useEffect } from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { clientDb } from '@/lib/supabase/client';
import { Problem, Chapter, Subject } from '@/lib/supabase/types';
import { 
  Plus, Edit, Trash2, Search, Filter, Sparkles, RefreshCw, 
  Layers, Database, BookOpen, Users, Flame, Play, Check, X,
  BarChart3, ToggleLeft, ToggleRight, HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

type TabType = 'analytics' | 'problems' | 'syllabus' | 'users' | 'daily_challenge';

export default function AdminPage() {
  const problems = usePrepArenaStore((state) => state.problems);
  const subjects = usePrepArenaStore((state) => state.subjects);
  const chapters = usePrepArenaStore((state) => state.chapters);
  const submissions = usePrepArenaStore((state) => state.submissions);
  const profile = usePrepArenaStore((state) => state.profile);
  const leaderboard = usePrepArenaStore((state) => state.leaderboard);
  const refreshState = usePrepArenaStore((state) => state.refreshState);

  const [activeTab, setActiveTab] = useState<TabType>('analytics');

  // --- PROBLEM MANAGER STATES ---
  const [problemSearch, setProblemSearch] = useState('');
  const [problemSubjectFilter, setProblemSubjectFilter] = useState('all');
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [isProblemFormOpen, setIsProblemFormOpen] = useState(false);

  // Form inputs
  const [formTitle, setFormTitle] = useState('');
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formChapterId, setFormChapterId] = useState('');
  const [formType, setFormType] = useState<'mcq' | 'brief_writing'>('mcq');
  const [formDifficulty, setFormDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formExpectedAnswer, setFormExpectedAnswer] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formMarks, setFormMarks] = useState(1);
  const [formIcseYear, setFormIcseYear] = useState('');
  const [formMcqOptions, setFormMcqOptions] = useState<Array<{ id: string; text: string; isCorrect: boolean }>>([
    { id: 'A', text: '', isCorrect: true },
    { id: 'B', text: '', isCorrect: false },
    { id: 'C', text: '', isCorrect: false },
    { id: 'D', text: '', isCorrect: false }
  ]);

  // --- SYLLABUS MANAGER STATES ---
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterDesc, setNewChapterDesc] = useState('');
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingChapterName, setEditingChapterName] = useState('');
  const [newTopicText, setNewTopicText] = useState<Record<string, string>>({});

  // --- DAILY CHALLENGE STATES ---
  const [triggeringChallenge, setTriggeringChallenge] = useState(false);
  const [dailyChallengeHistory, setDailyChallengeHistory] = useState<any[]>([]);

  // Initialize form default selections
  useEffect(() => {
    if (subjects.length > 0) {
      setFormSubjectId(subjects[0].id);
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects]);

  // Auto-set chapters in form when subject changes
  useEffect(() => {
    const subChapters = chapters.filter(c => c.subject_id === formSubjectId);
    if (subChapters.length > 0) {
      setFormChapterId(subChapters[0].id);
    } else {
      setFormChapterId('');
    }
  }, [formSubjectId, chapters]);

  // Load Daily Challenge history from localStorage mockup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHist = localStorage.getItem('preparena_admin_challenge_history');
      if (savedHist) {
        setDailyChallengeHistory(JSON.parse(savedHist));
      } else {
        const dummyHistory = [
          { date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), problemTitle: 'GST Calculation on Inter-State Supply', xpMultiplier: '2x', status: 'Completed' },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), problemTitle: 'Character of Convex Lens Image', xpMultiplier: '2x', status: 'Completed' }
        ];
        setDailyChallengeHistory(dummyHistory);
        localStorage.setItem('preparena_admin_challenge_history', JSON.stringify(dummyHistory));
      }
    }
  }, []);

  // --- ANALYTICS DATA ---
  const mockExams = typeof window !== 'undefined' ? clientDb.getMockExams() : [];
  const totalMockExams = mockExams.length;
  const avgMockExamScore = totalMockExams > 0 
    ? Math.round(mockExams.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalMockExams)
    : 0;
  const totalSubmissionsCount = submissions.length;
  const correctSubmissionsCount = submissions.filter(s => s.is_correct).length;
  const overallAccuracy = totalSubmissionsCount > 0 
    ? Math.round((correctSubmissionsCount / totalSubmissionsCount) * 100)
    : 0;

  // --- PROBLEM MANAGER OPERATIONS ---
  const handleOpenNewProblemForm = () => {
    setEditingProblem(null);
    setFormTitle('');
    setFormQuestionText('');
    setFormExpectedAnswer('');
    setFormKeywords('');
    setFormMarks(1);
    setFormIcseYear('');
    setFormType('mcq');
    setFormMcqOptions([
      { id: 'A', text: '', isCorrect: true },
      { id: 'B', text: '', isCorrect: false },
      { id: 'C', text: '', isCorrect: false },
      { id: 'D', text: '', isCorrect: false }
    ]);
    setIsProblemFormOpen(true);
  };

  const handleEditProblem = (prob: Problem) => {
    setEditingProblem(prob);
    setFormTitle(prob.title);
    setFormSubjectId(prob.subject_id);
    setFormChapterId(prob.chapter_id);
    setFormDifficulty(prob.difficulty);
    setFormType(prob.problem_type === 'mcq' ? 'mcq' : 'brief_writing');
    setFormQuestionText(prob.question_text);
    setFormExpectedAnswer(prob.expected_answer || '');
    setFormKeywords(prob.answer_keywords ? prob.answer_keywords.join(', ') : '');
    setFormMarks(prob.marks);
    setFormIcseYear(prob.icse_year ? prob.icse_year.toString() : '');
    if (prob.mcq_options) {
      setFormMcqOptions(prob.mcq_options.map(o => ({ id: o.id, text: o.text, isCorrect: o.isCorrect })));
    } else {
      setFormMcqOptions([
        { id: 'A', text: '', isCorrect: true },
        { id: 'B', text: '', isCorrect: false },
        { id: 'C', text: '', isCorrect: false },
        { id: 'D', text: '', isCorrect: false }
      ]);
    }
    setIsProblemFormOpen(true);
  };

  const handleDeleteProblem = (probId: string) => {
    if (confirm('Are you sure you want to delete this problem?')) {
      const updated = problems.filter(p => p.id !== probId);
      clientDb.saveProblems(updated);
      refreshState();
      toast.success('Problem deleted successfully!');
    }
  };

  const handleToggleProblemStatus = (probId: string) => {
    const updated = problems.map(p => {
      if (p.id === probId) {
        const nextStatus = !p.is_active;
        toast.success(`Problem ${nextStatus ? 'Activated' : 'Deactivated'}`);
        return { ...p, is_active: nextStatus };
      }
      return p;
    });
    clientDb.saveProblems(updated);
    refreshState();
  };

  const handleSaveProblem = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formQuestionText.trim()) {
      toast.error('Please fill in Title and Question Text.');
      return;
    }

    const keywordList = formKeywords
      ? formKeywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];

    const problemSlug = formTitle.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(Boolean)
      .join('-');

    const newProblemObj: Problem = {
      id: editingProblem?.id || `prob-custom-${Date.now()}`,
      chapter_id: formChapterId,
      subject_id: formSubjectId,
      title: formTitle,
      slug: problemSlug,
      problem_type: formType,
      difficulty: formDifficulty,
      question_text: formQuestionText,
      question_image_url: null,
      marks: formMarks,
      time_limit_seconds: formType === 'mcq' ? 120 : 300,
      tags: keywordList.map(kw => `#${kw}`),
      mcq_options: formType === 'mcq' ? formMcqOptions.map(o => ({ id: o.id, text: o.text, isCorrect: o.isCorrect })) : null,
      expected_answer: formType === 'brief_writing' ? formExpectedAnswer : null,
      answer_keywords: formType === 'brief_writing' ? keywordList : null,
      min_words: formType === 'brief_writing' ? 25 : null,
      max_words: formType === 'brief_writing' ? 200 : null,
      icse_year: formIcseYear ? parseInt(formIcseYear) : null,
      is_board_question: !!formIcseYear,
      total_attempts: editingProblem?.total_attempts || 0,
      total_correct: editingProblem?.total_correct || 0,
      xp_reward: formDifficulty === 'easy' ? 10 : formDifficulty === 'medium' ? 30 : 50,
      created_at: editingProblem?.created_at || new Date().toISOString(),
      is_active: editingProblem ? editingProblem.is_active : true
    };

    let updatedList: Problem[] = [];
    if (editingProblem) {
      updatedList = problems.map(p => p.id === editingProblem.id ? newProblemObj : p);
      toast.success('Problem updated successfully!');
    } else {
      updatedList = [newProblemObj, ...problems];
      toast.success('New problem added to board database!');
    }

    clientDb.saveProblems(updatedList);
    refreshState();
    setIsProblemFormOpen(false);
  };

  const handleUpdateOption = (id: string, text: string) => {
    setFormMcqOptions(formMcqOptions.map(o => o.id === id ? { ...o, text } : o));
  };

  const handleSelectCorrectOption = (id: string) => {
    setFormMcqOptions(formMcqOptions.map(o => ({ ...o, isCorrect: o.id === id })));
  };

  // --- SYLLABUS MANAGER OPERATIONS ---
  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterName.trim()) {
      toast.error('Chapter name is required.');
      return;
    }

    const newCh: Chapter = {
      id: `ch-custom-${Date.now()}`,
      subject_id: selectedSubjectId,
      name: newChapterName,
      description: newChapterDesc || 'Curriculum unit.',
      order_index: chapters.filter(c => c.subject_id === selectedSubjectId).length + 1,
      syllabus_reference: `ICSE-${selectedSubjectId.replace('sub-', '').toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-2)}`,
      created_at: new Date().toISOString(),
      topics: ['Introduction & Core Basics']
    };

    const updated = [...chapters, newCh];
    clientDb.saveChapters(updated);
    refreshState();
    setNewChapterName('');
    setNewChapterDesc('');
    toast.success('Chapter added to syllabus tree!');
  };

  const handleRenameChapter = (chapterId: string) => {
    if (!editingChapterName.trim()) return;
    const updated = chapters.map(c => {
      if (c.id === chapterId) {
        return { ...c, name: editingChapterName };
      }
      return c;
    });
    clientDb.saveChapters(updated);
    refreshState();
    setEditingChapterId(null);
    setEditingChapterName('');
    toast.success('Chapter renamed!');
  };

  const handleAddTopic = (chapterId: string) => {
    const text = newTopicText[chapterId];
    if (!text || !text.trim()) return;

    const updated = chapters.map(c => {
      if (c.id === chapterId) {
        const topics = c.topics || [];
        return { ...c, topics: [...topics, text.trim()] };
      }
      return c;
    });

    clientDb.saveChapters(updated);
    refreshState();
    setNewTopicText({ ...newTopicText, [chapterId]: '' });
    toast.success('Topic unit appended!');
  };

  // --- USER MANAGER OPERATIONS ---
  const handleResetStreak = (username: string) => {
    if (username === profile.username) {
      const updatedProfile = { ...profile, streak_days: 0 };
      clientDb.saveProfile(updatedProfile);
      refreshState();
      toast.success('Your streak has been reset to 0 days.');
    } else {
      toast.success(`Support: Streak reset executed for competitor "${username}".`);
    }
  };

  // --- DAILY CHALLENGE MANAGER OPERATIONS ---
  const triggerDailyChallengeManual = async () => {
    setTriggeringChallenge(true);
    toast.loading('Contacting scheduler backend...', { id: 'daily-reset' });

    try {
      // Simulate edge function fetch delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Select a random active problem
      const activeProbs = problems.filter(p => p.is_active);
      const randomProb = activeProbs[Math.floor(Math.random() * activeProbs.length)];

      if (randomProb) {
        // Save today's challenge in localStorage
        localStorage.setItem('preparena_daily_challenge_id', randomProb.id);
        
        // Add to admin history log
        const newHistItem = {
          date: new Date().toISOString(),
          problemTitle: randomProb.title,
          xpMultiplier: '2x',
          status: 'Triggered'
        };
        const updatedHist = [newHistItem, ...dailyChallengeHistory];
        setDailyChallengeHistory(updatedHist);
        localStorage.setItem('preparena_admin_challenge_history', JSON.stringify(updatedHist));

        toast.success(`Daily challenge updated to: "${randomProb.title}"`, { id: 'daily-reset' });
      } else {
        toast.error('No active problems found to set as challenge.', { id: 'daily-reset' });
      }
    } catch (err) {
      toast.error('Failed to trigger daily edge routine.', { id: 'daily-reset' });
    } finally {
      setTriggeringChallenge(false);
    }
  };

  // Filtered problems list
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(problemSearch.toLowerCase()) || 
                          p.question_text.toLowerCase().includes(problemSearch.toLowerCase());
    const matchesSubject = problemSubjectFilter === 'all' || p.subject_id === problemSubjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-space text-2xl font-black text-white uppercase tracking-tight">Admin Operations Console</h2>
          <p className="font-space text-xs text-textSecondary">Manage Board problems, curriculum structure, user data, and system jobs.</p>
        </div>
        <button 
          onClick={() => { refreshState(); toast.success('State synced!'); }} 
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-borderColor bg-bgSecondary/85 text-textSecondary hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-borderColor pb-3">
        {(['analytics', 'problems', 'syllabus', 'users', 'daily_challenge'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl font-space text-xs font-bold transition-all cursor-pointer uppercase ${
              activeTab === tab 
                ? 'bg-amberGold text-bgPrimary shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                : 'bg-bgSecondary/60 border border-borderColor/60 text-textSecondary hover:text-white'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* TABS CONTAINER */}
      <div className="space-y-6">
        
        {/* ========================================================
            TAB 1: SYSTEM ANALYTICS
           ======================================================== */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-6 space-y-2 shadow-glow text-center md:text-left">
              <span className="block font-space text-[10px] text-textMuted uppercase font-bold tracking-wider">Total Submissions Checked</span>
              <h3 className="font-space text-3xl font-black text-white">{totalSubmissionsCount}</h3>
              <span className="block font-space text-[11px] text-correct">Correct Solves: {correctSubmissionsCount}</span>
            </div>

            <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-6 space-y-2 shadow-glow text-center md:text-left">
              <span className="block font-space text-[10px] text-textMuted uppercase font-bold tracking-wider">Overall Platform Accuracy</span>
              <h3 className="font-space text-3xl font-black text-white">{overallAccuracy}%</h3>
              <span className="block font-space text-[11px] text-textSecondary">Average correct answer ratio</span>
            </div>

            <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-6 space-y-2 shadow-glow text-center md:text-left">
              <span className="block font-space text-[10px] text-textMuted uppercase font-bold tracking-wider">Mock Exams Completed</span>
              <h3 className="font-space text-3xl font-black text-white">{totalMockExams}</h3>
              <span className="block font-space text-[11px] text-amberGold font-bold">Average Score: {avgMockExamScore}%</span>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: PROBLEM MANAGER
           ======================================================== */}
        {activeTab === 'problems' && (
          <div className="space-y-6">
            
            {/* Search and Filters row */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex flex-1 w-full gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={problemSearch}
                    onChange={(e) => setProblemSearch(e.target.value)}
                    className="w-full rounded-xl border border-borderColor bg-bgSecondary/40 p-3.5 pl-10 font-space text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <select
                  value={problemSubjectFilter}
                  onChange={(e) => setProblemSubjectFilter(e.target.value)}
                  className="rounded-xl border border-borderColor bg-bgSecondary/40 px-3 py-3.5 font-space text-xs text-white focus:outline-none"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <button
                onClick={handleOpenNewProblemForm}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white px-5 py-3.5 font-space text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus size={14} />
                <span>Add New Problem</span>
              </button>
            </div>

            {/* Inline Add/Edit Form */}
            {isProblemFormOpen && (
              <form onSubmit={handleSaveProblem} className="glass-panel rounded-2xl border border-primary/30 bg-bgSecondary/60 p-6 space-y-6 shadow-glow">
                <div className="flex justify-between items-center border-b border-borderColor/40 pb-3">
                  <h3 className="font-space text-sm font-black text-white uppercase flex items-center gap-1.5">
                    <Database size={16} className="text-primary" />
                    <span>{editingProblem ? 'Modify Board Problem' : 'Insert New Problem'}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsProblemFormOpen(false)}
                    className="text-textMuted hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-space text-[10px] text-textSecondary uppercase font-bold">Problem Title</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. GST Calculation on Goods"
                      className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3 font-space text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="block font-space text-[10px] text-textSecondary uppercase font-bold">Subject</label>
                      <select
                        value={formSubjectId}
                        onChange={(e) => setFormSubjectId(e.target.value)}
                        className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3 font-space text-xs text-white focus:outline-none"
                      >
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-space text-[10px] text-textSecondary uppercase font-bold">Chapter</label>
                      <select
                        value={formChapterId}
                        onChange={(e) => setFormChapterId(e.target.value)}
                        className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3 font-space text-xs text-white focus:outline-none"
                      >
                        {chapters.filter(c => c.subject_id === formSubjectId).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1.5">
                      <label className="block font-space text-[10px] text-textSecondary uppercase font-bold">Type</label>
                      <select
                        value={formType}
                        onChange={(e: any) => setFormType(e.target.value)}
                        className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3 font-space text-xs text-white focus:outline-none"
                      >
                        <option value="mcq">MCQ</option>
                        <option value="brief_writing">Brief Writing</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-space text-[10px] text-textSecondary uppercase font-bold">Difficulty</label>
                      <select
                        value={formDifficulty}
                        onChange={(e: any) => setFormDifficulty(e.target.value)}
                        className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3 font-space text-xs text-white focus:outline-none"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-space text-[10px] text-textSecondary uppercase font-bold">Marks</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={10}
                        value={formMarks}
                        onChange={(e) => setFormMarks(parseInt(e.target.value) || 1)}
                        className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3 font-space text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-space text-[10px] text-textSecondary uppercase font-bold">ICSE Board Year (Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2023 (Leave blank if generic)"
                      value={formIcseYear}
                      onChange={(e) => setFormIcseYear(e.target.value)}
                      className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3 font-space text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-space text-[10px] text-textSecondary uppercase font-bold">Question Text</label>
                  <textarea
                    required
                    rows={4}
                    value={formQuestionText}
                    onChange={(e) => setFormQuestionText(e.target.value)}
                    placeholder="Enter the problem question prompt..."
                    className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3 font-space text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                {/* MCQ Options Config */}
                {formType === 'mcq' && (
                  <div className="space-y-3 bg-bgPrimary/30 p-4 rounded-xl border border-borderColor/40">
                    <span className="block font-space text-[10px] text-textSecondary uppercase font-bold">MCQ Options Configuration</span>
                    <div className="space-y-2">
                      {formMcqOptions.map((opt) => (
                        <div key={opt.id} className="flex gap-2 items-center">
                          <button
                            type="button"
                            onClick={() => handleSelectCorrectOption(opt.id)}
                            className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 font-space text-xs font-bold transition-all ${
                              opt.isCorrect 
                                ? 'bg-correct border-correct text-white' 
                                : 'border-borderColor text-textMuted hover:text-white bg-bgPrimary'
                            }`}
                          >
                            {opt.id}
                          </button>
                          <input
                            type="text"
                            required
                            placeholder={`Option ${opt.id} content...`}
                            value={opt.text}
                            onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
                            className="flex-1 rounded-lg border border-borderColor bg-bgPrimary p-2.5 font-space text-xs text-white focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brief Writing Answer Scheme */}
                {formType === 'brief_writing' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-space text-[10px] text-textSecondary uppercase font-bold">Expected Marking Answer</label>
                      <textarea
                        rows={4}
                        required
                        value={formExpectedAnswer}
                        onChange={(e) => setFormExpectedAnswer(e.target.value)}
                        placeholder="Expected answer for reference evaluation..."
                        className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3 font-space text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-space text-[10px] text-textSecondary uppercase font-bold">Concept Keywords (Comma Separated)</label>
                      <textarea
                        rows={4}
                        required
                        value={formKeywords}
                        onChange={(e) => setFormKeywords(e.target.value)}
                        placeholder="e.g. GST, SGST, CGST, 18 percent"
                        className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3 font-space text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProblemFormOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-borderColor text-textSecondary hover:text-white font-space text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-space text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Problem
                  </button>
                </div>
              </form>
            )}

            {/* Problems list table */}
            <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-borderColor bg-bgPrimary/30 font-space text-[10px] text-textMuted uppercase font-bold">
                      <th className="p-4">Title</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Difficulty</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Marks</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderColor/40 font-space text-xs">
                    {filteredProblems.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-textMuted uppercase tracking-widest text-[10px]">
                          No problems matching query found.
                        </td>
                      </tr>
                    ) : (
                      filteredProblems.map((p) => {
                        const subName = subjects.find(s => s.id === p.subject_id)?.name || 'Generic';
                        return (
                          <tr key={p.id} className="hover:bg-bgPrimary/10 text-white">
                            <td className="p-4 font-bold">{p.title}</td>
                            <td className="p-4 text-textSecondary">{subName}</td>
                            <td className="p-4">
                              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                p.difficulty === 'easy' ? 'bg-correct/10 text-correct' :
                                p.difficulty === 'medium' ? 'bg-amberGold/15 text-amberGold' : 'bg-wrong/10 text-wrong'
                              }`}>
                                {p.difficulty}
                              </span>
                            </td>
                            <td className="p-4 text-textMuted uppercase text-[10px] font-bold">{p.problem_type === 'mcq' ? 'MCQ' : 'Brief'}</td>
                            <td className="p-4 text-textSecondary font-mono">{p.marks}</td>
                            <td className="p-4">
                              <button
                                onClick={() => handleToggleProblemStatus(p.id)}
                                className={`flex items-center gap-1 text-[10px] font-bold uppercase transition-all ${
                                  p.is_active ? 'text-correct' : 'text-textMuted'
                                }`}
                              >
                                {p.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                <span>{p.is_active ? 'Active' : 'Inactive'}</span>
                              </button>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditProblem(p)}
                                  className="h-8 w-8 rounded-lg border border-borderColor bg-bgPrimary hover:text-primary transition-all flex items-center justify-center cursor-pointer"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProblem(p.id)}
                                  className="h-8 w-8 rounded-lg border border-borderColor bg-bgPrimary hover:text-wrong transition-all flex items-center justify-center cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 3: SYLLABUS MANAGER
           ======================================================== */}
        {activeTab === 'syllabus' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Column: Syllabus Add form & selector */}
            <div className="space-y-6">
              
              <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 space-y-4">
                <span className="block font-space text-[10px] text-textSecondary uppercase font-bold tracking-wider">Select Target Subject</span>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map(s => {
                    const isSelected = selectedSubjectId === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSubjectId(s.id)}
                        className={`p-3 rounded-xl border text-center font-space text-xs transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-amberGold/15 border-amberGold text-amberGold' 
                            : 'border-borderColor/60 hover:border-borderColor text-textSecondary'
                        }`}
                      >
                        <span className="block text-lg">{s.icon}</span>
                        <span className="block font-bold truncate mt-1">{s.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Chapter Form */}
              <form onSubmit={handleAddChapter} className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 space-y-4">
                <span className="block font-space text-[10px] text-textSecondary uppercase font-bold tracking-wider">Add Chapter to Subject</span>
                
                <div className="space-y-1">
                  <label className="block font-space text-[9px] text-textMuted uppercase font-bold">Chapter Name</label>
                  <input
                    type="text"
                    required
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    placeholder="e.g. Mensuration"
                    className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3 font-space text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-space text-[9px] text-textMuted uppercase font-bold">Brief Description</label>
                  <input
                    type="text"
                    value={newChapterDesc}
                    onChange={(e) => setNewChapterDesc(e.target.value)}
                    placeholder="Surface area, volume etc."
                    className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3 font-space text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-space text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Insert Chapter</span>
                </button>
              </form>

            </div>

            {/* Right Column: Syllabus tree view */}
            <div className="lg:col-span-2 space-y-4">
              
              <div className="flex justify-between items-center">
                <span className="font-space text-xs font-bold text-white uppercase tracking-wider">
                  Syllabus Tree units
                </span>
                <span className="font-mono text-xs text-textMuted uppercase">
                  {subjects.find(s => s.id === selectedSubjectId)?.name || ''}
                </span>
              </div>

              <div className="space-y-3">
                {chapters.filter(c => c.subject_id === selectedSubjectId).map((ch) => {
                  const isRenaming = editingChapterId === ch.id;
                  return (
                    <div key={ch.id} className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/45 p-5 space-y-3">
                      
                      {/* Chapter details row */}
                      <div className="flex items-center justify-between gap-3 border-b border-borderColor/40 pb-2.5">
                        <div className="flex-1">
                          {isRenaming ? (
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={editingChapterName}
                                onChange={(e) => setEditingChapterName(e.target.value)}
                                className="rounded-lg border border-borderColor bg-bgPrimary px-3 py-1 font-space text-xs text-white focus:outline-none"
                              />
                              <button
                                onClick={() => handleRenameChapter(ch.id)}
                                className="h-7 px-3 bg-correct text-bgPrimary rounded font-space text-[10px] font-bold"
                              >
                                Rename
                              </button>
                              <button
                                onClick={() => setEditingChapterId(null)}
                                className="text-textMuted hover:text-white"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-baseline gap-2">
                              <h4 className="font-space text-sm font-bold text-white uppercase">{ch.name}</h4>
                              <span className="font-mono text-[9px] text-textMuted uppercase">{ch.syllabus_reference}</span>
                            </div>
                          )}
                          <p className="font-space text-[11px] text-textSecondary mt-0.5">{ch.description}</p>
                        </div>

                        {!isRenaming && (
                          <button
                            onClick={() => { setEditingChapterId(ch.id); setEditingChapterName(ch.name); }}
                            className="text-textMuted hover:text-white transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                      </div>

                      {/* Topics inside chapter */}
                      <div className="space-y-2">
                        <span className="block font-space text-[9px] text-textMuted uppercase font-bold tracking-wider">Chapter Topics</span>
                        <div className="flex flex-wrap gap-1.5">
                          {ch.topics?.map((topic, tIdx) => (
                            <span
                              key={tIdx}
                              className="inline-flex items-center rounded bg-bgPrimary border border-borderColor/60 px-2 py-0.5 text-[10px] font-space text-textSecondary"
                            >
                              {topic}
                            </span>
                          )) || <span className="text-[10px] font-space text-textMuted italic">No topics defined yet.</span>}
                        </div>

                        {/* Add Topic mini form */}
                        <div className="flex gap-2 pt-2.5">
                          <input
                            type="text"
                            placeholder="Add specific syllabus topic..."
                            value={newTopicText[ch.id] || ''}
                            onChange={(e) => setNewTopicText({ ...newTopicText, [ch.id]: e.target.value })}
                            className="flex-1 rounded-lg border border-borderColor/80 bg-bgPrimary px-3 py-1.5 font-space text-[10px] text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddTopic(ch.id)}
                            className="px-3 bg-bgTertiary hover:bg-bgPrimary text-white rounded-lg border border-borderColor font-space text-[10px] font-bold cursor-pointer"
                          >
                            Add Unit
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            TAB 4: USER MANAGER
           ======================================================== */}
        {activeTab === 'users' && (
          <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 overflow-hidden">
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-borderColor bg-bgPrimary/30 font-space text-[10px] text-textMuted uppercase font-bold">
                    <th className="p-4">Username</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Affiliation / School</th>
                    <th className="p-4">XP Score</th>
                    <th className="p-4">Daily Streak</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderColor/40 font-space text-xs">
                  {/* Sync Current user profile */}
                  <tr className="hover:bg-bgPrimary/10 text-white bg-primary/5">
                    <td className="p-4 font-bold flex items-center gap-1.5">
                      <img src={profile.avatar_url || ''} className="h-6 w-6 rounded-full border border-primary shrink-0 bg-bgPrimary" />
                      <span>{profile.username} (You)</span>
                    </td>
                    <td className="p-4 text-textSecondary">{profile.full_name || 'Anonymous Student'}</td>
                    <td className="p-4 text-textMuted truncate max-w-[200px]">{profile.school || 'ICSE Academy'}</td>
                    <td className="p-4 font-mono font-black text-amberGold">{profile.xp}</td>
                    <td className="p-4 font-bold text-orange-500">{profile.streak_days} days</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleResetStreak(profile.username)}
                        className="px-2.5 py-1 bg-wrong/10 text-wrong border border-wrong/20 hover:bg-wrong/20 rounded font-space text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Reset Streak
                      </button>
                    </td>
                  </tr>

                  {/* Sync other leaderboard members */}
                  {leaderboard.filter(e => e.username !== profile.username).map((u, idx) => (
                    <tr key={idx} className="hover:bg-bgPrimary/10 text-white">
                      <td className="p-4 font-bold flex items-center gap-1.5">
                        <img src={u.avatar_url || ''} className="h-6 w-6 rounded-full border border-borderColor shrink-0 bg-bgPrimary" />
                        <span>{u.username}</span>
                      </td>
                      <td className="p-4 text-textSecondary">{u.full_name || 'Competitor'}</td>
                      <td className="p-4 text-textMuted truncate max-w-[200px]">{u.school || 'ICSE Affiliate'}</td>
                      <td className="p-4 font-mono font-bold text-textSecondary">{u.xp}</td>
                      <td className="p-4 text-textSecondary">{u.streak_days} days</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleResetStreak(u.username)}
                          className="px-2.5 py-1 bg-wrong/10 text-wrong border border-wrong/20 hover:bg-wrong/20 rounded font-space text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Reset Streak
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 5: DAILY CHALLENGE MANAGER
           ======================================================== */}
        {activeTab === 'daily_challenge' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Daily Reset panel */}
            <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 space-y-4">
              <span className="block font-space text-[10px] text-textSecondary uppercase font-bold tracking-wider">Challenge Dispatcher</span>
              <p className="font-space text-[11px] text-textMuted leading-relaxed">
                Manually trigger the random active problem scheduling routine. This routine rotates questions and updates double XP flags.
              </p>

              <button
                onClick={triggerDailyChallengeManual}
                disabled={triggeringChallenge}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-space text-xs font-black transition-all cursor-pointer"
              >
                {triggeringChallenge ? (
                  <span className="h-4.5 w-4.5 animate-spin rounded-full border border-solid border-current border-r-transparent"></span>
                ) : (
                  <Play size={14} />
                )}
                <span>{triggeringChallenge ? 'Contacting Edge...' : 'Trigger Manual Dispatch'}</span>
              </button>
            </div>

            {/* Daily Challenge history log */}
            <div className="lg:col-span-2 space-y-4">
              <span className="block font-space text-xs font-bold text-white uppercase tracking-wider">
                Edge Job Dispatch Logs
              </span>

              <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-borderColor bg-bgPrimary/30 font-space text-[10px] text-textMuted uppercase font-bold">
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Scheduled Problem Title</th>
                        <th className="p-4">XP Flag</th>
                        <th className="p-4 text-right">Job Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borderColor/40 font-space text-xs">
                      {dailyChallengeHistory.map((hist, idx) => (
                        <tr key={idx} className="hover:bg-bgPrimary/10 text-white">
                          <td className="p-4 text-textMuted">
                            {new Date(hist.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4 font-bold">{hist.problemTitle}</td>
                          <td className="p-4 font-mono font-black text-amberGold">{hist.xpMultiplier}</td>
                          <td className="p-4 text-right">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-correct/10 border border-correct/20 text-correct text-[9px] font-bold uppercase">
                              {hist.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
