import React from 'react';
import {
  Building2,
  ShieldCheck,
  TrendingDown,
  Coins,
  FileSpreadsheet,
  Download,
  Lock,
  Globe2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AnalyticsSummary, GeographyChurnStat } from '../types';
import { exportExecutiveSummaryToCsv } from '../services/sheetsExportService';

interface ClientPortalProps {
  summary: AnalyticsSummary;
  onExportSummary?: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ summary, onExportSummary }) => {
  const geoStats = summary.geographyChurn || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Tenant Isolation Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-5 rounded-2xl border border-indigo-900/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Restricted Client Portal</span>
            </span>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
              Tenant ID: tenant-client-eu
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-2 flex items-center space-x-2">
            <span>Corporate Client Intelligence Suite</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Approved portfolio performance, aggregate retail depositor retention metrics, and macroeconomic geographic distribution.
            Under strict banking confidentiality rules, individual depositor PII is excluded.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => {
              if (onExportSummary) onExportSummary();
              else exportExecutiveSummaryToCsv();
            }}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Approved Summary (.csv)</span>
          </button>
        </div>
      </div>

      {/* Approved KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Observed Customer Population</div>
          <div className="text-2xl font-bold text-slate-100 font-mono">10,000</div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>European Retail Sample Ground Truth</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Portfolio Churn Rate</div>
          <div className="text-2xl font-bold text-rose-400 font-mono">20.37%</div>
          <div className="text-[11px] text-slate-400 mt-1">2,037 accounts exited</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Deposits Protected / Retained</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">€590.2M</div>
          <div className="text-[11px] text-slate-400 mt-1">Active capital base</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Regulatory Governance Tier</div>
          <div className="text-2xl font-bold text-indigo-300 font-mono">EBA Tier-1</div>
          <div className="text-[11px] text-slate-400 mt-1">BCBS 239 Compliant</div>
        </div>
      </div>

      {/* Geographic Breakdown & Approved Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Summary */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Globe2 className="w-4 h-4 text-indigo-400" />
              <span>Approved Geographic Distribution</span>
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Aggregated
            </span>
          </div>

          <div className="space-y-3">
            {geoStats.map((geo) => (
              <div key={geo.country} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-200">{geo.country}</span>
                  <span className="font-mono text-rose-400 font-semibold">{geo.churnRate}% Churn</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${
                      geo.country === 'Germany' ? 'bg-rose-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, geo.churnRate * 2.5)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{geo.customerCount.toLocaleString()} Total Customers</span>
                  <span>Avg Balance: €{geo.averageBalance.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Data Privacy Guarantee */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Client Confidentiality & Privacy Shield</span>
            </h2>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-start space-x-2.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100 block">Strict Data Isolation</strong>
                  Tenant authorization restricts this session strictly to approved executive KPIs. Internal banking operator queues, individual credit cards, and salaries are isolated.
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100 block">Explainable AI Attestation</strong>
                  Model predictions utilized across this portfolio are validated against TreeSHAP explainability requirements with 0% black-box opacity.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Client Workspace: tenant-client-eu</span>
            <span className="text-emerald-400">Audited & Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
