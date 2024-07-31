// Define the API URL
function stockInfo() {

    let stock = document.getElementById("stock").value;
    const apiUrl = 'https://api.polygon.io/v3/reference/tickers/' + stock + '?apiKey=Ix4tpJivedA1nWgzXSR8nQjJV1si8jbE';

// Make a GET request
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function cashFlow() {
    let stock = document.getElementById("stock").value;
    const apiUrl = 'https://api.polygon.io/vX/reference/financials?ticker=' + stock + '&apiKey=Ix4tpJivedA1nWgzXSR8nQjJV1si8jbE';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        calculateAndLogCashFlows(data);
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
}

function calculateAndLogCashFlows(data) {
    const results = data.results;

    results.forEach((result, index) => {
        const cashFlowStatement = result.financials.cash_flow_statement;

        const netCashFlowFromOperatingActivities = cashFlowStatement.net_cash_flow_from_operating_activities
            ? cashFlowStatement.net_cash_flow_from_operating_activities.value
            : 0;

        const netCashFlowFromInvestingActivities = cashFlowStatement.net_cash_flow_from_investing_activities
            ? cashFlowStatement.net_cash_flow_from_investing_activities.value
            : 0;

        console.log(`Period ${index + 1}:`);
        console.log(`Net Cash Flow from Operating Activities: ${netCashFlowFromOperatingActivities}`);
        console.log(`Net Cash Flow from Investing Activities: ${netCashFlowFromInvestingActivities}`);
        console.log('---------------------------------------------');
    });
}