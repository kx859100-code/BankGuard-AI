import React, { useState } from 'react';
import {
  X,
  User,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Building,
  CheckCircle2,
  Calendar,
  DollarSign,
  Briefcase,
  AlertTriangle,
  ClipboardList,
  Sparkles
} from 'lucide-react';
import { Customer } from '../types';

interface Customer360ModalProps {
  customer: Customer | null;
  onClose: () => void;
  onCreateCrmCase: (customer: Customer, officer: string, notes: string) => void;
}

export const Customer360Modal: React.FC<Customer360ModalProps> = ({
  customer,
  onClose,
  onCreateCrmCase,
}) => {
  if (!customer) return null;

  const [officerName, setOfficerName] = useState('Claire Laurent (Senior Relationship Mgr)');
  const [caseNotes, setCaseNotes] = useState(`Urgent retention intervention recommended: ${customer.recommendedAction}`);
  const [caseCreated, setCaseCreated] = useState(false);

  const handleCreateCase = () => {
    onCreateCrmCase(customer, officerName, caseNotes);
    setCaseCreated(true);
    setTimeout(() => {
      setCaseCreated(false);
      onClose();
    }, 1200);
  };

  const getRiskBadgeColor = (category: string) => {
    switch (category) {
      case 'CRITICAL':
        return 'bg-rose-950 text-rose-300 border-rose-700';
      case 'HIGH':
        return 'bg-orange-950 text-orange-300 border-orange-700';
      case 'MEDIUM':
        return 'bg-amber-950 text-amber-300 border-amber-700';
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-100">{customer.surname}</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  ID: {customer.customerId}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getRiskBadgeColor(customer.riskCategory)}`}>
                  {customer.riskCategory} RISK ({customer.riskScore}/100)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {customer.geography} • {customer.age} yrs old • {customer.gender} • Tenure: {customer.tenure} yrs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400 mb-0.5">Account Balance</div>
              <div className="text-base font-bold font-mono text-amber-300">
                €{customer.balance.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">{customer.balanceSegment}</div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400 mb-0.5">Predicted Churn Prob</div>
              <div className="text-base font-bold font-mono text-rose-400">
                {(customer.churnProbability * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">{customer.modelVersion}</div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400 mb-0.5">Products & Activity</div>
              <div className="text-base font-bold text-slate-200">
                {customer.numOfProducts} {customer.numOfProducts === 1 ? 'Product' : 'Products'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {customer.isActiveMember ? 'Active Member' : 'Inactive Account'}
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400 mb-0.5">Estimated Salary / CLV</div>
              <div className="text-base font-bold font-mono text-emerald-300">
                €{customer.estimatedSalary.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Simulated CLV: €{customer.simulatedCLV.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Model Explainability: TreeSHAP Feature Attributions */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  TreeSHAP Explainable Risk Attribution
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Calibrated against ground-truth behavioral drivers
              </span>
            </div>

            <div className="space-y-2.5">
              {customer.shapFactors.map((factor, idx) => {
                const isPushingRisk = factor.direction === 'positive';
                const impactWidth = Math.min(100, Math.round(Math.abs(factor.impact) * 220));

                return (
                  <div key={idx} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {isPushingRisk ? (
                          <TrendingUp className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-200">{factor.feature}:</span>
                        <span className="font-mono text-slate-300">{factor.value}</span>
                      </div>
                      <span className={`font-mono font-bold text-[11px] ${isPushingRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isPushingRisk ? '+' : ''}{factor.impact.toFixed(3)} SHAP
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full ${isPushingRisk ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${impactWidth}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400">
                      {factor.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Segment & Strategic Recommended Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/80">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Customer Segment (Cluster)
              </h3>
              <div className="text-sm font-bold text-indigo-300 mb-1">{customer.segment}</div>
              <p className="text-xs text-slate-400">
                Segment profile based on product count, activity status, demographic age band, and deposit liquidity.
              </p>
            </div>

            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/80">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Prescribed Retention Action
              </h3>
              <div className="text-sm font-bold text-amber-300 mb-1">{customer.recommendedAction}</div>
              <p className="text-xs text-slate-400">
                Cost assumption: €{customer.simulatedInterventionCost} • Expected capital protected: €{Math.round(customer.balance * 0.65).toLocaleString()}
              </p>
            </div>
          </div>

          {/* CRM Case Initiation Form */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-indigo-500/30">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center space-x-2 mb-2">
              <ClipboardList className="w-4 h-4 text-indigo-400" />
              <span>Create Operational CRM Retention Case</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Assign Relationship Officer</label>
                <select
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Claire Laurent (Senior Relationship Mgr)">Claire Laurent (Senior Relationship Mgr)</option>
                  <option value="Markus Becker (German Desk Lead)">Markus Becker (German Desk Lead)</option>
                  <option value="Elena Garcia (Private Banking Advisor)">Elena Garcia (Private Banking Advisor)</option>
                  <option value="Jean Dupont (Retail Retention Specialist)">Jean Dupont (Retail Retention Specialist)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Intervention Note</label>
                <input
                  type="text"
                  value={caseNotes}
                  onChange={(e) => setCaseNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Case will sync to Google Sheets & CRM operational queue
              </span>
              <button
                onClick={handleCreateCase}
                disabled={caseCreated}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center space-x-1.5 shadow-sm shadow-indigo-600/30"
              >
                {caseCreated ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Case Logged!</span>
                  </>
                ) : (
                  <>
                    <ClipboardList className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Dispatch Case to CRM</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
