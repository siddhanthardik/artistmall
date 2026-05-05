import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Grid,
  Star,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Info,
  User,
  ImageIcon,
  MessageCircle,
  Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminAuthService } from '../../services/admin-auth.service';
import { useAuthStore } from '../../store/authStore';

export const AdminLayout: React.FC = () => {
  const isSidebarOpen = true; // Sidebar is fixed for now
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const hasRole = (...roles: string[]) => !!user?.role && roles.includes(user.role);
  const can = (permission: string, fallbackRoles: string[] = []) => {
    if (user?.isSuperAdmin || user?.role === 'SUPER_ADMIN') return true;
    if (user?.permissions?.length) return user.permissions.includes(permission);
    return hasRole(...fallbackRoles);
  };

  const handleLogout = () => {
    AdminAuthService.logout();
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/admin', exact: true, show: true },
    {
      label: 'Artists',
      icon: Users,
      to: '/admin/artists',
      exact: true,
      show: can('artist.view', ['SUPER_ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS']),
    },
    {
      label: 'Add Artist',
      icon: UserPlus,
      to: '/admin/artists/create',
      exact: true,
      show: can('artist.create', ['SUPER_ADMIN', 'SUB_ADMIN']),
    },
    {
      label: 'Categories',
      icon: Grid,
      to: '/admin/categories',
      show: can('settings.manage', ['SUPER_ADMIN', 'SUB_ADMIN']),
    },
    {
      label: 'Clients',
      icon: Briefcase,
      to: '/admin/clients',
      show: can('settings.manage', ['SUPER_ADMIN', 'SUB_ADMIN']),
    },
    {
      label: 'Featured Artists',
      icon: Star,
      to: '/admin/moderation',
      show: can('artist.edit', ['SUPER_ADMIN', 'SUB_ADMIN']),
    },
    {
      label: 'Hero Banners',
      icon: ImageIcon,
      to: '/admin/hero-banners',
      show: can('settings.manage', ['SUPER_ADMIN', 'SUB_ADMIN']),
    },
    {
      label: 'Leads / Enquiries',
      icon: MessageCircle,
      to: '/admin/leads',
      show: can('lead.view', ['SUPER_ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS']),
    },
    {
      label: 'Settings',
      icon: Settings,
      to: '/admin/settings',
      show: can('settings.manage', ['SUPER_ADMIN']),
    },
  ];

  const filteredNav = navItems.filter((item) => item.show);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-neutral-content relative overflow-x-hidden">
      {/* 1. MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-xl font-bold text-neutral-content tracking-tighter">
                    Artist Mall <span className="text-brand-primary">Admin</span>
                  </h1>
                  <p className="text-[10px] font-black text-neutral-content/40 uppercase tracking-[0.2em]">
                    Management Portal
                  </p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-content/40"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
                {filteredNav.map((item) => {
                  const isActive = item.exact
                    ? location.pathname === item.to
                    : location.pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-[#FDF0E9] text-brand-primary font-bold'
                          : 'text-neutral-content/60 font-medium'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-6 border-t border-surface-container">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-container overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-content truncate">
                      {user?.fullName || 'Admin User'}
                    </p>
                    <p className="text-[10px] font-bold text-neutral-content/40 uppercase tracking-widest mt-0.5">
                      {user?.roleName || user?.role}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-neutral-content/20 hover:text-error transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 2. DESKTOP SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-surface-container h-screen sticky top-0 hidden lg:flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all"
      >
        <div className="p-8 mb-6 overflow-hidden flex items-center justify-between">
          {isSidebarOpen ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
              <h1 className="text-xl font-bold text-neutral-content tracking-tighter">
                Artist Mall <span className="text-brand-primary">Admin</span>
              </h1>
              <p className="text-[10px] font-black text-neutral-content/40 uppercase tracking-[0.2em]">
                Management Portal
              </p>
            </motion.div>
          ) : (
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-bold text-white text-xs mx-auto">
              AM
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {filteredNav.map((item: any) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative ${
                  isActive
                    ? 'bg-[#FDF0E9] text-brand-primary font-bold'
                    : 'text-neutral-content/60 hover:text-neutral-content hover:bg-[#F8F9FA] font-medium'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-primary' : 'text-neutral-content/40 group-hover:text-neutral-content'}`}
                />
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && isSidebarOpen && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-primary rounded-l-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-surface-container">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-surface-container border border-surface-container shrink-0">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            {isSidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-neutral-content truncate">
                  {user?.fullName || 'Admin User'}
                </p>
                <p className="text-[10px] font-bold text-neutral-content/40 uppercase tracking-widest mt-0.5">
                  {user?.roleName || user?.role}
                </p>
              </div>
            )}
            {isSidebarOpen && (
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-content/20 hover:text-error transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header (Responsive) */}
        <header className="h-20 bg-white border-b border-surface-container px-6 md:px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 bg-[#F8F9FA] rounded-xl text-neutral-content/60"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-content/30 group-focus-within:text-brand-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search records..."
                  className="w-full bg-[#F8F9FA] border border-transparent rounded-full py-2.5 md:py-3 pl-12 pr-6 text-sm font-medium text-neutral-content placeholder:text-neutral-content/30 focus:outline-none focus:bg-white focus:border-brand-primary transition-all"
                />
              </div>
            </div>
            <div className="md:hidden">
              <h1 className="text-sm font-bold text-neutral-content tracking-tighter">
                Artist Mall <span className="text-brand-primary">Admin</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button className="p-2.5 text-neutral-content/40 hover:text-neutral-content relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-white"></span>
            </button>
            <button className="hidden sm:flex p-2.5 text-neutral-content/40 hover:text-neutral-content transition-colors">
              <Info className="w-5 h-5" />
            </button>
            <div className="h-6 w-[1px] bg-surface-container hidden sm:block"></div>
            <button className="p-2.5 text-neutral-content/40 hover:text-neutral-content transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content (Responsive Padding) */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
