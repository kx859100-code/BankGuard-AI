import React from 'react';
import {
  Database,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  AlertCircle,
  Clock,
  Layers,
  FileText
} from 'lucide-react';

export const DataQualityCenter: React.FC = () => {
  const schemaColumns = [
    { name: 'Year', type: 'INTEGER', nulls: 0, distinct: 1, range: '2025', status: 'VALID' },
    { name: 'CustomerId', type: 'INTEGER (PK)', nulls: 0, distinct: 10000, range: '15565701 - 15815690', status: 'UNIQUE' },
    { name: 'Surname', type: 'VARCHAR(100)', nulls: 0, distinct: 2932, range: 'A - Z', status: 'VALID' },
    { name: 'CreditScore', type: 'INTEGER', nulls: 0, distinct: 460, range: '350 - 850', status: 'VALID' },
    { name: 'Geography', type: 'VARCHAR(50)', nulls: 0, distinct: 3, range: 'France, Germany, Spain', status: 'VALID' },
    { name: 'Gender', type: 'VARCHAR(20)', nulls: 0, distinct: 2, range: 'Female, Male', status: 'VALID' },
    { name: 'Age', type: 'INTEGER', nulls: 0, distinct: 70, range: '18 - 92 yrs', status: 'VALID' },
    { name: 'Tenure', type: 'INTEGER', nulls: 0, distinct: 11, range: '0 - 10 yrs', status: 'VALID' },
    { name: 'Balance', type: 'NUMERIC(15,2)', nulls: 0, distinct: 6382, range: '€0.00 - €250,898.09', status: 'VALID' },
    { name: 'NumOfProducts', type: 'INTEGER', nulls: 0, distinct: 4, range: '1, 2, 3, 4', status: 'VALID' },
    { name: 'HasCrCard', type: 'SMALLINT', nulls: 0, distinct: 2, range: '0 or 1', status: 'VALID' },
    { name: 'IsActiveMember', type: 'SMALLINT', nulls: 0, distinct: 2, range: '0 or 1', status: 'VALID' },
    { name: 'EstimatedSalary', type: 'NUMERIC(15,2)', nulls: 0, distinct: 9999, range: '€11.58 - €199,992.48', status: 'VALID' },
    { name: 'Exited', type: 'SMALLINT (TARGET)', nulls: 0, distinct: 2, range: '0 (Retained) / 1 (Churned)', status: 'VALID' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>DATA GOVERNANCE & LINEAGE AUDIT</span>
            </span>
            <span className="text-xs text-slate-400">100% Immutable Ground Truth</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">Data Quality, Schema Integrity & Lineage</h1>
          <p className="text-xs text-slate-400">
            Automated schema validation, missingness audit, duplicate checks, and end-to-end data provenance tracking.
          </p>
        </div>
      </div>

      {/* Quality Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Completeness Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">100.0%</div>
          <div className="text-[11px] text-slate-400 mt-1">0 missing in 140,000 cells</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Primary Key Integrity</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">0 Duplicates</div>
          <div className="text-[11px] text-slate-400 mt-1">10,000 unique Customer IDs</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Schema Conformance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-300">14 / 14 Passed</div>
          <div className="text-[11px] text-slate-400 mt-1">Strict type checking verified</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Target Class Ratio</span>
            <CheckCircle2 className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">20.37% Exited</div>
          <div className="text-[11px] text-slate-400 mt-1">2,037 Churned / 7,963 Retained</div>
        </div>
      </div>

      {/* End-to-End Data Lineage Graph */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Architectural Lineage Pipeline (Immutable Source → Processed Storage)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-300">1. Raw Ground Truth</div>
            <div className="text-[11px] text-slate-400 font-mono">data/raw/European_Bank.csv</div>
            <p className="text-[10px] text-slate-400 mt-1">
              Read-only immutable storage. Contains 10,000 genuine customer banking records.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-300">2. Data Ingestion & Quality</div>
            <div className="text-[11px] text-slate-400 font-mono">Python 3 + Pandas</div>
            <p className="text-[10px] text-slate-400 mt-1">
              Schema parsing, range checking, null audit, and outlier verification.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-300">3. Processed Storage Layer</div>
            <div className="text-[11px] text-slate-400 font-mono">PostgreSQL / JSON Store</div>
            <p className="text-[10px] text-slate-400 mt-1">
              Clean relational schema, derived segments (AgeGroup, BalanceBand), and indexing.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-slate-300">4. Decision Intelligence</div>
            <div className="text-[11px] text-slate-400 font-mono">XGBoost + OR-Tools + RAG</div>
            <p className="text-[10px] text-slate-400 mt-1">
              TreeSHAP scoring, knapsack optimization, and Google Sheets bidirectional sync.
            </p>
          </div>
        </div>
      </div>

      {/* Schema Audit Table */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Dataset Schema & Column-Level Validation Report</span>
          </h2>
          <p className="text-xs text-slate-400">
            Validated against European Banking Authority and internal quantitative data standards
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Column Name</th>
                <th className="py-2.5 px-3">SQL Data Type</th>
                <th className="py-2.5 px-3">Missing Cells</th>
                <th className="py-2.5 px-3">Distinct Values</th>
                <th className="py-2.5 px-3">Verified Range</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {schemaColumns.map((col, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-200">{col.name}</td>
                  <td className="py-2.5 px-3 font-mono text-indigo-300">{col.type}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400">{col.nulls}</td>
                  <td className="py-2.5 px-3 font-mono">{col.distinct.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">{col.range}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-700">
                      {col.status}
                    </span>
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
