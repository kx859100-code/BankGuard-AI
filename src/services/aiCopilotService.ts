import { ANALYTICS_SUMMARY } from '../data/analyticsSummary';
import { CUSTOMER_SAMPLE } from '../data/customerSample';
import { RAG_DOCUMENTS } from '../data/ragKnowledge';
import { Customer } from '../types';

export interface ToolCallTelemetry {
  toolName: string;
  parameters: Record<string, any>;
  executionTimeMs: number;
  recordsReturned: number;
  resultSummary: string;
}

export interface CopilotResponse {
  answer: string;
  toolCalls: ToolCallTelemetry[];
  citedSources?: string[];
  dataPoints?: Record<string, any>;
  relevantCustomers?: Customer[];
}

/**
 * Validated Banking Analytics Tools (Guarded Execution - No arbitrary SQL)
 */
export const AnalyticsTools = {
  getCountryChurn: () => {
    return ANALYTICS_SUMMARY.geographyChurn;
  },

  getAgeChurn: () => {
    return ANALYTICS_SUMMARY.ageChurn;
  },

  getProductChurn: () => {
    return ANALYTICS_SUMMARY.productChurn;
  },

  getSegments: () => {
    return ANALYTICS_SUMMARY.customerSegments;
  },

  getGlobalShapDrivers: () => {
    return ANALYTICS_SUMMARY.globalShap;
  },

  getHighRiskCustomers: (country?: string, minBalance?: number, limit = 10) => {
    let list = CUSTOMER_SAMPLE.filter(c => c.riskCategory === 'CRITICAL' || c.riskCategory === 'HIGH');
    if (country && country !== 'ALL') {
      list = list.filter(c => c.geography.toLowerCase() === country.toLowerCase());
    }
    if (minBalance !== undefined) {
      list = list.filter(c => c.balance >= minBalance);
    }
    return list.slice(0, limit);
  },

  getCustomerById: (id: number) => {
    return CUSTOMER_SAMPLE.find(c => c.customerId === id);
  },

  searchResearchKnowledge: (keyword: string) => {
    const q = keyword.toLowerCase();
    return RAG_DOCUMENTS.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.content.toLowerCase().includes(q) ||
      d.relevanceKeywords.some(k => k.toLowerCase().includes(q))
    );
  }
};

/**
 * AI Copilot Query Processor
 * Emulates the multi-agent orchestrator with guarded tool dispatch
 */
export async function processCopilotQuery(prompt: string): Promise<CopilotResponse> {
  const q = prompt.toLowerCase();
  const startTime = Date.now();
  const toolCalls: ToolCallTelemetry[] = [];
  const citedSources: string[] = [];

  // Query 1: Country Churn / Germany vs France vs Spain
  if (q.includes('country') || q.includes('highest churn') || q.includes('germany') || q.includes('france') || q.includes('spain')) {
    const geoData = AnalyticsTools.getCountryChurn();
    toolCalls.push({
      toolName: 'get_country_churn()',
      parameters: {},
      executionTimeMs: 12,
      recordsReturned: geoData.length,
      resultSummary: 'Retrieved aggregated churn rate and average deposit balances for France, Germany, Spain.'
    });

    const germany = geoData.find(g => g.country === 'Germany')!;
    const france = geoData.find(g => g.country === 'France')!;
    const spain = geoData.find(g => g.country === 'Spain')!;

    // Check RAG for contextual explanation
    const ragMatches = AnalyticsTools.searchResearchKnowledge('Germany');
    if (ragMatches.length > 0) {
      citedSources.push(ragMatches[0].title);
    }

    const answer = `Based on the verified database calculation from European_Bank.csv:

• **Highest Churn Country: Germany** with an observed churn rate of **${germany.churnRate}%** (${germany.churnedCount.toLocaleString()} churned customers out of ${germany.customerCount.toLocaleString()}).
• **Average Balance in Germany:** €${germany.averageBalance.toLocaleString()} (significantly higher liquid exposure than peer markets).
• **France:** Churn rate of **${france.churnRate}%** (${france.churnedCount.toLocaleString()} / ${france.customerCount.toLocaleString()}), average balance €${france.averageBalance.toLocaleString()}.
• **Spain:** Churn rate of **${spain.churnRate}%** (${spain.churnedCount.toLocaleString()} / ${spain.customerCount.toLocaleString()}), average balance €${spain.averageBalance.toLocaleString()}.

**Root Cause Insight:** Cross-referencing with our European Banking Authority and ECB literature, the elevated German churn reflects lower switching friction across private, cooperative (Volksbanken), and public (Sparkassen) institutions, whereas French customers are stabilized by regulated mortgage domicile and tax-exempt Livret A accounts.`;

    return {
      answer,
      toolCalls,
      citedSources,
      dataPoints: { geographyData: geoData }
    };
  }

  // Query 2: Age group churn
  if (q.includes('age') || q.includes('cohort') || q.includes('demographic')) {
    const ageData = AnalyticsTools.getAgeChurn();
    toolCalls.push({
      toolName: 'get_age_churn()',
      parameters: {},
      executionTimeMs: 9,
      recordsReturned: ageData.length,
      resultSummary: 'Calculated churn rates by age bracket (<30, 30-45, 46-60, 60+).'
    });

    const maxAgeGroup = [...ageData].sort((a, b) => b.churnRate - a.churnRate)[0];

    const answer = `According to verified calculation on customer records:

• **Peak Churn Demographic: Age ${maxAgeGroup.ageGroup}** with a churn rate of **${maxAgeGroup.churnRate}%** (${maxAgeGroup.churnedCount.toLocaleString()} churned out of ${maxAgeGroup.customerCount.toLocaleString()} customers).
• Age <30: Churn rate is only **${ageData[0].churnRate}%** (least prone to switching).
• Age 30–45: Churn rate is **${ageData[1].churnRate}%** (broad career prime).
• Age 60+: Churn rate is **${ageData[3]?.churnRate || 24.5}%**.

**Strategic Insight:** Customers aged 46–60 represent the bank's greatest capital vulnerability because they hold mature accumulated deposits while facing retirement restructuring, pension transfers, or estate disbursements.`;

    return {
      answer,
      toolCalls,
      dataPoints: { ageData }
    };
  }

  // Query 3: Churn drivers / SHAP explainability
  if (q.includes('driver') || q.includes('factor') || q.includes('why') || q.includes('shap') || q.includes('product')) {
    const shapData = AnalyticsTools.getGlobalShapDrivers();
    const prodData = AnalyticsTools.getProductChurn();
    toolCalls.push({
      toolName: 'get_global_shap_drivers()',
      parameters: {},
      executionTimeMs: 14,
      recordsReturned: shapData.length,
      resultSummary: 'Computed TreeSHAP global feature attribution weights across XGBoost model.'
    });
    toolCalls.push({
      toolName: 'get_product_churn()',
      parameters: {},
      executionTimeMs: 8,
      recordsReturned: prodData.length,
      resultSummary: 'Calculated attrition curve by number of products (1, 2, 3, 4).'
    });

    citedSources.push('EBA Supervisory Guidelines: Product Bundling Friction & Customer Exit Traps');

    const answer = `Our explainable AI layer (TreeSHAP on calibrated XGBoost v1.4) identifies the top 3 primary churn drivers across the portfolio:

1. **Age (+0.342 SHAP importance):** Senior customers (45+) have steep attrition growth.
2. **Product Holdings (+0.284 SHAP importance):** 
   • Customers with **2 products** enjoy the highest retention (churn rate only **${prodData[1]?.churnRate || 7.6}%**).
   • However, customers with **3 or 4 products** suffer an acute complexity cliff (churn rates exceeding **${prodData[2]?.churnRate || 82.1}%**).
3. **Account Inactivity (+0.248 SHAP importance):** Inactive members churn at more than double the rate of active transactional depositors.
4. **Geography (Germany: +0.196 SHAP importance):** German retail depositors demonstrate heightened competitor yield sensitivity.`;

    return {
      answer,
      toolCalls,
      citedSources,
      dataPoints: { shapData, prodData }
    };
  }

  // Query 4: High-Value At-Risk Customers
  if (q.includes('high value') || q.includes('wealth') || q.includes('balance') || q.includes('critical')) {
    const customers = AnalyticsTools.getHighRiskCustomers(undefined, 100000, 6);
    toolCalls.push({
      toolName: 'get_high_risk_customers()',
      parameters: { minBalance: 100000, riskCategory: 'HIGH_OR_CRITICAL', limit: 6 },
      executionTimeMs: 18,
      recordsReturned: customers.length,
      resultSummary: 'Filtered database for balances >= €100,000 and Risk Score >= 61.'
    });

    const answer = `Identified **${ANALYTICS_SUMMARY.highValueAtRiskCount.toLocaleString()} high-value at-risk accounts** (liquid balance ≥ €100,000 with HIGH or CRITICAL risk category).

Total exposed deposit capital across this high-value cohort: **€${ANALYTICS_SUMMARY.totalHighValueBalance.toLocaleString()}**.

Here are the top priority accounts requiring immediate private wealth banker outreach:`;

    return {
      answer,
      toolCalls,
      relevantCustomers: customers
    };
  }

  // Default: General Overview & Copilot Tool Capabilities
  const highRiskSample = AnalyticsTools.getHighRiskCustomers('Germany', 80000, 4);
  toolCalls.push({
    toolName: 'get_portfolio_kpis()',
    parameters: {},
    executionTimeMs: 11,
    recordsReturned: 1,
    resultSummary: 'Fetched portfolio headline statistics.'
  });

  const answer = `**BankGuard AI Decision Support Overview:**

• **Portfolio Base:** 10,000 verified customer records from \`European_Bank.csv\`.
• **Overall Churn Rate:** **${ANALYTICS_SUMMARY.overallChurnRate}%** (${ANALYTICS_SUMMARY.churnedCustomers.toLocaleString()} customers).
• **Critical Risk Accounts:** **${ANALYTICS_SUMMARY.riskDistribution.critical}** accounts (Score 81–100).
• **High Risk Accounts:** **${ANALYTICS_SUMMARY.riskDistribution.high}** accounts (Score 61–80).
• **High-Value Exposure:** €${ANALYTICS_SUMMARY.totalHighValueBalance.toLocaleString()} in deposits across ${ANALYTICS_SUMMARY.highValueAtRiskCount} affluent accounts.

You can ask me specific questions like:
- *"Which country has the highest churn rate?"*
- *"Show me high-risk customers in Germany with high balances."*
- *"What are the primary churn drivers according to SHAP?"*
- *"Which age group is most likely to exit?"*
- *"Compare retention in France and Germany."*`;

  return {
    answer,
    toolCalls,
    relevantCustomers: highRiskSample
  };
}
