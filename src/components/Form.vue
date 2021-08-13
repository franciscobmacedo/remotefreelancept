<template>
  <div>
    <v-form v-model="valid" ref="form">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              @input="validate"
              v-model="income"
              type="number"
              :rules="[
                (v) => v > 0 || 'Your Income can\'t really be 0, can it?',
              ]"
              label="Income"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              @input="validate"
              v-model="frequency"
              :items="frequencyItems"
              return-object
              :rules="[(v) => !!v || 'frequency is required']"
              label="Frequency"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-checkbox
              v-model="hasExpenses"
              :label="expensesLabelText"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <div v-if="valid">
      <v-row>
        <v-col cols="12" md="3"> Title </v-col>
        <v-col cols="12" md="3"> Year Income </v-col>
        <v-col cols="12" md="3"> Month Income </v-col>
        <v-col cols="12" md="3"> Day Income </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="3"> Income </v-col>
        <v-col cols="12" md="3"> {{ round(frequencyIncome.year) }} </v-col>
        <v-col cols="12" md="3">
          {{ round(frequencyIncome.month) }}
        </v-col>
        <v-col cols="12" md="3"> {{ round(frequencyIncome.day) }} </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="3"> Year Expenses </v-col>
        <v-col cols="12" md="3"> {{ expenses }} </v-col>
        <v-col cols="12" md="3"> - </v-col>
        <v-col cols="12" md="3"> - </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="3"> SS </v-col>
        <v-col cols="12" md="3"> {{ round(ssPay.year) }} </v-col>
        <v-col cols="12" md="3"> {{ round(ssPay.month) }} </v-col>
        <v-col cols="12" md="3"> - </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="3"> IRS </v-col>
        <v-col cols="12" md="3"> {{ round(irsPay.year) }} </v-col>
        <v-col cols="12" md="3"> {{ round(irsPay.month) }} </v-col>
        <v-col cols="12" md="3"> - </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="3"> NET Income </v-col>
        <v-col cols="12" md="3"> {{ round(netIncome.year) }} </v-col>
        <v-col cols="12" md="3"> {{ round(netIncome.month) }} </v-col>
        <v-col cols="12" md="3"> - </v-col>
      </v-row>

      {{ taxableIncome }}
      {{ taxRank }}
      {{ taxRankAvg }}
      {{ irsPay }}
    </div>
  </div>
</template>

<script>
const frequencyItems = {
  YEAR: "Year",
  MONTH: "Month",
  DAY: "Day",
};

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

export default {
  data: () => ({
    valid: false,
    income: null,
    formResult: "not valid",
    frequency: frequencyItems.YEAR,
    frequencyItems: Object.values(frequencyItems),
    hasExpenses: false,
  }),
  computed: {
    ssPay() {
      return {
        year: SOCIAL_SECURITY_TAX * this.frequencyIncome.year * 0.7,
        month: SOCIAL_SECURITY_TAX * this.frequencyIncome.month * 0.7,
      };
    },

    frequencyIncome() {
      const result = {};
      switch (this.frequency) {
        case frequencyItems.YEAR:
          result.year = this.income;
          result.month = this.income / 12;
          result.day = this.income / YEAR_BUSINESS_DAYS;
          break;
        case frequencyItems.MONTH:
          result.year = this.income * 12;
          result.month = this.income;
          result.day = this.income / MONTH_BUSINESS_DAYS;
          break;
        case frequencyItems.DAY:
          result.year = this.income * YEAR_BUSINESS_DAYS;
          result.month = this.income * MONTH_BUSINESS_DAYS;
          result.day = this.income;
      }
      return result;
    },
    expenses() {
      if (this.income === null) {
        return null;
      }
      const grossIncome = this.frequencyIncome.year;
      const diff =
        0.15 * grossIncome -
        Math.max(4104, Math.min(this.ssPay.year, 0.1 * grossIncome));
      return diff < 0 ? 0 : diff;
    },
    expensesLabelText() {
      const expenseText = this.expenses === null ? "" : `(${this.expenses}€) `;
      return (
        "Can you have professional related expenses " +
        expenseText +
        "to be granteed the 15% discount?"
      );
    },
    taxableIncome() {
      const grossIncome = this.frequencyIncome.year;
      return this.hasExpenses ? grossIncome * 0.75 : grossIncome * 0.9;
    },
    taxRank() {
      const grossIncome = this.frequencyIncome.year;
      return TAX_RANKS.filter((tr) => {
        if (tr.id == 7 && tr.min < grossIncome) {
          return tr;
        }
        return tr.min < grossIncome && tr.max >= grossIncome;
      })[0];
    },
    taxRankAvg() {
      const taxRank = this.taxRank;
      if (taxRank === undefined || taxRank.id === 1) {
        return taxRank;
      }
      const avgID = taxRank.id - 1;
      console.log(avgID);
      return TAX_RANKS.filter((tr) => tr.id == avgID)[0];
    },
    irsPay() {
      if (this.taxRankAvg === undefined) {
        return {};
      }
      const taxIncomeAvg = this.taxRankAvg.max;
      const yearIRS =
        taxIncomeAvg * this.taxRankAvg.averageTax +
        (this.taxableIncome - taxIncomeAvg) * this.taxRank.normalTax;
      return {
        year: yearIRS,
        month: yearIRS / 12,
      };
    },
    netIncome() {
      return {
        year: this.frequencyIncome.year - this.irsPay.year - this.ssPay.year,
        month:
          this.frequencyIncome.month - this.irsPay.month - this.ssPay.month,
      };
    },
  },
  methods: {
    validate() {
      const result = this.$refs.form.validate();
      if (result) {
        this.valid = true;
      } else {
        this.valid = false;
        this.formResult = "NOT valid";
      }
    },

    round(num) {
      return Math.round(num * 100) / 100;
    },
  },
};
</script>