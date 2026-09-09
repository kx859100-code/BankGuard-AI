import React, { useState } from 'react';
import {
  PieChart as PieChartIcon,
  Users,
  TrendingDown,
  Coins,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers
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
import { CustomerSegment, Customer } from '../types';

interface CustomerSegmentationProps {
  segments?: CustomerSegment[];
  customerSample?: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

export const CustomerSegmentation: React.FC<CustomerSegmentationProps> = ({
  segments = [],
  customerSample = [],
  onSelectCustomer,
}) => {
  const [selectedClusterId, setSelectedClusterId] = useState<string>('cluster_4');

  const safeSegments = segments || [];
  const safeCustomerSample = customerSample || [];
  const selectedSegment = safeSegments.find(s => s.clusterId === selectedClusterId) || safeSegments[0] || {
    clusterId: 'cluster_4',
    name: 'At-Risk Affluent Seniors',
    size: 2150,
    churnRate: 54.8,
    avgBalance: 128400,
    avgAge: 52.4,
    description: 'High balance depositors in Germany and France',
    primaryRiskFactors: ['Age > 50', 'Germany residency'],
    recommendedRetentionPlaybook: 'Senior Wealth Concierge & Capital Guarantee Booster'
  };
  const clusterCustomers = safeCustomerSample.filter(c => c.clusterId === selectedClusterId).slice(0, 10);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              K-MEANS CLUSTERING & BEHAVIORAL ARCHETYPES
            </span>
            <span className="text-xs text-slate-400">Multi-Dimensional Behavioral Segmentation</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">Customer Archetypes & Strategic Segments</h1>
          <p className="text-xs text-slate-400">
            Categorization across product complexity, engagement dormancy, demographic life stages, and deposit liquidity.
          </p>
        </div>
      </div>

      {/* Cluster Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {segments.map((seg) => {
          const isSelected = seg.clusterId === selectedClusterId;
          return (
            <div
              key={seg.clusterId}
              onClick={() => setSelectedClusterId(seg.clusterId)}
              className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                    {seg.clusterId}
                  </span>
                  <span className={`text-xs font-bold font-mono ${seg.churnRate > 50 ? 'text-rose-400' : seg.churnRate > 20 ? 'text-orange-400' : 'text-emerald-400'}`}>
                    {seg.churnRate}% Churn
                  </span>
                </div>
                <h2 className="text-sm font-bold text-slate-100 mb-1">{seg.name}</h2>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{seg.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Customer Count:</span>
                  <strong className="text-slate-200">{seg.customerCount.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Avg Balance:</span>
                  <strong className="text-amber-300 font-mono">€{seg.averageBalance.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Segment Deep Dive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Cluster Details & Retention Playbook */}
        <div className="lg:col-span-1 bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Active Archetype Deep-Dive</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-100">{selectedSegment.name}</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {selectedSegment.description}
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Prescribed Intervention Strategy
            </h3>
            <div className="text-sm font-bold text-amber-300">
              {selectedSegment.recommendedAction}
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between p-2 rounded bg-slate-800/40">
              <span>Observed Churn Rate:</span>
              <strong className="text-rose-400 font-mono">{selectedSegment.churnRate}%</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-800/40">
              <span>Segment Population:</span>
              <strong className="text-slate-100 font-mono">{selectedSegment.customerCount.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-800/40">
              <span>Observed Churned Accounts:</span>
              <strong className="text-rose-400 font-mono">{selectedSegment.churnedCount.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-800/40">
              <span>Average Liquid Deposit:</span>
              <strong className="text-amber-300 font-mono">€{selectedSegment.averageBalance.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Cluster Comparison Chart & Sample Accounts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Chart */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300 mb-3">
              Comparative Churn Rate by Customer Archetype (%)
            </h3>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segments} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} />
                  <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }}
                    formatter={(val: any) => [`${val}%`, 'Churn Rate']}
                  />
                  <Bar dataKey="churnRate" name="Churn Rate" fill="#6366f1" radius={[4, 4, 0, 0]}>
                    {segments.map((s, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={s.clusterId === selectedClusterId ? '#ec4899' : s.churnRate > 50 ? '#e11d48' : '#6366f1'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Representative Accounts Table */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-200">
                Representative Accounts in "{selectedSegment.name}"
              </h3>
              <span className="text-[11px] text-slate-400">Click row for Customer 360° Profile</span>
            </div>

            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/70 text-slate-400 text-[10px] uppercase sticky top-0">
                  <tr>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Surname</th>
                    <th className="py-2 px-3">Country</th>
                    <th className="py-2 px-3">Age</th>
                    <th className="py-2 px-3">Balance</th>
                    <th className="py-2 px-3">Products</th>
                    <th className="py-2 px-3">Risk Tier</th>
                    <th className="py-2 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {clusterCustomers.map((c) => (
                    <tr
                      key={c.customerId}
                      onClick={() => onSelectCustomer(c)}
                      className="hover:bg-slate-800/50 cursor-pointer transition"
                    >
                      <td className="py-2 px-3 font-mono text-indigo-300">{c.customerId}</td>
                      <td className="py-2 px-3 font-medium text-slate-200">{c.surname}</td>
                      <td className="py-2 px-3">{c.geography}</td>
                      <td className="py-2 px-3">{c.age}</td>
                      <td className="py-2 px-3 font-mono text-amber-300">€{c.balance.toLocaleString()}</td>
                      <td className="py-2 px-3">{c.numOfProducts}</td>
                      <td className="py-2 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${c.riskCategory === 'CRITICAL' ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-300'}`}>
                          {c.riskScore}
                        </span>
                      </td>
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
