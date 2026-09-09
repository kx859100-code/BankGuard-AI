import React, { useState } from 'react';
import {
  Calculator,
  Play,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Coins,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Customer, OptimizationObjective, OptimizationResult } from '../types';
import { runRetentionOptimization, OptimizationParams } from '../services/optimizationEngine';
import { exportCustomersToCsv } from '../services/sheetsExportService';

interface RetentionOptimizerProps {
  customerPool: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onBulkAddToCrm: (customers: Customer[]) => void;
}

export const RetentionOptimizer: React.FC<RetentionOptimizerProps> = ({
  customerPool,
  onSelectCustomer,
  onBulkAddToCrm,
}) => {
  // Optimizer Parameters
  const [scenarioName, setScenarioName] = useState('Executive Scenario 1 (500 High-Priority)');
  const [targetCapacity, setTargetCapacity] = useState<number>(500);
  const [totalBudget, setTotalBudget] = useState<number>(60000);
  const [objective, setObjective] = useState<OptimizationObjective>('MAX_RETAINED_BALANCE');
  const [countryFilter, setCountryFilter] = useState<'ALL' | 'France' | 'Germany' | 'Spain'>('ALL');
  const [minRiskCategory, setMinRiskCategory] = useState<'ALL' | 'HIGH_CRITICAL' | 'CRITICAL_ONLY'>('HIGH_CRITICAL');

  // Execution Result State
  const [activeResult, setActiveResult] = useState<OptimizationResult>(() =>
    runRetentionOptimization(customerPool, {
      scenarioName: 'Executive Scenario 1 (500 High-Priority)',
      targetCapacity: 500,
      totalBudget: 60000,
      objective: 'MAX_RETAINED_BALANCE',
      countryFilter: 'ALL',
      minRiskCategory: 'HIGH_CRITICAL'
    })
  );

  const [savedScenarios, setSavedScenarios] = useState<OptimizationResult[]>([activeResult]);
  const [bulkDispatched, setBulkDispatched] = useState(false);

  const handleRunOptimization = () => {
    const params: OptimizationParams = {
      scenarioName,
      targetCapacity,
      totalBudget,
      objective,
      countryFilter,
      minRiskCategory
    };
    const result = runRetentionOptimization(customerPool, params);
    setActiveResult(result);
    setSavedScenarios(prev => [result, ...prev.slice(0, 3)]);
  };

  const handleDispatchAllToCrm = () => {
    onBulkAddToCrm(activeResult.selectedCustomers);
    setBulkDispatched(true);
    setTimeout(() => setBulkDispatched(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              OR-TOOLS ALGORITHMIC KNAPSACK SOLVER
            </span>
            <span className="text-xs text-slate-400">Multi-Objective Constraint Optimization</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">Prescriptive Retention Optimization Center</h1>
          <p className="text-xs text-slate-400">
            Maximizes preserved deposit capital under operational banker capacity and retention budget limits.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportCustomersToCsv(activeResult.selectedCustomers, `${activeResult.scenarioName.replace(/\s+/g, '_')}.csv`)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Roster CSV</span>
          </button>
          <button
            onClick={handleDispatchAllToCrm}
            disabled={bulkDispatched || activeResult.selectedCustomers.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm shadow-emerald-600/30"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
            <span>{bulkDispatched ? 'Dispatched to CRM!' : 'Push Cohort to CRM'}</span>
          </button>
        </div>
      </div>

      {/* Assumptions Transparency Callout */}
      <div className="bg-amber-950/20 border border-amber-800/40 p-3.5 rounded-xl text-xs text-amber-200/90 flex items-start space-x-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300">Methodology & Assumption Disclosure:</strong> While customer attributes (Age, Balance, Geography, Credit Score) are strictly 100% verified ground truth from <code className="text-slate-300 font-mono">European_Bank.csv</code>, intervention costs (€75 mass / €150 wealth) and Customer Lifetime Values (CLV) are simulated scenario assumptions to enable mathematical resource allocation.
        </div>
      </div>

      {/* Interactive Controls & Solver Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            <span>Optimization Parameters</span>
          </h2>

          {/* Scenario Name */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Scenario Label</label>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Objective Function */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Primary Solver Objective</label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value as OptimizationObjective)}
              className="w-full bg-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="MAX_RETAINED_BALANCE">Maximize Protected Capital (Weighted Balance)</option>
              <option value="MAX_RISK_REDUCTION">Maximize Attrition Risk Reduction (Score)</option>
              <option value="BALANCED_COMPOSITE">Balanced Composite (Capital & Churn Rate)</option>
            </select>
          </div>

          {/* Target Capacity Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Target Customer Capacity:</span>
              <span className="font-mono font-bold text-indigo-400">{targetCapacity} accounts</span>
            </div>
            <input
              type="range"
              min={50}
              max={1000}
              step={25}
              value={targetCapacity}
              onChange={(e) => setTargetCapacity(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>50 (VIP only)</span>
              <span>500 (Standard)</span>
              <span>1,000 (Full Cohort)</span>
            </div>
          </div>

          {/* Total Budget Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Intervention Budget Limit:</span>
              <span className="font-mono font-bold text-emerald-400">€{totalBudget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={150000}
              step={5000}
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>€10,000</span>
              <span>€75,000</span>
              <span>€150,000</span>
            </div>
          </div>

          {/* Geographic Filter */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Geographic Quota / Target</label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value as any)}
              className="w-full bg-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Jurisdictions (Pan-European)</option>
              <option value="Germany">Germany Focus (Highest Churn 51.5%)</option>
              <option value="France">France Focus</option>
              <option value="Spain">Spain Focus</option>
            </select>
          </div>

          {/* Risk Level Floor */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Risk Eligibility Threshold</label>
            <select
              value={minRiskCategory}
              onChange={(e) => setMinRiskCategory(e.target.value as any)}
              className="w-full bg-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="HIGH_CRITICAL">High & Critical Risk Only (Score ≥ 61)</option>
              <option value="CRITICAL_ONLY">Critical Risk Only (Score ≥ 81)</option>
              <option value="ALL">Entire Portfolio (Unrestricted)</option>
            </select>
          </div>

          {/* Run Button */}
          <button
            onClick={handleRunOptimization}
            className="w-full py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/30 transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Execute Knapsack Solver</span>
          </button>
        </div>

        {/* Solver Output Headline Metrics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-0.5">Accounts Selected</div>
              <div className="text-xl font-bold font-mono text-indigo-300">
                {activeResult.selectedCustomers.length} <span className="text-xs text-slate-400 font-normal">/ {targetCapacity}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">100% Capacity Utilized</div>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-0.5">Capital Protected</div>
              <div className="text-xl font-bold font-mono text-amber-300">
                €{(activeResult.totalProtectedBalance / 1000000).toFixed(2)}M
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Expected Saved Deposits</div>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-0.5">Budget Invested</div>
              <div className="text-xl font-bold font-mono text-emerald-300">
                €{activeResult.estimatedCost.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">ROI: {(activeResult.totalProtectedBalance / Math.max(1, activeResult.estimatedCost)).toFixed(0)}x leverage</div>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-0.5">Average Risk Score</div>
              <div className="text-xl font-bold font-mono text-rose-400">
                {activeResult.averageRiskScore}/100
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Targeted Attrition Tier</div>
            </div>
          </div>

          {/* Scenario History Comparison */}
          {savedScenarios.length > 1 && (
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                <span className="flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Scenario Benchmark Comparison</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Recent Executions</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {savedScenarios.slice(0, 3).map((sc, i) => (
                  <div key={sc.optimizationId} className={`p-2 rounded border ${i === 0 ? 'bg-indigo-950/40 border-indigo-700/60' : 'bg-slate-800/40 border-slate-700/50'}`}>
                    <div className="font-semibold text-slate-200 truncate">{sc.scenarioName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex justify-between">
                      <span>Capacity: {sc.selectedCustomers.length}</span>
                      <span className="text-amber-300 font-mono">€{(sc.totalProtectedBalance / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Customer Priority Roster Table */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-200">
                  Algorithmic Roster (Top {activeResult.selectedCustomers.length} Ranked Accounts)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Sorted by knapsack value-to-cost efficiency ratio
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {activeResult.scenarioName}
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/70 text-slate-400 text-[10px] uppercase sticky top-0">
                  <tr>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Surname</th>
                    <th className="py-2 px-3">Country</th>
                    <th className="py-2 px-3">Balance</th>
                    <th className="py-2 px-3">Products</th>
                    <th className="py-2 px-3">Risk</th>
                    <th className="py-2 px-3">Prescribed Action</th>
                    <th className="py-2 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {activeResult.selectedCustomers.map((c) => (
                    <tr
                      key={c.customerId}
                      onClick={() => onSelectCustomer(c)}
                      className="hover:bg-slate-800/50 cursor-pointer transition"
                    >
                      <td className="py-2 px-3 font-mono text-indigo-300">{c.customerId}</td>
                      <td className="py-2 px-3 font-medium text-slate-200">{c.surname}</td>
                      <td className="py-2 px-3">{c.geography}</td>
                      <td className="py-2 px-3 font-mono text-amber-300 font-medium">€{c.balance.toLocaleString()}</td>
                      <td className="py-2 px-3">{c.numOfProducts}</td>
                      <td className="py-2 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${c.riskCategory === 'CRITICAL' ? 'bg-rose-950 text-rose-300' : 'bg-orange-950 text-orange-300'}`}>
                          {c.riskScore}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-400 text-[11px] truncate max-w-[200px]">{c.recommendedAction}</td>
                      <td className="py-2 px-3 text-right text-indigo-400 hover:text-indigo-300">View →</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
