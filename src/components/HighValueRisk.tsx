import React, { useState } from 'react';
import {
  Gem,
  Coins,
  AlertTriangle,
  Download,
  Filter,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { Customer } from '../types';
import { exportCustomersToCsv } from '../services/sheetsExportService';

interface HighValueRiskProps {
  customers?: Customer[];
  customerSample?: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onBulkAddToCrm: (customers: Customer[]) => void;
}

export const HighValueRisk: React.FC<HighValueRiskProps> = ({
  customers,
  customerSample,
  onSelectCustomer,
  onBulkAddToCrm,
}) => {
  const safeCustomers = customers || customerSample || [];
  const [minBalance, setMinBalance] = useState(100000);
  const [selectedCountry, setSelectedCountry] = useState('ALL');

  const highValueAtRisk = safeCustomers.filter(c => {
    if (c.balance < minBalance) return false;
    if (c.riskCategory !== 'CRITICAL' && c.riskCategory !== 'HIGH') return false;
    if (selectedCountry !== 'ALL' && c.geography !== selectedCountry) return false;
    return true;
  });

  const totalCapitalExposed = highValueAtRisk.reduce((acc, c) => acc + c.balance, 0);
  const avgBalance = highValueAtRisk.length > 0 ? totalCapitalExposed / highValueAtRisk.length : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
              PRIVATE BANKING & WEALTH RETENTION
            </span>
            <span className="text-xs text-slate-400">High Liquid Balances with Elevated Churn Risk</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">High-Value Depositor Risk Explorer</h1>
          <p className="text-xs text-slate-400">
            Dedicated monitoring of affluent depositors where relationship exit incurs acute liquidity outflow.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportCustomersToCsv(highValueAtRisk, 'BankGuard_High_Value_Risk.csv')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Roster CSV</span>
          </button>
          <button
            onClick={() => onBulkAddToCrm(highValueAtRisk.slice(0, 50))}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm shadow-indigo-600/30"
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-200" />
            <span>Assign Top 50 to Wealth Desk</span>
          </button>
        </div>
      </div>

      {/* Headline Exposure Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">High-Value At-Risk Accounts</div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {highValueAtRisk.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Liquid balance ≥ €{minBalance.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Total Capital Balance Exposed</div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            €{(totalCapitalExposed / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-slate-400 mt-1">High flight-risk capital exposure</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Average Depositor Balance</div>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            €{Math.round(avgBalance).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Requires Senior Banker contact</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Balance Threshold:</span>
          <select
            value={minBalance}
            onChange={(e) => setMinBalance(Number(e.target.value))}
            className="bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700"
          >
            <option value={80000}>≥ €80,000</option>
            <option value={100000}>≥ €100,000 (Affluent)</option>
            <option value={150000}>≥ €150,000 (Private Wealth)</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Country:</span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700"
          >
            <option value="ALL">All Countries</option>
            <option value="Germany">Germany (High Mobility)</option>
            <option value="France">France</option>
            <option value="Spain">Spain</option>
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Customer ID</th>
                <th className="py-2.5 px-3">Surname</th>
                <th className="py-2.5 px-3">Country</th>
                <th className="py-2.5 px-3">Age</th>
                <th className="py-2.5 px-3">Deposit Balance</th>
                <th className="py-2.5 px-3">Products</th>
                <th className="py-2.5 px-3">Activity</th>
                <th className="py-2.5 px-3">Risk Tier</th>
                <th className="py-2.5 px-3">Prescribed Action</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {highValueAtRisk.map((c) => (
                <tr
                  key={c.customerId}
                  onClick={() => onSelectCustomer(c)}
                  className="hover:bg-slate-800/50 cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 font-mono text-indigo-300 font-medium">{c.customerId}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-200">{c.surname}</td>
                  <td className="py-2.5 px-3">{c.geography}</td>
                  <td className="py-2.5 px-3">{c.age} yrs</td>
                  <td className="py-2.5 px-3 font-mono text-amber-300 font-bold">€{c.balance.toLocaleString()}</td>
                  <td className="py-2.5 px-3">{c.numOfProducts}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${c.isActiveMember ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      {c.isActiveMember ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${c.riskCategory === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-orange-950 text-orange-300 border border-orange-800'}`}>
                      {c.riskScore} ({c.riskCategory})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[220px]">{c.recommendedAction}</td>
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
