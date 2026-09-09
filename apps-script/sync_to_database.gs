/**
 * Synchronizes prioritized high-risk customers from BankGuard AI into the current Google Sheet.
 */
function syncPriorityChurnRoster() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Priority_Churn_Roster');
  if (!sheet) {
    sheet = ss.insertSheet('Priority_Churn_Roster');
  }
  sheet.clear();

  const apiUrl = getApiBaseUrl() + '/churn/predictions?limit=500&riskCategory=CRITICAL';
  
  try {
    const response = UrlFetchApp.fetch(apiUrl, {
      method: 'get',
      headers: { 'Accept': 'application/json' },
      muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
      SpreadsheetApp.getUi().alert('Failed to connect to BankGuard AI: ' + response.getContentText());
      return;
    }

    const customers = JSON.parse(response.getContentText());
    
    // Header formatting
    const headers = [
      'Customer ID', 'Surname', 'Country', 'Age', 'Balance (€)', 
      'Products', 'Active Member', 'Credit Score', 'Churn Probability', 
      'Risk Score', 'Risk Level', 'Segment', 'Recommended Action'
    ];
    
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1E293B').setFontColor('#FFFFFF');

    const rows = customers.map(c => [
      c.customerId,
      c.surname,
      c.geography,
      c.age,
      c.balance,
      c.numOfProducts,
      c.isActiveMember ? 'Yes' : 'No',
      c.creditScore,
      (c.churnProbability * 100).toFixed(1) + '%',
      c.riskScore,
      c.riskCategory,
      c.segment,
      c.recommendedAction
    ]);

    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      sheet.autoResizeColumns(1, headers.length);
    }
    
    SpreadsheetApp.getUi().alert(`Successfully imported ${rows.length} critical at-risk customer records.`);
  } catch (err) {
    SpreadsheetApp.getUi().alert('Error syncing data: ' + err.toString());
  }
}
