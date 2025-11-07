'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  FileText,
  Users,
  BarChart3,
  Building,
  Plus,
  Menu,
  Home,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Companies', href: '/dashboard/companies', icon: Building },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/60">
      <div className="flex items-center px-8 py-6 border-b border-slate-200/60">
        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <span className="text-2xl font-bold text-slate-900 tracking-tight">
          Invoify
        </span>
      </div>

      <nav className="flex-1 px-6 py-8 space-y-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' &&
              pathname.startsWith(item.href + '/'));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300',
                isActive
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:shadow-md'
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon
                className={cn(
                  'mr-4 h-5 w-5 transition-transform duration-300',
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 group-hover:scale-110'
                )}
              />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-slate-200/60">
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Quick Actions
          </p>
          <Link href="/dashboard/invoices/new">
            <Button className="w-full justify-start bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="mr-3 h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-6 py-6 border-t border-slate-200/60 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="h-10 w-10 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none"></div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="fixed top-6 left-6 z-50 md:hidden bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-lg hover:shadow-xl rounded-xl"
            size="icon"
          >
            <Menu className="h-6 w-6 text-slate-700" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80 border-r-0 shadow-2xl">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-40">
        <SidebarContent />
      </div>

      <div className="md:pl-80 relative">
        <main className="flex-1 min-h-screen">
          <div className="relative">{children}</div>
        </main>
      </div>
    </div>
  );
}
