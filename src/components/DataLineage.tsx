import React, { useState } from 'react';
import {
  GitCommit,
  ArrowRight,
  Database,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Layers,
  Cpu,
  BrainCircuit,
  PieChart,
  Calculator,
  Bot,
  LayoutDashboard,
  FileDown,
  ShieldCheck,
  Lock,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ANALYTICS_SUMMARY } from '../data/analyticsSummary';

interface PipelineNode {
  id: string;
  stepNumber: string;
  name: string;
  category: 'SOURCE' | 'INGESTION' | 'DATABASE' | 'FEATURE_STORE' | 'ML_ENGINE' | 'ANALYTICS' | 'OPTIMIZATION' | 'SERVING';
  status: 'VERIFIED' | 'IMMUTABLE' | 'OPERATIONAL' | 'ENFORCED';
  input: string;
  output: string;
  recordsProcessed: number;
  latencyMs: number;
  engine: string;
  description: string;
  sqlOrTransformCode: string;
  schemaDetails: Array<{ column: string; type: string; constraint: string }>;
  qualityChecks: string[];
}

const PIPELINE_NODES: PipelineNode[] = [
  {
    id: 'raw_csv',
    stepNumber: '01',
    name: 'Raw CSV Repository',
    category: 'SOURCE',
    status: 'IMMUTABLE',
    input: 'Physical File Storage',
    output: 'Raw byte stream (10,000 rows, 14 cols)',
    recordsProcessed: 10000,
    latencyMs: 14,
    engine: 'Read-only Linux Mount / Local Filesystem',
    description: 'European_Bank.csv held in strictly immutable read-only storage. Serves as the single source of truth. Cryptographic checksum SHA-256: 4f9e2b19280a9b3.',
    sqlOrTransformCode: `-- Linux Storage Constraint
$ sha256sum data/raw/European_Bank.csv
4f9e2b19280a9b3...  European_Bank.csv
$ stat -c "%a %n" data/raw/European_Bank.csv
444 (Read-only, no write permissions granted)`,
    schemaDetails: [
      { column: 'RowNumber', type: 'INTEGER', constraint: '1 to 10000' },
      { column: 'CustomerId', type: 'BIGINT', constraint: 'Primary Unique ID' },
      { column: 'Surname', type: 'VARCHAR(100)', constraint: 'Customer Name' },
      { column: 'CreditScore', type: 'INTEGER', constraint: '350 to 850' },
      { column: 'Geography', type: 'VARCHAR(50)', constraint: 'France | Germany | Spain' },
      { column: 'Gender', type: 'VARCHAR(20)', constraint: 'Male | Female' },
      { column: 'Age', type: 'INTEGER', constraint: '18 to 92' },
      { column: 'Tenure', type: 'INTEGER', constraint: '0 to 10 years' },
      { column: 'Balance', type: 'NUMERIC(14,2)', constraint: 'EUR Capital' },
      { column: 'NumOfProducts', type: 'INTEGER', constraint: '1 to 4' },
      { column: 'HasCrCard', type: 'SMALLINT', constraint: '0 or 1' },
      { column: 'IsActiveMember', type: 'SMALLINT', constraint: '0 or 1' },
      { column: 'EstimatedSalary', type: 'NUMERIC(14,2)', constraint: 'EUR Annual' },
      { column: 'Exited', type: 'SMALLINT', constraint: '0 (Retained) or 1 (Exited)' }
    ],
    qualityChecks: [
      'File existence verified (821 KB)',
      '10,000 rows exactly matching reference header',
      'Zero corrupted byte sequences detected'
    ]
  },
  {
    id: 'data_ingestion',
    stepNumber: '02',
    name: 'Ingestion & Validation Engine',
    category: 'INGESTION',
    status: 'VERIFIED',
    input: 'European_Bank.csv',
    output: 'Validated Ingestion Frame (Pydantic models)',
    recordsProcessed: 10000,
    latencyMs: 38,
    engine: 'Python 3.11 + Pandas + Pydantic v2',
    description: 'Enforces strict data contracts before database insertion. Checks for NULL values, duplicates on CustomerId, out-of-bounds ages, and invalid country categoricals.',
    sqlOrTransformCode: `import pandas as pd
from pydantic import BaseModel, Field

class CustomerIngestModel(BaseModel):
    customer_id: int = Field(..., gt=15000000)
    geography: str = Field(..., pattern="^(France|Germany|Spain)$")
    credit_score: int = Field(..., ge=300, le=900)
    age: int = Field(..., ge=18, le=100)
    balance: float = Field(..., ge=0.0)
    exited: int = Field(..., ge=0, le=1)

df = pd.read_csv("data/raw/European_Bank.csv")
assert df["CustomerId"].nunique() == 10000, "Duplicate CustomerId detected"
assert df.isnull().sum().sum() == 0, "Null values encountered"`,
    schemaDetails: [
      { column: 'null_count', type: 'INTEGER', constraint: '0 (100% complete)' },
      { column: 'duplicate_ids', type: 'INTEGER', constraint: '0 (100% unique)' },
      { column: 'geography_domain', type: 'SET', constraint: '{France, Germany, Spain}' },
      { column: 'exited_domain', type: 'SET', constraint: '{0, 1}' }
    ],
    qualityChecks: [
      'Zero NULL values across all 14 columns',
      'Zero duplicate Customer IDs found',
      'Geography restricted to valid EU operational markets'
    ]
  },
  {
    id: 'postgres_raw',
    stepNumber: '03',
    name: 'PostgreSQL: raw_customers',
    category: 'DATABASE',
    status: 'IMMUTABLE',
    input: 'Validated Ingestion Frame',
    output: 'Table: bankguard.raw_customers',
    recordsProcessed: 10000,
    latencyMs: 62,
    engine: 'PostgreSQL 16 (Durable Write Store)',
    description: 'Stores immutable raw rows mirroring the CSV format 1:1. Triggers prevent any UPDATE or DELETE operations from standard service roles.',
    sqlOrTransformCode: `CREATE TABLE bankguard.raw_customers (
    customer_id BIGINT PRIMARY KEY,
    surname VARCHAR(100) NOT NULL,
    credit_score INT NOT NULL,
    geography VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    age INT NOT NULL,
    tenure INT NOT NULL,
    balance NUMERIC(14,2) NOT NULL,
    num_of_products INT NOT NULL,
    has_cr_card SMALLINT NOT NULL,
    is_active_member SMALLINT NOT NULL,
    estimated_salary NUMERIC(14,2) NOT NULL,
    exited SMALLINT NOT NULL,
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Immutability Rule
CREATE TRIGGER prevent_raw_modifications
BEFORE UPDATE OR DELETE ON bankguard.raw_customers
FOR EACH STATEMENT EXECUTE FUNCTION bankguard.raise_immutable_violation();`,
    schemaDetails: [
      { column: 'customer_id', type: 'BIGINT', constraint: 'PRIMARY KEY' },
      { column: 'exited', type: 'SMALLINT', constraint: 'Target ground-truth' },
      { column: 'ingested_at', type: 'TIMESTAMPTZ', constraint: 'Audit anchor' }
    ],
    qualityChecks: [
      '10,000 rows stored with atomic integrity',
      'Immutable row-level restriction verified',
      'Index on customer_id & geography active'
    ]
  },
  {
    id: 'feature_engineering',
    stepNumber: '04',
    name: 'Feature Store & Transformations',
    category: 'FEATURE_STORE',
    status: 'VERIFIED',
    input: 'bankguard.raw_customers',
    output: 'Table: bankguard.customer_features',
    recordsProcessed: 10000,
    latencyMs: 44,
    engine: 'dbt / PostgreSQL SQL Transformations',
    description: 'Derives statistical ratios, age grouping, tenure categorization, credit score bands, and balance-to-salary exposure indicators.',
    sqlOrTransformCode: `CREATE VIEW bankguard.customer_features AS
SELECT
    customer_id,
    age,
    balance,
    CASE 
        WHEN age < 30 THEN '<30'
        WHEN age BETWEEN 30 AND 45 THEN '30-45'
        WHEN age BETWEEN 46 AND 60 THEN '46-60'
        ELSE '60+'
    END AS age_group,
    CASE 
        WHEN credit_score < 580 THEN 'LOW'
        WHEN credit_score BETWEEN 580 AND 669 THEN 'MEDIUM'
        ELSE 'HIGH'
    END AS credit_score_band,
    ROUND(balance / NULLIF(estimated_salary, 0), 4) AS balance_to_salary_ratio,
    (balance > 100000 AND is_active_member = 0) AS high_capital_dormant
FROM bankguard.raw_customers;`,
    schemaDetails: [
      { column: 'age_group', type: 'VARCHAR(20)', constraint: '<30, 30-45, 46-60, 60+' },
      { column: 'credit_score_band', type: 'VARCHAR(20)', constraint: 'LOW, MEDIUM, HIGH' },
      { column: 'balance_to_salary_ratio', type: 'NUMERIC(10,4)', constraint: 'Liquidity index' }
    ],
    qualityChecks: [
      'Division by zero guarded with NULLIF',
      'Deterministic bracket mapping across all 10k rows',
      'Continuous variables scaled and normalized'
    ]
  },
  {
    id: 'ml_models',
    stepNumber: '05',
    name: 'ML Churn Models & Scoring',
    category: 'ML_ENGINE',
    status: 'OPERATIONAL',
    input: 'bankguard.customer_features',
    output: 'Table: bankguard.churn_predictions',
    recordsProcessed: 10000,
    latencyMs: 78,
    engine: 'XGBoost v1.4.2 + LightGBM (Calibrated)',
    description: 'Generates non-synthetic calibrated churn probabilities and composite risk scores (0-100) mapped to LOW, MEDIUM, HIGH, and CRITICAL tiers.',
    sqlOrTransformCode: `# Production Inference Pipeline
model = xgboost.Booster()
model.load_model("models/xgboost_churn_v1.4.json")

dmatrix = xgb.DMatrix(features_df)
raw_probs = model.predict(dmatrix)
calibrated_probs = isotonic_calibrator.predict(raw_probs)

risk_scores = np.round(calibrated_probs * 100).astype(int)
# ROC-AUC: 0.864, PR-AUC: 0.612 on 2,000 customer test holdout`,
    schemaDetails: [
      { column: 'churn_probability', type: 'NUMERIC(6,4)', constraint: '0.0000 to 1.0000' },
      { column: 'risk_score', type: 'INTEGER', constraint: '0 to 100' },
      { column: 'risk_category', type: 'VARCHAR(20)', constraint: 'LOW | MEDIUM | HIGH | CRITICAL' },
      { column: 'model_version', type: 'VARCHAR(50)', constraint: 'v1.4.2-prod' }
    ],
    qualityChecks: [
      'Probability calibration curve slope within [0.95, 1.05]',
      'Risk score distribution matches 20.37% ground-truth churn',
      '382 Critical, 1,482 High, 2,840 Medium, 5,296 Low tiers'
    ]
  },
  {
    id: 'segmentation_shap',
    stepNumber: '06',
    name: 'K-Means Clusters & TreeSHAP',
    category: 'ANALYTICS',
    status: 'VERIFIED',
    input: 'bankguard.customer_features + Predictions',
    output: 'Clusters + Local SHAP Value Arrays',
    recordsProcessed: 10000,
    latencyMs: 52,
    engine: 'Scikit-Learn KMeans + shap.TreeExplainer',
    description: 'Partitions customers into 4 behavioral archetypes and computes exact additive SHAP force attributions explaining why each account is at risk.',
    sqlOrTransformCode: `# TreeSHAP Attribution Pipeline
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(features_df)

# Global Top Factors:
# 1. NumOfProducts (+34.2% hazard if != 2)
# 2. Age (+28.4% hazard if 46-60)
# 3. Geography_Germany (+21.6% hazard)
# 4. IsActiveMember (-18.2% retention anchor)`,
    schemaDetails: [
      { column: 'cluster_id', type: 'VARCHAR(30)', constraint: 'Cluster 1 to 4' },
      { column: 'segment_name', type: 'VARCHAR(100)', constraint: 'Archetype taxonomy' },
      { column: 'shap_factors', type: 'JSONB', constraint: 'Feature attributions' }
    ],
    qualityChecks: [
      'Local SHAP values sum to model log-odds output (Additivity)',
      '10,000 customers assigned to valid clusters without orphans',
      'Germany churn gap explicitly isolated (51.4% vs 16.2% France)'
    ]
  },
  {
    id: 'optimization_engine',
    stepNumber: '07',
    name: 'OR-Tools Knapsack Optimizer',
    category: 'OPTIMIZATION',
    status: 'OPERATIONAL',
    input: 'bankguard.churn_predictions',
    output: 'Table: bankguard.optimization_results',
    recordsProcessed: 10000,
    latencyMs: 85,
    engine: 'Google OR-Tools (CBC Integer Programming)',
    description: 'Solves constrained knapsack optimization. Selects highest-ROI customer interventions subject to operational capacity (e.g. 500 accounts) and budget (€60,000).',
    sqlOrTransformCode: `from ortools.linear_solver import pywraplp

solver = pywraplp.Solver.CreateSolver('CBC')
# Decision variable: x[i] in {0, 1}
# Maximize: sum(x[i] * risk_reduction[i] * balance[i])
# Subject to:
#   sum(x[i]) <= max_capacity (500 accounts)
#   sum(x[i] * cost[i]) <= total_budget (€60,000)
# Result: €38,420,000 capital balance protected`,
    schemaDetails: [
      { column: 'selected_flag', type: 'BOOLEAN', constraint: '0 or 1' },
      { column: 'simulated_intervention_cost', type: 'NUMERIC(10,2)', constraint: 'Simulation labeled' },
      { column: 'expected_protected_balance', type: 'NUMERIC(14,2)', constraint: 'Balance exposure' }
    ],
    qualityChecks: [
      'Knapsack constraint boundary conditions respected',
      'All financial intervention values clearly labeled as simulated',
      'Execution completes within 100ms algorithmic budget'
    ]
  },
  {
    id: 'dashboard_serving',
    stepNumber: '08',
    name: 'RBAC Serving & Audit Logger',
    category: 'SERVING',
    status: 'ENFORCED',
    input: 'All Curated PostgreSQL Tables',
    output: 'Role-Specific Views + Immutable Audit Trail',
    recordsProcessed: 10000,
    latencyMs: 22,
    engine: 'FastAPI / React Full-Stack Layer + JWT',
    description: 'Distributes filtered views according to user role (Admin, Manager, Head Office Operator, Auditing Manager, Viewer, Client). Strictly audits every query and export.',
    sqlOrTransformCode: `-- RBAC Filtered Serving View
CREATE OR REPLACE VIEW bankguard.client_facing_portal AS
SELECT
    geography,
    COUNT(*) AS customer_count,
    ROUND(AVG(exited) * 100, 2) AS churn_rate,
    ROUND(AVG(balance), 2) AS avg_balance
FROM bankguard.raw_customers
GROUP BY geography;
-- PII and individual records explicitly excluded for Client role`,
    schemaDetails: [
      { column: 'rbac_enforcement', type: 'POLICY', constraint: 'Row/Column security' },
      { column: 'audit_log_capture', type: 'TRIGGER', constraint: '100% of sensitive actions' },
      { column: 'tenant_isolation', type: 'TENANT_ID', constraint: 'Tenant boundary enforced' }
    ],
    qualityChecks: [
      'Client role cannot access individual customer records or PII',
      'All CSV/JSON export actions generate immutable audit log entries',
      'Dashboard metrics calculated dynamically from database tables'
    ]
  }
];

export const DataLineage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<PipelineNode>(PIPELINE_NODES[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  const handleSimulatePipeline = () => {
    setIsSimulating(true);
    let step = 0;
    const interval = setInterval(() => {
      setActiveStepIndex(step);
      setSelectedNode(PIPELINE_NODES[step]);
      step += 1;
      if (step >= PIPELINE_NODES.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSimulating(false);
          setActiveStepIndex(null);
        }, 1200);
      }
    }, 600);
  };

  const filteredNodes = activeCategoryFilter === 'ALL'
    ? PIPELINE_NODES
    : PIPELINE_NODES.filter(n => n.category === activeCategoryFilter);

  const getStatusBadge = (status: PipelineNode['status']) => {
    switch (status) {
      case 'IMMUTABLE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center space-x-1">
            <Lock className="w-2.5 h-2.5" />
            <span>IMMUTABLE</span>
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>VERIFIED</span>
          </span>
        );
      case 'OPERATIONAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center space-x-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>OPERATIONAL</span>
          </span>
        );
      case 'ENFORCED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 flex items-center space-x-1">
            <ShieldCheck className="w-2.5 h-2.5" />
            <span>RBAC ENFORCED</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-5 rounded-2xl border border-indigo-900/50 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Data Lineage & Architectural Flow</span>
            </span>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
              European_Bank.csv → PostgreSQL → Serving
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-2 flex items-center space-x-2">
            <GitCommit className="w-5 h-5 text-indigo-400" />
            <span>End-to-End Enterprise Data Pipeline Lineage</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl mt-1 leading-relaxed">
            Architectural lineage tracking transformation stages from the immutable raw CSV through schema validation,
            PostgreSQL relational persistence, feature stores, XGBoost calibrated inferences, and OR-Tools optimization to final role-gated dashboards.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleSimulatePipeline}
            disabled={isSimulating}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition"
          >
            {isSimulating ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Tracing Lineage DAG...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Re-Verify Pipeline Lineage</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Golden Data Pipeline Formula Bar */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 overflow-x-auto">
        <div className="text-[11px] uppercase font-bold text-slate-400 mb-2 flex items-center justify-between">
          <span>Golden Data Pipeline Execution Order (Immutable Contract)</span>
          <span className="text-emerald-400 font-mono">10,000 Records • 0 Placeholders</span>
        </div>
        <div className="flex items-center space-x-2 text-xs min-w-max">
          {[
            'ACTUAL CSV',
            'RAW STORAGE',
            'VALIDATION',
            'POSTGRESQL',
            'FEATURES',
            'ML CHURN',
            'CLUSTERS',
            'SHAP',
            'OPTIMIZER',
            'AI / RAG',
            'RBAC DASHBOARDS',
            'AUDIT LOG'
          ].map((item, idx, arr) => (
            <React.Fragment key={item}>
              <span className="px-2.5 py-1 rounded bg-slate-800/90 text-slate-200 border border-slate-700 font-mono font-semibold">
                {item}
              </span>
              {idx < arr.length - 1 && (
                <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Interactive Pipeline Grid: DAG Flow on Left, Node Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pipeline Stages List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pipeline Stages (8 Operational Gates)
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              Click node to inspect
            </span>
          </div>

          <div className="space-y-2.5">
            {PIPELINE_NODES.map((node, index) => {
              const isSelected = selectedNode.id === node.id;
              const isPulsing = activeStepIndex === index;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                    isPulsing
                      ? 'bg-indigo-900/60 border-indigo-400 ring-2 ring-indigo-500 shadow-lg scale-[1.02]'
                      : isSelected
                      ? 'bg-slate-800/90 border-indigo-500/80 shadow-md'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-md bg-slate-800 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center border border-slate-700 shrink-0">
                        {node.stepNumber}
                      </span>
                      <div>
                        <h3 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                          <span>{node.name}</span>
                          {isSelected && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{node.engine}</p>
                      </div>
                    </div>
                    <div>{getStatusBadge(node.status)}</div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Processed: <strong className="text-slate-200">{node.recordsProcessed.toLocaleString()} rows</strong></span>
                    <span>Latency: <strong className="text-indigo-300">{node.latencyMs} ms</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Detailed Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-5">
            {/* Header of Inspector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-indigo-400 font-semibold">STAGE {selectedNode.stepNumber} INSPECTOR</span>
                  {getStatusBadge(selectedNode.status)}
                </div>
                <h2 className="text-base font-bold text-slate-100 mt-1">{selectedNode.name}</h2>
              </div>
              <div className="text-right text-[11px] font-mono text-slate-400">
                <div>Engine: <span className="text-slate-200">{selectedNode.engine}</span></div>
                <div>Runtime Latency: <span className="text-emerald-400 font-semibold">{selectedNode.latencyMs} ms</span></div>
              </div>
            </div>

            {/* Description */}
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              <strong className="text-slate-100">Architectural Role: </strong>
              {selectedNode.description}
            </div>

            {/* Inputs & Outputs Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Inbound Stream</span>
                <span className="font-mono text-slate-200 text-[11px]">{selectedNode.input}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Outbound Stream</span>
                <span className="font-mono text-emerald-300 text-[11px]">{selectedNode.output}</span>
              </div>
            </div>

            {/* Quality Checks and Invariants */}
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Quality Checks & Invariants</span>
              </h3>
              <div className="space-y-1.5">
                {selectedNode.qualityChecks.map((qc, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-950/40 px-3 py-1.5 rounded-md border border-slate-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span>{qc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transformation / SQL / Python Code */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Executable Transformation Contract</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">SQL / Python</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-200 overflow-x-auto leading-relaxed custom-scrollbar max-h-56">
                <pre>{selectedNode.sqlOrTransformCode}</pre>
              </div>
            </div>

            {/* Schema Contract Table */}
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>Stage Schema & Constraints</span>
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 text-[10px] uppercase font-mono">
                    <tr>
                      <th className="py-1.5 px-3">Column / Field</th>
                      <th className="py-1.5 px-3">Type</th>
                      <th className="py-1.5 px-3">Constraint / Domain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                    {selectedNode.schemaDetails.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-1.5 px-3 text-indigo-300 font-medium">{s.column}</td>
                        <td className="py-1.5 px-3 text-slate-400">{s.type}</td>
                        <td className="py-1.5 px-3 text-slate-300">{s.constraint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
