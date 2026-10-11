import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Bot,
  AlertCircle,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { DocumentItem } from '../../types';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const DocumentsPage: React.FC = () => {
  const { documents, addChatMessage } = usePortal();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  const categories = ['All', 'Syllabus', 'Academic Regulations', 'Circular', 'Question Paper', 'Form'];

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.description.toLowerCase().includes(search.toLowerCase()) ||
      doc.department.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (doc: DocumentItem) => {
    if (!doc.hasSampleDownload) {
      alert(`[Notice] Hard copies of "${doc.title}" are maintained exclusively in the Central Library reserve repository.`);
      return;
    }
    alert(`[Sandbox Preview] Simulating file download: ${doc.downloadFilename || doc.title}`);
  };

  const handleAskAI = (doc: DocumentItem) => {
    addChatMessage({
      sender: 'user',
      text: `Explain key regulations or syllabus topics from document: "${doc.title}"`
    });
    setSelectedDoc(null);
    navigate('/ai-assistant');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Breadcrumbs items={[{ label: 'Syllabus & Documents' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-app-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-app-text tracking-tight">
            Institutional Documents & Curriculum Repository
          </h1>
          <p className="text-xs text-app-muted mt-0.5">
            Academic Regulations, Course Syllabi, Question Papers, and University Decrees
          </p>
        </div>
        <span className="text-xs text-app-muted font-mono">{documents.length} verified publications</span>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by code, keyword, or academic topic..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-app-surface border border-app-border rounded text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-accent"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-app-muted shrink-0 mr-1 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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

      {/* Documents Table List */}
      <div className="bg-app-surface border border-app-border rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-app-bg border-b border-app-border text-app-muted text-[11px]">
              <tr>
                <th className="p-3 font-medium">Document Title</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Department</th>
                <th className="p-3 font-medium">Format & Size</th>
                <th className="p-3 font-medium">Published</th>
                <th className="p-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-app-bg/50 transition-colors">
                  <td className="p-3 font-medium text-app-text max-w-xs">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="text-left hover:text-app-accent hover:underline font-semibold"
                    >
                      {doc.title}
                    </button>
                    <p className="text-[11px] text-app-muted line-clamp-1 mt-0.5">
                      {doc.description}
                    </p>
                  </td>
                  <td className="p-3">
                    <Badge variant="neutral" size="sm">{doc.category}</Badge>
                  </td>
                  <td className="p-3 text-app-muted">{doc.department}</td>
                  <td className="p-3 font-mono text-[11px] text-app-muted">
                    {doc.fileType} ({doc.fileSize})
                  </td>
                  <td className="p-3 text-app-muted font-mono">{doc.publishedDate}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDoc(doc)}
                        icon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Inspect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!doc.hasSampleDownload}
                        title={!doc.hasSampleDownload ? 'Hard copy in Library' : 'Download sample PDF'}
                        onClick={() => handleDownload(doc)}
                        icon={<Download className="w-3.5 h-3.5" />}
                      >
                        PDF
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Detail & AI Preview Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={selectedDoc.title}
          subtitle={`${selectedDoc.category} • ${selectedDoc.department}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-app-bg border border-app-border rounded space-y-1.5">
              <span className="text-app-muted font-medium">Document Description & Synopsis:</span>
              <p className="text-app-text leading-relaxed">{selectedDoc.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-app-bg border border-app-border rounded">
              <div>
                <span className="text-app-muted">Target Semester:</span>
                <p className="font-medium text-app-text mt-0.5">{selectedDoc.semester}</p>
              </div>
              <div>
                <span className="text-app-muted">File Format & Size:</span>
                <p className="font-mono text-app-text mt-0.5">{selectedDoc.fileType} ({selectedDoc.fileSize})</p>
              </div>
              <div>
                <span className="text-app-muted">Published Date:</span>
                <p className="font-mono text-app-text mt-0.5">{selectedDoc.publishedDate}</p>
              </div>
              <div>
                <span className="text-app-muted">Download Status:</span>
                <p className="mt-0.5">
                  {selectedDoc.hasSampleDownload ? (
                    <span className="text-app-success font-semibold">Verified Sample Available</span>
                  ) : (
                    <span className="text-app-muted italic">Archived in Central Library</span>
                  )}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-app-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(selectedDoc)}
                disabled={!selectedDoc.hasSampleDownload}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                {selectedDoc.hasSampleDownload ? 'Download PDF Document' : 'Physical Library Copy Only'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAskAI(selectedDoc)}
                icon={<Bot className="w-3.5 h-3.5" />}
              >
                Ask AI About This Document
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
