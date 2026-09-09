import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Copy,
  ChevronLeft,
  ChevronRight,
  User,
  AlertOctagon,
  FileSpreadsheet,
  Check,
  ArrowUpDown
} from 'lucide-react';
import { Customer, Geography, RiskCategory } from '../types';
import { exportCustomersToCsv, copyTableToGoogleSheetsClipboard } from '../services/sheetsExportService';

interface CustomerExplorerProps {
  customers?: Customer[];
  customerSample?: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

export const CustomerExplorer: React.FC<CustomerExplorerProps> = ({
  customers,
  customerSample,
  onSelectCustomer,
}) => {
  const customerList = customers || customerSample || [];
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState<'filter' | 'highlight'>('highlight');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedProducts, setSelectedProducts] = useState<string>('ALL');
  const [selectedActivity, setSelectedActivity] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'riskScore' | 'balance' | 'age' | 'creditScore'>('riskScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [copied, setCopied] = useState(false);

  // Check if a customer matches search string
  const checkMatchesSearch = (c: Customer, q: string) => {
    if (!q) return true;
    const lower = q.toLowerCase();
    return (
      c.customerId.toString().includes(lower) ||
      c.surname.toLowerCase().includes(lower) ||
      c.geography.toLowerCase().includes(lower) ||
      c.segment.toLowerCase().includes(lower)
    );
  };

  // Filtering & Sorting
  const filtered = useMemo(() => {
    return customerList.filter((c) => {
      // Search (if filter mode)
      if (search.trim() && searchMode === 'filter') {
        if (!checkMatchesSearch(c, search.trim())) return false;
      }

      // Country
      if (selectedCountry !== 'ALL' && c.geography !== selectedCountry) return false;

      // Risk
      if (selectedRisk !== 'ALL' && c.riskCategory !== selectedRisk) return false;

      // Products
      if (selectedProducts !== 'ALL' && c.numOfProducts !== parseInt(selectedProducts, 10)) return false;

      // Activity
      if (selectedActivity !== 'ALL') {
        const isActive = selectedActivity === 'ACTIVE';
        if (c.isActiveMember !== (isActive ? 1 : 0)) return false;
      }

      return true;
    }).sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }, [customerList, search, searchMode, selectedCountry, selectedRisk, selectedProducts, selectedActivity, sortBy, sortAsc]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleCopyClipboard = () => {
    const ok = copyTableToGoogleSheetsClipboard(filtered.slice(0, 500));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const getRiskBadge = (category: RiskCategory, score: number) => {
    switch (category) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-950 text-rose-300 border border-rose-800">{score} (CRIT)</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-orange-950 text-orange-300 border border-orange-800">{score} (HIGH)</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-950 text-amber-300 border border-amber-800">{score} (MED)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">{score} (LOW)</span>;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header & Export Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Customer 360° Explorer & Repository</span>
          </h1>
          <p className="text-xs text-slate-400">
            Query across verified records with model-assigned risk scores, behavioral features, and TreeSHAP attributions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyClipboard}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Copy TSV formatted directly for pasting into Google Sheets"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied TSV!' : 'Copy for Sheets'}</span>
          </button>
          <button
            onClick={() => exportCustomersToCsv(filtered, 'BankGuard_Filtered_Customers.csv')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm shadow-indigo-600/30"
          >
            <Download className="w-3.5 h-3.5 text-indigo-200" />
            <span>Export CSV ({filtered.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {/* Search Input & Mode Toggle */}
          <div className="lg:col-span-2 flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Customer ID, surname, geography..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 pl-9 pr-3 py-1.5 rounded-lg text-xs border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
            {search.trim() && (
              <div className="flex items-center space-x-1 shrink-0 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[10px]">
                <button
                  type="button"
                  onClick={() => setSearchMode('highlight')}
                  className={`px-2 py-1 rounded font-medium transition ${
                    searchMode === 'highlight' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Highlight
                </button>
                <button
                  type="button"
                  onClick={() => setSearchMode('filter')}
                  className={`px-2 py-1 rounded font-medium transition ${
                    searchMode === 'filter' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Filter
                </button>
              </div>
            )}
          </div>

          {/* Country Filter */}
          <div>
            <select
              value={selectedCountry}
              onChange={(e) => { setSelectedCountry(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Countries</option>
              <option value="France">France</option>
              <option value="Germany">Germany (51% Churn)</option>
              <option value="Spain">Spain</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => { setSelectedRisk(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="CRITICAL">Critical (Score 81-100)</option>
              <option value="HIGH">High (Score 61-80)</option>
              <option value="MEDIUM">Medium (Score 31-60)</option>
              <option value="LOW">Low (Score 0-30)</option>
            </select>
          </div>

          {/* Product Count Filter */}
          <div>
            <select
              value={selectedProducts}
              onChange={(e) => { setSelectedProducts(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Products</option>
              <option value="1">1 Product</option>
              <option value="2">2 Products (Optimal)</option>
              <option value="3">3 Products (High Risk)</option>
              <option value="4">4 Products (Critical)</option>
            </select>
          </div>

          {/* Activity Filter */}
          <div>
            <select
              value={selectedActivity}
              onChange={(e) => { setSelectedActivity(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Activity</option>
              <option value="ACTIVE">Active Members</option>
              <option value="INACTIVE">Inactive Accounts</option>
            </select>
          </div>
        </div>

        {/* Filter Stats & Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
          <div>
            Showing <strong className="text-slate-200">{filtered.length}</strong> matching depositors
            {filtered.length !== customers.length && ` (filtered from ${customers.length.toLocaleString()})`}
          </div>
          <div className="flex items-center space-x-2">
            <span>Sort By:</span>
            <button
              onClick={() => {
                if (sortBy === 'riskScore') setSortAsc(!sortAsc);
                else { setSortBy('riskScore'); setSortAsc(false); }
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border ${sortBy === 'riskScore' ? 'bg-indigo-950 text-indigo-300 border-indigo-700' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
              Risk Score {sortBy === 'riskScore' && (sortAsc ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'balance') setSortAsc(!sortAsc);
                else { setSortBy('balance'); setSortAsc(false); }
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border ${sortBy === 'balance' ? 'bg-indigo-950 text-indigo-300 border-indigo-700' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
              Balance {sortBy === 'balance' && (sortAsc ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Customer ID</th>
                <th className="py-2.5 px-3">Surname</th>
                <th className="py-2.5 px-3">Geography</th>
                <th className="py-2.5 px-3">Age</th>
                <th className="py-2.5 px-3">Balance</th>
                <th className="py-2.5 px-3">Products</th>
                <th className="py-2.5 px-3">Activity</th>
                <th className="py-2.5 px-3">Credit Score</th>
                <th className="py-2.5 px-3">Churn Prob</th>
                <th className="py-2.5 px-3">Risk Tier</th>
                <th className="py-2.5 px-3 text-right">360° Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginated.map((c) => {
                const isMatchingSearch = search.trim() ? checkMatchesSearch(c, search.trim()) : true;
                const isHighlightModeActive = search.trim().length > 0 && searchMode === 'highlight';

                return (
                  <tr
                    key={c.customerId}
                    onClick={() => onSelectCustomer(c)}
                    className={`cursor-pointer transition-all ${
                      isHighlightModeActive && isMatchingSearch
                        ? 'bg-indigo-950/40 border-l-4 border-indigo-400 font-medium shadow-sm'
                        : isHighlightModeActive && !isMatchingSearch
                        ? 'opacity-30 hover:opacity-80'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono text-indigo-300 font-medium">
                      {c.customerId}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      <span className={isHighlightModeActive && isMatchingSearch && c.surname.toLowerCase().includes(search.toLowerCase()) ? 'text-amber-300 underline underline-offset-2' : ''}>
                        {c.surname}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`${
                        c.geography === 'Germany' ? 'text-rose-300 font-medium' : 'text-slate-300'
                      } ${
                        isHighlightModeActive && isMatchingSearch && c.geography.toLowerCase().includes(search.toLowerCase()) ? 'text-amber-300 font-bold' : ''
                      }`}>
                        {c.geography}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{c.age} yrs</td>
                    <td className="py-2.5 px-3 font-mono text-amber-300 font-medium">
                      €{c.balance.toLocaleString()}
                    </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${c.numOfProducts >= 3 ? 'bg-rose-950 text-rose-300' : c.numOfProducts === 2 ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                      {c.numOfProducts}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${c.isActiveMember ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      {c.isActiveMember ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">{c.creditScore}</td>
                  <td className="py-2.5 px-3 font-mono font-medium text-rose-400">
                    {(c.churnProbability * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3">
                    {getRiskBadge(c.riskCategory, c.riskScore)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCustomer(c);
                      }}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition"
                    >
                      View 360°
                    </button>
                  </td>
                </tr>
              );
            })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No customer records match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700 text-xs"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <span>
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center space-x-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
