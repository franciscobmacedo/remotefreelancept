import Vue from "vue";
import Vuex from "vuex";
import {frequencyItems} from "@/utils.js";

Vue.use(Vuex);




const YEAR_BUSINESS_DAYS = 248;
const MONTH_BUSINESS_DAYS = 22;

const SOCIAL_SECURITY_TAX = 0.214;
const TAX_RANKS = [
  { id: 1, min: 0, max: 7112, normalTax: 0.15, averageTax: 0.145 },
  { id: 2, min: 7112, max: 10732, normalTax: 0.23, averageTax: 0.1737 },
  { id: 3, min: 10732, max: 20322, normalTax: 0.29, averageTax: 0.2262 },
  { id: 4, min: 20322, max: 25075, normalTax: 0.35, averageTax: 0.2497 },
  { id: 5, min: 25075, max: 36967, normalTax: 0.37, averageTax: 0.2884 },
  { id: 6, min: 36967, max: 80882, normalTax: 0.45, averageTax: 0.3761 },
  { id: 7, min: 80882, normalTax: 0.48 },
];

export default new Vuex.Store({
    state: {
        valid: false,
        income: null,
        frequency: frequencyItems.YEAR,
        displayFreq: frequencyItems.MONTH,
        grossIncome: {
          month: 3700,
          day: 170,
          year: 40000
        },
        hasExpenses: false,
        nrMonthsDisplay: 12,
        colors:{
          netIncome: "#76c479",
          irs: "#ff6384",
          ss: "#36a2eb",
        }
      },
      getters:{
        
        ssPay(state) {
          const monthSS = SOCIAL_SECURITY_TAX * state.grossIncome.month * 0.7
          return {
            year: SOCIAL_SECURITY_TAX * state.grossIncome.year * 0.7,
            month: monthSS,
            day: monthSS/MONTH_BUSINESS_DAYS,
          };
        },
        specificDeductions(state, getters){
          return Math.max(4104, Math.min(getters.ssPay.year, 0.1 * state.grossIncome.year));
        },
        expenses(state, getters) {
          if (state.income === null) {
            return null;
          }
          const grossIncome = state.grossIncome.year;
          const diff = 0.15 * grossIncome - getters.specificDeductions
          return diff < 0 ? 0 : diff;
        },
        expensesLabelText(state, getters) {
          const expenseText = getters.expenses === null ? "" : `(${getters.expenses}€) `;
          return (
            "Can you have professional related expenses " +
            expenseText +
            "to be granteed the 15% discount?"
          );
        },
        taxableIncome(state) {
          const grossIncome = state.grossIncome.year;
          return state.hasExpenses ? grossIncome * 0.75 : grossIncome * 0.9;
        },
        taxRank(state) {
          const grossIncome = state.grossIncome.year;
          return TAX_RANKS.filter((tr) => {
            if (tr.id == 7 && tr.min < grossIncome) {
              return tr;
            }
            return tr.min < grossIncome && tr.max >= grossIncome;
          })[0];
        },
        taxRankAvg(state, getters) {
          const taxRank = getters.taxRank;
          if (taxRank === undefined || taxRank.id === 1) {
            return taxRank;
          }
          const avgID = taxRank.id - 1;
          return TAX_RANKS.filter((tr) => tr.id == avgID)[0];
        },
        taxIncomeAvg(state, getters){
          if (getters.taxRank.id <= 1){
            return getters.taxableIncome
          }
          return getters.taxRankAvg.max 
        },
        taxIncomeNormal(state, getters){
          if (getters.taxRank.id <= 1){
            return 0
          }
          return getters.taxableIncome - getters.taxIncomeAvg
        },
       
  
        irsPay(state, getters) {
          if (getters.taxRankAvg === undefined) {
            return {};
          }

          const yearIRS =
            getters.taxIncomeAvg * getters.taxRankAvg.averageTax +
            getters.taxIncomeNormal * getters.taxRank.normalTax;
            const monthIRS = Math.max(yearIRS / state.nrMonthsDisplay, 0)
          return {
            year: Math.max(yearIRS, 0),
            month: monthIRS,
            day: monthIRS/MONTH_BUSINESS_DAYS,
          };
        },
        netIncome(state, getters) {
          const monthIncome = state.grossIncome.month - getters.irsPay.month - getters.ssPay.month; 
          return {
            year: state.grossIncome.year - getters.irsPay.year - getters.ssPay.year,
            month: monthIncome,
            day: monthIncome/MONTH_BUSINESS_DAYS,
            
          };
        },
      },
      mutations: {
        valid(state, value){
          state.valid = value
        },
      income (state, income) {
          state.income = income
      },
      frequency (state, frequency) {
          state.frequency = frequency
      },
      hasExpenses (state, hasExpenses) {
        state.hasExpenses = hasExpenses
      },
      grossIncome(state){
          const result = {};
          switch (state.frequency) {
            case frequencyItems.YEAR:
              result.year = state.income;
              result.month = state.income / state.nrMonthsDisplay;
              result.day = state.income / YEAR_BUSINESS_DAYS;
              break;
            case frequencyItems.MONTH:
              result.year = state.income * state.nrMonthsDisplay;
              result.month = state.income;
              result.day = state.income / MONTH_BUSINESS_DAYS;
              break;
            case frequencyItems.DAY:
              result.year = state.income * YEAR_BUSINESS_DAYS;
              result.month = state.income * MONTH_BUSINESS_DAYS;
              result.day = state.income;
          }
          state.grossIncome = result;
        },
        setDisplayFrequency(state, frequency){
          state.displayFreq = frequency
      },
        setNrMonthsDisplay(state, nrMonths){
            state.nrMonthsDisplay = nrMonths
        }
      },
      actions:{
         validate (context) {
          context.commit('valid', true);
          context.commit('grossIncome');
        },
        unvalid(context){
          context.commit('valid', false);
        },
        income(context, income){
          context.commit('income', income);
        }
      }
});