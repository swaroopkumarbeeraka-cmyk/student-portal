import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Check,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { AcademicYear } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    student,
    academicYear,
    setAcademicYear,
    notifications,
    unreadNotifCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    preferences,
    updatePreferences,
    logout
  } = usePortal();

  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Dropdown states
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // Refs for click outside
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-40 bg-app-surface border-b border-app-border h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile hamburger + Institution branding */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar menu"
            className="p-2 text-app-muted hover:text-app-text hover:bg-app-bg rounded transition-colors focus-visible:ring-2 focus-visible:ring-app-accent min-h-[44px] min-w-[44px] flex items-center justify-center lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded bg-app-accent text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0">
              {student.institutionLogoText}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-app-text leading-tight group-hover:text-app-accent transition-colors">
                {student.institutionName}
              </h1>
              <p className="text-[11px] text-app-muted leading-tight">Autonomous • Student Portal</p>
            </div>
          </Link>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-md mx-2 hidden md:block relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notices, exams, subjects, documents..."
              className="w-full h-9 pl-9 pr-4 text-xs bg-app-bg border border-app-border rounded text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent"
            />
          </form>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile search toggle button */}
          <button
            onClick={() => navigate('/search')}
            aria-label="Search"
            className="md:hidden p-2 text-app-muted hover:text-app-text hover:bg-app-bg rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Academic Year Selector */}
          <div className="hidden lg:flex items-center gap-1 text-xs border border-app-border rounded px-2 py-1 bg-app-bg text-app-text">
            <Calendar className="w-3.5 h-3.5 text-app-muted" />
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value as AcademicYear)}
              className="bg-transparent text-xs font-medium text-app-text focus:outline-none cursor-pointer"
              aria-label="Select Academic Year"
            >
              <option value="2026-27">AY 2026-27 (Current)</option>
              <option value="2025-26">AY 2025-26 (Archive)</option>
            </select>
          </div>

          {/* Student Chip (Desktop) */}
          <div className="hidden xl:flex items-center gap-2 border-l border-app-border pl-3 ml-1 text-right">
            <div>
              <p className="text-xs font-semibold text-app-text leading-tight">{student.name}</p>
              <p className="text-[11px] text-app-muted leading-tight">
                {student.specialization || student.course} • {student.section}
              </p>
            </div>
            <span className="text-[10px] font-mono bg-app-bg border border-app-border px-1.5 py-0.5 rounded text-app-muted">
              {student.studentCode}
            </span>
          </div>

          {/* Theme Toggle dropdown */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              aria-label="Change color theme"
              className="p-2 text-app-muted hover:text-app-text hover:bg-app-bg rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {preferences.theme === 'light' ? (
                <Sun className="w-4 h-4" />
              ) : preferences.theme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Monitor className="w-4 h-4" />
              )}
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-app-surface border border-app-border rounded shadow-none py-1 z-50 text-xs">
                {themeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = preferences.theme === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        updatePreferences({ theme: opt.value });
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-app-bg transition-colors ${
                        isSelected ? 'text-app-accent font-medium' : 'text-app-text'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        {opt.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-app-accent" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label={`Notifications: ${unreadNotifCount} unread`}
              className="relative p-2 text-app-muted hover:text-app-text hover:bg-app-bg rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-app-danger" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-app-surface border border-app-border rounded z-50 overflow-hidden text-xs">
                <div className="p-3 border-b border-app-border flex items-center justify-between bg-app-bg/50">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-app-text">Notifications</span>
                    {unreadNotifCount > 0 && (
                      <Badge variant="accent" size="sm">
                        {unreadNotifCount} new
                      </Badge>
                    )}
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-app-accent hover:underline text-[11px]"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-app-border">
                  {notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        setIsNotifOpen(false);
                        navigate(notif.targetPath);
                      }}
                      className={`p-3 cursor-pointer hover:bg-app-bg transition-colors flex items-start gap-2.5 ${
                        !notif.isRead ? 'bg-app-accent/5' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`font-medium ${!notif.isRead ? 'text-app-accent font-semibold' : 'text-app-text'}`}>
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-app-muted">{notif.timestamp}</span>
                        </div>
                        <p className="text-app-muted text-[11px] line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-1.5 h-1.5 rounded-full bg-app-accent mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-app-border bg-app-bg/30 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-app-accent hover:underline text-xs font-medium inline-flex items-center gap-1"
                  >
                    View all notifications
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Account Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User Account Menu"
              className="flex items-center gap-1.5 p-1.5 rounded hover:bg-app-bg text-app-text min-h-[44px] transition-colors"
            >
              <div className="w-7 h-7 rounded bg-app-accent/15 text-app-accent flex items-center justify-center font-semibold text-xs border border-app-accent/30">
                AK
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-app-muted hidden sm:block" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-app-surface border border-app-border rounded z-50 py-1.5 text-xs">
                {/* User info header */}
                <div className="px-3.5 py-2.5 border-b border-app-border bg-app-bg/40">
                  <p className="font-semibold text-app-text text-sm">{student.name}</p>
                  <p className="text-app-muted text-[11px]">{student.email}</p>
                  <p className="text-app-muted text-[11px] font-mono mt-0.5">Code: {student.studentCode}</p>
                </div>

                {/* Academic Year in menu (mobile support) */}
                <div className="px-3.5 py-2 border-b border-app-border flex items-center justify-between lg:hidden">
                  <span className="text-app-muted">Academic Year</span>
                  <select
                    value={academicYear}
                    onChange={(e) => {
                      setAcademicYear(e.target.value as AcademicYear);
                      setIsUserMenuOpen(false);
                    }}
                    className="bg-app-bg border border-app-border rounded text-xs px-2 py-0.5 text-app-text"
                  >
                    <option value="2026-27">2026-27</option>
                    <option value="2025-26">2025-26</option>
                  </select>
                </div>

                {/* Menu items */}
                <Link
                  to="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-app-bg text-app-text transition-colors"
                >
                  <User className="w-4 h-4 text-app-muted" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-app-bg text-app-text transition-colors"
                >
                  <Settings className="w-4 h-4 text-app-muted" />
                  <span>Account & Settings</span>
                </Link>

                <div className="border-t border-app-border my-1" />

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsSignOutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-app-bg text-app-danger transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-app-danger" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sign Out Confirmation Modal */}
      <Modal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        title="Confirm Sign Out"
        subtitle="End student portal session"
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsSignOutModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setIsSignOutModalOpen(false);
                logout();
                navigate('/signed-out');
              }}
            >
              Sign Out Now
            </Button>
          </>
        }
      >
        <p className="text-sm text-app-muted leading-relaxed">
          Are you sure you want to sign out from the portal on this device? Your saved personal tasks, submissions and preferences will remain securely stored in your local session.
        </p>
      </Modal>
    </>
  );
};
