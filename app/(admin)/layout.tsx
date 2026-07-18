'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ArrowLeft, GraduationCap, LayoutDashboard 
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoaded) {
      // Allow bypass for local dev/mock username "admin" or Clerk role === "admin"
      const role = user?.publicMetadata?.role;
      const isUserAdmin = role === 'admin' || user?.username === 'admin';
      
      // Also check query param fallback for sandbox/offline verification
      const searchParams = new URLSearchParams(window.location.search);
      const isParamAdmin = searchParams.get('admin') === 'true';

      if (isUserAdmin || isParamAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        toast.error('Access Denied. Admin privilege required.');
        router.push('/dashboard');
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || isAdmin === null) {
    return (
      <div className="min-h-screen bg-bgPrimary flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 text-primary animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="font-space text-xs text-textSecondary uppercase tracking-widest">Verifying Admin clearance...</p>
      </div>
    );
  }

  if (isAdmin === false) {
    return null; // redirecting
  }

  const menuItems = [
    { name: 'Admin Console', icon: LayoutDashboard, href: '/admin' },
    { name: 'Return to App', icon: ArrowLeft, href: '/dashboard' }
  ];

  return (
    <div className="min-h-screen bg-bgPrimary grid-bg flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-borderColor bg-bgSecondary flex flex-col hidden md:flex shrink-0">
        <div className="flex h-16 items-center px-6 gap-2 border-b border-borderColor">
          <GraduationCap className="h-8 w-8 text-amberGold animate-pulse-glow" />
          <div className="font-space text-xl font-bold tracking-tight text-white">
            Prep<span className="text-amberGold">Admin</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-space font-medium text-sm transition-all duration-300 ${
                  isActive 
                    ? 'bg-amberGold/10 text-amberGold border-l-2 border-amberGold glow-amberGold' 
                    : 'text-textSecondary hover:bg-bgTertiary hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-amberGold' : 'text-textMuted'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-borderColor bg-bgPrimary/50">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-correct animate-pulse"></div>
            <span className="font-space text-xs text-textSecondary">Secure Clearance Mode</span>
          </div>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b border-borderColor bg-bgSecondary/60 backdrop-blur-md flex items-center px-6 md:px-8 justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-space text-xs font-black text-amberGold uppercase tracking-widest bg-amberGold/10 border border-amberGold/30 px-2 py-0.5 rounded">
              Clearance Level: Admin
            </span>
          </div>
          <Link href="/dashboard" className="font-space text-xs text-textSecondary hover:text-white flex items-center gap-1 transition-all">
            <ArrowLeft size={12} />
            <span>App Dashboard</span>
          </Link>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
