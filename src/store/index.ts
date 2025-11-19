import { defineStore } from "pinia";
import {
  FrequencyChoices,
  GrossIncome,
  TaxRank,
  Colors,
  YouthIrsRank,
  YouthIrs,
} from "@/typings";
import { asCurrency, generateUUID } from "@/utils.js";
import { updateUrlQuery, clearUrlQuery } from "@/router";

export const YEAR_BUSINESS_DAYS = 248;
//export const MONTH_BUSINESS_DAYS = 22; // No longer used by this simulator, only year business days are taken into account
export const SUPPORTED_TAX_RANK_YEARS = ([2023, 2024, 2025]).sort((a, b) => b - a);
const SIMULATIONS_LOCAL_STORE_KEY = "net_income_simulations";

interface TaxesState {
  income: number | null;
  validationCount: number;
  defaultIncomes: number[];
  incomeFrequency: FrequencyChoices;
  displayFrequency: FrequencyChoices;
  nrMonthsDisplay: number;
  nrDaysOff: number;
  ssTax: number;
  expensesTax: number;
  maxExpensesTax: number;
  expenses: number;
  expensesAuto: boolean;
  ssDiscount: number;
  ssDiscountChoices: number[];
  currentTaxRankYear: (typeof SUPPORTED_TAX_RANK_YEARS)[number];
  taxRanks: { [K in (typeof SUPPORTED_TAX_RANK_YEARS)[number]]: TaxRank[] };
  iasPerYear: { [K in (typeof SUPPORTED_TAX_RANK_YEARS)[number]]: number };
  youthIrs: { [K in (typeof SUPPORTED_TAX_RANK_YEARS)[number]]: YouthIrs };
  colors: Colors;
  rnh: boolean;
  rnhTax: number;
  firstYear: boolean;
  secondYear: boolean;
  ssFirstYear: boolean;
  benefitsOfYouthIrs: boolean;
  yearOfYouthIrs: number;
  storedSimulations:
    | [
        {
          id: string;
          simulationName: string;
          createdAt: string;
          parameters: Record<string, string>;
        },
      ]
    | null;
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
    nrDaysOff: 0,
    ssDiscount: 0,
    ssDiscountChoices: [
      -0.25, -0.2, -0.15, -0.1, -0.05, 0, +0.05, +0.1, +0.15, +0.2, +0.25,
    ],
    expensesTax: 15,
    maxExpensesTax: 15,
    expenses: 0,
    expensesAuto: true,
    ssTax: 0.214,
    currentTaxRankYear: SUPPORTED_TAX_RANK_YEARS[0], //This array should be sorted in descending order
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
        { id: 1, min: 0, max: 7703, normalTax: 0.13, averageTax: 0.13 },
        { id: 2, min: 7703, max: 11623, normalTax: 0.165, averageTax: 0.1418 },
        { id: 3, min: 11623, max: 16472, normalTax: 0.22, averageTax: 0.16482 },
        { id: 4, min: 16472, max: 21321, normalTax: 0.25, averageTax: 0.18419 },
        { id: 5, min: 21321, max: 27146, normalTax: 0.32, averageTax: 0.21334 },
        { id: 6, min: 27146, max: 39791, normalTax: 0.35, averageTax: 0.25835 },
        { id: 7, min: 39791, max: 43000, normalTax: 0.435, averageTax: 0.27154 },
        { id: 8, min: 43000, max: 80000, normalTax: 0.45, averageTax: 0.35408 },
        { id: 9, min: 80000, normalTax: 0.48, max: null, averageTax: null },
      ],
      2025: [
        { id: 1, min: 0, max: 8059, normalTax: 0.125, averageTax: 0.125 },
        { id: 2, min: 8059, max: 12160, normalTax: 0.16, averageTax: 0.1368 },
        { id: 3, min: 12160, max: 17233, normalTax: 0.215, averageTax: 0.1598 },
        { id: 4, min: 17233, max: 22306, normalTax: 0.244, averageTax: 0.179 },
        { id: 5, min: 22306, max: 28400, normalTax: 0.314, averageTax: 0.2079 },
        { id: 6, min: 28400, max: 41629, normalTax: 0.349, averageTax: 0.2528 },
        { id: 7, min: 41629, max: 44987, normalTax: 0.431, averageTax: 0.2661 },
        { id: 8, min: 44987, max: 83696, normalTax: 0.446, averageTax: 0.3493 },
        { id: 9, min: 83696, normalTax: 0.48, max: null, averageTax: null },
      ],
    },
    iasPerYear: {
      2023: 480.43,
      2024: 509.26,
      2025: 522.50,
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
    youthIrs: {
      2023: {
        1: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 12.5 },
        2: { maxDiscountPercentage: 0.4, maxDiscountIasMultiplier: 10 },
        3: { maxDiscountPercentage: 0.3, maxDiscountIasMultiplier: 7.5 },
        4: { maxDiscountPercentage: 0.3, maxDiscountIasMultiplier: 7.5 },
        5: { maxDiscountPercentage: 0.2, maxDiscountIasMultiplier: 5 },
      },
      2024: {
        1: { maxDiscountPercentage: 1, maxDiscountIasMultiplier: 40 },
        2: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 30 },
        3: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 20 },
        4: { maxDiscountPercentage: 0.5, maxDiscountIasMultiplier: 20 },
        5: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 10 },
      },
      2025: {
        1: { maxDiscountPercentage: 1, maxDiscountIasMultiplier: 55 },
        2: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
        3: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
        4: { maxDiscountPercentage: 0.75, maxDiscountIasMultiplier: 55 },
        5: { maxDiscountPercentage: 0.50, maxDiscountIasMultiplier: 55 },
        6: { maxDiscountPercentage: 0.50, maxDiscountIasMultiplier: 55 },
        7: { maxDiscountPercentage: 0.50, maxDiscountIasMultiplier: 55 },
        8: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
        9: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
        10: { maxDiscountPercentage: 0.25, maxDiscountIasMultiplier: 55 },
      },
    },
    benefitsOfYouthIrs: false,
    yearOfYouthIrs: 1,
    storedSimulations: null,
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
            result.day = state.income / (YEAR_BUSINESS_DAYS - state.nrDaysOff);
            break;
          case FrequencyChoices.Month:
            result.year = state.income * state.nrMonthsDisplay;
            result.month = state.income;
            result.day = result.year / (YEAR_BUSINESS_DAYS - state.nrDaysOff);
            break;
          case FrequencyChoices.Day:
            result.year = state.income * (YEAR_BUSINESS_DAYS - state.nrDaysOff);
            result.month = result.year / state.nrMonthsDisplay;
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
      // We first calculate 70% of the gross income, with the discount applied,
      // then we compare it to the maximum SS income, and we take the minimum
      const monthSS =
        this.ssTax *
        Math.min(
          this.maxSsIncome,
          this.grossIncome.month * 0.7 * (1 + this.ssDiscount),
        );
      const yearSSPay = Math.max(12 * monthSS, 20 * 12);
      return {
        year: yearSSPay,
        month: Math.max(monthSS, 20),
        day: yearSSPay / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
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
        (grossIncome - this.youthIrsDiscount) *
          (this.firstYear ? 0.375 : this.secondYear ? 0.5625 : 0.75) +
        expensesMissing
      );
    },
    youthIrsDiscount() {
      if (!this.benefitsOfYouthIrs) {
        return 0;
      }
      const youthIrsRank =
        this.youthIrs[this.currentTaxRankYear][this.yearOfYouthIrs];
      const maxDiscount =
        youthIrsRank.maxDiscountPercentage * this.grossIncome.year;
      const maxDiscountIas =
        youthIrsRank.maxDiscountIasMultiplier * this.currentIas;
      return Math.min(maxDiscount, maxDiscountIas);
    },
    youthIrsRange() {
      return this.currentTaxRankYear === 2025 ? 10 : 5;
    },
    taxRank(): TaxRank {
      return this.taxRanks[this.currentTaxRankYear].filter(
        (taxRank: TaxRank, index: number) => {
          const isLastRank =
            index === this.taxRanks[this.currentTaxRankYear].length - 1;
          const isBiggerThanMin = taxRank.min <= this.taxableIncome;
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
    maxSsIncome() {
      return 12 * this.currentIas;
    },
    currentIas() {
      return this.iasPerYear[this.currentTaxRankYear];
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
      let yearIRS: number;
      if (this.rnh) {
        yearIRS = this.taxableIncome * this.rnhTax;
      } else {
        yearIRS =
          this.taxIncomeAvg * this.taxRankAvg.averageTax +
          this.taxIncomeNormal * this.taxRank.normalTax;
      }

      const monthIRS = Math.max(yearIRS / this.nrMonthsDisplay, 0);
      const yearIrsPay = Math.max(yearIRS, 0);
      return {
        year: yearIrsPay,
        month: monthIRS,
        day: yearIrsPay / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
      };
    },
    taxesDisplay() {
      return asCurrency(
        this.irsPay[this.displayFrequency] + this.ssPay[this.displayFrequency],
      );
    },
    netIncome() {
      const monthIncome = this.grossIncome.month - this.irsPay.month - this.ssPay.month;
      const yearIncome = this.grossIncome.year - this.irsPay.year - this.ssPay.year;
      return {
        year: yearIncome,
        month: monthIncome,
        day: yearIncome / (YEAR_BUSINESS_DAYS - this.nrDaysOff),
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
    hasStoredSimulations() {
      return this.storedSimulations && this.storedSimulations.length > 0;
    },
    storedSimulationsCount() {
      return this.storedSimulations && this.storedSimulations.length;
    },
  },
  actions: {
    setIncome(value: number) {
      if (value <= 0) {
        this.income = null;
      } else {
        this.income = value ? value : 0;
        if (this.expensesAuto) {
          this.setExpenses(this.expensesNeeded);
        }
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
    setNrDaysOff(nrDaysOff: number) {
      this.nrDaysOff = nrDaysOff;
      updateUrlQuery({ nrDaysOff: this.nrDaysOff });
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
    setExpensesManual(value: number) {
      this.expensesAuto = false;
      this.setExpenses(value);
    },
    setExpensesAuto() {
      this.expensesAuto = true;
      this.setExpenses(this.expensesNeeded);
      updateUrlQuery({
        expenses: undefined,
      });
    },
    setSsFirstYear(value: boolean) {
      this.ssFirstYear = value;
      updateUrlQuery({ ssFirstYear: this.ssFirstYear });
    },
    setBenefitsOfYouthIrs(value: boolean) {
      this.benefitsOfYouthIrs = value;
      updateUrlQuery({ benefitsOfYouthIrs: this.benefitsOfYouthIrs });
    },
    setYearOfYouthIrs(year: number) {
      if (this.isYearOfYouthIrsValid(year)) {
        this.yearOfYouthIrs = year;
        updateUrlQuery({ yearOfYouthIrs: this.yearOfYouthIrs });
      }
    },
    setFirstYear(value: boolean) {
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

        this.setParameterFromUrl(
          params["incomeFrequency"],
          this.setIncomeFrequency,
          null,
          frequencyChoicesValidator,
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
        params["nrDaysOff"],
        this.setNrDaysOff,
        parseInt,
        (value: number) => value >= 0,
      );
      this.setParameterFromUrl(
        params["ssDiscount"],
        this.setSsDiscount,
        parseFloat,
        (value: number) => this.ssDiscountChoices.includes(value),
      );
      this.setParameterFromUrl(
        params["expenses"],
        this.setExpensesManual,
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
      this.setParameterFromUrl(
        params["benefitsOfYouthIrs"],
        this.setBenefitsOfYouthIrs,
        booleanParser,
        null,
      );
      this.setParameterFromUrl(
        params["yearOfYouthIrs"],
        this.setYearOfYouthIrs,
        parseInt,
        this.isYearOfYouthIrsValid,
      );
    },
    getUrlParams() {
      const urlParams = new URLSearchParams(
        window.location.hash.split("/?")[1],
      );

      const params: { [key: string]: string | boolean } = {};

      urlParams.forEach((value, key) => (params[key] = value));

      return params;
    },
    setStoredSimulations(storedSimulations) {
      this.storedSimulations = storedSimulations;
    },
    loadSimulations() {
      if (!this.storedSimulations) {
        const simulations = localStorage.getItem(SIMULATIONS_LOCAL_STORE_KEY);
        this.storedSimulations = simulations ? JSON.parse(simulations) : [];
      }
    },
    deleteSimulation(id: string) {
      const index = this.storedSimulations.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.storedSimulations.splice(index, 1);

        this.updateStoredSimulations();
      }
    },
    updateStoredSimulations() {
      localStorage.setItem(
        SIMULATIONS_LOCAL_STORE_KEY,
        JSON.stringify(this.storedSimulations),
      );
    },
    storeSimulation(simulationName: string) {
      if (!this.storedSimulations) {
        this.loadSimulations();
      }

      this.storedSimulations.push({
        id: generateUUID(),
        simulationName,
        createdAt: new Date().toISOString(),
        parameters: {
          ...this.getUrlParams(),
        },
      });

      this.updateStoredSimulations();
    },
    isYearOfYouthIrsValid (value: number)  {
      const validRange = this.currentTaxRankYear === 2025 ? 10 : 5;
      return value >= 1 && value <= validRange;
    },
    reset() {
      this.setIncome(null);
      this.setIncomeFrequency(FrequencyChoices.Year);
      this.setDisplayFrequency(FrequencyChoices.Month);
      this.setNrMonthsDisplay(12);
      this.setNrDaysOff(0);
      this.setSsDiscount(0);
      this.setExpenses(0);
      this.setCurrentTaxRankYear( SUPPORTED_TAX_RANK_YEARS[0] );
      this.setSsFirstYear(false);
      this.setFirstYear(false);
      this.setSecondYear(false);
      this.setRnh(false);
      this.setBenefitsOfYouthIrs(false);
      this.setYearOfYouthIrs(1);
      clearUrlQuery();
    },
  },
});

export { useTaxesStore };
