/**
 * BankGuard AI — Google Apps Script Enterprise Connector
 * Synchronizes churn predictions and executive reports directly between
 * BankGuard AI and Google Sheets.
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('BankGuard AI')
    .addItem('Sync Priority Churn Roster', 'syncPriorityChurnRoster')
    .addItem('Import Customer Segments', 'syncCustomerSegments')
    .addItem('Generate Executive Churn Summary', 'generateExecutiveSummarySheet')
    .addSeparator()
    .addItem('Configure API Endpoint', 'configureApiEndpoint')
    .addToUi();
}

function getApiBaseUrl() {
  const props = PropertiesService.getScriptProperties();
  return props.getProperty('BANKGUARD_API_URL') || 'https://bankguard-ai.internal.bank/api/v1';
}

function configureApiEndpoint() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'BankGuard AI API URL',
    'Enter your deployed BankGuard AI backend URL:',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() === ui.Button.OK) {
    PropertiesService.getScriptProperties().setProperty('BANKGUARD_API_URL', response.getResponseText().trim());
    ui.alert('API URL configured successfully.');
  }
}
