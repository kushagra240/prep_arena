import React, { useState, useEffect } from 'react';
import { BookOpen, X, Search, Copy, Check, Info, Bookmark, ChevronDown, ChevronRight } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { FORMULA_DATABASE, Formula } from '@/content/formulas';
import { toast } from 'sonner';

export function FormulaSheetDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'mathematics' | 'physics' | 'chemistry' | 'biology' | 'bookmarked'>('mathematics');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // Listen to custom event to open the drawer
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-formula-drawer', handleToggle);
    return () => window.removeEventListener('toggle-formula-drawer', handleToggle);
  }, []);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedFormulas');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync bookmarks with state
  const toggleBookmark = (id: string) => {
    const isBookmarked = bookmarks.includes(id);
    const updated = isBookmarked ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    setBookmarks(updated);
    localStorage.setItem('bookmarkedFormulas', JSON.stringify(updated));
    
    if (isBookmarked) {
      toast.info('Bookmark removed');
    } else {
      toast.success('Formula bookmarked!');
    }
  };

  const handleCopy = (latex: string, id: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    toast.success('LaTeX copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter and Group formulas by Chapter
  const getFilteredChapters = () => {
    // 1. Filter by subject tab
    let filtered = FORMULA_DATABASE;
    if (activeTab === 'bookmarked') {
      filtered = FORMULA_DATABASE.filter(f => bookmarks.includes(f.id));
    } else {
      filtered = FORMULA_DATABASE.filter(f => f.subject === activeTab);
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.title.toLowerCase().includes(q) ||
        f.chapter.toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // 3. Group by Chapter name
    const groups: Record<string, Formula[]> = {};
    filtered.forEach(f => {
      if (!groups[f.chapter]) {
        groups[f.chapter] = [];
      }
      groups[f.chapter].push(f);
    });

    return groups;
  };

  const groupedData = getFilteredChapters();
  const chapterKeys = Object.keys(groupedData);

  const toggleChapter = (chapter: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapter]: !prev[chapter]
    }));
  };

  // Automatically expand all chapters when a search query is active
  useEffect(() => {
    if (searchQuery.trim() && chapterKeys.length > 0) {
      const allExpanded = chapterKeys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedChapters(allExpanded);
    }
  }, [searchQuery]);

  return (
    <>
      {/* Floating Magic Book Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-primary bg-primary text-white hover:bg-primary-hover shadow-glow px-4 py-3.5 font-space font-extrabold text-xs uppercase tracking-wider transition-all duration-300 hover:-translate-y-1"
      >
        <BookOpen size={16} className="animate-pulse" />
        <span className="hidden sm:inline">Board Reference</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        ></div>
      )}

      {/* Drawer Container */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-bgSecondary border-l border-borderColor z-50 shadow-wrongGlow transition-transform duration-300 transform flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-borderColor flex items-center justify-between bg-bgPrimary/60">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary animate-pulse" />
            <h3 className="font-space font-black text-white text-sm uppercase tracking-wider">
              Board Grimoire
            </h3>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg border border-borderColor hover:bg-bgTertiary text-textSecondary hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="grid grid-cols-5 border-b border-borderColor bg-bgPrimary/30 p-1 gap-1">
          {(['mathematics', 'physics', 'chemistry', 'biology', 'bookmarked'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery('');
              }}
              className={`py-2 rounded-lg font-space text-[9px] font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === tab 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow' 
                  : 'text-textSecondary hover:text-white border border-transparent'
              }`}
            >
              {tab === 'bookmarked' ? (
                <Bookmark size={11} className={bookmarks.length > 0 ? "fill-primary text-primary" : ""} />
              ) : null}
              <span className="truncate max-w-[70px]">
                {tab === 'mathematics' ? 'Math' : tab === 'bookmarked' ? 'Saved' : tab}
              </span>
            </button>
          ))}
        </div>

        {/* Search Toolbar */}
        <div className="p-3 border-b border-borderColor bg-bgPrimary/10">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-textMuted" />
            <input
              type="text"
              placeholder={`Search formulas in ${activeTab === 'bookmarked' ? 'bookmarks' : activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-borderColor bg-bgPrimary/60 py-2 pl-9 pr-4 font-space text-xs text-white placeholder-textMuted focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Scrollable Contents */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bgPrimary/25 custom-scrollbar">
          
          {chapterKeys.map((chapter) => {
            const formulas = groupedData[chapter];
            const isExpanded = expandedChapters[chapter] !== false; // default to true

            return (
              <div key={chapter} className="border border-borderColor/60 rounded-xl overflow-hidden bg-bgSecondary/20">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleChapter(chapter)}
                  className="w-full p-3 bg-bgPrimary/40 flex items-center justify-between border-b border-borderColor/30 text-left hover:bg-bgPrimary/60 transition-colors"
                >
                  <span className="font-space text-xs font-bold text-white uppercase tracking-wider">
                    {chapter}
                  </span>
                  <span className="text-textSecondary">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-3 space-y-3">
                    {formulas.map((f) => {
                      const isBookmarked = bookmarks.includes(f.id);
                      return (
                        <div key={f.id} className="p-3 rounded-lg border border-borderColor bg-bgSecondary/60 space-y-2 relative group hover:border-primary/50 transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <h5 className="font-space text-xs font-bold text-white pr-6">
                              {f.title}
                            </h5>
                            
                            <div className="flex items-center gap-1.5">
                              {/* Bookmark Button */}
                              <button
                                onClick={() => toggleBookmark(f.id)}
                                className="p-1 rounded text-textMuted hover:text-white transition-colors"
                                title={isBookmarked ? "Remove Bookmark" : "Bookmark Formula"}
                              >
                                <Bookmark size={13} className={isBookmarked ? "fill-primary text-primary" : ""} />
                              </button>
                              
                              {/* Copy Button */}
                              <button
                                onClick={() => handleCopy(f.formula, f.id)}
                                className="p-1 rounded text-textMuted hover:text-white transition-colors"
                                title="Copy LaTeX Formula"
                              >
                                {copiedId === f.id ? <Check size={13} className="text-correct" /> : <Copy size={13} />}
                              </button>
                            </div>
                          </div>

                          {/* Math Formula Rendered with KaTeX */}
                          <div className="py-2 overflow-x-auto bg-bgPrimary/80 rounded border border-borderColor/40 shadow-inner px-2 flex justify-center">
                            <BlockMath math={f.formula} />
                          </div>

                          {/* Variables Legend */}
                          {f.variables && f.variables.length > 0 && (
                            <div className="text-[10px] text-textSecondary bg-bgPrimary/20 p-2 rounded border border-borderColor/30 space-y-1">
                              <span className="font-bold text-textPrimary uppercase tracking-wider text-[9px]">Where:</span>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                {f.variables.map((v, i) => (
                                  <div key={i} className="flex gap-1.5 items-start">
                                    <span className="font-mono text-amber-500 font-bold shrink-0">{v.symbol}</span>
                                    <span className="text-[9px] leading-tight">{v.meaning}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Worked Example */}
                          {f.example && (
                            <div className="p-2 rounded bg-bgPrimary/40 border-l-2 border-primary/50 text-[10px] text-textSecondary leading-relaxed">
                              <span className="font-bold text-textPrimary uppercase tracking-wider text-[9px] block mb-0.5">Example:</span>
                              {f.example}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
          {chapterKeys.length === 0 && (
            <div className="text-center font-space text-xs text-textMuted py-8">
              {activeTab === 'bookmarked' 
                ? "No bookmarked formulas yet. Tap the bookmark icon on any formula to save it here."
                : `No formulas found matching "${searchQuery}"`
              }
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-borderColor bg-bgPrimary/60 flex gap-2 items-center text-[10px] font-space text-textMuted leading-relaxed">
          <Info size={12} className="text-primary shrink-0 animate-pulse" />
          <span>Formulas comply with Selina Concise, Frank, and CISCE textbook syllabi.</span>
        </div>

      </div>
    </>
  );
}
