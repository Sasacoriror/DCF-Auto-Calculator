function runAll(){
    stockPriceAPI();
    cashFlowAPIV2();
}



async function cashFlowAPIV2(){
    let stock = document.getElementById("stock").value;
    const apiUrl = 'https://api.polygon.io/vX/reference/financials?ticker=' + stock + '&apiKey=Ix4tpJivedA1nWgzXSR8nQjJV1si8jbE';


    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return latestCashFlows(data);
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function stockPriceAPI(){
    let stock = document.getElementById("stock").value;
    const apiUrl = 'https://api.polygon.io/v3/reference/tickers/' + stock + '?apiKey=Ix4tpJivedA1nWgzXSR8nQjJV1si8jbE';


    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return stockPrice(data);
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}


/////////////////////////////////////

function stockPrice(data){
    try {
        const weightedSharesOutstanding = parseFloat(data.results.weighted_shares_outstanding);
        const stockPrice = parseFloat(data.results.market_cap);
        let price = stockPrice/weightedSharesOutstanding;
        console.log("stock price: "+ price)
        document.getElementById('currentSharePrice').innerText = price;
    } catch (error) {
        console.error('Error extracting weighted shares outstanding:', error);
    }


}

function latestCashFlows(data) {
    const results = data.results;
    let freeFlow = 0

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
        freeFlow = parseFloat(netCashFlowFromOperatingActivities) - parseFloat(netCashFlowFromInvestingActivities);
        console.log('Free cash flow IS: '+freeFlow);
        document.getElementById('FCF').innerText = freeFlow;
        return freeFlow;
    } else {
        console.log('No financial data available.');
    }
}

function Cagr(){

}

async function test(){

    //let cash = await
    //let shares = await

}