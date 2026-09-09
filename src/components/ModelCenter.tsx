import React, { useState } from 'react';
import {
  BrainCircuit,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Play,
  History,
  ShieldCheck,
  Cpu,
  TrendingUp,
  BarChart3,
  Layers,
  FileCode,
  Clock
} from 'lucide-react';
import { ModelComparison, GlobalShapItem, ModelTrainingRun } from '../types';

interface ModelCenterProps {
  models: ModelComparison[];
  globalShap: GlobalShapItem[];
  onInitiateRetraining: (modelName: string) => void;
  trainingRuns?: ModelTrainingRun[];
  isRetrainingActive?: boolean;
}

export const ModelCenter: React.FC<ModelCenterProps> = ({
  models = [],
  globalShap = [],
  onInitiateRetraining,
  trainingRuns = [],
  isRetrainingActive = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState('XGBoost Churn Classifier');

  const handleConfirmRetrain = () => {
    onInitiateRetraining(selectedModel);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              MLOps & GOVERNANCE
            </span>
            <span className="text-xs text-slate-400">Model Registry & Training Orchestration</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">Model Center & Lifecycle Management</h1>
          <p className="text-xs text-slate-400">
            Production model registry, performance metrics, SHAP feature importance, and model retraining workflow triggers.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={isRetrainingActive}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
            isRetrainingActive
              ? 'bg-amber-950 text-amber-300 border border-amber-800 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrainingActive ? 'animate-spin text-amber-400' : ''}`} />
          <span>{isRetrainingActive ? 'Training Workflow Initiated...' : 'Initiate Model Retraining'}</span>
        </button>
      </div>

      {/* Production Champion Model Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 p-5 rounded-2xl border border-indigo-900/50 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Production Champion Model</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-mono text-slate-300">XGBoost v1.4.2</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1">European Retail Banking Churn Predictor</h2>
            <p className="text-xs text-slate-400">
              Trained on 10,000 ground truth banking records. Validated via Stratified 5-Fold Cross Validation.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">ROC-AUC</span>
              <span className="text-emerald-400 font-bold text-sm">0.864</span>
            </div>
            <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">PR-AUC</span>
              <span className="text-indigo-400 font-bold text-sm">0.738</span>
            </div>
            <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">F1-SCORE</span>
              <span className="text-amber-400 font-bold text-sm">0.684</span>
            </div>
            <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">INFERENCE</span>
              <span className="text-slate-300 font-bold text-sm">1.8ms</span>
            </div>
          </div>
        </div>

        {/* Model Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Training Source</span>
            <span className="text-slate-200 font-mono">European_Bank.csv</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Last Training Run</span>
            <span className="text-slate-200 font-mono">2026-09-08T18:42:10Z</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Governance Standard</span>
            <span className="text-slate-200">EBA AI Ethics / BCBS 239</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Feature Count</span>
            <span className="text-slate-200 font-mono">18 Engineered Features</span>
          </div>
        </div>
      </div>

      {/* Model Benchmark Comparison Table */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Model Benchmark Comparison</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Model Architecture</th>
                <th className="py-2.5 px-3">Version</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">ROC-AUC</th>
                <th className="py-2.5 px-3">PR-AUC</th>
                <th className="py-2.5 px-3">Precision</th>
                <th className="py-2.5 px-3">Recall</th>
                <th className="py-2.5 px-3">F1 Score</th>
                <th className="py-2.5 px-3">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {models.map((m) => (
                <tr key={m.modelName} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-semibold text-slate-100">{m.modelName}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{m.version}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      m.status === 'PRODUCTION'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">{m.rocAuc.toFixed(3)}</td>
                  <td className="py-2.5 px-3 font-mono text-indigo-400">{m.prAuc.toFixed(3)}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{(m.precision * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{(m.recall * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{(m.f1Score * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{m.latencyMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global TreeSHAP Feature Attribution */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Global TreeSHAP Feature Importance (Explainable AI Ground Truth)</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Mean Absolute SHAP Value</span>
        </div>
        <p className="text-xs text-slate-400">
          Quantifies how much each European banking feature changes the model's prediction on average across the 10,000 customers.
        </p>

        <div className="space-y-3">
          {globalShap.map((item, idx) => (
            <div key={item.feature} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center space-x-2">
                  <span className="text-slate-500 font-mono text-[10px]">#{idx + 1}</span>
                  <span>{item.feature}</span>
                </span>
                <span className="font-mono text-slate-400 font-semibold">{item.importance.toFixed(3)} SHAP Impact</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, item.importance * 300)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Retraining History Log */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>Model Retraining Audit History</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Immutable Log</span>
        </div>

        <div className="space-y-2">
          {trainingRuns.length > 0 ? (
            trainingRuns.map(run => (
              <div key={run.runId} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-slate-200 font-bold">{run.modelName} ({run.version})</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {run.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Initiated by {run.initiatedBy} • {run.datasetVersion} ({run.trainingSamples} samples)
                  </div>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-400">
                  {run.initiatedAt}
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 text-xs text-slate-400">
              No recent manual retraining triggers executed in this session.
            </div>
          )}
        </div>
      </div>

      {/* Retraining Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Initiate Model Retraining?</h3>
                <p className="text-xs text-slate-400">Governance & MLOps Trigger</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <p>
                This will trigger an immutable training workflow in the background:
              </p>
              <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-1">
                <li>Input Data: <strong className="text-slate-200">European_Bank.csv (10,000 records)</strong></li>
                <li>Target Model: <strong className="text-indigo-300">XGBoost Churn Classifier v1.5 Candidate</strong></li>
                <li>Validation: <strong className="text-slate-200">5-Fold Cross Validation + SHAP evaluation</strong></li>
                <li>Audit: An immutable <strong className="text-emerald-400">MODEL_RETRAINING_INITIATED</strong> audit event will be logged for the Auditing Manager.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRetrain}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start Training</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
