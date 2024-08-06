function runAll(){
    stockPriceAPI();
    cashFlowAPIV2();
    stockCagr();
}


async function outstandingSharesAPI() {

    let stock = document.getElementById("stock").value;
    const apiUrl = 'https://api.polygon.io/v3/reference/tickers/' + stock + '?apiKey=Ix4tpJivedA1nWgzXSR8nQjJV1si8jbE';


    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return shares(data);
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
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
         //Cagr(data);
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function CagrAPI(){
    let stock = document.getElementById("stock").value;
    const apiUrl = 'https://api.polygon.io/vX/reference/financials?ticker=' + stock + '&apiKey=Ix4tpJivedA1nWgzXSR8nQjJV1si8jbE';


    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return Cagr(data);
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
        console.log("stock price TEST: "+ price)
        document.getElementById('currentSharePrice').innerText = price;
        return price;
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

        freeFlow = parseFloat(netCashFlowFromOperatingActivities) - parseFloat(netCashFlowFromInvestingActivities);
        console.log('Free cash flow IS: '+freeFlow);
        return freeFlow;
    } else {
        console.log('No financial data available.');
    }
}

function Cagr(data){

    const results = data.results;
    let freeCashFlow = 0;

    // Iterate through the first 4 entries in the array
    //for (let i = 0; i < 5 && i < results.length; i++) {
    if (results.length > 4) {
        const latestResult = results[4];
        const cashFlowStatement = latestResult.financials.cash_flow_statement;

        const netCashFlowFromOperatingActivities = cashFlowStatement.net_cash_flow_from_operating_activities
            ? cashFlowStatement.net_cash_flow_from_operating_activities.value
            : 0;

        const netCashFlowFromInvestingActivities = cashFlowStatement.net_cash_flow_from_investing_activities
            ? cashFlowStatement.net_cash_flow_from_investing_activities.value
            : 0;

        freeCashFlow = parseFloat(netCashFlowFromOperatingActivities) - parseFloat(netCashFlowFromInvestingActivities);
        console.log('Free cash flow IS: '+freeCashFlow);

        return freeCashFlow;
    } else {
        console.log('No financial data available.');
    }
}

function shares(data) {

    try {
        const weightedSharesOutstanding = parseFloat(data.results.weighted_shares_outstanding);
        console.log('Weighted Shares Outstanding:', weightedSharesOutstanding);
        return weightedSharesOutstanding;
    } catch (error) {
        console.error('Error extracting weighted shares outstanding:', error);
        return null;
    }
}

async function calculate(){
    let price = await stockPriceAPI();
    let FCF = await cashFlowAPIV2();
    let OS = await outstandingSharesAPI();

    if (!price || !FCF || !OS) {
        console.error('Error: One of the values (price, FCF, or OS) is undefined or null.');
        return;
    }

    let FCFPS = FCF / OS;
    let FCFPSO = parseFloat(FCFPS.toFixed(2));
    document.getElementById('FCF').innerText = FCFPSO;
    console.log('Free Cash Flow Per Share (FCFPS):', FCFPS);

    let growth = parseFloat(document.getElementById("Growth").value) / 100;
    let years = parseInt(document.getElementById("Years").value);
    let discount = parseFloat(document.getElementById("Discount").value) / 100;

    if (isNaN(growth) || isNaN(years) || isNaN(discount)) {
        console.error('Error: Invalid input values for growth, years, or discount rate.');
        return;
    }

    let FCF_Sum = 0;

    for (let i = 1; i <= years; i++) {
        const dccf = FCFPSO / Math.pow(1 + discount, i);
        FCF_Sum += dccf;
        FCFPSO *= (1 + growth);
    }

    console.log('Sum of Discounted Cash Flows (FCF_Sum):', FCF_Sum);

    let ut = FCF_Sum > price ? "Undervalued" : "Overvalued";
    const percentage = ((FCF_Sum - price) / FCF_Sum) * 100;

    let skrivUt = `Intrinsic value: $${FCF_Sum.toFixed(2)}\n${ut}: ${percentage.toFixed(0)}%`;
    console.log('DCF Value:', skrivUt);
    document.getElementById('value').innerText = skrivUt;
}