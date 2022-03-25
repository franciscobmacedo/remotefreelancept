<template>
  <div>
    <v-form ref="form">
      <v-container>
        <v-row align="center" justify="center">
          {{ select }}

          <v-hover v-slot="{ hover }">
            <v-col cols="8" sm="5" md="4" style="position: relative">
              <v-text-field
                @click="showIncomeSugestions()"
                @keydown="hideIncomeSugestions()"
                v-click-outside="hideIncomeSugestions"
                @input="validate"
                v-model="income"
                label="Income"
                prepend-inner-icon="mdi-chevron-down"
                append-icon="mdi-currency-eur"
                :rules="[
                  (v) =>
                    (!!v && v.length > 0) ||
                    'You must have some income, no...?',
                ]"
                @click:prepend-inner="showIncomeSugestions"
              >
              </v-text-field>
              <span v-if="$vuetify.breakpoint.mdAndUp">
                <v-btn
                  v-if="hover"
                  class="add-btn"
                  x-small
                  outlined
                  color="primary lighten-3"
                  @click="increase()"
                  >+ {{ increaseAmount.text }}€</v-btn
                >
                <v-btn
                  v-if="hover"
                  class="less-btn"
                  x-small
                  outlined
                  color="primary lighten-3"
                  @click="decrease()"
                  >- {{ increaseAmount.text }}€</v-btn
                >
              </span>
              <v-slide-y-transition>
                <div v-if="showsugestions" class="sugestion-box">
                  <v-chip-group
                    style="position: relative"
                    @change="setDefaultIncome()"
                    center-active
                    show-arrows
                    column
                    v-model="defaultIncome"
                  >
                    <v-chip
                      v-for="dincome in defaultIncomesCurr"
                      :key="dincome"
                      :value="dincome"
                    >
                      {{ dincome }}
                    </v-chip>
                  </v-chip-group>
                </div>
              </v-slide-y-transition>
            </v-col>
          </v-hover>

          <div v-if="$vuetify.breakpoint.mdAndUp">/</div>
          <v-col cols="4" sm="3">
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
        </v-row>
        <v-row> </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { frequencyItems } from "@/utils.js";
import { currency, reverseCurrency, currencyNoSymbol } from "@/utils.js";

import { mapState } from "vuex";

export default {
  data: () => ({
    select: null,
    items: ["aa", "bb", "cc"],
    showsugestions: false,
    showIncrement: false,
    defaultIncome: null,
    frequencyItems: Object.values(frequencyItems),
  }),
  computed: {
    ...mapState(["valid"]),

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
        const income = this.$store.state.income;

        return income === null || isNaN(income) || income === 0
          ? null
          : currencyNoSymbol(this.$store.state.income);
      },
      set(value) {
        this.$store.commit("income", reverseCurrency(value));
      },
    },
    defaultIncomesCurr() {
      return this.defaultIncomes.map((i) => currency(i));
    },
    increaseAmount() {
      let result;
      switch (this.frequency) {
        case frequencyItems.YEAR:
          result = { value: 5000, text: "5k" };
          break;
        case frequencyItems.MONTH:
          result = { value: 1000, text: "1k" };
          break;
        case frequencyItems.DAY:
          result = { value: 100, text: "100" };
      }
      return result;
    },
    defaultIncomes() {
      let result;
      switch (this.frequency) {
        case frequencyItems.YEAR:
          result = [30000, 50000, 60000, 70000, 100000];
          break;
        case frequencyItems.MONTH:
          result = [3000, 5000, 6000, 7000, 10000];
          break;
        case frequencyItems.DAY:
          result = [200, 300, 500, 700, 1000];
      }
      return result;
    },
  },
  methods: {
    validate() {
      const result = this.$refs.form.validate();
      if (result && this.$store.state.income > 0) {
        this.$store.dispatch("validate");
      } else {
        this.$store.dispatch("unvalid");
      }
    },

    round(num) {
      return Math.round(num * 100) / 100;
    },
    showIncomeSugestions() {
      this.showsugestions = true;
    },
    hideIncomeSugestions() {
      this.showsugestions = false;
    },
    setDefaultIncome() {
      this.$store
        .dispatch("income", reverseCurrency(this.defaultIncome))
        .then(() => {
          this.validate();
        });
    },
    increase() {
      this.$store
        .dispatch(
          "income",
          (this.$store.state.income || 0) + this.increaseAmount.value
        )
        .then(() => {
          this.validate();
        });
    },
    decrease() {
      let result = this.$store.state.income - this.increaseAmount.value;
      result = result <= 0 ? null : result;
      this.$store.dispatch("income", result).then(() => {
        this.validate();
      });
    },
  },
};
</script>
<style lang="scss">
@import "~vuetify/src/styles/main.sass";
.sugestion-box {
  position: absolute;
  z-index: 2;
  // left: -40px;
  top: 70px;
  background-color: map-get($grey, lighten-4);
  border-radius: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.add-btn {
  position: absolute !important;
  top: 35px;
  right: 40px;
}
.less-btn {
  position: absolute !important;
  top: 35px;
  right: 105px;
}
</style>