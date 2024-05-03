<template>
  <transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0"
  >
    <TaxRanksDialog
      v-if="showTaxRanksTable"
      @close="showTaxRanksTable = false"
    />
  </transition>
  <table class="w-full text-xs md:text-sm text-left text-gray-700">
    <thead class="text-xs text-gray-700 uppercase border-b-2">
      <tr>
        <th class="py-3 text-left">Title</th>
        <th class="py-3 text-left">Year</th>
        <th class="py-3 text-left">Month</th>
        <th class="py-3 text-left">Day</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="py-3">Gross income</td>
        <td class="py-3 whitespace-nowrap">
          {{ renderCellValue(grossIncome.year) }}
        </td>
        <td class="py-3 whitespace-nowrap">
          {{ renderCellValue(grossIncome.month) }}
        </td>
        <td class="py-3 whitespace-nowrap">
          {{ renderCellValue(grossIncome.day) }}
        </td>
      </tr>

      <tr>
        <td colspan="4" class="text-center bg-neutral-200 py-3">
          <div class="flex justify-center space-x-3 items-center">
            <b>IRS estimation</b>
            <span class="text-xs ml-3">
              tax rank level
              <span class="text-red-400">{{ taxRank.id }}</span> (out of
              {{ getTaxRanks.length }})
            </span>
            <InfoButton @onClick="showTaxRanksTable = true">
              <p class="text-xs xl:w-32 text-center">Show tax ranks table</p>
            </InfoButton>
          </div>
        </td>
      </tr>
      <tr class="border-b-2">
        <td class="pl-2 py-3">Specific deductions</td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(specificDeductions) }}
        </td>
        <td class="grey lighten-4"></td>
        <td class="grey lighten-4"></td>
      </tr>
      <tr class="border-b-2">
        <td class="pl-2 py-3">Expenses</td>
        <td class="whitespace-nowrap">{{ renderCellValue(expenses) }}</td>
        <td class="grey lighten-4"></td>
        <td class="grey lighten-4"></td>
      </tr>
      <tr class="border-b-2">
        <td class="pl-2 py-3">Taxable income</td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(taxableIncome) }}
        </td>
        <td class="grey lighten-4"></td>
        <td class="grey lighten-4"></td>
      </tr>
      <tr class="border-b-2">
        <td class="pl-2 py-3">Taxable income for average tax</td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(taxIncomeAvg) }}
        </td>
        <td class="grey lighten-4"></td>
        <td class="grey lighten-4"></td>
      </tr>
      <tr class="">
        <td class="pl-2 py-3">Taxable income for normal tax</td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(taxIncomeNormal) }}
        </td>
        <td class="grey lighten-4"></td>
        <td class="grey lighten-4"></td>
      </tr>
      <tr class="bg-red-100">
        <td class="pl-2 py-3">IRS</td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(irsPay.year) }}
        </td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(irsPay.month) }}
        </td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(irsPay.day) }}
        </td>
      </tr>
      <tr class="bg-blue-100">
        <td class="pl-2 py-3">Social security</td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(ssPay.year) }}
        </td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(ssPay.month) }}
        </td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(ssPay.day) }}
        </td>
      </tr>
      <tr class="bg-green-100">
        <td class="pl-2 py-3">Net income</td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(netIncome.year) }}
        </td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(netIncome.month) }}
        </td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(netIncome.day) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useTaxesStore } from "@/store";
import { asCurrency } from "@/utils.js";
import InfoButton from "@/components/InfoButton.vue";
import TaxRanksDialog from "./TaxRanksDialog.vue";
import { useBreakpoint } from "@/composables/breakpoints";
const { breakpoint } = useBreakpoint();
// store
const {
  grossIncome,
  taxableIncome,
  specificDeductions,
  expenses,
  netIncome,
  taxRank,
  ssPay,
  irsPay,
  taxIncomeNormal,
  taxIncomeAvg,
  getTaxRanks,
} = storeToRefs(useTaxesStore());

const decimalCases = computed(() => {
  return breakpoint.smAndDown ? 0 : 2;
});

const renderCellValue = (value: number) => {
  return value ? asCurrency(value, decimalCases.value) : "-";
};
const showTaxRanksTable = ref(false);
</script>
