import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark
} from 'lucide-react';
import { RAG_DOCUMENTS } from '../data/ragKnowledge';
import { RAGDocument } from '../types';

export const RAGAssistant: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedDocId, setExpandedDocId] = useState<string | null>('ecb-2025-01');

  const filteredDocs = RAG_DOCUMENTS.filter(doc => {
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.content.toLowerCase().includes(q) ||
        doc.relevanceKeywords.some(k => k.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              RETRIEVAL-AUGMENTED GENERATION (RAG) KNOWLEDGE REPOSITORY
            </span>
            <span className="text-xs text-slate-400">ECB • EBA • Eurostat • Internal Governance</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">Banking Research & Regulatory Knowledge Base</h1>
          <p className="text-xs text-slate-400">
            Grounding predictive model outcomes with authoritative macroeconomic research, supervisory bulletins, and empirical retention benchmarks.
          </p>
        </div>
      </div>

      {/* Epistemological Framework Banner */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="font-bold text-emerald-400 flex items-center space-x-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>[DATASET FACTS]</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Deterministic ground truth extracted directly from <code className="text-slate-300 font-mono">European_Bank.csv</code>. No hallucinations permitted.
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="font-bold text-indigo-400 flex items-center space-x-1.5 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>[EXTERNAL KNOWLEDGE]</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Supervisory publications and academic banking literature (ECB Financial Stability Review, EBA Consumer Guidelines).
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="font-bold text-amber-400 flex items-center space-x-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>[SCENARIO ASSUMPTIONS]</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Intervention costs (€75/€150) and Customer Lifetime Values (CLV) explicitly designated as optimization assumptions.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search banking research articles, guidelines, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 pl-9 pr-3 py-1.5 rounded-lg text-xs border border-slate-700 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs"
          >
            <option value="ALL">All Sources</option>
            <option value="REGULATORY">Regulatory (ECB / EBA)</option>
            <option value="STATISTICS">Statistical (Eurostat)</option>
            <option value="INTERNAL">Internal Methodology</option>
          </select>
        </div>
      </div>

      {/* Document Accordion Cards */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => {
          const isExpanded = expandedDocId === doc.id;
          return (
            <div
              key={doc.id}
              className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden transition"
            >
              <div
                onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                className="p-4 cursor-pointer hover:bg-slate-800/40 flex items-center justify-between"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold font-mono bg-slate-800 text-indigo-300 border border-slate-700">
                        {doc.category}
                      </span>
                      <span className="text-xs text-slate-400">{doc.source} • {doc.date}</span>
                    </div>
                    <h2 className="text-sm font-bold text-slate-100 mt-1">{doc.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{doc.summary}</p>
                  </div>
                </div>

                <div className="text-slate-400 pl-3 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-3 text-xs text-slate-300">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre-line text-[13px] font-sans">
                    {doc.content}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 mr-1">Key Concepts:</span>
                    {doc.relevanceKeywords.map((kw, kidx) => (
                      <span
                        key={kidx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
