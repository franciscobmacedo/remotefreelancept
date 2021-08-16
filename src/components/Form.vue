<template>
  <div>
    <v-form ref="form">
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
    <!-- <div v-if="valid">
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

    </div> -->
  </div>
</template>

<script>
import { frequencyItems } from "@/utils.js";

// const TAX_RANKS = [
//   { id: 1, min: 0, max: 7112, normalTax: 0.15, averageTax: 0.145 },
//   { id: 2, min: 7112, max: 10732, normalTax: 0.23, averageTax: 0.1737 },
//   { id: 3, min: 10732, max: 20322, normalTax: 0.29, averageTax: 0.2262 },
//   { id: 4, min: 20322, max: 25075, normalTax: 0.35, averageTax: 0.2497 },
//   { id: 5, min: 25075, max: 36967, normalTax: 0.37, averageTax: 0.2884 },
//   { id: 6, min: 36967, max: 80882, normalTax: 0.45, averageTax: 0.3761 },
//   { id: 7, min: 80882, normalTax: 0.48 },
// ];
import { mapState, mapGetters } from "vuex";

export default {
  data: () => ({
    frequencyItems: Object.values(frequencyItems),
  }),
  computed: {
    ...mapState(["valid", "frequencyIncome"]),
    ...mapGetters([
      "ssPay",
      "expenses",
      "taxableIncome",
      "taxRank",
      "taxRankAvg",
      "irsPay",
      "netIncome",
    ]),
    hasExpenses: {
      get() {
        return this.$store.state.hasExpenses;
      },
      set(value) {
        this.$store.commit("hasExpenses", value);
      },
    },
    frequency: {
      get() {
        return this.$store.state.frequency;
      },
      set(value) {
        this.$store.commit("frequency", value);
      },
    },
    income: {
      get() {
        return this.$store.state.income;
      },
      set(value) {
        this.$store.commit("income", value);
      },
    },
    expensesLabelText() {
      const expenseText = this.expenses === null ? "" : `(${this.expenses}€) `;
      return (
        "Can you have professional related expenses " +
        expenseText +
        "to be granteed the 15% discount?"
      );
    },
  },
  methods: {
    validate() {
      const result = this.$refs.form.validate();
      if (result) {
        this.$store.dispatch("validate");
      } else {
        this.$store.dispatch("unvalid");
      }
    },

    round(num) {
      return Math.round(num * 100) / 100;
    },
  },
};
</script>