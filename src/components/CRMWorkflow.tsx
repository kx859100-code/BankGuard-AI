import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertOctagon,
  Download,
  Filter,
  PhoneCall,
  Calendar,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { CRMCase, CRMStatus } from '../types';

interface CRMWorkflowProps {
  cases?: CRMCase[];
  onUpdateCaseStatus: (caseId: string, status: CRMStatus, notes?: string) => void;
  onSelectCustomerById: (customerId: number) => void;
}

export const CRMWorkflow: React.FC<CRMWorkflowProps> = ({
  cases = [],
  onUpdateCaseStatus,
  onSelectCustomerById,
}) => {
  const safeCases = cases || [];
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const filteredCases = safeCases.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    return true;
  });

  const totalCapitalInCrm = safeCases.reduce((acc, c) => acc + c.balance, 0);
  const openCount = safeCases.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length;
  const resolvedCount = safeCases.filter(c => c.status === 'RESOLVED').length;

  const exportCrmToCsv = () => {
    const headers = ['CaseId', 'CustomerId', 'CustomerName', 'Country', 'Balance', 'RiskScore', 'Priority', 'AssignedOfficer', 'Status', 'RecommendedAction', 'FollowUpDate', 'Notes'];
    const rows = filteredCases.map(c => [
      c.caseId,
      c.customerId,
      `"${c.customerName}"`,
      c.country,
      c.balance.toFixed(2),
      c.riskScore,
      c.priority,
      `"${c.assignedOfficer}"`,
      c.status,
      `"${c.recommendedAction}"`,
      c.followUpDate,
      `"${c.notes}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'BankGuard_CRM_Retention_Queue.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              OPERATIONAL RETENTION WORKFLOW
            </span>
            <span className="text-xs text-slate-400">Human-in-the-Loop CRM Case Management</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">CRM Retention Intervention Queue</h1>
          <p className="text-xs text-slate-400">
            Assigned customer outreach cases, banker follow-up schedules, and real-time relationship retention tracking.
          </p>
        </div>

        <button
          onClick={exportCrmToCsv}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Queue CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Active Cases Pending Contact</div>
          <div className="text-2xl font-bold font-mono text-amber-400">{openCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Requiring outreach this week</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Total Managed Deposit Exposure</div>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            €{(totalCapitalInCrm / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all logged CRM cases</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Successfully Retained Accounts</div>
          <div className="text-2xl font-bold font-mono text-indigo-300">{resolvedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Resolved through retention playbook</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open (New)</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CONTACTED">Contacted</option>
            <option value="RESOLVED">Resolved (Saved)</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical (Score ≥81)</option>
            <option value="HIGH">High (Score ≥61)</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {filteredCases.map((item) => (
          <div
            key={item.caseId}
            className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-xs text-indigo-400 font-bold">{item.caseId}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  item.priority === 'CRITICAL'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-orange-950 text-orange-300 border border-orange-800'
                }`}>
                  {item.priority} PRIORITY
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  item.status === 'RESOLVED'
                    ? 'bg-emerald-950 text-emerald-300'
                    : item.status === 'CONTACTED'
                    ? 'bg-indigo-950 text-indigo-300'
                    : 'bg-amber-950 text-amber-300'
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <h3
                  onClick={() => onSelectCustomerById(item.customerId)}
                  className="text-base font-bold text-slate-100 hover:text-indigo-400 cursor-pointer transition"
                >
                  {item.customerName}
                </h3>
                <span className="text-xs text-slate-400 font-mono">ID: {item.customerId} • {item.country}</span>
                <span className="text-xs text-amber-300 font-mono font-semibold">€{item.balance.toLocaleString()}</span>
              </div>

              <div className="text-xs text-slate-300">
                <strong>Recommended Strategy:</strong> {item.recommendedAction}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                <span>Officer: <strong className="text-slate-200">{item.assignedOfficer}</strong></span>
                <span>Follow-up: <strong className="text-slate-200">{item.followUpDate}</strong></span>
                <span>Note: "{item.notes}"</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              {item.status !== 'CONTACTED' && item.status !== 'RESOLVED' && (
                <button
                  onClick={() => onUpdateCaseStatus(item.caseId, 'CONTACTED', 'Banker conducted phone outreach consultation.')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  Mark Contacted
                </button>
              )}
              {item.status !== 'RESOLVED' && (
                <button
                  onClick={() => onUpdateCaseStatus(item.caseId, 'RESOLVED', 'Customer accepted fee waiver and agreed to deposit lock-in term.')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Resolve (Retained)</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredCases.length === 0 && (
          <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
            No active retention cases match the current filter selection.
          </div>
        )}
      </div>
    </div>
  );
};
