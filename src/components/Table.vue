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
        <th class="py-3 text-left">{{ t.colTitle }}</th>
        <th class="py-3 text-left">{{ t.year }}</th>
        <th class="py-3 text-left">{{ t.month }}</th>
        <th class="py-3 text-left">{{ t.day }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="py-3">{{ t.rowGrossIncome }}</td>
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
            <b>{{ t.irsEstimation }}</b>
            <span class="text-xs ml-3">
              {{ t.taxRankLevel }}
              <span class="text-red-400">{{ taxRank.id }}</span> ({{ t.outOf }}
              {{ getTaxRanks.length }})
            </span>
            <InfoButton @onClick="showTaxRanksTable = true">
              <p class="text-xs xl:w-32 text-center">{{ t.showTaxRanksTable }}</p>
            </InfoButton>
          </div>
        </td>
      </tr>
      <tr class="border-b-2">
        <td class="pl-2 py-3">{{ t.specificDeductions }}</td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(specificDeductions) }}
        </td>
        <td class="grey lighten-4"></td>
        <td class="grey lighten-4"></td>
      </tr>
      <tr class="border-b-2">
        <td class="pl-2 py-3">{{ t.expenses }}</td>
        <td class="whitespace-nowrap">{{ renderCellValue(expenses) }}</td>
        <td class="grey lighten-4"></td>
        <td class="grey lighten-4"></td>
      </tr>
      <tr v-if="benefitsOfYouthIrs" class="border-b-2">
        <td class="pl-2 py-3">{{ t.youthIrsDiscount }}</td>
        <td class="whitespace-nowrap">{{ renderCellValue(youthIrsDiscount) }}</td>
        <td class="grey lighten-4"></td>
        <td class="grey lighten-4"></td>
      </tr>
      <tr class="border-b-2">
        <td class="pl-2 py-3">{{ t.taxableIncome }}</td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(taxableIncome) }}
        </td>
        <td class="grey lighten-4"></td>
        <td class="grey lighten-4"></td>
      </tr>
      <tr class="border-b-2">
        <td class="pl-2 py-3">{{ t.taxableIncomeAvg }}</td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(taxIncomeAvg) }}
        </td>
        <td class="grey lighten-4"></td>
        <td class="grey lighten-4"></td>
      </tr>
      <tr class="">
        <td class="pl-2 py-3">{{ t.taxableIncomeNormal }}</td>
        <td class="whitespace-nowrap">
          {{ renderCellValue(taxIncomeNormal) }}
        </td>
        <td class="grey lighten-4"></td>
        <td class="grey lighten-4"></td>
      </tr>
      <tr class="bg-red-100">
        <td class="pl-2 py-3">{{ t.irs }}</td>
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
        <td class="pl-2 py-3">{{ t.socialSecurity }}</td>
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
        <td class="pl-2 py-3">{{ t.netIncome }}</td>
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
import { useI18n } from "@/i18n";
const { breakpoint } = useBreakpoint();
const { t } = useI18n();
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
  youthIrsDiscount,
  benefitsOfYouthIrs
} = storeToRefs(useTaxesStore());

const decimalCases = computed(() => {
  return breakpoint.smAndDown ? 0 : 2;
});

const renderCellValue = (value: number) => {
  return value ? asCurrency(value, decimalCases.value) : "-";
};
const showTaxRanksTable = ref(false);
</script>
