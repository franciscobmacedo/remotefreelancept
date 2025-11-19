<template>
  <div class="overflow-x-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div
        v-for="comparison in comparisons"
        :key="comparison.type"
        class="bg-white rounded-lg shadow-md p-4 border-2"
        :class="getBorderClass(comparison.type)"
      >
        <h3 class="font-bold text-lg mb-4 text-center">
          {{ getContractTypeLabel(comparison.type) }}
        </h3>

        <!-- Salário Anual -->
        <div class="mb-4">
          <div class="text-sm text-gray-600 mb-1">
            {{ comparison.type === 'unipessoal' ? t.grossIncome : t.annualSalary }}
          </div>
          <div class="text-xl font-semibold">
            {{ renderCellValue(comparison.grossIncome.year) }}
          </div>
        </div>

        <!-- Despesas -->
        <div class="mb-4 border-t pt-4">
          <div class="text-sm font-semibold text-gray-700 mb-2">{{ t.annualExpenses }}</div>
          
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">{{ t.irs }}:</span>
              <span class="text-red-600">{{ renderCellValue(comparison.irsPay.year) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">{{ t.socialSecurity }}:</span>
              <span class="text-blue-600">{{ renderCellValue(comparison.ssPay.year) }}</span>
            </div>
            <div v-if="comparison.ircPay" class="flex justify-between">
              <span class="text-gray-600">{{ t.irc }}:</span>
              <span class="text-purple-600">{{ renderCellValue(comparison.ircPay.year) }}</span>
            </div>
            
            <!-- Despesas Adicionais -->
            <template v-if="comparison.additionalExpenses">
              <div v-if="comparison.additionalExpenses.accountant" class="flex justify-between">
                <span class="text-gray-600">{{ t.accountant }}:</span>
                <span>{{ renderCellValue(comparison.additionalExpenses.accountant) }}</span>
              </div>
              <div v-if="comparison.additionalExpenses.healthInsurance" class="flex justify-between">
                <span class="text-gray-600">{{ t.healthInsurance }}:</span>
                <span>{{ renderCellValue(comparison.additionalExpenses.healthInsurance) }}</span>
              </div>
              <div v-if="comparison.additionalExpenses.personalInsurance" class="flex justify-between">
                <span class="text-gray-600">{{ t.personalInsurance }}:</span>
                <span>{{ renderCellValue(comparison.additionalExpenses.personalInsurance) }}</span>
              </div>
              <div v-if="comparison.additionalExpenses.workInsurance" class="flex justify-between">
                <span class="text-gray-600">{{ t.workInsurance }}:</span>
                <span>{{ renderCellValue(comparison.additionalExpenses.workInsurance) }}</span>
              </div>
              <div v-if="comparison.additionalExpenses.otherExpenses" class="flex justify-between">
                <span class="text-gray-600">{{ t.otherExpenses }}:</span>
                <span>{{ renderCellValue(comparison.additionalExpenses.otherExpenses) }}</span>
              </div>
            </template>

            <div class="flex justify-between font-semibold border-t pt-1 mt-1">
              <span>{{ t.totalExpenses }}:</span>
              <span class="text-red-700">
                {{ renderCellValue(comparison.totalExpenses?.year || comparison.totalTaxes.year) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Benefícios -->
        <div v-if="comparison.benefits?.mealTicket" class="mb-4 border-t pt-4">
          <div class="text-sm font-semibold text-gray-700 mb-2">{{ t.benefits }}</div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">{{ t.mealCard }}:</span>
            <span class="text-green-600">
              {{ renderCellValue(comparison.benefits.mealTicket.year) }}
            </span>
          </div>
        </div>

        <!-- Liquidez (Unipessoal) -->
        <div v-if="comparison.liquidityExpenses?.year > 0" class="mb-4 border-t pt-4">
          <div class="text-sm font-semibold text-gray-700 mb-2">{{ t.liquidity }}</div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">{{ t.expensesBenefits }}:</span>
            <span class="text-green-600">
              {{ renderCellValue(comparison.liquidityExpenses.year) }}
            </span>
          </div>
        </div>

        <div class="border-t pt-4">
          <div class="text-sm text-gray-600 mb-1">
            {{ comparison.type === 'unipessoal' ? t.netIncome : t.netSalaryYear }}
          </div>
          <div class="text-2xl font-bold text-green-600">
            {{ renderCellValue(comparison.finalNetIncome?.year || comparison.netIncome.year) }}
          </div>
        </div>

        <!-- Custo Empregador (apenas CTI) -->
        <div v-if="comparison.employerCost" class="border-t pt-4 mt-4">
          <div class="text-sm text-gray-600 mb-1">{{ t.employerCost }}</div>
          <div class="text-lg font-semibold text-orange-600">
            {{ renderCellValue(comparison.employerCost.year) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela Comparativa Resumida -->
    <div class="mt-6">
      <h3 class="text-lg font-semibold mb-3">{{ t.summaryComparison }}</h3>
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-gray-100 border-b-2">
            <th class="py-2 px-3 text-left">{{ t.regime }}</th>
            <th class="py-2 px-3 text-right">{{ t.grossIncome }}</th>
            <th class="py-2 px-3 text-right">{{ t.totalExpenses }}</th>
            <th class="py-2 px-3 text-right">{{ t.liquidity }}</th>
            <th class="py-2 px-3 text-right">{{ t.netSalary }}</th>
            <th v-if="showEmployerCost" class="py-2 px-3 text-right">{{ t.employerCost }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="comparison in comparisons"
            :key="comparison.type"
            class="border-b hover:bg-gray-50"
            :class="getRowClass(comparison.type)"
          >
            <td class="py-2 px-3 font-semibold">{{ getContractTypeLabel(comparison.type) }}</td>
            <td class="py-2 px-3 text-right">{{ renderCellValue(comparison.grossIncome.year) }}</td>
            <td class="py-2 px-3 text-right text-red-600">
              {{ renderCellValue(comparison.totalExpenses?.year || comparison.totalTaxes.year) }}
            </td>
            <td class="py-2 px-3 text-right text-green-600">
              {{ comparison.liquidityExpenses?.year ? renderCellValue(comparison.liquidityExpenses.year) : "-" }}
            </td>
            <td class="py-2 px-3 text-right font-bold text-green-600">
              {{ renderCellValue(comparison.finalNetIncome?.year || comparison.netIncome.year) }}
            </td>
            <td v-if="showEmployerCost" class="py-2 px-3 text-right text-orange-600">
              {{ comparison.employerCost ? renderCellValue(comparison.employerCost.year) : "-" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ContractComparison, ContractType } from "@/typings";
import { asCurrency } from "@/utils.js";
import { useBreakpoint } from "@/composables/breakpoints";
import { useI18n } from "@/i18n";

const { t } = useI18n();
const { breakpoint } = useBreakpoint();

interface Props {
  comparisons: ContractComparison[];
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
      return t.value.cti;
    case ContractType.Unipessoal:
      return t.value.unipessoal;
    default:
      return type;
  }
};

const getBorderClass = (type: ContractType): string => {
  switch (type) {
    case ContractType.RecibosVerdes:
      return "border-green-300";
    case ContractType.CTI:
      return "border-blue-300";
    case ContractType.Unipessoal:
      return "border-purple-300";
    default:
      return "border-gray-300";
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

const showEmployerCost = computed(() => {
  return props.comparisons.some(c => c.employerCost !== undefined);
});
</script>


