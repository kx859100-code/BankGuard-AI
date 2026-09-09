import React from 'react';
import {
  BrainCircuit,
  Award,
  CheckCircle2,
  TrendingUp,
  Activity,
  Cpu,
  BarChart3,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { GlobalShapItem, ModelComparison } from '../types';

interface ChurnIntelligenceProps {
  globalShap: GlobalShapItem[];
  models: ModelComparison[];
}

export const ChurnIntelligence: React.FC<ChurnIntelligenceProps> = ({
  globalShap,
  models,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              MLOps & EXPLAINABLE AI CENTER
            </span>
            <span className="text-xs text-slate-400">TreeSHAP Global Feature Importance & Model Registry</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">Churn Intelligence & Predictive Model Governance</h1>
          <p className="text-xs text-slate-400">
            Audit model rankings, ROC-AUC curves, precision-recall tradeoffs, and global factor attribution.
          </p>
        </div>
      </div>

      {/* Global SHAP Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Global TreeSHAP Feature Attributions</span>
              </h2>
              <p className="text-xs text-slate-400">
                Normalized mean absolute SHAP value impact across portfolio predictions
              </p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              Model: XGBoost v1.4
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={globalShap}
                margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} domain={[0, 0.4]} />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                  formatter={(val: any) => [`${val} mean |SHAP|`, 'Importance']}
                />
                <Bar dataKey="importance" name="Mean |SHAP|" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  {globalShap.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#ec4899' : index === 1 ? '#e11d48' : index === 2 ? '#f59e0b' : '#6366f1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Descriptions Card */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Behavioral Risk Interpretation
            </h3>
            <div className="space-y-2.5">
              {globalShap.slice(0, 5).map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>{item.feature}</span>
                    <span className="font-mono text-indigo-400 text-[11px]">{item.importance}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.direction}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <strong>Audit Guarantee:</strong> Calculations derived deterministically from the 14 attributes in <code className="text-slate-300 font-mono">European_Bank.csv</code>.
          </div>
        </div>
      </div>

      {/* Model Benchmark & Governance Registry */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Model Comparison & Validation Registry</span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluated on 80/20 stratified split against ground truth `Exited` label
            </p>
          </div>
          <span className="text-xs text-emerald-400 flex items-center space-x-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>XGBoost Champion Live</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Model Architecture</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">ROC-AUC</th>
                <th className="py-2.5 px-3">PR-AUC</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Precision</th>
                <th className="py-2.5 px-3">Recall</th>
                <th className="py-2.5 px-3">F1 Score</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3">Governance Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {models.map((m, idx) => (
                <tr key={idx} className={m.status.includes('CHAMPION') ? 'bg-indigo-950/20' : 'hover:bg-slate-800/40'}>
                  <td className="py-3 px-3 font-semibold text-slate-200">
                    <div className="flex items-center space-x-2">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{m.modelName}</span>
                      <span className="font-mono text-[10px] text-slate-400">({m.version})</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      m.status.includes('CHAMPION')
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : m.status.includes('SHADOW')
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-indigo-300">{m.rocAuc}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{m.prAuc}</td>
                  <td className="py-3 px-3 font-mono">{m.accuracy}%</td>
                  <td className="py-3 px-3 font-mono text-emerald-400">{m.precision}%</td>
                  <td className="py-3 px-3 font-mono text-amber-300">{m.recall}%</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-100">{m.f1Score}%</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{m.latencyMs}ms</td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] max-w-[240px] truncate" title={m.notes}>
                    {m.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
