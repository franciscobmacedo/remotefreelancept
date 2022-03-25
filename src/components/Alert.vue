<template>
  <v-alert color="#ff5252" class="white--text my-0">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" class="py-0 my-0 text-center">
        Can you have
        <span class="font-weight-bold expense-text px-2 px-md-3"
          >{{ expensesLabelText }} <span class="caption">/year</span></span
        >
        professional related expenses to be granteed the 15% discount?
      </v-col>
      <v-col class="py-0 my-0" cols="6" md="2">
        <v-row align="center" justify="center">
          <div class="mr-3">no</div>
          <v-switch
            class="white--text m-0"
            v-model="hasExpenses"
            label=""
            inset
            color="primary"
          ></v-switch>
          <div>yes</div>
        </v-row>
      </v-col>
      <v-col class="py-0 my-0" cols="2" md="1">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="
                goToExternal(
                  'https://www.e-konomista.pt/irs-para-quem-passa-recibos-verdes/'
                )
              "
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon color="white">mdi-help-circle </v-icon>
            </v-btn>
          </template>
          <span>What is this?</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
import { currency } from "@/utils.js";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["expenses"]),
    hasExpenses: {
      get() {
        return this.$store.state.hasExpenses;
      },
      set(value) {
        this.$store.commit("hasExpenses", value);
      },
    },
    expensesLabelText() {
      return currency(this.expenses);
    },
  },
  methods: {
    goToExternal(url) {
      window.open(url);
    },
  },
};
</script>

<style scoped>
.expense-text {
  background-color: rgba(216, 25, 25, 0.8);
  border-radius: 20px;
}
</style>