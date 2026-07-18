import React from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { Sparkles } from 'lucide-react';

export function ActivityCalendar() {
  const submissions = usePrepArenaStore((state) => state.submissions);

  // Generate list of past 24 weeks (168 days) to render
  const daysToRender = 168; // 24 weeks
  const today = new Date();
  
  const cells = Array.from({ length: daysToRender }).map((_, idx) => {
    const date = new Date();
    date.setDate(today.getDate() - (daysToRender - 1 - idx));
    const dateStr = date.toISOString().split('T')[0];
    
    // Count user submissions on this date
    const count = submissions.filter(s => s.submitted_at.startsWith(dateStr) && s.is_correct).length;
    
    return {
      dateStr,
      count,
      dayOfWeek: date.getDay()
    };
  });

  // Group cells into 24 columns (weeks)
  const columns: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    columns.push(cells.slice(i, i + 7));
  }

  // Activity levels color map
  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-bgTertiary/30 border border-borderColor/20';
    if (count <= 2) return 'bg-primary/20 border border-primary/30';
    if (count <= 5) return 'bg-primary/50 border border-primary/60';
    return 'bg-primary border border-primary/80 shadow-[0_0_8px_rgba(79,110,247,0.4)]';
  };

  const getTooltipText = (cell: typeof cells[0]) => {
    const dateFormatted = new Date(cell.dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
    return `${cell.count} ${cell.count === 1 ? 'problem' : 'problems'} solved on ${dateFormatted}`;
  };

  return (
    <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 shadow-glow space-y-4">
      <div className="flex items-center justify-between border-b border-borderColor pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <h3 className="font-space font-bold text-white text-sm">Consistent Practice Grid</h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-space text-textMuted uppercase tracking-wider">
          <span>Less</span>
          <div className="flex gap-1">
            <span className="h-2.5 w-2.5 rounded bg-bgTertiary/30"></span>
            <span className="h-2.5 w-2.5 rounded bg-primary/20"></span>
            <span className="h-2.5 w-2.5 rounded bg-primary/40"></span>
            <span className="h-2.5 w-2.5 rounded bg-primary"></span>
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="overflow-x-auto pb-2">
          {/* Calendar Heatmap Grid */}
          <div className="flex gap-1.5 min-w-[500px]">
            {/* Weekday indicator column */}
            <div className="flex flex-col justify-between text-[9px] font-space text-textMuted h-[86px] pr-2 pt-0.5 select-none uppercase">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Weeks columns */}
            {columns.map((week, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1.5">
                {week.map((cell) => (
                  <div
                    key={cell.dateStr}
                    title={getTooltipText(cell)}
                    className={`h-2.5 w-2.5 rounded-[2px] transition-all duration-300 hover:scale-125 cursor-pointer ${getColorClass(cell.count)}`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="font-space text-[10px] text-textMuted leading-relaxed">
          Hover over cells to view daily board completion rates. Consistent practice guarantees a 95%+ score in ICSE.
        </p>
      </div>
    </div>
  );
}
