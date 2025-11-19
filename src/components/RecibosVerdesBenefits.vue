<template>
  <div v-if="taxesStore.income && taxesStore.income > 0" class="mt-6 pt-6 border-t">
    <h3 class="text-lg font-semibold mb-4 text-green-700">🎁 {{ t.taxBenefits }}</h3>
    
    <div class="space-y-3">
      <!-- Isenção SS 1º ano -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="ssFirstYear"
            v-model="taxesStore.ssFirstYear"
            class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <label for="ssFirstYear" class="text-sm cursor-pointer">
            {{ t.ssExemption }}
          </label>
          <InfoButton link="https://www.montepio.org/ei/pessoal/emprego-e-formacao/seguranca-social-guia-com-as-regras-para-os-trabalhadores-independentes">
            <p class="text-sm w-64 text-center">
              {{ t.ssExemptionTooltip }}
            </p>
          </InfoButton>
        </div>
      </div>

      <!-- 1º ano fiscal -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="firstYear"
            v-model="taxesStore.firstYear"
            @change="handleFirstYearChange"
            class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <label for="firstYear" class="text-sm cursor-pointer">
            {{ t.firstYear }}
          </label>
          <InfoButton link="https://www.cgd.pt/Site/Saldo-Positivo/leis-e-impostos/Pages/irs-trabalhadores-independentes.aspx">
            <p class="text-sm w-64 text-center">
              {{ t.firstYearTooltip }}
            </p>
          </InfoButton>
        </div>
      </div>

      <!-- 2º ano fiscal -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="secondYear"
            v-model="taxesStore.secondYear"
            @change="handleSecondYearChange"
            class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <label for="secondYear" class="text-sm cursor-pointer">
            {{ t.secondYear }}
          </label>
          <InfoButton link="https://www.cgd.pt/Site/Saldo-Positivo/leis-e-impostos/Pages/irs-trabalhadores-independentes.aspx">
            <p class="text-sm w-64 text-center">
              {{ t.secondYearTooltip }}
            </p>
          </InfoButton>
        </div>
      </div>

      <!-- IRS Jovem -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="youthIrs"
            v-model="taxesStore.benefitsOfYouthIrs"
            class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <label for="youthIrs" class="text-sm cursor-pointer">
            {{ t.youthIRS }}
          </label>
          <InfoButton link="https://www.deco.proteste.pt/dinheiro/impostos/dicas/irs-jovem-como-funciona">
            <p class="text-sm w-64 text-center">
              {{ t.youthIRSTooltip }}
            </p>
          </InfoButton>
        </div>
        <div v-if="taxesStore.benefitsOfYouthIrs" class="flex items-center gap-2">
          <span class="text-xs text-gray-600">{{ t.year }}:</span>
          <select
            v-model="taxesStore.yearOfYouthIrs"
            class="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option v-for="year in youthIrsYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <!-- NHR/RNH -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="rnh"
            v-model="taxesStore.rnh"
            class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <label for="rnh" class="text-sm cursor-pointer">
            {{ t.nhr }}
          </label>
          <InfoButton link="https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/Folhetos_informativos/Documents/Non_habitual_residents_Tax_regime.pdf">
            <p class="text-sm w-64 text-center">
              {{ t.nhrTooltip }}
            </p>
          </InfoButton>
        </div>
      </div>

      <!-- Ajuste SS -->
      <div class="flex items-center justify-between pt-3 border-t">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">
            {{ t.ssAdjustment }}
          </label>
          <InfoButton link="https://www.seg-social.pt/documents/10152/15974914/1009%20Trabalhador%20independente%20-%20novo%20regime/87b6e00c-523d-4718-8a88-942ea804c18a">
            <p class="text-sm w-64 text-center">
              {{ t.ssAdjustmentTooltip }}
            </p>
          </InfoButton>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="decreaseSsDiscount"
            class="px-2 py-1 border rounded hover:bg-gray-100"
            :disabled="ssDiscountIndex <= 0"
          >
            -
          </button>
          <span class="text-sm font-medium w-16 text-center">{{ ssDiscountDisplay }}</span>
          <button
            @click="increaseSsDiscount"
            class="px-2 py-1 border rounded hover:bg-gray-100"
            :disabled="ssDiscountIndex >= ssDiscountChoices.length - 1"
          >
            +
          </button>
        </div>
      </div>

      <!-- Despesas Profissionais -->
      <div v-if="taxesStore.expensesNeeded > 0" class="pt-3 border-t">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">
              {{ t.professionalExpenses }}
            </label>
            <InfoButton link="https://www.cgd.pt/Site/Saldo-Positivo/leis-e-impostos/Pages/deducoes-especificas.aspx">
              <p class="text-sm w-64 text-center">
                {{ t.professionalExpensesTooltip }}
              </p>
            </InfoButton>
          </div>
          <button
            v-if="!taxesStore.expensesAuto"
            @click="taxesStore.setExpensesAuto()"
            class="text-xs text-blue-600 hover:text-blue-800"
          >
            {{ t.autoExpenses }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <input
            type="number"
            v-model.number="internalExpenses"
            :max="taxesStore.grossIncome.year"
            min="0"
            step="100"
            class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="0"
          />
          <span class="text-xs text-gray-500">
            / {{ asCurrency(taxesStore.expensesNeeded) }} {{ t.required }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useTaxesStore } from '@/store';
import { asCurrency } from '@/utils';
import InfoButton from '@/components/InfoButton.vue';
import { useI18n } from '@/i18n';

const { t } = useI18n();
const taxesStore = useTaxesStore();

// Despesas profissionais
const internalExpenses = ref(0);

// SS Discount
const ssDiscountChoices = [-0.25, -0.2, -0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15, 0.2, 0.25];
const ssDiscountIndex = ref(5); // Começa em 0%

// Youth IRS years
const youthIrsYears = computed(() => {
  const validRange = taxesStore.youthIrsRange;
  return Array.from({ length: validRange }, (_, index) => index + 1);
});

// SS Discount display
const ssDiscountDisplay = computed(() => {
  const discount = ssDiscountChoices[ssDiscountIndex.value];
  return `${discount > 0 ? '+' : ''}${(discount * 100).toFixed(0)}%`;
});

// Handlers
const handleFirstYearChange = () => {
  if (taxesStore.firstYear) {
    taxesStore.setSecondYear(false);
  }
};

const handleSecondYearChange = () => {
  if (taxesStore.secondYear) {
    taxesStore.setFirstYear(false);
  }
};

const increaseSsDiscount = () => {
  if (ssDiscountIndex.value < ssDiscountChoices.length - 1) {
    ssDiscountIndex.value++;
    taxesStore.setSsDiscount(ssDiscountChoices[ssDiscountIndex.value]);
  }
};

const decreaseSsDiscount = () => {
  if (ssDiscountIndex.value > 0) {
    ssDiscountIndex.value--;
    taxesStore.setSsDiscount(ssDiscountChoices[ssDiscountIndex.value]);
  }
};

// Watches
watch(() => internalExpenses.value, (value) => {
  taxesStore.setExpensesManual(value);
});

watch(() => taxesStore.expenses, (value) => {
  internalExpenses.value = value;
}, { immediate: true });

watch(() => taxesStore.ssDiscount, (value) => {
  const index = ssDiscountChoices.indexOf(value);
  if (index !== -1) {
    ssDiscountIndex.value = index;
  }
}, { immediate: true });
</script>
