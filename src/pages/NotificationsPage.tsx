import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Filter,
  ExternalLink,
  Calendar,
  CreditCard,
  GraduationCap,
  CalendarDays,
  Settings,
  ChevronRight
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadNotifCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    preferences
  } = usePortal();

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter notifications by selected category and respect user notification preferences
  const filteredNotifications = notifications.filter((notif) => {
    // Check if category enabled in user settings
    const catKey = notif.category.toLowerCase() as keyof typeof preferences.notificationPreferences;
    if (preferences.notificationPreferences[catKey] === false) {
      return false;
    }

    if (selectedCategory === 'All') return true;
    return notif.category === selectedCategory;
  });

  const categories = ['All', 'Academic', 'Fees', 'Examination', 'Planner'];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Fees':
        return <CreditCard className="w-4 h-4 text-app-accent" />;
      case 'Examination':
        return <GraduationCap className="w-4 h-4 text-app-accent" />;
      case 'Planner':
        return <CalendarDays className="w-4 h-4 text-app-accent" />;
      default:
        return <Calendar className="w-4 h-4 text-app-accent" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: 'Notifications' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
              Institutional Notifications
            </h1>
            {unreadNotifCount > 0 && (
              <Badge variant="accent" size="sm">
                {unreadNotifCount} unread
              </Badge>
            )}
          </div>
          <p className="text-xs text-app-muted mt-0.5">
            Direct notices, fee reminders, assessment scores, and system advisories
          </p>
        </div>

        {unreadNotifCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsAsRead}
            icon={<CheckCheck className="w-3.5 h-3.5" />}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-app-muted shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-app-accent text-white font-medium'
                : 'bg-app-surface border border-app-border text-app-muted hover:text-app-text'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-app-surface border border-app-border rounded divide-y divide-app-border">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-app-muted space-y-2">
            <Bell className="w-6 h-6 text-app-muted mx-auto" />
            <p>No notifications match the selected filter or preferences.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                navigate(notif.targetPath);
              }}
              className={`p-4 flex items-start justify-between gap-3 text-xs cursor-pointer hover:bg-app-bg transition-colors ${
                !notif.isRead ? 'bg-app-accent/5' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-app-bg border border-app-border shrink-0 mt-0.5">
                  {getCategoryIcon(notif.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-semibold ${
                        !notif.isRead ? 'text-app-accent' : 'text-app-text'
                      }`}
                    >
                      {notif.title}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {notif.category}
                    </Badge>
                    <span className="text-[10px] text-app-muted">{notif.timestamp}</span>
                  </div>

                  <p className="text-app-muted leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-1">
                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-app-accent shrink-0" />
                )}
                <ChevronRight className="w-4 h-4 text-app-muted" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
