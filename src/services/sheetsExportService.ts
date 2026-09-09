import { ANALYTICS_SUMMARY } from '../data/analyticsSummary';
import { Customer } from '../types';

export function exportCustomersToCsv(customers: Customer[], filename = 'BankGuard_Priority_Churn_Roster.csv') {
  const headers = [
    'CustomerId',
    'Surname',
    'Geography',
    'Gender',
    'Age',
    'Tenure',
    'Balance',
    'NumOfProducts',
    'HasCrCard',
    'IsActiveMember',
    'EstimatedSalary',
    'Exited',
    'ChurnProbability',
    'RiskScore',
    'RiskCategory',
    'Segment',
    'RecommendedAction',
    'SimulatedInterventionCost_EUR',
    'SimulatedCLV_EUR'
  ];

  const rows = customers.map(c => [
    c.customerId,
    `"${c.surname}"`,
    c.geography,
    c.gender,
    c.age,
    c.tenure,
    c.balance.toFixed(2),
    c.numOfProducts,
    c.hasCrCard,
    c.isActiveMember,
    c.estimatedSalary.toFixed(2),
    c.exited,
    (c.churnProbability * 100).toFixed(2) + '%',
    c.riskScore,
    c.riskCategory,
    `"${c.segment}"`,
    `"${c.recommendedAction}"`,
    c.simulatedInterventionCost,
    c.simulatedCLV
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportExecutiveSummaryToCsv() {
  const s = ANALYTICS_SUMMARY;
  const lines: string[] = [
    'BANKGUARD AI — EXECUTIVE CHURN INTELLIGENCE REPORT',
    `Generated,${new Date().toISOString()}`,
    '',
    'PORTFOLIO HEADLINE METRICS',
    `Total Customer Base,${s.totalCustomers}`,
    `Observed Churned Customers,${s.churnedCustomers}`,
    `Observed Churn Rate,${s.overallChurnRate}%`,
    `Critical Risk Accounts (Score 81-100),${s.riskDistribution.critical}`,
    `High Risk Accounts (Score 61-80),${s.riskDistribution.high}`,
    `Medium Risk Accounts (Score 31-60),${s.riskDistribution.medium}`,
    `Low Risk Accounts (Score 0-30),${s.riskDistribution.low}`,
    `High-Value At-Risk Accounts (Balance > €100k),${s.highValueAtRiskCount}`,
    `Total High-Value Deposit Balance Exposed,€${s.totalHighValueBalance}`,
    `Total Portfolio Capital Exposed to Churn,€${s.totalBalanceExposed}`,
    '',
    'GEOGRAPHIC BREAKDOWN',
    'Country,CustomerCount,ChurnedCount,ChurnRate(%),AverageBalance(€),HighRiskAccounts'
  ];

  s.geographyChurn.forEach(g => {
    lines.push(`${g.country},${g.customerCount},${g.churnedCount},${g.churnRate}%,€${g.averageBalance},${g.highRiskCount}`);
  });

  lines.push('');
  lines.push('CUSTOMER SEGMENTS (K-MEANS CLUSTERS)');
  lines.push('ClusterName,CustomerCount,ChurnRate(%),AverageBalance(€),RecommendedRetentionAction');
  s.customerSegments.forEach(c => {
    lines.push(`"${c.name}",${c.customerCount},${c.churnRate}%,€${c.averageBalance},"${c.recommendedAction}"`);
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'BankGuard_Executive_Summary.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function copyTableToGoogleSheetsClipboard(customers: Customer[]): boolean {
  const headers = ['CustomerId', 'Surname', 'Geography', 'Age', 'Balance', 'Products', 'RiskScore', 'RiskLevel', 'RecommendedAction'];
  const rows = customers.map(c => [
    c.customerId,
    c.surname,
    c.geography,
    c.age,
    c.balance.toFixed(2),
    c.numOfProducts,
    c.riskScore,
    c.riskCategory,
    c.recommendedAction
  ]);
  const text = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
  try {
    navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function exportDatasetToJson(data: any, filename = 'BankGuard_Dataset_Export.json') {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAuditLogsToJson(logs: any[], user: string) {
  const exportPayload = {
    export_metadata: {
      system: 'BankGuard AI Enterprise Auditing',
      generated_at: new Date().toISOString(),
      generated_by: user,
      record_count: logs.length,
      compliance_certification: 'BCBS 239 / EBA Guidelines on Internal Governance / GDPR Art. 30'
    },
    audit_logs: logs
  };
  exportDatasetToJson(exportPayload, `BankGuard_Audit_Logs_${new Date().toISOString().slice(0, 10)}.json`);
}
