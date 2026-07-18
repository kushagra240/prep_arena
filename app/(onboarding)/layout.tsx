import React from 'react';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
      {children}
    </div>
  );
}
