<template>
  <v-dialog v-model="showDialog" max-width="700">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">Tax Ranks</v-card-title>

      <v-card-text class="mt-2">
        Your taxable income (<span class="green--text">{{
          formatCurrency(taxableIncome)
        }}</span
        >) is in level
        <span class="red--text">{{ taxRank.id }}</span>
        (<span v-html="taxRankMinText"></span
        ><span v-html="taxRankMaxText"></span>).

        <v-simple-table min-height="300">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Level</th>
                <th>Minimum</th>
                <th>Maximum</th>
                <th>Normal Tax</th>
                <th>Average Tax</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in TAX_RANKS"
                :key="item.id"
                :class="{ active: item.id === taxRank.id }"
              >
                <td>{{ item.id }}</td>
                <td>{{ formatCurrency(item.min) }}</td>
                <td>{{ formatCurrency(item.max) }}</td>
                <td>{{ formatPercentage(item.normalTax) }}</td>
                <td>{{ formatPercentage(item.averageTax) }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="$emit('closeDialog')">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { currency } from "@/utils.js";
export default {
  props: {
    dialog: Boolean,
  },
  computed: {
    ...mapState(["TAX_RANKS"]),
    ...mapGetters(["taxRank", "taxableIncome"]),
    showDialog: {
      get() {
        return this.dialog;
      },
      set() {
        this.$emit("closeDialog");
      },
    },
    taxRankMinText() {
      return this.taxRank.min
        ? `bigger than <span class="text-subtitle-2">${this.formatCurrency(
            this.taxRank.min
          )}</span>`
        : null;
    },
    taxRankMaxText() {
      const preText = this.taxRankMinText ? " and" : "";
      return this.taxRank.max
        ? `${preText} lower than <span class="text-subtitle-2">${this.formatCurrency(
            this.taxRank.max
          )}</span>`
        : null;
    },
  },
  methods: {
    formatPercentage(value) {
      return value ? (value * 100).toFixed(2) + "%" : "";
    },
    formatCurrency(value) {
      return value ? currency(value) : "";
    },
  },
};
</script>
