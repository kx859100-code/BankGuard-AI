import { RAGDocument } from '../types';

export const RAG_DOCUMENTS: RAGDocument[] = [
  {
    id: 'ecb-2025-01',
    title: 'ECB Financial Stability Review: Retail Deposit Stickiness & Multi-Product Attrition',
    source: 'European Central Bank (ECB) Analytical Bulletin',
    category: 'REGULATORY',
    date: '2025-04-15',
    summary: 'Empirical Eurozone analysis examining why depositors with balances >€100k have 2.4x switching sensitivity in rising interest environments.',
    content: `Recent monetary policy adjustments across the Eurozone highlighted asymmetric deposit elasticity across European retail customer categories:
1. High-Balance Deposit Sensitivity: Retail accounts holding liquid balances exceeding €100,000 exhibit a 2.4x higher switching propensity when competitor promotional spreads exceed 25 bps.
2. Account Inactivity as Lead Indicator: Eurozone banking telemetry shows that 90-day digital or branch transaction inactivity is accompanied by a 68% annualized probability of permanent account closure.
3. Market Structure Disparities: In Germany, a three-pillar banking system (private commercial, public savings/Sparkassen, and cooperative/Volksbanken) facilitates switching friction far lower than in France or Spain, directly driving elevated retail attrition benchmarks (~30–33% vs ~16–18%).`,
    relevanceKeywords: ['ECB', 'Deposit', 'Yield', 'Germany', 'High Balance', 'Inactivity', 'Stability']
  },
  {
    id: 'eba-2024-08',
    title: 'EBA Supervisory Guidelines: Product Bundling Friction & Customer Exit Traps',
    source: 'European Banking Authority (EBA)',
    category: 'REGULATORY',
    date: '2024-11-20',
    summary: 'Supervisory report analyzing consumer complaints and showing that holding 3 or 4 unintegrated banking products causes customer attrition rates above 75%.',
    content: `Supervisory examination of retail banking portfolios reveals a stark non-linear relationship between product holdings and relationship longevity:
1. Optimal Anchor: Two core complementary services (e.g. current checking account paired with a fixed mortgage or primary debit card) produces maximum customer lifetime retention, with observed churn under 10%.
2. The Complexity Cliff: Holding 3 or 4 unbundled products correlates with an acute spike in customer attrition (exceeding 75%).
3. Root Causes: Cross-authority audit data indicates that maintaining 3+ unbundled financial products generates overlapping monthly maintenance fees, multiple authentication apps, and disjointed customer support queues.
4. Strategic Remediation: EBA recommends product consolidation, automated fee waivers, and assigning a single relationship point-of-contact for multi-service clients.`,
    relevanceKeywords: ['EBA', 'Products', 'Bundling', 'Fees', 'Friction', 'Multi-Product', 'Supervision']
  },
  {
    id: 'eurostat-2025-03',
    title: 'Eurostat Statistical Monitor: Household Financial Mobility in France, Germany & Spain',
    source: 'Eurostat Banking Statistics Division',
    category: 'STATISTICS',
    date: '2025-02-10',
    summary: 'Demographic and geographic comparison of customer switching behavior, showing that older customers (45-60) represent the highest financial volume risk.',
    content: `Comparative analysis of retail banking dynamics across core European economies:
- Germany: Characterized by strong fintech adoption (N26, Trade Republic) and active deposit brokers (WeltSparen, Raisin), resulting in higher depositor mobility.
- France: Deeply anchored by regulated 'Livret A' tax-exempt savings accounts and domicile regulations for residential mortgages, generating structural customer inertia.
- Spain: Post-merger banking networks (Santander, BBVA, CaixaBank) maintain steady local branch presence; account churn predominantly aligns with life stages and employment transitions.
- Age Distribution: Across all three markets, customers aged 46–60 exhibit peak churn propensity, attributed to mid-career wealth consolidation, pre-retirement restructuring, and estate planning moves.`,
    relevanceKeywords: ['Eurostat', 'France', 'Germany', 'Spain', 'Age', 'Demographics', 'Mobility']
  },
  {
    id: 'bankguard-internal-01',
    title: 'BankGuard AI Methodological Framework & KPI Definitions',
    source: 'BankGuard Model Risk & Quantitative Governance Committee',
    category: 'INTERNAL',
    date: '2026-01-10',
    summary: 'Documentation of data lineage, feature engineering definitions, calibrated risk thresholds, and OR-Tools optimization formulation.',
    content: `1. Data Lineage:
Raw Dataset (data/raw/European_Bank.csv) is strictly immutable and serves as ground truth.
2. Risk Score Formulation:
Risk Score is calibrated on a scale of 0 to 100 derived from the ensemble model (XGBoost champion model v1.4):
- 0–30: LOW Risk (Routine engagement, no immediate retention campaign needed)
- 31–60: MEDIUM Risk (Monitor for digital inactivity or balance decay)
- 61–80: HIGH Risk (Targeted retention campaign, product review)
- 81–100: CRITICAL Risk (Immediate human banker concierge outreach)
3. Retention Optimization Formulation:
Using 0-1 Knapsack mathematical optimization to maximize Total Retained Capital under capacity (N accounts) and budget constraints.
4. Transparency Notice:
All retention intervention costs (€75/€150) and Customer Lifetime Values (CLV) are explicitly designated as SIMULATED SCENARIO ASSUMPTIONS due to the absence of cost/revenue fields in the raw dataset.`,
    relevanceKeywords: ['Methodology', 'Risk Score', 'Calibration', 'Knapsack', 'Optimization', 'Lineage', 'Assumptions']
  }
];
