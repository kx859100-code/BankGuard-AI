import React from 'react';
import {
  LayoutDashboard,
  Users,
  PieChart,
  BrainCircuit,
  Globe2,
  Gem,
  Calculator,
  Bot,
  BookOpen,
  ClipboardList,
  FileSpreadsheet,
  Database,
  ShieldCheck,
  Cpu,
  Layers,
  Building2,
  GitCommit,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Role, ActiveTab } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  criticalCount: number;
  onOpenLoginModal?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  criticalCount,
  onOpenLoginModal,
}) => {
  const allNavItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | null;
    category: 'Intelligence' | 'Operations' | 'Governance' | 'Client';
    allowedRoles: Role[];
  }> = [
    // Executive Intelligence
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard, badge: null, category: 'Intelligence', allowedRoles: ['Admin', 'Manager', 'Head Office Operator', 'Auditing Manager', 'Viewer'] },
    { id: 'customers', label: 'Customer 360° Explorer', icon: Users, badge: '10k', category: 'Intelligence', allowedRoles: ['Admin', 'Manager', 'Head Office Operator', 'Viewer'] },
    { id: 'segmentation', label: 'Segmentation Clusters', icon: PieChart, badge: '4 Clusters', category: 'Intelligence', allowedRoles: ['Admin', 'Manager', 'Viewer'] },
    { id: 'churn', label: 'TreeSHAP & ML Models', icon: BrainCircuit, badge: 'XGBoost', category: 'Intelligence', allowedRoles: ['Admin', 'Manager'] },
    { id: 'geography', label: 'Geographic Intelligence', icon: Globe2, badge: null, category: 'Intelligence', allowedRoles: ['Admin', 'Manager', 'Viewer'] },
    { id: 'high-value', label: 'High-Value at Risk', icon: Gem, badge: 'VIP', category: 'Intelligence', allowedRoles: ['Admin', 'Manager'] },
    { id: 'optimization', label: 'OR-Tools Optimizer', icon: Calculator, badge: 'Knapsack', category: 'Intelligence', allowedRoles: ['Admin', 'Manager'] },

    // Operations & AI
    { id: 'copilot', label: 'AI Analytics Copilot', icon: Bot, badge: 'Agent', category: 'Operations', allowedRoles: ['Admin', 'Manager'] },
    { id: 'rag', label: 'Banking RAG Research', icon: BookOpen, badge: 'ECB/EBA', category: 'Operations', allowedRoles: ['Admin', 'Manager', 'Viewer'] },
    { id: 'operations', label: 'Operations Triage Center', icon: Layers, badge: 'Queue', category: 'Operations', allowedRoles: ['Admin', 'Manager', 'Head Office Operator'] },
    { id: 'crm', label: 'CRM Retention Queue', icon: ClipboardList, badge: `${criticalCount} alert`, category: 'Operations', allowedRoles: ['Admin', 'Manager', 'Head Office Operator'] },

    // Governance & Models
    { id: 'model-center', label: 'Model Center & Retraining', icon: Cpu, badge: 'MLOps', category: 'Governance', allowedRoles: ['Admin', 'Auditing Manager'] },
    { id: 'sheets', label: 'Google Sheets & Sync', icon: FileSpreadsheet, badge: 'OAuth/API', category: 'Governance', allowedRoles: ['Admin', 'Manager'] },
    { id: 'data-quality', label: 'Data Quality Center', icon: Database, badge: '100%', category: 'Governance', allowedRoles: ['Admin', 'Manager', 'Auditing Manager'] },
    { id: 'data-lineage', label: 'Data Lineage & Pipeline', icon: GitCommit, badge: 'Flow', category: 'Governance', allowedRoles: ['Admin', 'Manager', 'Auditing Manager', 'Viewer'] },
    { id: 'settings', label: 'Governance & RBAC', icon: ShieldCheck, badge: currentRole, category: 'Governance', allowedRoles: ['Admin', 'Manager', 'Head Office Operator', 'Auditing Manager', 'Viewer'] },

    // Client Portal (Isolated)
    { id: 'client-portal', label: 'Corporate Client Portal', icon: Building2, badge: 'Tenant', category: 'Client', allowedRoles: ['Client', 'Admin'] },
  ];

  // Filter based on active role
  const visibleNavItems = allNavItems.filter((item) => item.allowedRoles.includes(currentRole));

  const intelligenceItems = visibleNavItems.filter((item) => item.category === 'Intelligence');
  const operationsItems = visibleNavItems.filter((item) => item.category === 'Operations');
  const governanceItems = visibleNavItems.filter((item) => item.category === 'Governance');
  const clientItems = visibleNavItems.filter((item) => item.category === 'Client');

  return (
    <div className="w-64 bg-slate-950 text-slate-200 border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-100 tracking-tight text-base">BankGuard</span>
              <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">European Retail Bank</p>
          </div>
        </div>
      </div>

      {/* Role & Context Switcher */}
      <div className="px-3 py-2.5 border-b border-slate-800/60 bg-slate-900/40">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span className="font-medium">Active RBAC Role:</span>
          {onOpenLoginModal ? (
            <button
              onClick={onOpenLoginModal}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-0.5"
            >
              <span>Switch User</span>
            </button>
          ) : (
            <span className="text-emerald-400 font-mono text-[10px]">VERIFIED</span>
          )}
        </div>
        <select
          value={currentRole}
          onChange={(e) => {
            const newRole = e.target.value as Role;
            setCurrentRole(newRole);
            if (newRole === 'Client') {
              setActiveTab('client-portal');
            } else if (newRole === 'Head Office Operator' && (activeTab === 'churn' || activeTab === 'optimization')) {
              setActiveTab('operations');
            } else if (newRole === 'Auditing Manager' && (activeTab === 'churn' || activeTab === 'customers')) {
              setActiveTab('settings');
            }
          }}
          className="w-full bg-slate-800/90 text-slate-200 text-xs rounded px-2 py-1.5 border border-slate-700 focus:outline-none focus:border-indigo-400 font-medium"
        >
          <option value="Admin">Admin (Full Control)</option>
          <option value="Manager">Manager (Portfolio & Retention)</option>
          <option value="Head Office Operator">Head Office Operator (Triage)</option>
          <option value="Auditing Manager">Auditing Manager (Compliance)</option>
          <option value="Viewer">Viewer (Read-Only)</option>
          <option value="Client">Client (Isolated Portal)</option>
        </select>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 custom-scrollbar">
        {intelligenceItems.length > 0 && (
          <div className="space-y-0.5">
            <div className="px-2 pt-2 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Intelligence
            </div>
            {intelligenceItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1 ${
                        isActive
                          ? 'bg-indigo-700/80 text-indigo-100'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {operationsItems.length > 0 && (
          <div className="space-y-0.5 pt-2">
            <div className="px-2 pt-1 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Operations & Outreach
            </div>
            {operationsItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1 ${
                        isActive
                          ? 'bg-indigo-700/80 text-indigo-100'
                          : item.id === 'crm'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {governanceItems.length > 0 && (
          <div className="space-y-0.5 pt-2">
            <div className="px-2 pt-1 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Governance & Lineage
            </div>
            {governanceItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1 ${
                        isActive
                          ? 'bg-indigo-700/80 text-indigo-100'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {clientItems.length > 0 && (
          <div className="space-y-0.5 pt-2">
            <div className="px-2 pt-1 pb-1 text-[10px] uppercase font-bold tracking-wider text-indigo-400">
              Client Portal
            </div>
            {clientItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1 ${
                        isActive
                          ? 'bg-indigo-700/80 text-indigo-100'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Dataset Lineage Status Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/70 text-[11px]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="font-semibold text-slate-300">Raw Data Ground Truth</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <p className="text-[10px] text-slate-400 font-mono truncate">data/raw/European_Bank.csv</p>
        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
          <span>10,000 Records</span>
          <span className="text-rose-400 font-mono font-medium">20.37% Churn</span>
        </div>
      </div>
    </div>
  );
};
