<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Title</th>
            <th class="text-no-wrap text-left">Year</th>
            <th class="text-left">Month</th>
            <th class="text-left">Day</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gross income</td>
            <td class="text-no-wrap">
              {{ currency(grossIncome.year, decimalCases) }}
            </td>
            <td class="text-no-wrap">
              {{ currency(grossIncome.month, decimalCases) }}
            </td>
            <td class="text-no-wrap">
              {{ currency(grossIncome.day, decimalCases) }}
            </td>
          </tr>

          <tr>
            <td colspan="4" class="text-center grey lighten-2">
              <b>IRS estimation</b>
              <span class="text-caption pl-1 pl-md-3">
                tax rank level
                <span class="red--text">{{ taxRank.id }}</span> (out of
                {{ TAX_RANKS.length }})
                <v-tooltip
                  bottom
                  :max-width="$vuetify.breakpoint.smAndUp ? '360' : null"
                  color="grey darken-3"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="showTaxRanksTable = true"
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon small v-bind="attrs" v-on="on"
                        >mdi-help-circle</v-icon
                      >
                    </v-btn>
                  </template>
                  <span> show tax ranks table </span>
                </v-tooltip>
              </span>
            </td>
          </tr>
          <tr>
            <td>Specific deductions</td>
            <td class="text-no-wrap">
              {{ currency(specificDeductions, decimalCases) }}
            </td>
            <td class="grey lighten-4"></td>
            <td class="grey lighten-4"></td>
          </tr>
          <tr>
            <td>Expenses needed for the 15% discount</td>
            <td class="text-no-wrap">{{ currency(expenses, decimalCases) }}</td>
            <td class="grey lighten-4"></td>
            <td class="grey lighten-4"></td>
          </tr>
          <tr>
            <td>Taxable income</td>
            <td class="text-no-wrap">
              {{ currency(taxableIncome, decimalCases) }}
            </td>
            <td class="grey lighten-4"></td>
            <td class="grey lighten-4"></td>
          </tr>
          <tr>
            <td>Taxable income for average tax</td>
            <td class="text-no-wrap">
              {{ currency(taxIncomeAvg, decimalCases) }}
            </td>
            <td class="grey lighten-4"></td>
            <td class="grey lighten-4"></td>
          </tr>
          <tr>
            <td>Taxable income for normal tax</td>
            <td class="text-no-wrap">
              {{ currency(taxIncomeNormal, decimalCases) }}
            </td>
            <td class="grey lighten-4"></td>
            <td class="grey lighten-4"></td>
          </tr>
          <tr class="red lighten-4">
            <td>IRS</td>
            <td class="text-no-wrap">
              {{ currency(irsPay.year, decimalCases) }}
            </td>
            <td class="text-no-wrap">
              {{ currency(irsPay.month, decimalCases) }}
            </td>
            <td class="text-no-wrap">
              {{ currency(irsPay.day, decimalCases) }}
            </td>
          </tr>
          <tr class="blue lighten-4">
            <td>Social security</td>
            <td class="text-no-wrap">
              {{ currency(ssPay.year, decimalCases) }}
            </td>
            <td class="text-no-wrap">
              {{ currency(ssPay.month, decimalCases) }}
            </td>
            <td class="text-no-wrap">
              {{ currency(ssPay.day, decimalCases) }}
            </td>
          </tr>
          <tr class="green lighten-4">
            <td>Net income</td>
            <td class="text-no-wrap">
              {{ currency(netIncome.year, decimalCases) }}
            </td>
            <td class="text-no-wrap">
              {{ currency(netIncome.month, decimalCases) }}
            </td>
            <td class="text-no-wrap">
              {{ currency(netIncome.day, decimalCases) }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <TaxRanksDialog
      :dialog="showTaxRanksTable"
      @closeDialog="showTaxRanksTable = false"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { currency } from "@/utils.js";
import TaxRanksDialog from "@/components/TaxRanksDialog";

export default {
  components: {
    TaxRanksDialog,
  },
  data() {
    return {
      showTaxRanksTable: false,
    };
  },
  computed: {
    ...mapState(["colors", "displayFreq", "TAX_RANKS"]),
    ...mapGetters([
      "grossIncome",
      "specificDeductions",
      "expenses",
      "irsPay",
      "ssPay",
      "netIncome",
      "taxableIncome",
      "taxIncomeAvg",
      "taxIncomeNormal",
      "taxRank",
    ]),
    decimalCases() {
      return this.$vuetify.breakpoint.smAndUp ? 2 : 0;
    },
  },
  methods: {
    currency(val, dp = 0) {
      return currency(val, dp);
    },
  },
};
</script>
