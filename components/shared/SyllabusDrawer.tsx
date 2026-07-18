import React, { useState, useEffect } from 'react';
import { X, BookOpen, Loader2, Award, Clipboard } from 'lucide-react';
import { Subject } from '@/lib/supabase/types';

interface SyllabusTopic {
  name: string;
  description: string;
  syllabus_reference: string;
  order_index: number;
}

interface SyllabusDrawerProps {
  subject: Subject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SyllabusDrawer({ subject, isOpen, onClose }: SyllabusDrawerProps) {
  const [syllabus, setSyllabus] = useState<SyllabusTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subject || !isOpen) return;

    const fetchSyllabus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/syllabus/${subject.slug}`);
        if (!res.ok) throw new Error('Syllabus data not seeded');
        const data = await res.json();
        // Sort by order_index
        const sorted = data.sort((a: SyllabusTopic, b: SyllabusTopic) => a.order_index - b.order_index);
        setSyllabus(sorted);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load official board guidelines');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSyllabus();
  }, [subject, isOpen]);

  if (!isOpen || !subject) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
      ></div>

      {/* Drawer Container */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-bgSecondary border-l border-borderColor z-50 shadow-wrongGlow transition-transform duration-300 transform translate-x-0 flex flex-col">
        
        {/* Header */}
        <div 
          className="p-5 border-b border-borderColor flex items-center justify-between"
          style={{ backgroundColor: `${subject.color}05` }}
        >
          <div className="flex items-center gap-3">
            <span 
              className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0 border"
              style={{
                backgroundColor: `${subject.color}15`,
                borderColor: `${subject.color}35`,
                color: subject.color
              }}
            >
              {subject.icon}
            </span>
            <div>
              <h3 className="font-space font-black text-white text-sm uppercase tracking-wider">
                {subject.name} Syllabus
              </h3>
              <p className="font-space text-[10px] text-textMuted uppercase font-bold tracking-wider">
                CISCE Official Directives
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-borderColor hover:bg-bgTertiary text-textSecondary hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-bgPrimary/20 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="font-space text-xs text-textSecondary animate-pulse">
                Fetching official ICSE board guidelines...
              </p>
            </div>
          ) : error ? (
            <div className="text-center p-6 border border-wrong/20 bg-wrong/5 rounded-xl space-y-3">
              <p className="font-space text-xs text-wrong">{error}</p>
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-bgPrimary border border-borderColor text-white text-xs font-space font-bold rounded-lg hover:bg-bgTertiary transition-all"
              >
                Close Drawer
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-bgPrimary/40 border border-borderColor/60 rounded-xl p-3.5 space-y-1.5">
                <h4 className="font-space text-xs font-bold text-white flex items-center gap-1.5">
                  <Award size={14} className="text-amberGold" />
                  <span>Syllabus Overview</span>
                </h4>
                <p className="font-space text-[11px] text-textSecondary leading-relaxed">
                  Below are the official exam chapters prescribed by the Council for the Indian School Certificate Examinations (CISCE) for board testing.
                </p>
              </div>

              {/* Timeline list */}
              <div className="relative border-l border-borderColor/50 ml-3.5 pl-5 space-y-6 py-2">
                {syllabus.map((topic, index) => (
                  <div key={index} className="relative group">
                    {/* Circle Node */}
                    <span 
                      className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-bgSecondary flex items-center justify-center transition-all duration-300 group-hover:scale-125"
                      style={{ 
                        borderColor: subject.color,
                        boxShadow: `0 0 8px ${subject.color}40`
                      }}
                    ></span>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-space text-xs font-bold text-white leading-tight pr-4">
                          {topic.name}
                        </h4>
                        <span className="font-mono text-[9px] font-bold text-textMuted bg-bgPrimary px-1.5 py-0.5 rounded border border-borderColor/60 shrink-0">
                          {topic.syllabus_reference}
                        </span>
                      </div>
                      <p className="font-space text-[11px] text-textSecondary leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-borderColor bg-bgPrimary/60 flex items-center gap-2 text-[10px] font-space text-textMuted leading-relaxed">
          <Clipboard size={12} className="text-primary shrink-0 animate-pulse" />
          <span>Curriculum verified according to current CISCE regulations.</span>
        </div>
      </div>
    </>
  );
}
