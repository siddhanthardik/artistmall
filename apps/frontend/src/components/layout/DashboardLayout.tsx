import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Wallet, 
  Settings, 
  LogOut, 
  HeartHandshake,
  Bookmark
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { AuthService } from '../../services/auth.service';
import { NotificationDropdown } from '../shared/NotificationDropdown';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/login');
  };

  const managementNav = [
    { name: 'Overview', path: '/dashboard/management', icon: LayoutDashboard },
    { name: 'My Artists', path: '/dashboard/management/artists', icon: Users },
    { name: 'Booking Requests', path: '/dashboard/management/bookings', icon: CalendarCheck },
    { name: 'Earnings', path: '/dashboard/management/earnings', icon: Wallet },
    { name: 'Settings', path: '/dashboard/management/settings', icon: Settings },
  ];

  const bookingNav = [
    { name: 'Overview', path: '/dashboard/booking', icon: LayoutDashboard },
    { name: 'Active Requests', path: '/dashboard/booking/requests', icon: CalendarCheck },
    { name: 'Deal Room', path: '/dashboard/booking/negotiations', icon: HeartHandshake },
    { name: 'Saved Artists', path: '/dashboard/booking/saved', icon: Bookmark },
    { name: 'Company Profile', path: '/dashboard/booking/profile', icon: Settings },
  ];

  const navItems = user?.role === 'BOOKING_COMPANY' ? bookingNav : managementNav;
  const brandName = user?.role === 'BOOKING_COMPANY' ? 'Demand Ops' : 'Management';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#1E4DB7] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-sm font-black text-white">AM</span>
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              {brandName}
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                    isActive 
                      ? 'bg-[#1E4DB7]/5 text-[#1E4DB7] border border-[#1E4DB7]/10 shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-[#1E4DB7]' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-50 border border-slate-200/50">
            <div className="w-8 h-8 rounded-full bg-[#FF7A2F] flex items-center justify-center text-white font-black text-xs uppercase shadow-md shadow-orange-500/20">
              {user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div>
            <h1 className="text-xl font-black text-slate-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};
