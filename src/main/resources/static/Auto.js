// Define the API URL
function outstandingSharesAPI() {

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
            shares(data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function cashFlowAPI() {
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
            shares(data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function stockPriceAPI(){
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
            //console.log(data);
            stockPrice(data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


/////////////////////////////////////

function shares(data) {

    try {
        const weightedSharesOutstanding = data.results.weighted_shares_outstanding;
        console.log('Weighted Shares Outstanding:', weightedSharesOutstanding);

    } catch (error) {
        console.error('Error extracting weighted shares outstanding:', error);
    }
}

function stockPrice(data){
    try {
        const weightedSharesOutstanding = data.results.weighted_shares_outstanding;
        const stockPrice = data.results.market_cap;
        let price = stockPrice/weightedSharesOutstanding;
        console.log("stock price: "+ price)

    } catch (error) {
        console.error('Error extracting weighted shares outstanding:', error);
    }
}

function logLatestCashFlows(data, shares) {
    const results = data.results;

    // Assuming the latest data is the first entry in the array
    if (results.length > 0) {
        const latestResult = results[0];
        const cashFlowStatement = latestResult.financials.cash_flow_statement;

        const netCashFlowFromOperatingActivities = cashFlowStatement.net_cash_flow_from_operating_activities
            ? cashFlowStatement.net_cash_flow_from_operating_activities.value
            : 0;

        const netCashFlowFromInvestingActivities = cashFlowStatement.net_cash_flow_from_investing_activities
            ? cashFlowStatement.net_cash_flow_from_investing_activities.value
            : 0;
/*
        console.log(`Latest Period:`);
        console.log(`Net Cash Flow from Operating Activities: ${netCashFlowFromOperatingActivities}`);
        console.log(`Net Cash Flow from Investing Activities: ${netCashFlowFromInvestingActivities}`);
 */
        let freeFlow = netCashFlowFromOperatingActivities - netCashFlowFromInvestingActivities;

        console.log('Free cash flow: '+freeFlow);
    } else {
        console.log('No financial data available.');
    }
}