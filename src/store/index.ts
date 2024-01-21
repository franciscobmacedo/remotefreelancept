import { defineStore } from "pinia";
import { FrequencyChoices, GrossIncome, TaxRank, Colors } from "@/typings";
import { asCurrency } from "@/utils.js";
import { updateUrlQuery, clearUrlQuery } from "@/router";

export const YEAR_BUSINESS_DAYS = 248;
export const MONTH_BUSINESS_DAYS = 22;
export const SS_MAX_MONTH_INCOME = 5765.16;
export const SUPPORTED_TAX_RANK_YEARS = [2023, 2024];

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
  ssDiscountChoices: number[];
  currentTaxRankYear: (typeof SUPPORTED_TAX_RANK_YEARS)[number];
  taxRanks: { [K in (typeof SUPPORTED_TAX_RANK_YEARS)[number]]: TaxRank[] };
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
    ssDiscountChoices: [
      -0.25, -0.2, -0.15, -0.1, -0.05, 0, +0.05, +0.1, +0.15, +0.2, +0.25,
    ],
    expensesTax: 15,
    maxExpensesTax: 15,
    expenses: 0,
    ssTax: 0.214,
    currentTaxRankYear: 2023,
    taxRanks: {
      2023: [
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
      2024: [
        { id: 1, min: 0, max: 7703, normalTax: 0.1325, averageTax: 0.1325 },
        { id: 2, min: 7703, max: 11623, normalTax: 0.18, averageTax: 0.149 },
        { id: 3, min: 11623, max: 16472, normalTax: 0.23, averageTax: 0.173 },
        { id: 4, min: 16472, max: 21321, normalTax: 0.26, averageTax: 0.192 },
        { id: 5, min: 21321, max: 27146, normalTax: 0.3275, averageTax: 0.221 },
        { id: 6, min: 27146, max: 39791, normalTax: 0.37, averageTax: 0.269 },
        { id: 7, min: 39791, max: 51997, normalTax: 0.435, averageTax: 0.308 },
        { id: 8, min: 51997, max: 81199, normalTax: 0.46, averageTax: 0.359 },
        { id: 9, min: 81199, normalTax: 0.48, max: null, averageTax: null },
      ],
    },
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
        Math.min(SS_MAX_MONTH_INCOME, this.grossIncome.month * 0.7) *
        (1 + this.ssDiscount);
      const yearSS =
        this.ssTax *
        Math.min(SS_MAX_MONTH_INCOME, this.grossIncome.month * 0.7) *
        (1 + this.ssDiscount) *
        12;
      return {
        year: Math.max(yearSS, 20 * 12),
        month: Math.max(monthSS, 20),
        day: monthSS / MONTH_BUSINESS_DAYS,
      };
    },
    specificDeductions() {
      return Math.max(
        4104,
        Math.min(this.ssPay.year, 0.1 * this.grossIncome.year),
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
      const expensesMissing =
        this.expensesNeeded > this.expenses
          ? this.expensesNeeded - this.expenses
          : 0;

      return (
        grossIncome *
          (this.firstYear ? 0.375 : this.secondYear ? 0.5625 : 0.75) +
        expensesMissing
      );
    },
    taxRank(): TaxRank {
      return this.taxRanks[this.currentTaxRankYear].filter(
        (taxRank: TaxRank, index: number) => {
          const isLastRank =
            index === this.taxRanks[this.currentTaxRankYear].length - 1;
          const isBiggerThanMin = taxRank.min < this.taxableIncome;
          const isSmallerThanMax = taxRank.max >= this.taxableIncome;

          if (isLastRank && isBiggerThanMin) {
            return taxRank;
          }
          return isBiggerThanMin && isSmallerThanMax;
        },
      )[0];
    },
    getTaxRanks(): TaxRank[] {
      return this.taxRanks[this.currentTaxRankYear];
    },
    getCurrentTaxRankYear(): (typeof SUPPORTED_TAX_RANK_YEARS)[number] {
      return this.currentTaxRankYear;
    },
    taxRankAvg(): TaxRank {
      if (this.taxRank === undefined || this.taxRank.id === 1) {
        return this.taxRank;
      }
      const avgID = this.taxRank.id - 1;
      return this.taxRanks[this.currentTaxRankYear].filter(
        (taxRank: TaxRank) => taxRank.id == avgID,
      )[0];
    },
    taxIncomeAvg() {
      if (this.rnh) {
        return null;
      }
      if (this.taxRank.id <= 1) {
        return this.taxableIncome;
      }
      return this.taxRankAvg.max;
    },
    taxIncomeNormal() {
      if (this.rnh) {
        return null;
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
        this.irsPay[this.displayFrequency] + this.ssPay[this.displayFrequency],
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
        this.setExpenses(this.expensesNeeded);
      }
      updateUrlQuery({ income: this.income });
    },
    setSsDiscount(value: number) {
      this.ssDiscount = value;
      updateUrlQuery({ ssDiscount: this.ssDiscount });
    },
    setIncomeFrequency(frequency: FrequencyChoices) {
      this.incomeFrequency = frequency;
      updateUrlQuery({ incomeFrequency: this.incomeFrequency });
    },
    setDisplayFrequency(frequency: FrequencyChoices) {
      this.displayFrequency = frequency;
      updateUrlQuery({ displayFrequency: this.displayFrequency });
    },
    setNrMonthsDisplay(nrMonthsDisplay: number) {
      this.nrMonthsDisplay = nrMonthsDisplay;
      updateUrlQuery({ nrMonthsDisplay: this.nrMonthsDisplay });
    },
    setCurrentTaxRankYear(
      taxRankYear: (typeof SUPPORTED_TAX_RANK_YEARS)[number],
    ) {
      this.currentTaxRankYear = taxRankYear;
      updateUrlQuery({ currentTaxRankYear: this.currentTaxRankYear });
    },
    setExpenses(value: number) {
      if (value < 0) {
        this.expenses = 0;
      } else {
        this.expenses = value;
      }
      updateUrlQuery({ expenses: this.expenses });
    },
    setSsFirstYear(value: boolean) {
      this.ssFirstYear = value;
      updateUrlQuery({ ssFirstYear: this.ssFirstYear });
    },
    setFirstYear(value: boolean) {
      console.log("firstYear store", value);
      this.firstYear = value;
      if (value === true && this.secondYear === true) {
        this.secondYear = false;
        updateUrlQuery({
          firstYear: this.firstYear,
          secondYear: this.secondYear,
        });
      } else {
        updateUrlQuery({ firstYear: this.firstYear });
      }
    },
    setSecondYear(value: boolean) {
      console.log("secondYear store", value);
      this.secondYear = value;
      if (value === true) {
        this.firstYear = false;
        updateUrlQuery({
          firstYear: this.firstYear,
          secondYear: this.secondYear,
        });
      } else {
        updateUrlQuery({ secondYear: this.secondYear });
      }
    },
    setRnh(value: boolean) {
      this.rnh = value;
      updateUrlQuery({ rnh: this.rnh });
    },

    setParameterFromUrl(
      value: any,
      setter: CallableFunction,
      parser: Function | null = null,
      validator: CallableFunction | null = null,
    ): boolean {
      if (value === undefined) {
        // undefined means the parameter was not in the URL
        return false;
      }
      if (parser !== null) {
        value = parser(value);
      }

      if (validator !== null && !validator(value)) {
        return false;
      }

      setter(value);
      return true;
    },
    setParametersFromURL(params: object) {
      const numericValidator = (value: number) => !isNaN(value);
      const positiveNumericValidator = (value: number) =>
        numericValidator(value) && value > 0;
      const booleanParser = (value: string) => value.toLowerCase() === "true";
      const frequencyChoicesValidator = (value: string) =>
        Object.values(FrequencyChoices).includes(value as FrequencyChoices);
      const taxRankYearValidator = (value: number) =>
        SUPPORTED_TAX_RANK_YEARS.includes(
          value as (typeof SUPPORTED_TAX_RANK_YEARS)[number],
        );

      const incomeResult = this.setParameterFromUrl(
        params["income"],
        this.setIncome,
        parseInt,
        positiveNumericValidator,
      );
      if (incomeResult) {
        this.validationCount++;
      }

      this.setParameterFromUrl(
        params["incomeFrequency"],
        this.setIncomeFrequency,
        null,
        frequencyChoicesValidator,
      );
      this.setParameterFromUrl(
        params["displayFrequency"],
        this.setDisplayFrequency,
        null,
        frequencyChoicesValidator,
      );
      this.setParameterFromUrl(
        params["nrMonthsDisplay"],
        this.setNrMonthsDisplay,
        parseInt,
        (value: number) => value > 0,
      );
      this.setParameterFromUrl(
        params["ssDiscount"],
        this.setSsDiscount,
        parseFloat,
        (value: number) => this.ssDiscountChoices.includes(value),
      );
      this.setParameterFromUrl(
        params["expenses"],
        this.setExpenses,
        parseInt,
        numericValidator,
      );
      this.setParameterFromUrl(
        params["currentTaxRankYear"],
        this.setCurrentTaxRankYear,
        parseInt,
        taxRankYearValidator,
      );
      this.setParameterFromUrl(
        params["ssFirstYear"],
        this.setSsFirstYear,
        booleanParser,
        null,
      );
      this.setParameterFromUrl(
        params["firstYear"],
        this.setFirstYear,
        booleanParser,
        null,
      );
      this.setParameterFromUrl(
        params["secondYear"],
        this.setSecondYear,
        booleanParser,
        null,
      );
      this.setParameterFromUrl(params["rnh"], this.setRnh, booleanParser, null);
    },
    reset() {
      this.setIncome(null);
      this.setIncomeFrequency(FrequencyChoices.Year);
      this.setDisplayFrequency(FrequencyChoices.Month);
      this.setNrMonthsDisplay(12);
      this.setSsDiscount(0);
      this.setExpenses(0);
      this.setCurrentTaxRankYear(2023);
      this.setSsFirstYear(false);
      this.setFirstYear(false);
      this.setSecondYear(false);
      this.setRnh(false);
      clearUrlQuery();
    },
  },
});

export { useTaxesStore };
