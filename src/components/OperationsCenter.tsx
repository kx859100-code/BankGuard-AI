import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  AlertOctagon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PhoneCall,
  Search,
  Filter,
  UserCheck,
  Building2,
  ArrowRight,
  ShieldAlert,
  Send
} from 'lucide-react';
import { Customer, CRMCase, CRMStatus } from '../types';

interface OperationsCenterProps {
  customers: Customer[];
  crmCases: CRMCase[];
  onSelectCustomer: (customer: Customer) => void;
  onDispatchToCrm: (customer: Customer, action: string, notes: string) => void;
  onUpdateCaseStatus: (caseId: string, status: CRMStatus, notes?: string) => void;
}

export const OperationsCenter: React.FC<OperationsCenterProps> = ({
  customers = [],
  crmCases = [],
  onSelectCustomer,
  onDispatchToCrm,
  onUpdateCaseStatus,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedFilter, setSelectedFilter] = useState<'CRITICAL' | 'HIGH' | 'PENDING_CRM'>('CRITICAL');

  // Statistics
  const criticalCount = useMemo(() => customers.filter(c => c.riskCategory === 'CRITICAL').length, [customers]);
  const highRiskCount = useMemo(() => customers.filter(c => c.riskCategory === 'HIGH').length, [customers]);
  const openCasesCount = useMemo(() => crmCases.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length, [crmCases]);
  const pendingFollowupsCount = useMemo(() => crmCases.filter(c => c.status === 'CONTACTED').length, [crmCases]);

  // Priority Queue items
  const priorityQueue = useMemo(() => {
    let list = customers.filter(c => {
      if (selectedFilter === 'CRITICAL') return c.riskCategory === 'CRITICAL';
      if (selectedFilter === 'HIGH') return c.riskCategory === 'HIGH';
      return c.riskCategory === 'CRITICAL' || c.riskCategory === 'HIGH';
    });

    if (selectedCountry !== 'ALL') {
      list = list.filter(c => c.geography === selectedCountry);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.customerId.toString().includes(q) ||
        c.surname.toLowerCase().includes(q) ||
        c.geography.toLowerCase().includes(q)
      );
    }

    return list.slice(0, 30);
  }, [customers, selectedFilter, selectedCountry, search]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
              OPERATIONS & ACTION WORKFLOW
            </span>
            <span className="text-xs text-slate-400">Head Office Operator Console</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">Today's Retention & Case Queue</h1>
          <p className="text-xs text-slate-400">
            Real-time operational triage of high-flight depositors, banker assignment routing, and direct CRM case execution.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Verified Queue Lineage: European_Bank.csv</span>
        </div>
      </div>

      {/* Today's Queue Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Critical Queue */}
        <div
          onClick={() => setSelectedFilter('CRITICAL')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            selectedFilter === 'CRITICAL'
              ? 'bg-rose-950/30 border-rose-600 ring-1 ring-rose-500/50'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Critical Customers</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono tracking-tight">{criticalCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Score 81–100 • High flight hazard</div>
        </div>

        {/* High Risk Queue */}
        <div
          onClick={() => setSelectedFilter('HIGH')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            selectedFilter === 'HIGH'
              ? 'bg-orange-950/30 border-orange-600 ring-1 ring-orange-500/50'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>High Risk Accounts</span>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-400 font-mono tracking-tight">{highRiskCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Score 61–80 • Early friction stage</div>
        </div>

        {/* Open CRM Cases */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Open CRM Cases</span>
            <ClipboardList className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-300 font-mono tracking-tight">{openCasesCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active cases under officer review</div>
        </div>

        {/* Pending Follow-ups */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Pending Follow-ups</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono tracking-tight">{pendingFollowupsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Contacted clients awaiting offer decision</div>
        </div>
      </div>

      {/* Priority Queue Controls */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <ClipboardList className="w-4 h-4 text-amber-400" />
              <span>Priority Customer Queue ({priorityQueue.length} Active in Triage)</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by ID, surname..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48"
              />
            </div>

            {/* Country Selector */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Jurisdictions</option>
              <option value="Germany">Germany (High Priority)</option>
              <option value="France">France</option>
              <option value="Spain">Spain</option>
            </select>
          </div>
        </div>

        {/* Priority Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Customer ID</th>
                <th className="py-2.5 px-3">Surname</th>
                <th className="py-2.5 px-3">Country</th>
                <th className="py-2.5 px-3">Age</th>
                <th className="py-2.5 px-3">Balance</th>
                <th className="py-2.5 px-3">Products</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">Recommended Intervention</th>
                <th className="py-2.5 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {priorityQueue.map((c) => {
                const existingCase = crmCases.find(ca => ca.customerId === c.customerId);
                return (
                  <tr
                    key={c.customerId}
                    className="hover:bg-slate-800/40 transition group"
                  >
                    <td
                      onClick={() => onSelectCustomer(c)}
                      className="py-3 px-3 font-mono text-indigo-300 font-semibold cursor-pointer hover:underline"
                    >
                      {c.customerId}
                    </td>
                    <td
                      onClick={() => onSelectCustomer(c)}
                      className="py-3 px-3 font-medium text-slate-100 cursor-pointer"
                    >
                      {c.surname}
                    </td>
                    <td className="py-3 px-3">{c.geography}</td>
                    <td className="py-3 px-3">{c.age} yrs</td>
                    <td className="py-3 px-3 font-mono font-medium text-amber-300">
                      €{c.balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {c.numOfProducts} prod
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono border ${
                        c.riskCategory === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : 'bg-orange-950 text-orange-300 border-orange-800'
                      }`}>
                        {c.riskScore} ({c.riskCategory})
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-[11px] text-slate-300" title={c.recommendedAction}>
                      {c.recommendedAction}
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      {existingCase ? (
                        <span className="text-[10px] px-2 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                          {existingCase.status}
                        </span>
                      ) : (
                        <button
                          onClick={() => onDispatchToCrm(c, c.recommendedAction, 'Dispatched from Head Office Operator queue')}
                          className="px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition inline-flex items-center space-x-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Dispatch CRM</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
