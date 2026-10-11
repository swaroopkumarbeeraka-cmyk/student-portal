import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  AlertCircle,
  ChevronRight,
  Download,
  Calendar,
  Building
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const NoticesPage: React.FC = () => {
  const { notices } = usePortal();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const categories = [
    'All',
    'Academic',
    'Examination',
    'Administrative',
    'Placements',
    'Events',
    'Circular'
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.publisher.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalPages = Math.ceil(filteredNotices.length / pageSize) || 1;
  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: 'Campus Notices' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Institutional Notices & Circulars
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Official announcements authenticated by Institute Administration & Academic Sections
          </p>
        </div>
        <span className="text-xs text-app-muted font-mono">{notices.length} active notices</span>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search circulars by subject, keyword, or publisher..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-app-surface border border-app-border rounded text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-accent"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-app-muted shrink-0 mr-1 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-app-accent text-white font-medium'
                  : 'bg-app-surface border border-app-border text-app-muted hover:text-app-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Cards List */}
      <div className="space-y-3">
        {paginatedNotices.length === 0 ? (
          <div className="p-8 bg-app-surface border border-app-border rounded text-center text-xs text-app-muted">
            No notices match your search criteria.
          </div>
        ) : (
          paginatedNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => navigate(`/notices/${notice.id}`)}
              className="p-4 sm:p-5 bg-app-surface border border-app-border rounded hover:border-app-accent cursor-pointer transition-colors space-y-2 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={notice.isUrgent ? 'danger' : 'neutral'} size="sm">
                    {notice.category}
                  </Badge>
                  {notice.isUrgent && (
                    <span className="text-[10px] text-app-danger font-semibold uppercase">
                      Urgent Action
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-app-muted font-mono">
                  <span>{notice.date}</span>
                </div>
              </div>

              <h2 className="text-sm font-semibold text-app-text group-hover:text-app-accent transition-colors leading-snug">
                {notice.title}
              </h2>

              <p className="text-xs text-app-muted line-clamp-2 leading-relaxed">
                {notice.content}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-app-muted border-t border-app-border">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-app-muted" />
                  {notice.publisher}
                </span>

                <span className="text-app-accent font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read Circular
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs text-app-muted">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredNotices.length)} of {filteredNotices.length} notices
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="px-3 font-mono font-medium text-app-text">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
