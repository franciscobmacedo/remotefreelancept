import { defineStore } from "pinia";
import { FrequencyChoices, GrossIncome, TaxRank, Colors } from "@/typings";
import { asCurrency } from "@/utils.js";

const YEAR_BUSINESS_DAYS = 248;
const MONTH_BUSINESS_DAYS = 22;
const SS_MAX_MONTH_INCOME = 5765.16;

interface TaxesState {
  income: number | null;
  validationCount: number;
  defaultIncomes: number[];
  incomeFrequency: FrequencyChoices;
  displayFrequency: FrequencyChoices;
  nrMonthsDisplay: number;
  ssTax: number;
  expensesTax: number;
  maxExpensesTax: number;
  expenses: number;
  ssDiscount: number;
  taxRanks: TaxRank[];
  colors: Colors;
  rnh: boolean;
  rnhTax: number;
  firstYear: boolean;
  secondYear: boolean;
  ssFirstYear: boolean;
}
const useTaxesStore = defineStore({
  id: "taxes",
  state: (): TaxesState => ({
    income: null,
    validationCount: 0,
    defaultIncomes: [30000, 50000, 60000, 70000, 100000],
    incomeFrequency: FrequencyChoices.Year,
    displayFrequency: FrequencyChoices.Month,
    nrMonthsDisplay: 12,
    ssDiscount: 0,
    expensesTax: 15,
    maxExpensesTax: 15,
    expenses: 0,
    ssTax: 0.214,
    taxRanks: [
      { id: 1, min: 0, max: 7479, normalTax: 0.145, averageTax: 0.145 },
      { id: 2, min: 7479, max: 11284, normalTax: 0.21, averageTax: 0.1669 },
      { id: 3, min: 11284, max: 15992, normalTax: 0.265, averageTax: 0.1958 },
      { id: 4, min: 15992, max: 20700, normalTax: 0.285, averageTax: 0.2161 },
      { id: 5, min: 20700, max: 26355, normalTax: 0.35, averageTax: 0.2448 },
      { id: 6, min: 26355, max: 38632, normalTax: 0.37, averageTax: 0.2846 },
      { id: 7, min: 38632, max: 50483, normalTax: 0.435, averageTax: 0.3199 },
      { id: 8, min: 50483, max: 78834, normalTax: 0.45, averageTax: 0.3667 },
      { id: 9, min: 78834, normalTax: 0.48, max: null, averageTax: null },
    ],
    rnh: false,
    rnhTax: 0.2,
    firstYear: false,
    secondYear: false,
    ssFirstYear: false,
    colors: {
      netIncome: "#76c479",
      irs: "#ff6384",
      ss: "#36a2eb",
    },
  }),
  getters: {
    showDashboard: (state) => {
      return (
        state.validationCount > 0 && state.income !== null && state.income !== 0
      );
    },

    grossIncome: (state) => {
      const result: GrossIncome = {
        year: 0,
        month: 0,
        day: 0,
      };
      if (state.nrMonthsDisplay) {
        switch (state.incomeFrequency) {
          case FrequencyChoices.Year:
            result.year = state.income;
            result.month = state.income / state.nrMonthsDisplay;
            result.day = state.income / YEAR_BUSINESS_DAYS;
            break;
          case FrequencyChoices.Month:
            result.year = state.income * state.nrMonthsDisplay;
            result.month = state.income;
            result.day = state.income / MONTH_BUSINESS_DAYS;
            break;
          case FrequencyChoices.Day:
            result.year = state.income * YEAR_BUSINESS_DAYS;
            result.month =
              (state.income * MONTH_BUSINESS_DAYS * 12) / state.nrMonthsDisplay;
            result.day = state.income;
        }
      }
      return result;
    },
    ssPay() {
      if (this.ssFirstYear) {
        return {
          year: 0,
          month: 0,
          day: 0,
        };
      }
      const monthSS =
        this.ssTax *
        Math.min(
          SS_MAX_MONTH_INCOME,
          this.grossIncome.month * 0.7 * (1 + this.ssDiscount)
        );
      const yearSS =
        this.ssTax *
        Math.min(
          SS_MAX_MONTH_INCOME * 12,
          this.grossIncome.year * 0.7 * (1 + this.ssDiscount)
        );
      return {
        year: Math.max(yearSS, 20 * 12),
        month: Math.max(monthSS, 20),
        day: monthSS / MONTH_BUSINESS_DAYS,
      };
    },
    specificDeductions() {
      return Math.max(
        4104,
        Math.min(this.ssPay.year, 0.1 * this.grossIncome.year)
      );
    },

    maxExpenses() {
      if (this.income === null) {
        return null;
      }
      const grossIncome = this.grossIncome.year;
      return (this.maxExpensesTax / 100) * grossIncome;
    },

    hasExpenses() {
      return this.expenses > 0;
    },
    expensesNeeded() {
      const expenses = this.maxExpenses - this.specificDeductions;
      return expenses > 0 ? expenses : 0;
    },
    taxableIncome() {
      const grossIncome = this.grossIncome.year;
      if (this.hasExpenses || this.expensesNeeded <= 0) {
        const expensesMissing =
          this.expensesNeeded > this.expenses
            ? this.expensesNeeded - this.expenses
            : 0;

        return grossIncome * (this.firstYear ? 0.375 : this.secondYear ? 0.5625 :   0.75) + expensesMissing;
      }
      return grossIncome * (this.firstYear ? 0.45 : this.secondYear ? 0.675 :   0.9);
    },
    taxRank(): TaxRank {
      return this.taxRanks.filter((taxRank: TaxRank, index: number) => {
        const isLastRank = index === this.taxRanks.length - 1;
        const isBiggerThanMin = taxRank.min < this.taxableIncome;
        const isSmallerThanMax = taxRank.max >= this.taxableIncome;

        if (isLastRank && isBiggerThanMin) {
          return taxRank;
        }
        return isBiggerThanMin && isSmallerThanMax;
      })[0];
    },
    taxRankAvg(): TaxRank {
      if (this.taxRank === undefined || this.taxRank.id === 1) {
        return this.taxRank;
      }
      const avgID = this.taxRank.id - 1;
      return this.taxRanks.filter((taxRank: TaxRank) => taxRank.id == avgID)[0];
    },
    taxIncomeAvg() {
      if (this.rnh){
        return null
      }
      if (this.taxRank.id <= 1) {
        return this.taxableIncome;
      }
      return this.taxRankAvg.max;
    },
    taxIncomeNormal() {
      if (this.rnh){
        return null
      }
      if (this.taxRank.id <= 1) {
        return 0;
      }
      return this.taxableIncome - this.taxIncomeAvg;
    },

    irsPay() {
      if (this.taxRankAvg === undefined) {
        return {};
      }
      let yearIRS;
      if (this.rnh) {
        yearIRS = this.taxableIncome * this.rnhTax;
      } else {
        yearIRS =
          this.taxIncomeAvg * this.taxRankAvg.averageTax +
          this.taxIncomeNormal * this.taxRank.normalTax;
      }

      const monthIRS = Math.max(yearIRS / this.nrMonthsDisplay, 0);
      return {
        year: Math.max(yearIRS, 0),
        month: monthIRS,
        day: monthIRS / MONTH_BUSINESS_DAYS,
      };
    },
    taxesDisplay() {
      return asCurrency(
        this.irsPay[this.displayFrequency] + this.ssPay[this.displayFrequency]
      );
    },
    netIncome() {
      const monthIncome =
        this.grossIncome.month - this.irsPay.month - this.ssPay.month;
      return {
        year: this.grossIncome.year - this.irsPay.year - this.ssPay.year,
        month: monthIncome,
        day: monthIncome / MONTH_BUSINESS_DAYS,
      };
    },
    irsFrequency() {
      return this.irsPay[this.displayFrequency];
    },
    irsDisplay() {
      return asCurrency(this.irsFrequency);
    },
    ssFrequency() {
      return this.ssPay[this.displayFrequency];
    },
    ssDisplay() {
      return asCurrency(this.ssFrequency);
    },
    netIncomeFrequency() {
      return this.netIncome[this.displayFrequency];
    },
    netIncomeDisplay(): string {
      return asCurrency(this.netIncomeFrequency);
    },
  },
  actions: {
    setIncome(value: number) {
      if (value <= 0) {
        this.income = null;
      } else {
        this.income = value ? value : 0;
        this.expenses = this.expensesNeeded;
      }
    },
    setSsDiscount(value: number) {
      this.ssDiscount = value;
    },
    setIncomeFrequency(frequency: FrequencyChoices) {
      this.incomeFrequency = frequency;
    },
    setDisplayFrequency(frequency: FrequencyChoices) {
      this.displayFrequency = frequency;
    },
  },
});

export { useTaxesStore };
