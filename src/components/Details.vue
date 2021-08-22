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
            <td>Gross Income</td>
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
                <span class="red--text">{{ taxRank.id }}</span> (out of 7)
              </span>
            </td>
          </tr>
          <tr>
            <td>Specific Deductions</td>
            <td class="text-no-wrap">
              {{ currency(specificDeductions, decimalCases) }}
            </td>
            <td class="grey lighten-4"></td>
            <td class="grey lighten-4"></td>
          </tr>
          <tr>
            <td>Expenses Needed for the 15% discount</td>
            <td class="text-no-wrap">{{ currency(expenses, decimalCases) }}</td>
            <td class="grey lighten-4"></td>
            <td class="grey lighten-4"></td>
          </tr>
          <tr>
            <td>Taxable Income</td>
            <td class="text-no-wrap">
              {{ currency(taxableIncome, decimalCases) }}
            </td>
            <td class="grey lighten-4"></td>
            <td class="grey lighten-4"></td>
          </tr>
          <tr>
            <td>Taxable Income for Average Tax</td>
            <td class="text-no-wrap">
              {{ currency(taxIncomeAvg, decimalCases) }}
            </td>
            <td class="grey lighten-4"></td>
            <td class="grey lighten-4"></td>
          </tr>
          <tr>
            <td>Taxable Income for Normal Tax</td>
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
            <td>Social Security</td>
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
            <td>Net Income</td>
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
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { currency } from "@/utils.js";
export default {
  computed: {
    ...mapState(["colors", "grossIncome", "displayFreq"]),
    ...mapGetters([
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
<style lang="scss" scoped>
// table {
//   width: 100% !important;
// }

// th.year-col {
//   width: 95% !important;
// }
</style>