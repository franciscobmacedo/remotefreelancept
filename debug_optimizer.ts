
const SS_WORKER_RATE = 0.11;
const SS_EMPLOYER_RATE = 0.2375;
const IRC_THRESHOLD = 50000;
const IRC_RATE_LOW = 0.17;
const IRC_RATE_HIGH = 0.21;
const MINIMUM_WAGE_2025 = 870;
const YEAR_BUSINESS_DAYS = 248;

// Mock Tax Ranks (2025 estimated or simplified)
const taxRanks = [
    { id: 1, min: 0, max: 7703, normalTax: 0.13, averageTax: 0.13 },
    { id: 2, min: 7703, max: 11623, normalTax: 0.165, averageTax: 0.142 },
    { id: 3, min: 11623, max: 16472, normalTax: 0.22, averageTax: 0.165 },
    { id: 4, min: 16472, max: 21321, normalTax: 0.25, averageTax: 0.184 },
    { id: 5, min: 21321, max: 27142, normalTax: 0.32, averageTax: 0.213 },
    { id: 6, min: 27142, max: 39791, normalTax: 0.355, averageTax: 0.258 },
    { id: 7, min: 39791, max: 51997, normalTax: 0.387, averageTax: 0.288 },
    { id: 8, min: 51997, max: 81199, normalTax: 0.43, averageTax: 0.339 },
    { id: 9, min: 81199, max: null, normalTax: 0.48, averageTax: null },
];

function getTaxRankForIncome(income) {
    for (let i = taxRanks.length - 1; i >= 0; i--) {
        const rank = taxRanks[i];
        if (income >= rank.min && (rank.max === null || income <= rank.max)) {
            return rank;
        }
    }
    return taxRanks[0];
}

function calculateIRS(taxableIncome, taxRank) {
    let yearIRS;
    if (taxRank.id === 1) {
        yearIRS = taxableIncome * taxRank.normalTax;
    } else {
        const avgRankIndex = taxRank.id - 2;
        const avgRank = taxRanks[avgRankIndex];
        const taxIncomeAvg = avgRank.max || 0;
        const taxIncomeNormal = taxableIncome - taxIncomeAvg;
        yearIRS = taxIncomeAvg * (avgRank.averageTax || avgRank.normalTax) + taxIncomeNormal * taxRank.normalTax;
    }
    return Math.max(yearIRS, 0);
}

function optimize(grossIncomeYear) {
    const minSalary = MINIMUM_WAGE_2025 * 12;
    const maxSsIncome = 12 * 509.26 * 12; // Approx 12x IAS

    let bestSalary = minSalary;
    let maxNetIncome = 0;

    console.log(`Optimizing for Gross Income: ${grossIncomeYear}`);
    console.log(`Min Salary: ${minSalary}`);

    for (let salary = minSalary; salary <= grossIncomeYear; salary += 1000) { // Step 1000 for debug speed
        const monthlySalary = salary / 12;

        const ssBase = Math.min(maxSsIncome / 12, monthlySalary);
        const ssWorkerYear = ssBase * SS_WORKER_RATE * 12;
        const ssCompanyYear = ssBase * SS_EMPLOYER_RATE * 12;

        const expenses = 0; // Assume 0 for simplicity

        const totalCompanyCost = salary + ssCompanyYear + expenses;
        if (totalCompanyCost > grossIncomeYear) {
            console.log(`Salary ${salary}: Cost ${totalCompanyCost} > Income. Break.`);
            break;
        }

        const profit = Math.max(0, grossIncomeYear - salary - expenses - ssCompanyYear);

        let ircYear = 0;
        if (profit <= IRC_THRESHOLD) {
            ircYear = profit * IRC_RATE_LOW;
        } else {
            ircYear = IRC_THRESHOLD * IRC_RATE_LOW + (profit - IRC_THRESHOLD) * IRC_RATE_HIGH;
        }

        const taxRank = getTaxRankForIncome(salary);
        const irsPay = calculateIRS(salary, taxRank);

        const salaryNet = salary - irsPay - ssWorkerYear;
        const profitAfterIRC = profit - ircYear;
        const irsDividendos = profitAfterIRC * 0.28;
        const dividendosNet = profitAfterIRC - irsDividendos;

        const totalNet = salaryNet + dividendosNet;

        console.log(`Salary: ${salary}, Net: ${totalNet.toFixed(2)} (SalNet: ${salaryNet.toFixed(2)}, DivNet: ${dividendosNet.toFixed(2)}, IRS: ${irsPay.toFixed(2)}, SS: ${ssWorkerYear.toFixed(2)})`);

        if (totalNet > maxNetIncome) {
            maxNetIncome = totalNet;
            bestSalary = salary;
        }
    }

    console.log(`Best Salary: ${bestSalary}, Max Net: ${maxNetIncome.toFixed(2)}`);
}

optimize(60000);
