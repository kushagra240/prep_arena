'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePrepArenaStore } from '@/lib/store';
import { useUser } from '@clerk/nextjs';
import { checkUsernameUniqueness, updateUserSettings } from '@/app/actions/onboarding';
import { 
  Settings, User, GraduationCap, MapPin, Sparkles, Check, 
  RefreshCw, Loader2, Save, BookOpen 
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useUser();
  const profile = usePrepArenaStore((state) => state.profile);
  const subjects = usePrepArenaStore((state) => state.subjects);
  const updateProfileDetails = usePrepArenaStore((state) => state.updateProfileDetails);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [city, setCity] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Validation / Async states
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Avatar presets using DiceBear
  const avatarSeeds = ['Oliver', 'Willow', 'Leo', 'Mia', 'Jack', 'Ruby', 'Oscar', 'Sophia'];
  const avatarPresets = avatarSeeds.map(seed => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setSchool(profile.school || '');
      setCity(profile.city || '');
      setUsername(profile.username || '');
      setAvatarUrl(profile.avatar_url || '');
      setSelectedSubjects(profile.focus_subjects || []);
    }
  }, [profile]);

  // Username validation handler
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(val);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (val.trim() === '') {
      setUsernameStatus('idle');
      return;
    }

    if (val === profile.username) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    debounceTimer.current = setTimeout(async () => {
      const isUnique = await checkUsernameUniqueness(val);
      setUsernameStatus(isUnique ? 'available' : 'taken');
    }, 5000); // 5s debounce like onboarding
  };

  // Toggle subject selection
  const handleToggleSubject = (subjectSlug: string) => {
    if (selectedSubjects.includes(subjectSlug)) {
      setSelectedSubjects(selectedSubjects.filter(slug => slug !== subjectSlug));
    } else {
      if (selectedSubjects.length >= 5) {
        toast.warning('Maximum of 5 focus subjects can be selected.');
        return;
      }
      setSelectedSubjects([...selectedSubjects, subjectSlug]);
    }
  };

  // Save Settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !school.trim() || !city.trim() || !username.trim()) {
      toast.error('All profile fields are required.');
      return;
    }

    if (usernameStatus === 'taken') {
      toast.error('Please choose an available username.');
      return;
    }

    if (selectedSubjects.length === 0) {
      toast.error('Please select at least 1 focus subject.');
      return;
    }

    setIsSaving(true);
    const userId = user?.id || profile.id || 'user-id-mock-student';

    try {
      // 1. Call server action to update Clerk and Supabase
      const result = await updateUserSettings({
        userId,
        username,
        fullName,
        school,
        city,
        avatarUrl,
        focusSubjects: selectedSubjects
      });

      if (result.success) {
        // 2. Update Zustand store
        updateProfileDetails(fullName, school, city, username, avatarUrl, selectedSubjects);
        toast.success('Settings updated successfully!');
        router.refresh();
      } else {
        toast.error('Failed to sync settings with database.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider font-space">
          <Settings size={14} />
          <span>PrepArena Account Center</span>
        </div>
        <h2 className="font-space text-2xl font-black text-white leading-tight uppercase">
          Profile Settings
        </h2>
        <p className="font-space text-xs text-textSecondary max-w-xl leading-relaxed">
          Manage your personal details, Board school registration, avatar design, and curriculum targets.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Avatar selector & Stats */}
        <div className="space-y-6">
          
          {/* Avatar card */}
          <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 text-center space-y-4 shadow-glow">
            <span className="font-space text-[10px] font-bold text-textSecondary uppercase tracking-wider block">
              Profile Avatar
            </span>

            <div className="relative inline-block">
              <img 
                src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                alt="Selected Avatar" 
                className="h-24 w-24 rounded-full border-2 border-primary object-cover mx-auto shadow-glow bg-bgPrimary"
              />
            </div>

            <div className="space-y-2">
              <span className="font-space text-[9px] text-textMuted uppercase font-bold tracking-wider block">
                Choose Design Preset
              </span>
              <div className="grid grid-cols-4 gap-2">
                {avatarPresets.map((presetUrl, idx) => {
                  const isSelected = avatarUrl === presetUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(presetUrl)}
                      className={`h-11 w-11 rounded-full overflow-hidden border-2 transition-all p-0.5 bg-bgPrimary ${
                        isSelected ? 'border-primary scale-110 shadow-glow' : 'border-borderColor/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={presetUrl} alt={`Avatar Preset ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick info status */}
          <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-5 text-center space-y-2">
            <span className="font-space text-[10px] font-bold text-textMuted uppercase tracking-wider block">
              Curriculum standing
            </span>
            <div className="flex justify-around items-center pt-2">
              <div>
                <span className="block font-mono text-xl font-bold text-white">{profile.xp || 0}</span>
                <span className="block font-space text-[9px] text-textSecondary uppercase">XP</span>
              </div>
              <div className="h-8 w-px bg-borderColor/40"></div>
              <div>
                <span className="block font-mono text-xl font-bold text-orange-500">{profile.streak_days || 0}d</span>
                <span className="block font-space text-[9px] text-textSecondary uppercase">Streak</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Inputs & Focus subjects */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info */}
          <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-6 space-y-4 shadow-glow">
            <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider border-b border-borderColor/40 pb-2">
              General Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
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
                  placeholder="e.g. Kushagra Dev"
                  className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3.5 font-space text-xs text-white focus:border-primary focus:outline-none"
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="font-space text-[10px] font-bold text-textSecondary uppercase tracking-wider block">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="e.g. kushagra_icse"
                    className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3.5 pr-10 font-space text-xs text-white focus:border-primary focus:outline-none"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {usernameStatus === 'checking' && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                    {usernameStatus === 'available' && <Check className="h-4 w-4 text-correct" />}
                    {usernameStatus === 'taken' && <span className="h-2 w-2 rounded-full bg-wrong block" />}
                  </div>
                </div>
                {usernameStatus === 'taken' && (
                  <span className="block font-space text-[9px] text-wrong">Username is already registered by another candidate.</span>
                )}
                {usernameStatus === 'checking' && (
                  <span className="block font-space text-[9px] text-primary">Validating uniqueness against registrations...</span>
                )}
              </div>

              {/* Board School */}
              <div className="space-y-1.5">
                <label className="font-space text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap size={12} className="text-textMuted" />
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

              {/* City */}
              <div className="space-y-1.5">
                <label className="font-space text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={12} className="text-textMuted" />
                  <span>City</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full rounded-xl border border-borderColor bg-bgPrimary p-3.5 font-space text-xs text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Focus Curriculum */}
          <div className="glass-panel rounded-2xl border border-borderColor bg-bgSecondary/40 p-6 space-y-4 shadow-glow">
            <div className="flex justify-between items-center border-b border-borderColor/40 pb-2">
              <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={16} className="text-primary" />
                <span>Target Focus Curriculum</span>
              </h3>
              <span className="font-space text-[10px] text-textMuted uppercase font-bold">
                {selectedSubjects.length} / 5 Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {subjects.map((sub) => {
                const isSelected = selectedSubjects.includes(sub.slug);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleToggleSubject(sub.slug)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border font-space transition-all text-left ${
                      isSelected
                        ? 'border-primary/60 bg-primary/5 text-white scale-[1.01]'
                        : 'border-borderColor/60 bg-bgPrimary/20 text-textSecondary hover:border-borderColor'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-1">
                      <span className="text-sm shrink-0">{sub.icon}</span>
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
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving || usernameStatus === 'checking'}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary text-white hover:bg-primary-hover hover:shadow-glow px-8 py-4 font-space font-extrabold text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
              <span>Save Account Settings</span>
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
