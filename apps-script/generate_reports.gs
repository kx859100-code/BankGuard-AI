/**
 * Generates an executive dashboard summary tab inside Google Sheets.
 */
function generateExecutiveSummarySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Executive_Summary');
  if (!sheet) {
    sheet = ss.insertSheet('Executive_Summary');
  }
  sheet.clear();

  const apiUrl = getApiBaseUrl() + '/dashboard/kpis';
  try {
    const res = UrlFetchApp.fetch(apiUrl, { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) {
      SpreadsheetApp.getUi().alert('API fetch failed: ' + res.getContentText());
      return;
    }
    const data = JSON.parse(res.getContentText());

    sheet.getRange('A1').setValue('BANKGUARD AI — EXECUTIVE CHURN REPORT').setFontSize(14).setFontWeight('bold');
    sheet.getRange('A2').setValue('Generated at: ' + new Date().toISOString());

    const kpiHeaders = ['Metric', 'Value', 'Benchmark'];
    sheet.getRange('A4:C4').setValues([kpiHeaders]).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF');
    
    const kpis = [
      ['Total Active Customers', data.totalCustomers, '10,000 Portfolio Base'],
      ['Observed Churned Customers', data.churnedCustomers, 'Target Variable (Exited=1)'],
      ['Portfolio Churn Rate', data.overallChurnRate + '%', 'European Retail Avg ~18-22%'],
      ['Critical Risk Accounts', data.riskDistribution.critical, 'Risk Score 81-100'],
      ['High Risk Accounts', data.riskDistribution.high, 'Risk Score 61-80'],
      ['High-Value At-Risk Clients', data.highValueAtRiskCount, 'Balance > €100k + High Churn'],
      ['Total Capital Balance Exposed', '€' + (data.totalHighValueBalance || 0).toLocaleString(), 'At-Risk Capital Exposure']
    ];
    sheet.getRange(5, 1, kpis.length, 3).setValues(kpis);
    sheet.autoResizeColumns(1, 3);
    SpreadsheetApp.getUi().alert('Executive Summary Sheet generated successfully.');
  } catch (e) {
    SpreadsheetApp.getUi().alert('Failed generating report: ' + e.toString());
  }
}
