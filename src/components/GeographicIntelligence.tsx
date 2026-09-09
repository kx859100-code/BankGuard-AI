import React from 'react';
import { Globe2, TrendingDown, Coins, Users, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { GeographyChurnStat, Customer } from '../types';

interface GeographicIntelligenceProps {
  geoStats?: GeographyChurnStat[];
  customerSample?: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

export const GeographicIntelligence: React.FC<GeographicIntelligenceProps> = ({
  geoStats = [],
  customerSample = [],
  onSelectCustomer,
}) => {
  const safeGeoStats = geoStats || [];
  const safeCustomerSample = customerSample || [];
  const germanyCustomers = safeCustomerSample
    .filter(c => c.geography === 'Germany' && c.riskCategory === 'CRITICAL')
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              CROSS-BORDER JURISDICTIONAL INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400">Germany • France • Spain</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">Geographic Churn & Liquidity Disparity</h1>
          <p className="text-xs text-slate-400">
            Analysis of switching friction, regulatory structures, and capital concentration across European jurisdictions.
          </p>
        </div>
      </div>

      {/* Country Deep Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {geoStats.map((stat) => {
          const isGermany = stat.country === 'Germany';
          return (
            <div
              key={stat.country}
              className={`p-5 rounded-xl border flex flex-col justify-between ${
                isGermany
                  ? 'bg-rose-950/20 border-rose-800/80 shadow-lg shadow-rose-950/30'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Globe2 className={`w-5 h-5 ${isGermany ? 'text-rose-400' : 'text-slate-400'}`} />
                    <h2 className="text-base font-bold text-slate-100">{stat.country}</h2>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                    isGermany
                      ? 'bg-rose-950 text-rose-300 border border-rose-700'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {stat.churnRate}% Churn
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 my-4">
                  <div className="flex justify-between p-2 rounded bg-slate-800/40">
                    <span className="text-slate-400">Customer Base:</span>
                    <strong className="text-slate-100 font-mono">{stat.customerCount.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-800/40">
                    <span className="text-slate-400">Churned Customers:</span>
                    <strong className="text-rose-400 font-mono">{stat.churnedCount.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-800/40">
                    <span className="text-slate-400">Average Balance:</span>
                    <strong className="text-amber-300 font-mono">€{stat.averageBalance.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-800/40">
                    <span className="text-slate-400">High/Critical Risk Accounts:</span>
                    <strong className="text-rose-400 font-mono">{stat.highRiskCount}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                {isGermany ? (
                  <p className="text-rose-200/90 font-medium">
                    ⚠️ <strong>Extreme Attrition Disparity:</strong> 51.55% churn rate. German customers maintain higher liquid balances and exhibit high switching propensity across fintechs and direct banks.
                  </p>
                ) : stat.country === 'France' ? (
                  <p>
                    <strong>High Relationship Inertia:</strong> Only 10.16% churn. Anchored by regulated Livret A accounts and primary mortgage domicile requirements.
                  </p>
                ) : (
                  <p>
                    <strong>Moderate Stability:</strong> 10.38% churn. Consolidated banking market (Santander, BBVA, CaixaBank) with life-cycle account closures.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical German Accounts Table */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Priority High-Exposure German Accounts</span>
            </h2>
            <p className="text-xs text-slate-400">
              Due to Germany's 51.55% portfolio churn rate, these accounts require dedicated retention officer assignment.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/70 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Customer ID</th>
                <th className="py-2.5 px-3">Surname</th>
                <th className="py-2.5 px-3">Age</th>
                <th className="py-2.5 px-3">Balance</th>
                <th className="py-2.5 px-3">Products</th>
                <th className="py-2.5 px-3">Activity</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">Recommended Strategy</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {germanyCustomers.map((c) => (
                <tr
                  key={c.customerId}
                  onClick={() => onSelectCustomer(c)}
                  className="hover:bg-slate-800/50 cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 font-mono text-indigo-300 font-medium">{c.customerId}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">{c.surname}</td>
                  <td className="py-2.5 px-3">{c.age} yrs</td>
                  <td className="py-2.5 px-3 font-mono text-amber-300 font-medium">€{c.balance.toLocaleString()}</td>
                  <td className="py-2.5 px-3">{c.numOfProducts}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${c.isActiveMember ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      {c.isActiveMember ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-950 text-rose-300 border border-rose-800">
                      {c.riskScore}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[200px]">{c.recommendedAction}</td>
                  <td className="py-2.5 px-3 text-right text-indigo-400 hover:text-indigo-300">View 360° →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
