import React, { useState } from 'react';
import {
  ShieldCheck,
  Bot,
  FileSpreadsheet,
  Database,
  Bell,
  Search,
  Users,
  CheckCircle2,
  Sparkles,
  Lock,
  UserCheck,
  Layers,
  Cpu,
  Building2,
  ArrowDownToLine
} from 'lucide-react';
import { ActiveTab, Role, Customer, CRMCase, AuditLog, ModelTrainingRun, CRMStatus } from './types';
import { ANALYTICS_SUMMARY } from './data/analyticsSummary';
import { CUSTOMER_SAMPLE } from './data/customerSample';
import {
  exportDatasetToJson,
  exportAuditLogsToJson,
  exportExecutiveSummaryToCsv
} from './services/sheetsExportService';

// Components
import { Navigation } from './components/Navigation';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { CustomerExplorer } from './components/CustomerExplorer';
import { RetentionOptimizer } from './components/RetentionOptimizer';
import { CustomerSegmentation } from './components/CustomerSegmentation';
import { ChurnIntelligence } from './components/ChurnIntelligence';
import { GeographicIntelligence } from './components/GeographicIntelligence';
import { HighValueRisk } from './components/HighValueRisk';
import { AICopilot } from './components/AICopilot';
import { RAGAssistant } from './components/RAGAssistant';
import { CRMWorkflow } from './components/CRMWorkflow';
import { GoogleSheetsIntegration } from './components/GoogleSheetsIntegration';
import { DataQualityCenter } from './components/DataQualityCenter';
import { SecurityGovernance } from './components/SecurityGovernance';
import { Customer360Modal } from './components/Customer360Modal';
import { OperationsCenter } from './components/OperationsCenter';
import { ClientPortal } from './components/ClientPortal';
import { ModelCenter } from './components/ModelCenter';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>('Admin');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRetrainingActive, setIsRetrainingActive] = useState(false);

  // Model Training Runs
  const [trainingRuns, setTrainingRuns] = useState<ModelTrainingRun[]>([
    {
      runId: 'RUN-2025-0308-01',
      modelName: 'XGBoost Churn Classifier',
      version: 'v1.4.2-prod',
      initiatedBy: 'admin.infra@bankguard.eu',
      initiatedAt: '2025-03-08 08:30:15',
      status: 'COMPLETED',
      datasetVersion: 'European_Bank.csv (SHA-256: 4f9e2b1)',
      trainingSamples: 8000,
      parameters: { max_depth: 6, learning_rate: 0.05, n_estimators: 250, colsample_bytree: 0.8 },
      notes: 'Scheduled quarterly baseline model recalibration. Evaluated on 2,000 holdout set.'
    },
    {
      runId: 'RUN-2025-0214-03',
      modelName: 'LightGBM Retention Predictor',
      version: 'v1.1.0',
      initiatedBy: 'elena.rodriguez@bankguard.eu',
      initiatedAt: '2025-02-14 14:12:00',
      status: 'COMPLETED',
      datasetVersion: 'European_Bank.csv (SHA-256: 4f9e2b1)',
      trainingSamples: 8000,
      parameters: { num_leaves: 31, learning_rate: 0.03, n_estimators: 300 },
      notes: 'Testing sensitivity improvements on Germany balance drop cohort.'
    }
  ]);

  // Initial CRM Cases
  const [crmCases, setCrmCases] = useState<CRMCase[]>([
    {
      caseId: 'CRM-2025-001',
      customerId: 15634602,
      customerName: 'Hargrave',
      country: 'France',
      balance: 0.00,
      riskScore: 92,
      riskCategory: 'CRITICAL',
      priority: 'CRITICAL',
      assignedOfficer: 'Claire Laurent',
      status: 'OPEN',
      recommendedAction: 'Engage with cross-sell incentive: fee waiver on active credit line & direct debit loyalty bonus.',
      followUpDate: '2025-03-12',
      notes: 'Initial account balance drained to €0. High immediate switching hazard.',
      createdAt: '2025-03-08'
    },
    {
      caseId: 'CRM-2025-002',
      customerId: 15647311,
      customerName: 'Hill',
      country: 'Spain',
      balance: 69712.53,
      riskScore: 68,
      riskCategory: 'HIGH',
      priority: 'HIGH',
      assignedOfficer: 'Elena Garcia',
      status: 'IN_PROGRESS',
      recommendedAction: 'Offer deposit loyalty booster (+0.45% APY lock-in term) to preserve liquid assets.',
      followUpDate: '2025-03-14',
      notes: 'Customer contacted support asking about interest rate parity with regional neo-banks.',
      createdAt: '2025-03-08'
    },
    {
      caseId: 'CRM-2025-003',
      customerId: 15619304,
      customerName: 'Onio',
      country: 'France',
      balance: 0.00,
      riskScore: 88,
      riskCategory: 'CRITICAL',
      priority: 'CRITICAL',
      assignedOfficer: 'Jean Dupont',
      status: 'CONTACTED',
      recommendedAction: 'Target with multi-product reactivation package and no-fee premium checking.',
      followUpDate: '2025-03-15',
      notes: 'Call conducted on March 7. Client considering moving savings back from secondary fintech account.',
      createdAt: '2025-03-07'
    },
    {
      caseId: 'CRM-2025-004',
      customerId: 15701354,
      customerName: 'Boni',
      country: 'Spain',
      balance: 0.00,
      riskScore: 78,
      riskCategory: 'HIGH',
      priority: 'HIGH',
      assignedOfficer: 'Elena Garcia',
      status: 'RESOLVED',
      recommendedAction: 'Fee-free payroll deposit credit and automatic cashback card.',
      followUpDate: '2025-03-01',
      notes: 'Retained: Accepted fee-free payroll tier and locked direct debit for 12 months.',
      createdAt: '2025-03-01'
    },
    {
      caseId: 'CRM-2025-005',
      customerId: 15737888,
      customerName: 'Mitchell',
      country: 'Germany',
      balance: 144772.69,
      riskScore: 95,
      riskCategory: 'CRITICAL',
      priority: 'CRITICAL',
      assignedOfficer: 'Markus Becker',
      status: 'OPEN',
      recommendedAction: 'Dedicated German Wealth Relationship Manager consultation & structured deposit bonus.',
      followUpDate: '2025-03-11',
      notes: 'High-balance German account showing abrupt transaction cessation. Immediate priority.',
      createdAt: '2025-03-08'
    }
  ]);

  // Initial Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: '2025-03-08 09:14:22',
      user: 'admin.infra@bankguard.eu',
      role: 'Admin',
      action: 'DATA_INGESTION_VERIFIED',
      status: 'SUCCESS',
      resourceType: 'RAW_STORAGE',
      ipAddress: '10.240.0.12',
      details: 'Validated 10,000 records from European_Bank.csv. 0 nulls, 0 duplicate primary keys.'
    },
    {
      id: 'log-2',
      timestamp: '2025-03-08 09:15:01',
      user: 'elena.rodriguez@bankguard.eu',
      role: 'Manager',
      action: 'ML_MODEL_EVALUATION',
      status: 'SUCCESS',
      resourceType: 'MODEL_REGISTRY',
      ipAddress: '10.240.14.88',
      details: 'XGBoost v1.4 evaluated against 2,000 holdout set. ROC-AUC: 0.864, F1: 0.612.'
    },
    {
      id: 'log-3',
      timestamp: '2025-03-08 09:18:44',
      user: 'elena.rodriguez@bankguard.eu',
      role: 'Manager',
      action: 'OPTIMIZATION_EXECUTION',
      status: 'SUCCESS',
      resourceType: 'OR_TOOLS_SOLVER',
      ipAddress: '10.240.14.88',
      details: 'Solved Knapsack constraint: 500 capacity, €60,000 budget, protected €38.4M.'
    },
    {
      id: 'log-4',
      timestamp: '2025-03-08 09:22:15',
      user: 'ops.marcus@bankguard.eu',
      role: 'Head Office Operator',
      action: 'CRM_CASE_DISPATCH',
      status: 'SUCCESS',
      resourceType: 'CRM_WORKFLOW',
      ipAddress: '10.240.22.105',
      details: 'Created CRM retention case CRM-2025-005 for high-balance customer Mitchell (Germany).'
    },
    {
      id: 'log-5',
      timestamp: '2025-03-08 09:30:10',
      user: 'audit.kraus@bankguard.eu',
      role: 'Auditing Manager',
      action: 'AUDIT_TRAIL_INSPECTED',
      status: 'SUCCESS',
      resourceType: 'AUDIT_LOG_STORE',
      ipAddress: '10.240.50.19',
      details: 'Conducted compliance inspection for EBA governance compliance. Certified 100% action capture.'
    }
  ]);

  const addAuditLog = (
    action: string,
    details: string,
    resourceType = 'APPLICATION',
    status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'INITIATED' = 'SUCCESS'
  ) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentRole === 'Admin'
        ? 'admin.infra@bankguard.eu'
        : currentRole === 'Manager'
        ? 'elena.rodriguez@bankguard.eu'
        : currentRole === 'Head Office Operator'
        ? 'ops.marcus@bankguard.eu'
        : currentRole === 'Auditing Manager'
        ? 'audit.kraus@bankguard.eu'
        : currentRole === 'Client'
        ? 'corp.client@enterprise-client.eu'
        : 'analyst.read@bankguard.eu',
      role: currentRole,
      action,
      resourceType,
      status,
      ipAddress: '192.168.10.42',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    addAuditLog('CUSTOMER_360_INSPECTED', `Inspected profile for Customer ID ${customer.customerId} (${customer.surname})`, 'CUSTOMER_360');
  };

  const handleSelectCustomerById = (customerId: number) => {
    const found = CUSTOMER_SAMPLE.find(c => c.customerId === customerId);
    if (found) {
      handleSelectCustomer(found);
    }
  };

  const handleAddToCrm = (customer: Customer, recommendedStrategy: string, notes: string) => {
    const newCase: CRMCase = {
      caseId: `CRM-${Date.now().toString().slice(-4)}`,
      customerId: customer.customerId,
      customerName: customer.surname,
      country: customer.geography,
      balance: customer.balance,
      riskScore: customer.riskScore,
      riskCategory: customer.riskCategory,
      priority: customer.riskCategory === 'CRITICAL' ? 'CRITICAL' : customer.riskCategory === 'HIGH' ? 'HIGH' : 'MEDIUM',
      assignedOfficer: customer.geography === 'Germany' ? 'Markus Becker' : customer.geography === 'Spain' ? 'Elena Garcia' : 'Claire Laurent',
      status: 'OPEN',
      recommendedAction: recommendedStrategy,
      followUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      notes: notes || 'Dispatched directly from Customer 360 view.',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCrmCases(prev => [newCase, ...prev]);
    addAuditLog('CRM_CASE_CREATED', `Dispatched Customer ${customer.customerId} (${customer.surname}) to CRM workflow.`, 'CRM_WORKFLOW');
  };

  const handleBulkAddToCrm = (customers: Customer[]) => {
    const newCases: CRMCase[] = customers.slice(0, 50).map((c, i) => ({
      caseId: `CRM-${(Date.now() + i).toString().slice(-4)}`,
      customerId: c.customerId,
      customerName: c.surname,
      country: c.geography,
      balance: c.balance,
      riskScore: c.riskScore,
      riskCategory: c.riskCategory,
      priority: c.riskCategory === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      assignedOfficer: c.geography === 'Germany' ? 'Markus Becker' : c.geography === 'Spain' ? 'Elena Garcia' : 'Claire Laurent',
      status: 'OPEN',
      recommendedAction: c.recommendedAction,
      followUpDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      notes: 'Bulk cohort dispatched from Retention Optimization solver.',
      createdAt: new Date().toISOString().split('T')[0]
    }));
    setCrmCases(prev => [...newCases, ...prev]);
    addAuditLog('BULK_CRM_DISPATCH', `Dispatched ${newCases.length} priority accounts to CRM queue.`, 'CRM_WORKFLOW');
  };

  const handleUpdateCaseStatus = (caseId: string, status: CRMStatus, notes?: string) => {
    setCrmCases(prev => prev.map(c => c.caseId === caseId ? { ...c, status, notes: notes || c.notes } : c));
    addAuditLog('CRM_STATUS_UPDATED', `Updated case ${caseId} to ${status}.`, 'CRM_WORKFLOW');
  };

  // Retraining Handler
  const handleInitiateRetraining = (modelName: string) => {
    setIsRetrainingActive(true);
    const runId = `RUN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRun: ModelTrainingRun = {
      runId,
      modelName,
      version: `v1.5.0-${Date.now().toString().slice(-4)}`,
      initiatedBy: currentRole === 'Admin' ? 'admin.infra@bankguard.eu' : 'audit.kraus@bankguard.eu',
      initiatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'TRAINING',
      datasetVersion: 'European_Bank.csv (Validated 10,000 rows)',
      trainingSamples: 8000,
      parameters: { max_depth: 6, learning_rate: 0.04, n_estimators: 300, objective: 'binary:logistic' },
      notes: `Triggered by ${currentRole}. Retraining on 10,000 depositor ground-truth records.`
    };

    setTrainingRuns(prev => [newRun, ...prev]);
    addAuditLog('MODEL_RETRAIN_TRIGGERED', `Initiated retraining for ${modelName} (Run ID: ${runId}).`, 'MODEL_REGISTRY', 'INITIATED');

    setTimeout(() => {
      setTrainingRuns(prev => prev.map(r => r.runId === runId ? { ...r, status: 'COMPLETED' } : r));
      setIsRetrainingActive(false);
      addAuditLog('MODEL_RETRAIN_COMPLETED', `Successfully trained and registered ${modelName} ${newRun.version}. Metrics: AUC 0.871 (+0.007).`, 'MODEL_REGISTRY', 'SUCCESS');
    }, 2400);
  };

  // Export Handlers
  const handleExportAuditLogs = () => {
    exportAuditLogsToJson(auditLogs, `${currentRole} User`);
    addAuditLog('AUDIT_LOG_EXPORT_JSON', `Exported ${auditLogs.length} immutable audit records in JSON format.`, 'AUDIT_LOG_STORE');
  };

  const handleExportDatasetJson = () => {
    exportDatasetToJson(CUSTOMER_SAMPLE, 'BankGuard_European_Bank_Analytical_Export.json');
    addAuditLog('DATASET_EXPORT_JSON', `Exported analytical dataset JSON (10,000 verified records foundation).`, 'RAW_DATA_EXPORT');
  };

  const handleExportDatasetCsv = () => {
    exportExecutiveSummaryToCsv();
    addAuditLog('DATASET_EXPORT_CSV', `Exported executive churn intelligence CSV report.`, 'RAW_DATA_EXPORT');
  };

  // Role Authentication Transition
  const handleLoginAsRole = (newRole: Role, email: string) => {
    setCurrentRole(newRole);
    if (newRole === 'Client') {
      setActiveTab('client-portal');
    } else if (newRole === 'Head Office Operator') {
      setActiveTab('operations');
    } else if (newRole === 'Auditing Manager') {
      setActiveTab('settings');
    } else {
      setActiveTab('dashboard');
    }
    addAuditLog('USER_AUTHENTICATED', `Authenticated user ${email} under role ${newRole}. Session active.`, 'AUTH_SERVICE');
  };

  // Helper to map navigation string ids safely
  const handleNavigateSection = (sec: string) => {
    const map: Record<string, ActiveTab> = {
      'overview': 'dashboard',
      'executive': 'dashboard',
      'dashboard': 'dashboard',
      'customers': 'customers',
      'explorer': 'customers',
      'optimization': 'optimization',
      'optimizer': 'optimization',
      'segmentation': 'segmentation',
      'segments': 'segmentation',
      'churn': 'churn',
      'churn-ai': 'churn',
      'geography': 'geography',
      'geo': 'geography',
      'high-value': 'high-value',
      'copilot': 'copilot',
      'rag': 'rag',
      'crm': 'crm',
      'operations': 'operations',
      'model-center': 'model-center',
      'client-portal': 'client-portal',
      'sheets': 'sheets',
      'data-quality': 'data-quality',
      'quality': 'data-quality',
      'settings': 'settings',
      'governance': 'settings'
    };
    const target = map[sec] || 'dashboard';
    setActiveTab(target);
    addAuditLog('NAVIGATION_EVENT', `Navigated to ${target}`);
  };

  return (
    <div className="flex h-screen w-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          addAuditLog('NAVIGATION_EVENT', `Navigated to section: ${tab}`);
        }}
        currentRole={currentRole}
        setCurrentRole={(r) => {
          setCurrentRole(r);
          addAuditLog('ROLE_SWITCH', `Switched active role to: ${r}`);
        }}
        criticalCount={ANALYTICS_SUMMARY.riskDistribution.critical}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Operational Bar */}
        <header className="h-14 border-b border-slate-800 bg-slate-900/60 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400">Section:</span>
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider bg-slate-800 px-2.5 py-1 rounded border border-slate-700 font-mono">
              {activeTab}
            </span>
            <div className="hidden md:flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>10,000 Verified Records (European_Bank.csv)</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentRole !== 'Client' && (
              <>
                <button
                  onClick={() => setActiveTab('copilot')}
                  className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Ask AI Copilot</span>
                </button>

                <button
                  onClick={() => setActiveTab('sheets')}
                  className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Google Sheets Sync</span>
                </button>
              </>
            )}

            <div className="h-4 w-px bg-slate-800"></div>

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs font-mono text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 rounded border border-slate-700 flex items-center space-x-1.5 transition"
              title="Click to switch RBAC session role"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Role: <strong className="text-indigo-300">{currentRole}</strong></span>
            </button>
          </div>
        </header>

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#020617]">
          {/* Client Role Tenant Enforcement Banner */}
          {currentRole === 'Client' && activeTab !== 'client-portal' && (
            <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-200 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Tenant Isolation Active:</strong> Corporate Client role is restricted from internal banker tools. Showing aggregate client view.
                </span>
              </div>
              <button
                onClick={() => setActiveTab('client-portal')}
                className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-semibold"
              >
                Go to Client Portal
              </button>
            </div>
          )}

          {/* Active Views */}
          {activeTab === 'dashboard' && (
            <ExecutiveDashboard
              summary={ANALYTICS_SUMMARY}
              onNavigateSection={handleNavigateSection}
              onNavigateToOptimizer={() => handleNavigateSection('optimization')}
              onSelectCustomer={handleSelectCustomer}
              customerSample={CUSTOMER_SAMPLE}
              onExportCsv={handleExportDatasetCsv}
              onExportJson={handleExportDatasetJson}
            />
          )}

          {activeTab === 'customers' && (
            <CustomerExplorer
              customers={CUSTOMER_SAMPLE}
              customerSample={CUSTOMER_SAMPLE}
              onSelectCustomer={handleSelectCustomer}
            />
          )}

          {activeTab === 'operations' && (
            <OperationsCenter
              customers={CUSTOMER_SAMPLE}
              crmCases={crmCases}
              onSelectCustomer={handleSelectCustomer}
              onDispatchToCrm={handleAddToCrm}
              onUpdateCaseStatus={handleUpdateCaseStatus}
            />
          )}

          {activeTab === 'client-portal' && (
            <ClientPortal
              summary={ANALYTICS_SUMMARY}
              onExportSummary={handleExportDatasetCsv}
            />
          )}

          {activeTab === 'model-center' && (
            <ModelCenter
              models={ANALYTICS_SUMMARY.modelsComparison}
              globalShap={ANALYTICS_SUMMARY.globalShap}
              onInitiateRetraining={handleInitiateRetraining}
              trainingRuns={trainingRuns}
              isRetrainingActive={isRetrainingActive}
            />
          )}

          {activeTab === 'optimization' && (
            <RetentionOptimizer
              customerPool={CUSTOMER_SAMPLE}
              onSelectCustomer={handleSelectCustomer}
              onBulkAddToCrm={handleBulkAddToCrm}
            />
          )}

          {activeTab === 'segmentation' && (
            <CustomerSegmentation
              segments={ANALYTICS_SUMMARY.customerSegments}
              customerSample={CUSTOMER_SAMPLE}
              onSelectCustomer={handleSelectCustomer}
            />
          )}

          {activeTab === 'churn' && (
            <ChurnIntelligence
              globalShap={ANALYTICS_SUMMARY.globalShap}
              models={ANALYTICS_SUMMARY.modelsComparison}
            />
          )}

          {activeTab === 'geography' && (
            <GeographicIntelligence
              geoStats={ANALYTICS_SUMMARY.geographyChurn}
              customerSample={CUSTOMER_SAMPLE}
              onSelectCustomer={handleSelectCustomer}
            />
          )}

          {activeTab === 'high-value' && (
            <HighValueRisk
              customers={CUSTOMER_SAMPLE}
              onSelectCustomer={handleSelectCustomer}
              onBulkAddToCrm={handleBulkAddToCrm}
            />
          )}

          {activeTab === 'copilot' && (
            <AICopilot
              onSelectCustomer={handleSelectCustomer}
            />
          )}

          {activeTab === 'rag' && (
            <RAGAssistant />
          )}

          {activeTab === 'crm' && (
            <CRMWorkflow
              cases={crmCases}
              onUpdateCaseStatus={handleUpdateCaseStatus}
              onSelectCustomerById={handleSelectCustomerById}
            />
          )}

          {activeTab === 'sheets' && (
            <GoogleSheetsIntegration
              summary={ANALYTICS_SUMMARY}
              customerSample={CUSTOMER_SAMPLE}
            />
          )}

          {activeTab === 'data-quality' && (
            <DataQualityCenter />
          )}

          {activeTab === 'settings' && (
            <SecurityGovernance
              currentRole={currentRole}
              setCurrentRole={(r) => {
                setCurrentRole(r);
                addAuditLog('ROLE_SWITCH', `Switched active role to: ${r}`);
              }}
              auditLogs={auditLogs}
              onExportAuditLogs={handleExportAuditLogs}
            />
          )}
        </main>
      </div>

      {/* Customer 360° Inspector Modal */}
      {selectedCustomer && (
        <Customer360Modal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onAddToCrm={handleAddToCrm}
        />
      )}

      {/* Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={currentRole}
        onLoginAsRole={handleLoginAsRole}
      />
    </div>
  );
}
