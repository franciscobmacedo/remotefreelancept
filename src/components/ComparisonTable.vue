<template>
  <div class="overflow-x-auto">
    <table class="w-full text-xs md:text-sm text-left text-gray-700 border-collapse">
      <thead class="text-xs text-gray-700 uppercase border-b-2 bg-gray-50">
        <tr>
          <th class="py-3 px-2 text-left sticky left-0 bg-gray-50 z-10">{{ t.regime }}</th>
          <th class="py-3 px-2 text-left">{{ t.grossIncome }}</th>
          <th class="py-3 px-2 text-left">{{ t.irs }}</th>
          <th class="py-3 px-2 text-left">{{ t.socialSecurity }}</th>
          <th v-if="showIRC" class="py-3 px-2 text-left">{{ t.irc }}</th>
          <th class="py-3 px-2 text-left">{{ t.totalTaxes }}</th>
          <th v-if="showLiquidity" class="py-3 px-2 text-left">{{ t.liquidity }}</th>
          <th class="py-3 px-2 text-left">{{ t.netEstimated }} ({{ getFrequencyLabel(displayFrequency) }})</th>
          <!-- Sempre mostrar Anual, Mensal e Diária -->
          <th class="py-3 px-2 text-left">{{ t.annual }}</th>
          <th class="py-3 px-2 text-left">{{ t.monthly }}</th>
          <th class="py-3 px-2 text-left">{{ t.daily }}</th>
          <th v-if="showEmployerCost" class="py-3 px-2 text-left">{{ t.employerCost }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="comparison in comparisons"
          :key="comparison.type"
          class="border-b hover:bg-gray-50 transition-colors"
          :class="getRowClass(comparison.type)"
        >
          <td class="py-3 px-2 font-semibold sticky left-0 z-10" :class="getRowClass(comparison.type)">
            {{ getContractTypeLabel(comparison.type) }}
          </td>
          <td class="py-3 px-2 whitespace-nowrap">
            {{ renderCellValue(comparison.grossIncome[displayFrequency]) }}
          </td>
          <td class="py-3 px-2 whitespace-nowrap text-red-600">
            {{ renderCellValue(comparison.irsPay[displayFrequency]) }}
          </td>
          <td class="py-3 px-2 whitespace-nowrap text-blue-600">
            {{ renderCellValue(comparison.ssPay[displayFrequency]) }}
          </td>
          <td v-if="showIRC" class="py-3 px-2 whitespace-nowrap text-purple-600">
            {{ comparison.ircPay ? renderCellValue(comparison.ircPay[displayFrequency]) : "-" }}
          </td>
          <td class="py-3 px-2 whitespace-nowrap font-semibold">
            {{ renderCellValue(comparison.totalTaxes[displayFrequency]) }}
          </td>
          <td v-if="showLiquidity" class="py-3 px-2 whitespace-nowrap text-green-500">
            {{ comparison.liquidityExpenses?.year ? renderCellValue(comparison.liquidityExpenses[displayFrequency]) : "-" }}
          </td>
          <td class="py-3 px-2 whitespace-nowrap font-bold text-green-600">
            {{ renderCellValue(comparison.finalNetIncome?.[displayFrequency] || comparison.netIncome[displayFrequency]) }}
          </td>
          <!-- Sempre mostrar Anual, Mensal e Diária -->
          <td class="py-3 px-2 whitespace-nowrap text-green-600">
            {{ renderCellValue(comparison.finalNetIncome?.year || comparison.netIncome.year) }}
          </td>
          <td class="py-3 px-2 whitespace-nowrap text-green-600">
            {{ renderCellValue(comparison.finalNetIncome?.month || comparison.netIncome.month) }}
          </td>
          <td class="py-3 px-2 whitespace-nowrap text-green-600">
            {{ renderCellValue(comparison.finalNetIncome?.day || comparison.netIncome.day) }}
          </td>
          <td v-if="showEmployerCost" class="py-3 px-2 whitespace-nowrap text-orange-600">
            {{ comparison.employerCost ? renderCellValue(comparison.employerCost[displayFrequency]) : "-" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="mt-4 text-xs text-gray-500 space-y-1">
    <p>* {{ t.tablesNote }}</p>
    <p v-if="showIRC">*** {{ t.unipessoalBest }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { ContractComparison, ContractType, FrequencyChoices } from "@/typings";
import { asCurrency } from "@/utils.js";
import { useBreakpoint } from "@/composables/breakpoints";
import { useI18n } from "@/i18n";

const { t } = useI18n();
const { breakpoint } = useBreakpoint();

interface Props {
  comparisons: ContractComparison[];
  displayFrequency: FrequencyChoices;
}

const props = defineProps<Props>();

const decimalCases = computed(() => {
  return breakpoint.smAndDown ? 0 : 2;
});

const renderCellValue = (value: number) => {
  return value ? asCurrency(value, decimalCases.value) : "-";
};

const getContractTypeLabel = (type: ContractType): string => {
  switch (type) {
    case ContractType.RecibosVerdes:
      return t.value.recibosVerdes;
    case ContractType.CTI:
      return t.value.ctiLong;
    case ContractType.Unipessoal:
      return t.value.unipessoal;
    default:
      return type;
  }
};

const getFrequencyLabel = (freq: FrequencyChoices): string => {
  switch (freq) {
    case 'year': return t.value.annual;
    case 'month': return t.value.monthly;
    case 'day': return t.value.daily;
    default: return freq;
  }
};

const getRowClass = (type: ContractType): string => {
  switch (type) {
    case ContractType.RecibosVerdes:
      return "bg-green-50";
    case ContractType.CTI:
      return "bg-blue-50";
    case ContractType.Unipessoal:
      return "bg-purple-50";
    default:
      return "";
  }
};

const showIRC = computed(() => {
  return props.comparisons.some(c => c.ircPay !== undefined);
});

const showEmployerCost = computed(() => {
  return props.comparisons.some(c => c.employerCost !== undefined);
});

const showLiquidity = computed(() => {
  return props.comparisons.some(c => c.liquidityExpenses?.year > 0);
});
</script>

