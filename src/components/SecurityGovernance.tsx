import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  FileText,
  KeyRound,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  Layers,
  Activity,
  ShieldAlert,
  ArrowDownToLine,
  RefreshCw
} from 'lucide-react';
import { Role, AuditLog } from '../types';
import { exportAuditLogsToJson } from '../services/sheetsExportService';

interface SecurityGovernanceProps {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  auditLogs: AuditLog[];
  onExportAuditLogs?: () => void;
}

export const SecurityGovernance: React.FC<SecurityGovernanceProps> = ({
  currentRole,
  setCurrentRole,
  auditLogs = [],
  onExportAuditLogs,
}) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const rolesInfo: Record<Role, { title: string; description: string; permissions: string[]; tenant: string }> = {
    Admin: {
      title: 'Platform Administrator',
      description: 'Complete systemic control over data pipeline, optimization models, RBAC policies, and Google Workspace integrations.',
      permissions: ['Read all data & features', 'Initiate model retraining', 'Execute Knapsack optimizations', 'Modify CRM cases', 'Manage RBAC & users', 'Export raw customer records & audit logs', 'Inspect system observability'],
      tenant: 'bank-hq-europe (Tenant 001)'
    },
    Manager: {
      title: 'Portfolio & Retention Manager',
      description: 'Executive decision-maker overseeing high-level retention budgets, portfolio KPIs, TreeSHAP explainability, and customer segments.',
      permissions: ['Executive Dashboard access', 'Filter & explore customer pool', 'Run OR-Tools knapsack optimization', 'AI Analytics Copilot query engine', 'Export filtered analytical datasets (CSV/JSON)', 'Assign CRM officers'],
      tenant: 'bank-hq-europe (Tenant 001)'
    },
    'Head Office Operator': {
      title: 'Head Office Operations Specialist',
      description: 'Operational frontline team managing today’s risk queue, customer outreach tasks, banker assignments, and resolution statuses.',
      permissions: ['View operations risk queue', 'Access Customer Explorer with search highlighting', 'Dispatch accounts to CRM Retention Queue', 'Update case follow-up notes', 'Generate operational outreach reports'],
      tenant: 'bank-hq-europe (Tenant 001)'
    },
    'Auditing Manager': {
      title: 'Compliance & Audit Manager',
      description: 'Regulatory oversight role responsible for reviewing immutable audit records, model retraining triggers, security events, and data lineage.',
      permissions: ['Review immutable audit event logs', 'Inspect data lineage & pipeline integrity', 'Audit model retraining triggers & versions', 'Export complete audit log history (JSON)', 'Monitor failed logins & permission violations'],
      tenant: 'compliance-auditing-eu'
    },
    Viewer: {
      title: 'Risk Analyst (Read-Only)',
      description: 'Read-only stakeholder access for executive oversight and compliance review without mutation rights.',
      permissions: ['View high-level dashboard KPIs', 'View geographic churn distribution', 'View segmentation clusters', 'Read banking regulatory RAG documents'],
      tenant: 'bank-hq-europe (Tenant 001)'
    },
    Client: {
      title: 'Corporate Client Portal',
      description: 'Restricted corporate portal: approved aggregate portfolio KPIs, churn rates, and reports under strict tenant isolation.',
      permissions: ['View approved portfolio KPIs', 'View aggregate churn rate', 'View country-level distribution', 'Download approved executive summary report'],
      tenant: 'tenant-client-eu (Isolated)'
    }
  };

  // Filter audit logs
  const filteredLogs = useMemo(() => {
    let list = [...auditLogs];
    if (filterAction !== 'ALL') {
      list = list.filter(l => l.action.includes(filterAction));
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(l =>
        l.action.toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.role.toLowerCase().includes(q)
      );
    }
    return list;
  }, [auditLogs, filterAction, searchTerm]);

  const handleDownloadAuditLogs = () => {
    if (onExportAuditLogs) {
      onExportAuditLogs();
    } else {
      exportAuditLogsToJson(auditLogs, `${currentRole} User`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>ROLE-BASED ACCESS CONTROL (RBAC) & COMPLIANCE</span>
            </span>
            <span className="text-xs text-slate-400">GDPR & Banking Secrecy Standard (BCBS 239)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">Security, Governance & Audit Logging</h1>
          <p className="text-xs text-slate-400">
            Enforce granular user access controls, view permitted operation sets, inspect data lineage, and export immutable audit trails.
          </p>
        </div>

        <button
          onClick={handleDownloadAuditLogs}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Export All Audit Logs (JSON)</span>
        </button>
      </div>

      {/* Security Health Status Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">Authentication</div>
          <div className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Healthy (MFA)</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">RBAC Enforcement</div>
          <div className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>6 Roles Active</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">API Security</div>
          <div className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>TLS 1.3 / OAuth2</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">Tenant Isolation</div>
          <div className="text-sm font-bold text-indigo-400 flex items-center space-x-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>Enforced</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">Audit Trail</div>
          <div className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>100% Captured</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">Data Encryption</div>
          <div className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>AES-256 GCM</span>
          </div>
        </div>
      </div>

      {/* Role Switcher & Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span>Switch RBAC Role Context</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">6 Roles</span>
          </div>

          <div className="space-y-2">
            {(Object.keys(rolesInfo) as Role[]).map((r) => {
              const isSelected = currentRole === r;
              return (
                <button
                  key={r}
                  onClick={() => setCurrentRole(r)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs font-semibold transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <span>{r}</span>
                    <span className="block text-[10px] opacity-75 font-normal truncate">{rolesInfo[r].title}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-200 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Role Permissions Overview */}
        <div className="lg:col-span-2 bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Authorized Role Profile</span>
              <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <span>{currentRole}</span>
                <span className="text-xs font-normal text-slate-400">({rolesInfo[currentRole].title})</span>
              </h2>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 block">
                ACTIVE IN SESSION
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                {rolesInfo[currentRole].tenant}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {rolesInfo[currentRole].description}
          </p>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-400">Granted Capability Matrix:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {rolesInfo[currentRole].permissions.map((perm, idx) => (
                <div key={idx} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs text-slate-200 flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Immutable Audit Log Table & Filters */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950/40">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Immutable System Audit Trail ({filteredLogs.length} Records)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Audit trails capturing user logins, role transitions, filtered exports, model changes, and CRM status updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter logs..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
              />
            </div>

            {/* Action Filter */}
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Actions</option>
              <option value="LOGIN">User Logins</option>
              <option value="EXPORT">Data Exports</option>
              <option value="MODEL">Model Changes</option>
              <option value="CRM">CRM Updates</option>
              <option value="ROLE">Role Switches</option>
            </select>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto custom-scrollbar px-4 pb-4">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User & IP</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Action Event</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Operation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-200">
                    <div>{log.user}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{log.ipAddress || '192.168.10.42'}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-indigo-300 font-sans">{log.role}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action.includes('EXPORT')
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : log.action.includes('MODEL')
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : log.action.includes('DENIED')
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-bold ${
                      log.status === 'FAILED' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {log.status || 'SUCCESS'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300 text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
