import Vue from "vue";
import Vuex from "vuex";
import { frequencyItems } from "@/utils.js";

Vue.use(Vuex);

const SS_TAX = 0.214;
const SS_MAX_MONTH_INCOME = 5318.4;

export default new Vuex.Store({
  state: {
    valid: false,
    income: null,
    frequency: frequencyItems.YEAR,
    displayFreq: frequencyItems.MONTH,
    YEAR_BUSINESS_DAYS: 248,
    MONTH_BUSINESS_DAYS: 22,
    TAX_RANKS: [
      { id: 1, min: 0, max: 7479, normalTax: 0.145, averageTax: 0.145 },
      { id: 2, min: 7479, max: 11284, normalTax: 0.21, averageTax: 0.1669 },
      { id: 3, min: 11284, max: 15992, normalTax: 0.265, averageTax: 0.1958 },
      { id: 4, min: 15992, max: 20700, normalTax: 0.285, averageTax: 0.2161 },
      { id: 5, min: 20700, max: 26355, normalTax: 0.35, averageTax: 0.2448 },
      { id: 6, min: 26355, max: 38632, normalTax: 0.37, averageTax: 0.2846 },
      { id: 7, min: 38632, max: 50483, normalTax: 0.435, averageTax: 0.3199 },
      { id: 8, min: 50483, max: 78834, normalTax: 0.45, averageTax: 0.3667 },
      { id: 9, min: 78834, normalTax: 0.48 },
    ],
    hasExpenses: true,
    nrMonthsDisplay: 12,
    colors: {
      netIncome: "#76c479",
      irs: "#ff6384",
      ss: "#36a2eb",
    },
    ssDiscount: 0,
  },
  getters: {
    ssPay(state, getters) {
      const monthSS =
        SS_TAX *
        Math.min(
          SS_MAX_MONTH_INCOME,
          getters.grossIncome.month * 0.7 * (1 + state.ssDiscount)
        );
      const yearSS =
        SS_TAX *
        Math.min(
          SS_MAX_MONTH_INCOME * 12,
          getters.grossIncome.year * 0.7 * (1 + state.ssDiscount)
        );
      return {
        year: Math.max(yearSS, 20 * 12),
        month: Math.max(monthSS, 20),
        day: monthSS / state.MONTH_BUSINESS_DAYS,
      };
    },
    specificDeductions(state, getters) {
      return Math.max(
        4104,
        Math.min(getters.ssPay.year, 0.1 * getters.grossIncome.year)
      );
    },
    expenses(state, getters) {
      if (state.income === null) {
        return null;
      }
      const grossIncome = getters.grossIncome.year;
      const diff = 0.15 * grossIncome - getters.specificDeductions;
      return diff < 0 ? 0 : diff;
    },

    taxableIncome(state, getters) {
      const grossIncome = getters.grossIncome.year;
      return state.hasExpenses ? grossIncome * 0.75 : grossIncome * 0.9;
    },
    taxRank(state, getters) {
      const taxableIncome = getters.taxableIncome;
      return state.TAX_RANKS.filter((tr) => {
        if (tr.id == 7 && tr.min < taxableIncome) {
          return tr;
        }
        return tr.min < taxableIncome && tr.max >= taxableIncome;
      })[0];
    },
    taxRankAvg(state, getters) {
      const taxRank = getters.taxRank;
      if (taxRank === undefined || taxRank.id === 1) {
        return taxRank;
      }
      const avgID = taxRank.id - 1;
      return state.TAX_RANKS.filter((tr) => tr.id == avgID)[0];
    },
    taxIncomeAvg(state, getters) {
      if (getters.taxRank.id <= 1) {
        return getters.taxableIncome;
      }
      return getters.taxRankAvg.max;
    },
    taxIncomeNormal(state, getters) {
      if (getters.taxRank.id <= 1) {
        return 0;
      }
      return getters.taxableIncome - getters.taxIncomeAvg;
    },

    irsPay(state, getters) {
      if (getters.taxRankAvg === undefined) {
        return {};
      }

      const yearIRS =
        getters.taxIncomeAvg * getters.taxRankAvg.averageTax +
        getters.taxIncomeNormal * getters.taxRank.normalTax;
      const monthIRS = Math.max(yearIRS / state.nrMonthsDisplay, 0);
      return {
        year: Math.max(yearIRS, 0),
        month: monthIRS,
        day: monthIRS / state.MONTH_BUSINESS_DAYS,
      };
    },
    netIncome(state, getters) {
      const monthIncome =
        getters.grossIncome.month - getters.irsPay.month - getters.ssPay.month;
      return {
        year:
          getters.grossIncome.year - getters.irsPay.year - getters.ssPay.year,
        month: monthIncome,
        day: monthIncome / state.MONTH_BUSINESS_DAYS,
      };
    },
    grossIncome(state) {
      const result = {};
      if (state.nrMonthsDisplay) {
        switch (state.frequency) {
          case frequencyItems.YEAR:
            result.year = state.income;
            result.month = state.income / state.nrMonthsDisplay;
            result.day = state.income / state.YEAR_BUSINESS_DAYS;
            break;
          case frequencyItems.MONTH:
            result.year = state.income * state.nrMonthsDisplay;
            result.month = state.income;
            result.day = state.income / state.MONTH_BUSINESS_DAYS;
            break;
          case frequencyItems.DAY:
            result.year = state.income * state.YEAR_BUSINESS_DAYS;
            result.month =
              (state.income * state.MONTH_BUSINESS_DAYS * 12) /
              state.nrMonthsDisplay;
            result.day = state.income;
        }
      }
      return result;
    },
  },
  mutations: {
    setValid(state, value) {
      state.valid = value;
    },
    setIncome(state, income) {
      state.income = income;
    },
    setFrequency(state, frequency) {
      state.frequency = frequency;
    },
    setHasExpenses(state, hasExpenses) {
      state.hasExpenses = hasExpenses;
    },

    setDisplayFrequency(state, frequency) {
      state.displayFreq = frequency;
    },
    setNrMonthsDisplay(state, nrMonths) {
      console.log("setting nr months display");
      state.nrMonthsDisplay = nrMonths;
    },
    setSsDiscount(state, ssDiscount) {
      state.ssDiscount = ssDiscount;
    },
  },
  actions: {
    validate(context) {
      context.commit("setValid", true);
    },
    unvalid(context) {
      context.commit("setValid", false);
    },
    income(context, income) {
      context.commit("setIncome", income);
    },
  },
});
