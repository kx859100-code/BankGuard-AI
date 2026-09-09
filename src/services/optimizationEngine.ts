import { Customer, OptimizationObjective, OptimizationResult } from '../types';

export interface OptimizationParams {
  scenarioName: string;
  targetCapacity: number;
  totalBudget: number;
  objective: OptimizationObjective;
  countryFilter?: 'ALL' | 'France' | 'Germany' | 'Spain';
  minRiskCategory?: 'ALL' | 'HIGH_CRITICAL' | 'CRITICAL_ONLY';
}

/**
 * Enterprise Retention Optimizer (Google OR-Tools inspired Knapsack Solver)
 * Solves constrained multi-objective integer programming problem:
 * Maximize Retained Value / Risk Mitigated subject to:
 * 1. Count <= Target Capacity
 * 2. Total Cost <= Total Budget
 */
export function runRetentionOptimization(
  customerPool: Customer[],
  params: OptimizationParams
): OptimizationResult {
  // 1. Filter eligible candidates
  let eligible = [...(customerPool || [])];

  if (params.countryFilter && params.countryFilter !== 'ALL') {
    eligible = eligible.filter(c => c.geography === params.countryFilter);
  }

  if (params.minRiskCategory === 'CRITICAL_ONLY') {
    eligible = eligible.filter(c => c.riskCategory === 'CRITICAL');
  } else if (params.minRiskCategory === 'HIGH_CRITICAL') {
    eligible = eligible.filter(c => c.riskCategory === 'CRITICAL' || c.riskCategory === 'HIGH');
  }

  // 2. Score each candidate by objective value-to-cost ratio (greedy knapsack with dynamic heuristic)
  const scored = eligible.map(c => {
    // Expected risk loss in capital
    const riskExposure = c.balance * c.churnProbability;
    
    // Assumed retention effectiveness probability (simulated 65% success rate for outreach)
    const successRate = c.isActiveMember === 1 ? 0.72 : 0.58;
    const protectedCapital = riskExposure * successRate;

    // Objective weightings
    let score = 0;
    if (params.objective === 'MAX_RETAINED_BALANCE') {
      // Prioritize large deposits at risk
      score = (protectedCapital + 100) / Math.max(1, c.simulatedInterventionCost);
    } else if (params.objective === 'MAX_RISK_REDUCTION') {
      // Prioritize highest churn probabilities regardless of balance
      score = (c.churnProbability * 1000) / Math.max(1, c.simulatedInterventionCost);
    } else {
      // Balanced Composite: 60% balance protection, 40% risk severity
      const normBal = Math.min(1.0, c.balance / 150000);
      const compositeValue = (normBal * 0.6 + c.churnProbability * 0.4) * 1000;
      score = compositeValue / Math.max(1, c.simulatedInterventionCost);
    }

    return {
      customer: c,
      score,
      protectedCapital,
      cost: c.simulatedInterventionCost,
      riskImpact: c.churnProbability
    };
  });

  // Sort descending by knapsack efficiency score
  scored.sort((a, b) => b.score - a.score);

  // 3. Knapsack capacity & budget accumulator
  const selected: Customer[] = [];
  let totalCost = 0;
  let totalProtectedBalance = 0;
  let totalRiskReductionScore = 0;

  for (const item of scored) {
    if (selected.length >= params.targetCapacity) break;
    if (totalCost + item.cost > params.totalBudget) continue;

    selected.push(item.customer);
    totalCost += item.cost;
    totalProtectedBalance += item.protectedCapital;
    totalRiskReductionScore += item.riskImpact;
  }

  const avgRisk = selected.length > 0
    ? Math.round(selected.reduce((acc, c) => acc + c.riskScore, 0) / selected.length)
    : 0;

  return {
    optimizationId: 'OPT-' + Date.now().toString().slice(-6),
    scenarioName: params.scenarioName,
    targetCapacity: params.targetCapacity,
    totalBudget: params.totalBudget,
    selectedCustomers: selected,
    totalRiskReduction: Math.round(totalRiskReductionScore * 10) / 10,
    totalProtectedBalance: Math.round(totalProtectedBalance),
    estimatedCost: totalCost,
    averageRiskScore: avgRisk,
    timestamp: new Date().toISOString()
  };
}
