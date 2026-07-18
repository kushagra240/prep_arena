'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { usePrepArenaStore } from '@/lib/store';
import { checkUsernameUniqueness, completeOnboarding } from '@/app/actions/onboarding';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ArrowRight, User, School, MapPin, Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const subjects = usePrepArenaStore((state) => state.subjects);
  const updateProfileDetails = usePrepArenaStore((state) => state.updateProfileDetails);

  const [step, setStep] = useState(1);
  
  // Step 2 Form States
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [city, setCity] = useState('');
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState('Felix');

  // Step 3 States
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Validation States
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const avatarSeeds = ["Felix", "Mia", "Arjun", "Priya", "Rohan", "Aisha"];
  const getAvatarUrl = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

  // Pre-fill Clerk User Details
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      
      // Auto-suggest username: lowercase first name + random 3-digit number
      const fName = (user.firstName || 'scholar').toLowerCase().replace(/[^a-z0-9]/g, '');
      const randomNum = Math.floor(100 + Math.random() * 900);
      const suggestedUsername = `${fName}${randomNum}`;
      setUsername(suggestedUsername);
      
      // Immediately check availability of auto-suggested username
      checkUsername(suggestedUsername);
    }
  }, [user]);

  const checkUsername = async (val: string) => {
    if (val.trim() === '') {
      setUsernameStatus('idle');
      return;
    }
    setUsernameStatus('checking');
    try {
      const isUnique = await checkUsernameUniqueness(val);
      setUsernameStatus(isUnique ? 'available' : 'taken');
    } catch {
      setUsernameStatus('available'); // Fallback
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(val);
    setUsernameStatus('idle');

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      checkUsername(val);
    }, 400); // 400ms debounce
  };

  const handleToggleSubject = (subjectSlug: string) => {
    if (selectedSubjects.includes(subjectSlug)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subjectSlug));
    } else {
      if (selectedSubjects.length >= 5) {
        toast.warning('Maximum of 5 focus subjects can be selected.');
        return;
      }
      setSelectedSubjects([...selectedSubjects, subjectSlug]);
    }
  };

  const validateStep2 = () => {
    if (!username.trim()) {
      toast.error('Please enter a username.');
      return false;
    }
    if (usernameStatus === 'taken') {
      toast.error('Username is already taken.');
      return false;
    }
    if (!fullName.trim()) {
      toast.error('Please enter your full name.');
      return false;
    }
    if (!school.trim()) {
      toast.error('Please enter your school name.');
      return false;
    }
    return true;
  };

  const handleCompleteOnboarding = async () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least 1 focus subject to practice.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: user?.id || 'user-id-mock-student',
        username,
        fullName,
        school,
        city: city.trim() || 'India',
        avatarSeed: selectedAvatarSeed,
        focusSubjects: selectedSubjects
      };

      const result = await completeOnboarding(payload as any);

      if (result.success) {
        // Sync local Zustand state
        updateProfileDetails(
          fullName, 
          school, 
          city.trim() || 'India', 
          username, 
          getAvatarUrl(selectedAvatarSeed), 
          selectedSubjects
        );
        toast.success('Onboarding complete! Welcome to PrepArena! 🚀');
        
        // Wait briefly for redirect metadata propagation
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to complete profile creation.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during onboarding.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="font-space text-xs text-textSecondary uppercase tracking-widest">Loading PrepArena onboarding...</p>
      </div>
    );
  }

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemFade = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <div className="w-full max-w-xl bg-bgSecondary border border-borderColor rounded-3xl p-6 md:p-8 shadow-glow relative overflow-hidden">
      
      {/* Decorative Blur Glows */}
      <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-amberGold/5 blur-3xl -z-10"></div>

      {/* Steps Progress Header */}
      <div className="flex items-center justify-between mb-8 border-b border-borderColor/60 pb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-primary animate-pulse-glow" />
          <span className="font-space text-base font-bold text-white tracking-tight">
            Prep<span className="text-primary">Arena</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-24 bg-bgTertiary rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: '33.3%' }}
              animate={{ width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="font-space text-xs font-bold text-textSecondary font-mono">
            Step {step} of 3
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: WELCOME SCREEN */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 text-center"
          >
            <div className="space-y-2">
              <h2 className="font-space text-2xl font-black text-white leading-tight uppercase">
                Welcome to PrepArena, {user?.firstName || 'Scholar'}! 🎉
              </h2>
              <p className="font-space text-xs text-textSecondary max-w-sm mx-auto">
                Your LeetCode-style training ground for Class 10 ICSE Board Exams. Let's get onboarded.
              </p>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="bg-bgPrimary/30 rounded-2xl border border-borderColor/50 p-6 text-left space-y-4 max-w-md mx-auto"
            >
              <motion.div variants={itemFade} className="flex items-start gap-2.5 text-xs font-space leading-relaxed text-textSecondary">
                <span className="shrink-0">✅</span>
                <span><strong>10 ICSE Subjects</strong> with over 300+ authentic, curriculum-mapped problems.</span>
              </motion.div>
              <motion.div variants={itemFade} className="flex items-start gap-2.5 text-xs font-space leading-relaxed text-textSecondary">
                <span className="shrink-0">🤖</span>
                <span><strong>AI-Powered Solver</strong> evaluates brief answers and explains concepts step-by-step.</span>
              </motion.div>
              <motion.div variants={itemFade} className="flex items-start gap-2.5 text-xs font-space leading-relaxed text-textSecondary">
                <span className="shrink-0">🏆</span>
                <span><strong>Live Leaderboard</strong> to test your mastery and compete against top students nationwide.</span>
              </motion.div>
            </motion.div>

            <div className="pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-white hover:bg-primary-hover hover:shadow-glow py-4 font-space font-extrabold text-xs uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Set Up My Profile</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PROFILE DETAILS */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="font-space text-xl font-black text-white uppercase">Candidate Enrollment</h2>
              <p className="font-space text-xs text-textSecondary">Create your candidate profile for class ranking.</p>
            </div>

            <div className="space-y-4">
              
              {/* Username Input & Uniqueness Check */}
              <div className="space-y-1.5">
                <label className="font-space text-[10px] font-bold text-textSecondary uppercase tracking-wider block">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="e.g. arjun482"
                    className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3.5 pr-10 font-space text-xs text-white focus:border-primary focus:outline-none"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {usernameStatus === 'checking' && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                    {usernameStatus === 'available' && <Check className="h-4 w-4 text-correct" />}
                    {usernameStatus === 'taken' && <span className="h-2 w-2 rounded-full bg-wrong block" />}
                  </div>
                </div>
                {usernameStatus === 'taken' && (
                  <span className="block font-space text-[9px] text-wrong">Username is already registered.</span>
                )}
                {usernameStatus === 'available' && (
                  <span className="block font-space text-[9px] text-correct">Username is available!</span>
                )}
              </div>

              {/* Full Name prefilled */}
              <div className="space-y-1.5">
                <label className="font-space text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1">
                  <User size={12} className="text-textMuted" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Arjun Mehta"
                  className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3.5 font-space text-xs text-white focus:border-primary focus:outline-none"
                />
              </div>

              {/* School Name */}
              <div className="space-y-1.5">
                <label className="font-space text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1">
                  <School size={12} className="text-textMuted" />
                  <span>ICSE School Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. St. Xavier's High School"
                  className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3.5 font-space text-xs text-white focus:border-primary focus:outline-none"
                />
              </div>

              {/* City (Optional) */}
              <div className="space-y-1.5">
                <label className="font-space text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={12} className="text-textMuted" />
                  <span>City (Optional)</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3.5 font-space text-xs text-white focus:border-primary focus:outline-none"
                />
              </div>

              {/* Avatar Selector */}
              <div className="space-y-2 pt-2">
                <span className="font-space text-[10px] font-bold text-textSecondary uppercase tracking-wider block">
                  Select Avatar Style
                </span>
                <div className="flex gap-3 overflow-x-auto pb-1 justify-center sm:justify-start">
                  {avatarSeeds.map((seed) => {
                    const isSelected = selectedAvatarSeed === seed;
                    return (
                      <button
                        key={seed}
                        type="button"
                        onClick={() => setSelectedAvatarSeed(seed)}
                        className={`h-12 w-12 rounded-full overflow-hidden border-2 transition-all shrink-0 p-0.5 bg-bgPrimary ${
                          isSelected ? 'border-primary scale-110 shadow-glow' : 'border-borderColor/50 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={getAvatarUrl(seed)} alt={seed} className="h-full w-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-borderColor bg-bgTertiary/30 hover:bg-bgTertiary text-white py-3.5 font-space font-bold text-xs uppercase tracking-wider transition-all"
              >
                Back
              </button>
              <button
                type="button"
                disabled={usernameStatus === 'checking'}
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover hover:shadow-glow py-3.5 font-space font-extrabold text-xs uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: FOCUS SUBJECT SELECTOR */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="font-space text-xl font-black text-white uppercase">Which subjects do you want to ace? 🎯</h2>
              <p className="font-space text-xs text-textSecondary">Pick up to 5 — we'll prioritize these in your dashboard.</p>
            </div>

            {/* Subject Grid */}
            <div className="grid grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
              {subjects.map((sub) => {
                const isSelected = selectedSubjects.includes(sub.slug);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleToggleSubject(sub.slug)}
                    className={`flex items-center justify-between p-3 rounded-xl border font-space transition-all text-left relative ${
                      isSelected
                        ? 'border-primary/60 bg-primary/5 text-white scale-[1.01]'
                        : 'border-borderColor/60 bg-bgPrimary/20 text-textSecondary hover:border-borderColor'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-4">
                      <span className="text-base shrink-0">{sub.icon}</span>
                      <span className="text-[10px] font-extrabold uppercase leading-tight truncate">{sub.name}</span>
                    </div>

                    <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary border-primary text-white' : 'border-borderColor bg-bgPrimary'
                    }`}>
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Count & Navigation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between font-space text-[10px] text-textMuted uppercase font-bold border-t border-borderColor/40 pt-4">
                <span>Selected Checklist</span>
                <span className={selectedSubjects.length === 0 ? 'text-wrong' : 'text-primary'}>
                  {selectedSubjects.length} / 5 Selected
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-xl border border-borderColor bg-bgTertiary/30 hover:bg-bgTertiary text-white py-3.5 font-space font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCompleteOnboarding}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover hover:shadow-glow py-3.5 font-space font-extrabold text-xs uppercase tracking-wider transition-all duration-300 disabled:opacity-50 hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Practicing!</span>
                      <Sparkles size={14} className="fill-white" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
