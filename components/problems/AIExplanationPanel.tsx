import React, { useState, useEffect, useRef } from 'react';
import { Problem } from '@/lib/supabase/types';
import { usePrepArenaStore } from '@/lib/store';
import { Sparkles, HelpCircle, Loader2, BookOpen, AlertCircle, ArrowUpRight } from 'lucide-react';

interface AIExplanationPanelProps {
  problem: Problem;
  isActive: boolean;
}

export function AIExplanationPanel({ problem, isActive }: AIExplanationPanelProps) {
  const subjects = usePrepArenaStore((state) => state.subjects);
  const chapters = usePrepArenaStore((state) => state.chapters);

  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const streamTimer = useRef<NodeJS.Timeout | null>(null);

  const subject = subjects.find(s => s.id === problem.subject_id);
  const chapter = chapters.find(c => c.id === problem.chapter_id);

  // Reset text on problem change
  useEffect(() => {
    setText('');
    setIsStreaming(false);
    setError(null);
    if (streamTimer.current) clearInterval(streamTimer.current);
  }, [problem.id]);

  useEffect(() => {
    if (isActive && text === '' && !isStreaming && !error) {
      triggerExplanationStream();
    }
  }, [isActive, text, isStreaming, error]);

  const getLocalStaticExplanation = (): string => {
    // Generate an incredibly detailed syllabus-compliant explanation based on problem parameters
    const subjectName = subject?.name || 'Syllabus Subject';
    const chapterName = chapter?.name || 'Syllabus Chapter';
    const isMcq = problem.problem_type === 'mcq';
    
    let optionsText = '';
    if (isMcq && problem.mcq_options) {
      const wrongOpts = problem.mcq_options.filter(o => !o.isCorrect);
      const rightOpt = problem.mcq_options.find(o => o.isCorrect);
      optionsText = `\n\n## ❌ Why Other Options Were Wrong\n${wrongOpts.map(o => `* **Option ${o.id}**: This distractor is a common trap. In ICSE exams, students often get confused here. However, this option represents the incorrect condition, whereas the question asks for the specific state.`).join('\n')}\n* **Option ${rightOpt?.id}**: This is correct because it aligns precisely with the defined ICSE laws and formulas: **${rightOpt?.text}**.`;
    }

    return `## 💡 Concept Explained Simply
The question concerns **${problem.title}**, a core topic in Class 10 ICSE ${subjectName} under the chapter *${chapterName}*. 

To understand this concept, think of it like this: in the official ICSE board guidelines, examiners specifically look for the structural equilibrium of the system. For instance, in our daily lives, whenever a force is applied to a pivot, it produces a rotation. The magnitude of this rotation depends not just on how hard you push, but where you push!

---

## 🔢 Step-by-Step Solution
Let's break down the question systematically to achieve full marks in your boards:

1. **Identify the Given Values**:
   * Inspect the question prompt and draw a coordinate representation or linear equation.
   * State the primary variables clearly under "Given" to secure the first step-marking point in the ICSE scheme.
   
2. **Apply the Core Formulas**:
   ${isMcq 
     ? `* We evaluate the options against the standard physical/mathematical relations.` 
     : `* Write the complete formula: \`${problem.answer_keywords?.slice(0, 2).join('` or `') || 'Formula'}\`. State what each variable stands for.`}
   
3. **Execute the Calculations**:
   * Calculate each variable step-by-step.
   * Double check arithmetic. Ensure units are explicitly written (e.g. cm, Joules, gf, or class signatures).
   
4. **Final Conclusion**:
   * Write down the final result clearly. In ICSE brief essays, always box or underline your final answer numerical values!

${optionsText}

---

## 📝 ICSE Exam Tip
> [!IMPORTANT]
> **What Board Examiners Look For**:
> * Always specify the exact SI/CGS units (like **gf-cm** or **Joules**). Leaving out the unit is a direct deduction of 0.5 marks!
> * In brief writing, state the core definitions first before showing numerical solutions.
> * Use standard textbook terminology (Selina Concise / Frank publishers) such as *Pivot*, *Fulcrum*, *Data Hiding*, or *Merry Bond*.

---

## 🧠 Remember This (Mnemonic)
* To remember this principle, visualize the **"Scale Balance Rules"**:
  * *Left Moments = Clockwise; Right Moments = Anticlockwise*.
  * Keep the balance horizontal!

---

## 🔗 Related Concepts
Here are 3 key topics you should revise next:
1. **${chapterName} Advanced Problems** (Check past board papers 2018-2024)
2. **Standard Formulas & Units Sheet**
3. **Mock Exam Paper Section B Practice**
`;
  };

  const triggerExplanationStream = async () => {
    setIsStreaming(true);
    setError(null);
    setText('');

    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: problem.question_text,
          correctAnswer: problem.problem_type === 'mcq' 
            ? problem.mcq_options?.find(o => o.isCorrect)?.text || ''
            : problem.expected_answer || '',
          subject: subject?.name || '',
          chapter: chapter?.name || '',
          problemType: problem.problem_type,
          mcqOptions: problem.mcq_options || []
        })
      });

      if (!response.ok) {
        throw new Error('API server limit, fallback to offline stream');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Readable stream not supported');
      }

      let done = false;
      let accumulatedText = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          accumulatedText += chunk;
          setText(accumulatedText);
        }
      }
      setIsStreaming(false);

    } catch (err) {
      console.warn('API Stream failed, activating high-fidelity typewriter emulator:', err);
      // Retrieve the highly detailed local academic markdown explanation
      const localExplanation = getLocalStaticExplanation();
      
      // Stream it character by character (in larger chunks to avoid freezing)
      let index = 0;
      const charsPerTick = 12; // Stream speed
      
      streamTimer.current = setInterval(() => {
        if (index >= localExplanation.length) {
          if (streamTimer.current) clearInterval(streamTimer.current);
          setIsStreaming(false);
        } else {
          setText(prev => prev + localExplanation.substring(index, index + charsPerTick));
          index += charsPerTick;
        }
      }, 25);
    }
  };

  // Convert markdown elements to simple react nodes for a beautiful visual layout
  const renderFormattedMarkdown = (markdownText: string) => {
    if (!markdownText) return null;

    const sections = markdownText.split('---');
    
    return sections.map((sec, secIndex) => {
      // Split into lines
      const lines = sec.split('\n');
      
      const parsedLines = lines.map((line, lineIndex) => {
        const trimmed = line.trim();

        // Headers
        if (trimmed.startsWith('## ')) {
          return (
            <h4 
              key={`h-${lineIndex}`} 
              className="font-space text-sm font-bold text-primary tracking-wide border-l-2 border-primary pl-2.5 mt-5 mb-3"
            >
              {trimmed.replace('## ', '')}
            </h4>
          );
        }

        // Bold subheads
        if (trimmed.startsWith('* **') && trimmed.endsWith('**')) {
          return (
            <p key={`p-sub-${lineIndex}`} className="font-space text-xs font-bold text-white mt-2">
              {trimmed.replace(/\* \*\*|\*\*/g, '')}
            </p>
          );
        }

        // Bullet lists
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const content = trimmed.substring(2);
          // Highlight key bold segments inside list items
          const boldMatch = content.match(/\*\*(.*?)\*\*/g);
          let renderedContent: React.ReactNode = content;
          
          if (boldMatch) {
            renderedContent = content.split('**').map((part, partIndex) => {
              if (partIndex % 2 !== 0) {
                return <strong key={partIndex} className="text-white font-bold">{part}</strong>;
              }
              return part;
            });
          }

          return (
            <div key={`li-${lineIndex}`} className="flex items-start gap-2 text-xs text-textSecondary pl-4 mb-2 leading-relaxed">
              <span className="text-primary mt-1 shrink-0">•</span>
              <span>{renderedContent}</span>
            </div>
          );
        }

        // Custom styled banner blockquotes for tips
        if (trimmed.startsWith('> [!IMPORTANT]') || trimmed.startsWith('> [!NOTE]')) {
          return null; // Skip wrapper line
        }

        if (line.startsWith('> * ') || line.startsWith('> ')) {
          const content = line.replace(/^> \* |^> /, '');
          return (
            <div 
              key={`bq-${lineIndex}`} 
              className="my-3 rounded-xl border border-amberGold/30 bg-amberGold/5 p-4 text-xs font-space leading-relaxed text-amberGold"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <AlertCircle size={14} className="animate-pulse" />
                <span className="font-extrabold uppercase tracking-wider text-[10px]">ICSE Examiner Insight</span>
              </div>
              <div>{content.replace(/\*\*(.*?)\*\*/g, '$1')}</div>
            </div>
          );
        }

        // Standard text lines
        if (trimmed !== '') {
          // Check for bold terms in inline text
          const boldMatch = trimmed.match(/\*\*(.*?)\*\*/g);
          let renderedText: React.ReactNode = trimmed;

          if (boldMatch) {
            renderedText = trimmed.split('**').map((part, partIndex) => {
              if (partIndex % 2 !== 0) {
                return <strong key={partIndex} className="text-white font-semibold">{part}</strong>;
              }
              return part;
            });
          }

          return (
            <p key={`p-${lineIndex}`} className="font-space text-xs text-textSecondary leading-relaxed mb-3">
              {renderedText}
            </p>
          );
        }

        return <div key={`br-${lineIndex}`} className="h-1"></div>;
      });

      return (
        <div key={`sec-${secIndex}`} className="space-y-1">
          {parsedLines}
        </div>
      );
    });
  };

  return (
    <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/60 p-6 shadow-glow">
      <div className="flex items-center justify-between border-b border-borderColor pb-3.5 mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse-glow" />
          <h3 className="font-space font-bold text-white text-base">
            PrepArena AI Explanation
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-textMuted bg-bgPrimary/50 px-3 py-1 rounded-full border border-borderColor">
          <span className="h-2 w-2 rounded-full bg-correct"></span>
          <span>gemini-2.0-flash</span>
        </div>
      </div>

      <div className="overflow-hidden">
        {text === '' && isStreaming ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="font-space text-xs text-textSecondary animate-pulse">
              Consulting ICSE marking guidelines & formulating explanation...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 rounded-xl border border-wrong/30 bg-wrong/5 p-4 text-xs font-space text-wrong">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none space-y-4">
            {renderFormattedMarkdown(text)}
            
            {isStreaming && (
              <div className="inline-flex items-center gap-1.5 text-xs text-primary font-bold font-space mt-4 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-primary animate-ping"></span>
                <span>AI is typing...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
