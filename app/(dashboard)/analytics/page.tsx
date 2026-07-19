'use client';

import React, { useState, useEffect } from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { clientDb } from '@/lib/supabase/client';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Award, Clock, ArrowRight, Layers, Target } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [showXP, setShowXP] = useState(true);
  const [mockExams, setMockExams] = useState<any[]>([]);
  
  const submissions = usePrepArenaStore((state) => state.submissions);
  const problems = usePrepArenaStore((state) => state.problems);
  const subjects = usePrepArenaStore((state) => state.subjects);
  const chapters = usePrepArenaStore((state) => state.chapters);

  useEffect(() => {
    setMounted(true);
    setMockExams(
      clientDb.getMockExams().sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime())
    );
  }, [submissions]);

  if (!mounted) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-primary"></div>
      </div>
    );
  }

  // 1. Performance Over Time: last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const performanceData = last30Days.map(dateStr => {
    const subsOnDay = submissions.filter(s => s.submitted_at.startsWith(dateStr));
    const attempted = subsOnDay.length;
    const correct = subsOnDay.filter(s => s.is_correct).length;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const xp = subsOnDay.reduce((sum, s) => sum + (s.xp_earned || 0), 0);

    const [year, month, day] = dateStr.split('-');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      dateStr,
      label,
      accuracy: attempted > 0 ? accuracy : null,
      xp,
      attempted
    };
  });

  // 2. Subject Breakdown
  const subjectData = subjects.map(sub => {
    const subProblems = problems.filter(p => p.subject_id === sub.id);
    const subProblemIds = subProblems.map(p => p.id);
    const subSubmissions = submissions.filter(s => subProblemIds.includes(s.problem_id));
    
    const attempted = subSubmissions.length;
    const correct = subSubmissions.filter(s => s.is_correct).length;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    return {
      name: sub.name,
      color: sub.color || '#4F6EF7',
      accuracy,
      attempted
    };
  }).filter(s => s.attempted > 0);

  // 3. Difficulty Distribution
  const correctSubmissions = submissions.filter(s => s.is_correct);
  const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
  correctSubmissions.forEach(s => {
    const prob = problems.find(p => p.id === s.problem_id);
    if (prob) {
      const diff = prob.difficulty.toLowerCase();
      if (diff === 'easy') difficultyCounts.easy++;
      if (diff === 'medium') difficultyCounts.medium++;
      if (diff === 'hard') difficultyCounts.hard++;
    }
  });

  const difficultyData = [
    { name: 'Easy', value: difficultyCounts.easy, color: '#10B981' },
    { name: 'Medium', value: difficultyCounts.medium, color: '#F59E0B' },
    { name: 'Hard', value: difficultyCounts.hard, color: '#EF4444' }
  ].filter(d => d.value > 0);

  const totalSolved = difficultyData.reduce((sum, d) => sum + d.value, 0);

  // 4. Time of Day Heatmap (7x24 grid)
  const heatmapGrid = Array.from({ length: 7 }, () => Array(24).fill(0));
  submissions.forEach(s => {
    const date = new Date(s.submitted_at);
    const day = date.getDay(); // 0-6
    const hour = date.getHours(); // 0-23
    heatmapGrid[day][hour]++;
  });

  const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxHeatVal = Math.max(1, ...heatmapGrid.flat());

  // Helper for Heatmap square color intensity
  const getHeatmapColor = (val: number) => {
    if (val === 0) return 'bg-bgTertiary/20 border border-borderColor/20';
    const intensity = val / maxHeatVal;
    if (intensity < 0.25) return 'bg-primary/20 border border-primary/30';
    if (intensity < 0.5) return 'bg-primary/45 border border-primary/50';
    if (intensity < 0.75) return 'bg-primary/70 border border-primary/75';
    return 'bg-primary/95 border border-primary';
  };

  // 5. Weak Areas Report
  const chapterStatsMap: Record<string, { attempted: number; correct: number; subjectName: string; chapterId: string; subjectSlug: string }> = {};
  submissions.forEach(s => {
    const prob = problems.find(p => p.id === s.problem_id);
    if (prob) {
      const chapter = chapters.find(c => c.id === prob.chapter_id);
      const subject = subjects.find(sub => sub.id === prob.subject_id);
      if (chapter && subject) {
        if (!chapterStatsMap[chapter.name]) {
          chapterStatsMap[chapter.name] = {
            attempted: 0,
            correct: 0,
            subjectName: subject.name,
            chapterId: chapter.id,
            subjectSlug: subject.slug
          };
        }
        chapterStatsMap[chapter.name].attempted++;
        if (s.is_correct) {
          chapterStatsMap[chapter.name].correct++;
        }
      }
    }
  });

  const weakAreas = Object.entries(chapterStatsMap)
    .map(([chapterName, stats]) => {
      const accuracy = Math.round((stats.correct / stats.attempted) * 100);
      return {
        chapterName,
        subjectName: stats.subjectName,
        attempted: stats.attempted,
        accuracy,
        chapterId: stats.chapterId,
        subjectSlug: stats.subjectSlug
      };
    })
    .filter(wa => wa.attempted >= 3)
    .sort((a, b) => a.accuracy - b.accuracy);

  // 6. Mock Exam Trend Data
  const mockTrendData = mockExams.map((exam, index) => {
    const subject = subjects.find(s => s.id === exam.subject_id);
    const dateStr = new Date(exam.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      index: index + 1,
      label: `Exam ${index + 1}`,
      percentage: Number(exam.percentage),
      date: dateStr,
      subjectName: subject ? subject.name : 'Scholastic',
      id: exam.id
    };
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-borderColor pb-5">
        <div>
          <h1 className="font-space text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="text-primary" />
            Performance Analytics
          </h1>
          <p className="font-space text-xs text-textSecondary mt-1">
            Analyze your learning progress, subject proficiencies, and weak areas.
          </p>
        </div>
      </div>

      {/* Grid containing Section 1 & Section 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1 — Performance Over Time */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-borderColor/60 pb-3">
            <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              Daily Progress (30 Days)
            </h3>
            
            <button
              onClick={() => setShowXP(!showXP)}
              className={`px-3 py-1 rounded-lg font-space text-[10px] font-bold uppercase border transition-all ${
                showXP 
                  ? 'bg-primary/10 text-primary border-primary/30' 
                  : 'bg-transparent text-textMuted border-borderColor'
              }`}
            >
              {showXP ? 'Hide Daily XP' : 'Show Daily XP'}
            </button>
          </div>

          <div className="h-72 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={performanceData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F294D" />
                <XAxis dataKey="label" stroke="#64748B" />
                <YAxis yAxisId="left" domain={[0, 100]} stroke="#64748B" unit="%" />
                {showXP && <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" />}
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12182B', borderColor: '#1F294D' }}
                  labelStyle={{ color: '#F1F5F9', fontFamily: 'Space Grotesk' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Space Grotesk', fontSize: 10 }} />
                {showXP && (
                  <Bar yAxisId="right" dataKey="xp" name="XP Earned" fill="#F59E0B" opacity={0.2} radius={[4, 4, 0, 0]} />
                )}
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="accuracy" 
                  name="Accuracy %" 
                  stroke="#4F6EF7" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }} 
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 2 — Subject Breakdown */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="border-b border-borderColor/60 pb-3">
            <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers size={16} className="text-primary" />
              Subject Accuracy & Output
            </h3>
          </div>

          {subjectData.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-center font-space text-xs text-textMuted">
              Solve some problems first to view subject analytics!
            </div>
          ) : (
            <div className="h-72 w-full font-mono text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjectData}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F294D" />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748B" unit="%" />
                  <YAxis dataKey="name" type="category" stroke="#64748B" width={80} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#12182B', borderColor: '#1F294D' }}
                    labelStyle={{ color: '#F1F5F9', fontFamily: 'Space Grotesk' }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'Space Grotesk', fontSize: 10 }} />
                  <Bar dataKey="accuracy" name="Accuracy %" radius={[0, 4, 4, 0]}>
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <Bar dataKey="attempted" name="Attempts" fill="#64748B" opacity={0.3} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Grid containing Section 3 & Section 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 3 — Difficulty Distribution */}
        <div className="glass-panel rounded-2xl p-5 space-y-4 lg:col-span-1">
          <div className="border-b border-borderColor/60 pb-3">
            <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-primary" />
              Syllabus Difficulty
            </h3>
          </div>

          {totalSolved === 0 ? (
            <div className="h-56 flex items-center justify-center text-center font-space text-xs text-textMuted">
              No correct answers recorded yet.
            </div>
          ) : (
            <div className="relative h-56 flex flex-col justify-center items-center">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#12182B', borderColor: '#1F294D', fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Absolute Center Label */}
              <div className="absolute top-[37%] flex flex-col items-center justify-center pointer-events-none">
                <span className="font-space text-xl font-black text-white">{totalSolved}</span>
                <span className="font-space text-[8px] text-textMuted uppercase font-bold">Solved</span>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-4 text-[10px] font-space">
                {difficultyData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span className="text-textSecondary">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 4 — Time of Day Heatmap */}
        <div className="glass-panel rounded-2xl p-5 space-y-4 lg:col-span-2">
          <div className="border-b border-borderColor/60 pb-3">
            <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              Focus Time Heatmap
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex flex-col gap-1.5 overflow-x-auto pb-2">
              {/* Hours Header */}
              <div className="flex items-center gap-1 pl-8">
                {Array.from({ length: 24 }).map((_, hour) => (
                  <span key={hour} className="w-[14px] text-[8px] font-mono text-textMuted text-center shrink-0">
                    {hour === 0 ? '12a' : hour === 12 ? '12p' : hour % 12}
                  </span>
                ))}
              </div>

              {/* Grid Rows */}
              {DAYS_SHORT.map((dayLabel, dayIdx) => (
                <div key={dayLabel} className="flex items-center gap-1">
                  <span className="w-8 font-space text-[10px] font-bold text-textSecondary uppercase tracking-wide">
                    {dayLabel}
                  </span>
                  
                  {Array.from({ length: 24 }).map((_, hourIdx) => {
                    const val = heatmapGrid[dayIdx][hourIdx];
                    return (
                      <div
                        key={hourIdx}
                        title={`${dayLabel} at ${hourIdx}:00 — ${val} problems solved`}
                        className={`h-3 w-3 rounded-sm transition-all duration-300 hover:scale-125 cursor-pointer ${getHeatmapColor(val)}`}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center justify-end gap-1.5 text-[9px] font-space text-textMuted pr-2 pt-1">
              <span>Less</span>
              <div className="h-2.5 w-2.5 rounded-sm bg-bgTertiary/20 border border-borderColor/20"></div>
              <div className="h-2.5 w-2.5 rounded-sm bg-primary/20 border border-primary/30"></div>
              <div className="h-2.5 w-2.5 rounded-sm bg-primary/50 border border-primary/50"></div>
              <div className="h-2.5 w-2.5 rounded-sm bg-primary/80 border border-primary/80"></div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid containing Section 5 & Section 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 5 — Weak Areas Report */}
        <div className="glass-panel rounded-2xl p-5 space-y-4 lg:col-span-2">
          <div className="border-b border-borderColor/60 pb-2">
            <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Target size={16} className="text-wrong" />
              Syllabus Weak Areas (Acc &lt; 80%)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-space text-xs">
              <thead>
                <tr className="border-b border-borderColor text-[10px] text-textMuted uppercase tracking-wider">
                  <th className="py-2.5">Chapter</th>
                  <th className="py-2.5">Subject</th>
                  <th className="py-2.5 text-center">Attempted</th>
                  <th className="py-2.5 text-right">Accuracy</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColor/40">
                {weakAreas.map((area, idx) => (
                  <tr key={idx} className="hover:bg-bgPrimary/25 transition-colors">
                    <td className="py-3 font-bold text-white max-w-[200px] truncate">{area.chapterName}</td>
                    <td className="py-3 text-textSecondary">{area.subjectName}</td>
                    <td className="py-3 text-center text-white font-mono">{area.attempted}</td>
                    <td className="py-3 text-right font-mono">
                      <span className={`font-black ${
                        area.accuracy < 50 ? 'text-wrong' : 'text-amberGold'
                      }`}>
                        {area.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/problems?chapter=${encodeURIComponent(area.chapterName)}`}
                        className="inline-flex items-center gap-0.5 text-primary hover:text-primary-hover font-bold tracking-wide uppercase text-[10px] hover:translate-x-0.5 transition-all"
                      >
                        Practice
                        <ArrowRight size={10} />
                      </Link>
                    </td>
                  </tr>
                ))}

                {weakAreas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-textMuted">
                      No weak chapters identified yet. Complete at least 3 problems per chapter to generate report.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 6 — Mock Exam Trend */}
        <div className="glass-panel rounded-2xl p-5 space-y-4 lg:col-span-1">
          <div className="border-b border-borderColor/60 pb-3">
            <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Mock Exam Progress
            </h3>
          </div>

          {mockTrendData.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center font-space text-xs text-textMuted gap-3">
              <span>You haven&apos;t completed any mock exams yet.</span>
              <Link
                href="/dashboard/mock-exam"
                className="px-3.5 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-xl font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all text-[10px]"
              >
                Launch First Exam
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-44 w-full font-mono text-[9px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mockTrendData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F294D" />
                    <XAxis dataKey="label" stroke="#64748B" />
                    <YAxis domain={[0, 100]} stroke="#64748B" unit="%" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#12182B', borderColor: '#1F294D', fontSize: 10 }}
                      labelStyle={{ color: '#F1F5F9', fontFamily: 'Space Grotesk' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="percentage" 
                      name="Score" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Scrollable list of last 3 mocks */}
              <div className="space-y-2 max-h-[110px] overflow-y-auto custom-scrollbar">
                {mockTrendData.slice(-3).reverse().map((exam, idx) => (
                  <Link
                    key={idx}
                    href={`/dashboard/mock-exam/results/${exam.id}`}
                    className="flex justify-between items-center p-2 rounded-lg border border-borderColor/40 bg-bgPrimary/10 hover:bg-bgTertiary/30 hover:border-primary/50 transition-all"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="block font-space text-[10px] font-bold text-white truncate leading-tight">
                        {exam.subjectName} Exam
                      </span>
                      <span className="block text-[8px] font-space text-textMuted mt-0.5">
                        {exam.date}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] font-black text-correct shrink-0">
                      {exam.percentage}%
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
