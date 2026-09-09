export type Geography = 'France' | 'Germany' | 'Spain';
export type Gender = 'Male' | 'Female';
export type RiskCategory = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Role =
  | 'Admin'
  | 'Manager'
  | 'Head Office Operator'
  | 'Auditing Manager'
  | 'Viewer'
  | 'Client';
export type CRMStatus = 'OPEN' | 'IN_PROGRESS' | 'CONTACTED' | 'RESOLVED' | 'CLOSED';
export type OptimizationObjective = 'MAX_RETAINED_BALANCE' | 'MAX_RISK_REDUCTION' | 'BALANCED_COMPOSITE';

export type ActiveTab =
  | 'dashboard'
  | 'customers'
  | 'segmentation'
  | 'churn'
  | 'geography'
  | 'high-value'
  | 'optimization'
  | 'copilot'
  | 'rag'
  | 'crm'
  | 'operations'
  | 'model-center'
  | 'client-portal'
  | 'sheets'
  | 'data-quality'
  | 'data-lineage'
  | 'settings';

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
  tenantName: string;
  authMethod: 'PASSWORD' | 'GOOGLE_OAUTH';
  jwtToken: string;
  refreshToken: string;
  expiresAt: string;
  mfaVerified: boolean;
}

export interface ShapFactor {
  feature: string;
  value: string;
  impact: number;
  direction: 'positive' | 'negative';
  description: string;
}

export interface Customer {
  year: number;
  customerId: number;
  surname: string;
  creditScore: number;
  geography: Geography;
  gender: Gender;
  age: number;
  tenure: number;
  balance: number;
  numOfProducts: number;
  hasCrCard: number;
  isActiveMember: number;
  estimatedSalary: number;
  exited: number;
  // Engineered features
  ageGroup: string;
  creditScoreBand: string;
  tenureGroup: string;
  balanceSegment: string;
  engagementSegment: string;
  productSegment: string;
  // ML outputs
  churnProbability: number;
  riskScore: number;
  riskCategory: RiskCategory;
  segment: string;
  clusterId: string;
  modelVersion: string;
  predictionTimestamp: string;
  shapFactors: ShapFactor[];
  recommendedAction: string;
  simulatedInterventionCost: number;
  simulatedCLV: number;
  expectedLossExposure: number;
}

export interface GeographyChurnStat {
  country: Geography;
  customerCount: number;
  churnedCount: number;
  churnRate: number;
  averageBalance: number;
  highRiskCount: number;
}

export interface AgeChurnStat {
  ageGroup: string;
  customerCount: number;
  churnedCount: number;
  churnRate: number;
}

export interface GenderChurnStat {
  gender: string;
  customerCount: number;
  churnedCount: number;
  churnRate: number;
}

export interface ProductChurnStat {
  products: string;
  customerCount: number;
  churnedCount: number;
  churnRate: number;
}

export interface ActivityChurnStat {
  status: string;
  customerCount: number;
  churnedCount: number;
  churnRate: number;
}

export interface BalanceChurnStat {
  segment: string;
  customerCount: number;
  churnedCount: number;
  churnRate: number;
}

export interface TenureChurnStat {
  tenure: string;
  customerCount: number;
  churnRate: number;
}

export interface CustomerSegment {
  clusterId: string;
  name: string;
  description: string;
  customerCount: number;
  churnedCount: number;
  churnRate: number;
  averageBalance: number;
  recommendedAction: string;
}

export interface GlobalShapItem {
  feature: string;
  importance: number;
  category: string;
  direction: string;
}

export interface ModelComparison {
  modelName: string;
  version: string;
  trainingDate: string;
  datasetVersion: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  prAuc: number;
  status: string;
  latencyMs: number;
  notes: string;
}

export type NavSection = ActiveTab;

export interface AnalyticsSummary {
  totalCustomers: number;
  churnedCustomers: number;
  overallChurnRate: number;
  riskDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  highValueAtRiskCount: number;
  totalHighValueBalance: number;
  totalBalanceExposed: number;
  geographyChurn: GeographyChurnStat[];
  byGeography?: GeographyChurnStat[];
  ageChurn: AgeChurnStat[];
  genderChurn: GenderChurnStat[];
  productChurn: ProductChurnStat[];
  activityChurn: ActivityChurnStat[];
  balanceChurn: BalanceChurnStat[];
  tenureChurn: TenureChurnStat[];
  customerSegments: CustomerSegment[];
  segments?: CustomerSegment[];
  globalShap: GlobalShapItem[];
  modelsComparison: ModelComparison[];
  modelComparison?: ModelComparison[];
}

export interface OptimizationResult {
  optimizationId: string;
  scenarioName: string;
  targetCapacity: number;
  totalBudget: number;
  selectedCustomers: Customer[];
  totalRiskReduction: number;
  totalProtectedBalance: number;
  estimatedCost: number;
  averageRiskScore: number;
  timestamp: string;
}

export interface CRMCase {
  caseId: string;
  customerId: number;
  customerName: string;
  country: Geography;
  balance: number;
  riskScore: number;
  riskCategory?: RiskCategory;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignedOfficer: string;
  status: CRMStatus;
  recommendedAction: string;
  followUpDate: string;
  notes: string;
  createdAt?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: Role;
  action: string;
  resourceType?: string;
  resourceId?: string;
  status?: 'SUCCESS' | 'WARNING' | 'FAILED' | 'INITIATED';
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface ModelTrainingRun {
  runId: string;
  modelName: string;
  version: string;
  initiatedBy: string;
  initiatedAt: string;
  status: 'INITIATED' | 'TRAINING' | 'EVALUATING' | 'COMPLETED' | 'FAILED';
  datasetVersion: string;
  trainingSamples: number;
  parameters: Record<string, string | number>;
  notes?: string;
}

export interface AnalyticsSnapshot {
  id: string;
  snapshotPeriod: string;
  observationDate: string;
  totalCustomers: number;
  churnedCustomers: number;
  churnRate: number;
  highRiskCount: number;
  criticalCount: number;
  averageBalance: number;
  isBaseline: boolean;
  notes: string;
}

export interface RAGDocument {
  id: string;
  title: string;
  source: string;
  category: 'REGULATORY' | 'RESEARCH' | 'STATISTICS' | 'INTERNAL';
  date: string;
  summary: string;
  content: string;
  relevanceKeywords: string[];
}
