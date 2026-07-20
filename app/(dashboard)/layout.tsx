'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { FormulaSheetDrawer } from '@/components/shared/FormulaSheetDrawer';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { usePrepArenaStore } from '@/lib/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const refreshState = usePrepArenaStore((state) => state.refreshState);

  // Sync initial client state on mount
  useEffect(() => {
    refreshState();
  }, [refreshState]);

  return (
    <div className="min-h-screen bg-bgPrimary grid-bg">
      {/* Sidebar - hidden on mobile, visible on medium+ screens */}
      <Sidebar />

      {/* Main content container */}
      <div className="flex flex-col md:pl-64 min-h-screen pb-20 md:pb-0">
        {/* TopBar - Header */}
        <TopBar />

        {/* Dynamic page contents with Framer Motion transitions */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Floating Grimoire Reference Formula Drawer */}
      <FormulaSheetDrawer />

      {/* Global Command Palette search panel */}
      <CommandPalette />

      {/* Mobile Bottom navigation - visible on mobile only */}
      <MobileBottomNav />
    </div>
  );
}
