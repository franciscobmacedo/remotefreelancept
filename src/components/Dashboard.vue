<template>
  <div class="grid grid-cols-1 md:grid-cols-2 md:space-x-10 mt-5 md:mt-5 mb-20">
    <div>
      <!-- left side -->
      <div
        class="flex items-baseline justify-center md:justify-start flex-wrap"
      >
        <p class="text-sm text-neutral-600 mr-2 w-12/12">{{ t.showIncomePer }}</p>
        <div class="flex justify-center items-center">
          <button
            v-for="frequencyChoice in Object.keys(FrequencyChoices)"
            :key="frequencyChoice"
            class="w-fit text-gray-700 block px-4 mx-1 py-2 text-sm hover:bg-neutral-200 uppercase transition delay-5 duration-100 ease-in-out"
            :class="{
              'bg-secondary hover:bg-secondary cursor-default':
                displayFrequency === FrequencyChoices[frequencyChoice],
            }"
            @click="setFrequency(frequencyChoice)"
            data-cy="frequency-button"
          >
            {{ frequencyChoice }}
          </button>
        </div>
      </div>
      <div class="flex ml-3 md:ml-0 justify-start items-center mt-2 space-x-4">
        <p class="text-sm w-fit">{{ t.incomeTaxYear }}</p>
        <div class="w-16">
          <DropDown
            :choices="SUPPORTED_TAX_RANK_YEARS"
            @change="changeCurrentTaxRankYear"
            :value="getCurrentTaxRankYear.toString()"
            data-cy="tax-rank-years-dropdown"
          />
        </div>
        <InfoButton>
          <p class="text-sm w-64 text-center">
            {{ t.legalWarningText }}
          </p>
        </InfoButton>
      </div>
      <div class="flex ml-3 md:ml-0 justify-start items-center mt-2 space-x-4">
        <p class="text-sm w-fit">{{ t.nrMonthsSimulate }}</p>
        <AdjustCounter
          :value="store.nrMonthsDisplay"
          @update:value="store.setNrMonthsDisplay"
          :min="1"
          unit="months"
          data-cy="nr-months-display"
        />
        <InfoButton>
          <p class="text-sm w-64 text-center">
            {{ t.nrMonthsSimulateTooltip }}
          </p>
        </InfoButton>
      </div>

      <div class="flex ml-3 md:ml-0 justify-start items-center mt-2 space-x-4">
        <p class="text-sm w-fit">{{ t.nrDaysOff }}</p>
        <!-- This input field accepts negative values, with a minimum limit that ensures the total number of working days in a year does not exceed 365.  -->
        <AdjustCounter
          :value="store.nrDaysOff"
          @update:value="store.setNrDaysOff"
          :min="0" 
          :max="YEAR_BUSINESS_DAYS - 1"
          unit="days"
          data-cy="nr-days-off"
        /> 
        <InfoButton>
          <p class="text-sm w-64 text-center">
            {{ t.nrDaysOffTooltip.replace('{days}', YEAR_BUSINESS_DAYS) }}
          </p>
        </InfoButton>
      </div>

      <div class="flex ml-3 md:ml-0 justify-start items-center mt-2 space-x-4">
        <p class="text-sm w-fit">{{ t.adjustSS }}</p>
        <AdjustCounter
          v-model:value="ssDiscountPosition"
          :min="0"
          :max="ssDiscountChoices.length - 1"
          data-cy="ss-discount"
        >
          {{ ssDiscountDisplay }}
        </AdjustCounter>
        <InfoButton
          link="https://www.seg-social.pt/documents/10152/15974914/1009%20Trabalhador%20independente%20-%20novo%20regime/87b6e00c-523d-4718-8a88-942ea804c18a"
        >
          <p class="text-sm w-64 text-center">
            {{ t.adjustSSTooltip }}
          </p>
        </InfoButton>
      </div>
      <div
        class="flex h-5 ml-3 md:ml-0 justify-start items-center mt-6 sm:space-x-2 md:space-x-4"
      >
        <SwitchButton
          id="youthIrsSwitchButton"
          :label="t.eligibleYouthIRS"
          :model-value="store.benefitsOfYouthIrs"
          @update:model-value="store.setBenefitsOfYouthIrs"
          data-cy="youth-irs"
        />
        <InfoButton
          link="https://www.deco.proteste.pt/dinheiro/impostos/dicas/irs-jovem-como-funciona"
        >
          <p class="text-sm w-64 text-center">
            {{ t.eligibleYouthIRSTooltip }}
          </p>
        </InfoButton>
        <div v-if="store.benefitsOfYouthIrs" class="flex items-center gap-x-3">
          <p class="text-sm w-fit h-fit">{{ t.year }}</p>
          <div class="w-16">
            <DropDown
              :choices="youthIrsYears"
              @change="changeYouthIrsYear"
              :value="store.yearOfYouthIrs.toString()"
              data-cy="youth-irs-years-dropdown"
            />
          </div>
        </div>
      </div>
      <div
        class="flex ml-3 md:ml-0 justify-start items-center mt-6 sm:space-x-2 md:space-x-4"
      >
        <SwitchButton
          id="ssExemptSwitchButton"
          :label="t.first12Months"
          :model-value="store.ssFirstYear"
          @update:model-value="store.setSsFirstYear"
          data-cy="ss-first-year"
        />
        <InfoButton
          link="https://www.montepio.org/ei/pessoal/emprego-e-formacao/seguranca-social-guia-com-as-regras-para-os-trabalhadores-independentes#"
        >
          <p class="text-sm w-64 text-center">
            {{ t.first12MonthsTooltip }}
          </p>
        </InfoButton>
      </div>
      <div
        class="flex ml-3 md:ml-0 justify-start items-center mt-6 sm:space-x-2 md:space-x-4"
      >
        <SwitchButton
          id="firstYearSwitchButton"
          :label="t.firstFiscalYear"
          :model-value="store.firstYear"
          @update:model-value="setFirstYear"
          :key="firstYearKey"
          data-cy="first-year"
        />
        <InfoButton
          link="https://www.cgd.pt/Site/Saldo-Positivo/leis-e-impostos/Pages/irs-trabalhadores-independentes.aspx"
        >
          <p class="text-sm w-64 text-center">
            {{ t.firstFiscalYearTooltip }}
          </p>
        </InfoButton>
      </div>
      <div
        class="flex ml-3 md:ml-0 justify-start items-center mt-6 sm:space-x-2 md:space-x-4"
      >
        <SwitchButton
          id="secondYearSwitchButton"
          :label="t.secondFiscalYear"
          :model-value="secondYear"
          @update:model-value="setSecondYear"
          :key="secondYearKey"
          data-cy="second-year"
        />
        <InfoButton
          link="https://www.cgd.pt/Site/Saldo-Positivo/leis-e-impostos/Pages/irs-trabalhadores-independentes.aspx"
        >
          <p class="text-sm w-64 text-center">
            {{ t.secondFiscalYearTooltip }}
          </p>
        </InfoButton>
      </div>
      <div
        class="flex ml-3 md:ml-0 justify-start items-center mt-6 sm:space-x-2 md:space-x-4"
      >
        <SwitchButton
          id="nrmElegibleSwitchButton"
          :label="t.eligibleNHR"
          :model-value="store.rnh"
          @update:model-value="store.setRnh"
          data-cy="rnh"
        />
        <InfoButton
          link="https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/Folhetos_informativos/Documents/Non_habitual_residents_Tax_regime.pdf"
        >
          <p class="text-sm w-64 text-center">
            <span v-html="t.eligibleNHRTooltip.replace('{tax}', rnhTax)"></span>
          </p>
        </InfoButton>
      </div>
      <div
        v-if="expensesNeeded > 0"
        class="flex ml-3 md:ml-0 justify-start items-center mt-6 space-x-4"
      >
        <div>
          <p class="text-sm w-fit">
            {{ t.justifyExpenses }}
          </p>
          <span class="text-xs text-neutral-500"
            >{{ t.maxRequired }}
            <span class="font-semibold whitespace-nowrap">{{ asCurrency(expensesNeeded) }}</span>
            <span class="text-xs text-neutral-500">/{{ t.year.toLowerCase() }}</span>
          </span>
        </div>
        <AdjustCounter
          :value="store.expenses"
          @update:value="store.setExpensesManual"
          :min="0"
          :max="grossIncome.year"
          :step="100"
          unit="€"
          :width="14"
          data-cy="expenses"
        >
        </AdjustCounter>
        <span class="flex gap-2">
          <InfoButton
            class="flex flex-col items-center"
            link="https://www.cgd.pt/Site/Saldo-Positivo/leis-e-impostos/Pages/deducoes-especificas.aspx#:~:text=Empresariais%20e%20Profissionais%20(Categoria%20B)&text=Se%20estiver%20enquadrado%20no%20regime,bruto%20(antes%20dos%20descontos)."
          />
          <button
            class="text-xs text-neutral-500 flex flex-col items-center transition duration-500"
            :class="store.expensesAuto ? 'invisible' : 'visible'"
            @click="store.setExpensesAuto()"
            id="setExpensesAutoButton"
          >auto<ArrowPathIcon class="h-3" />
          </button>
        </span>
      </div>
      <div class="flex justify-center mt-8">
        <Chart />
      </div>
    </div>
    <div>
      <div class="flex gap-x-2">
        <!-- right side -->
        <div
          class="px-5 py-5 border-2 rounded-lg border-dashed border-green-500 w-6/12 text-center"
        >
          <span class="text-xl"> {{ netIncomeDisplay }}</span>
          <small class="text-xs text-neutral-400">
            / {{ displayFrequency }}*</small
          >

          <div class="uppercase text-xs mt-2 tracking-widest text-green-700">
            {{ t.netIncome }}
          </div>
        </div>
        <div
          class="px-5 pt-5 pb-2 border-2 rounded-lg border-dashed border-red-500 w-6/12 text-center"
        >
          {{ taxesDisplay
          }}<small class="text-xs text-neutral-400">
            / {{ displayFrequency }}*</small
          >
          <div class="uppercase text-xs mt-2 tracking-widest text-red-700">
            {{ t.taxes }}
          </div>
          <div
            class="mt-2 flex justify-between text-neutral-500 uppercase tracking-wide"
          >
            <small
              >{{ irsDisplay }}<span class="text-red-400"> IRS</span></small
            >
            <small>{{ ssDisplay }}<span class="text-blue-400"> SS</span></small>
          </div>
        </div>
      </div>
      <div class="mt-10">
        <Table></Table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";

import { asCurrency } from "@/utils.js";
import { FrequencyChoices } from "@/typings";
import { SUPPORTED_TAX_RANK_YEARS, useTaxesStore, YEAR_BUSINESS_DAYS } from "@/store";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import { useI18n } from "@/i18n";

import Chart from "@/components/Chart.vue";
import AdjustCounter from "@/components/AdjustCounter.vue";
import Table from "@/components/Table.vue";
import InfoButton from "@/components/InfoButton.vue";
import SwitchButton from "@/components/SwitchButton.vue";
import DropDown from "@/components/DropDown.vue";

// store
const {
  displayFrequency,
  netIncomeDisplay,
  taxesDisplay,
  ssDisplay,
  nrMonthsDisplay,
  nrDaysOff,
  irsDisplay,
  expensesNeeded,
  grossIncome,
  expenses,
  firstYear,
  secondYear,
  ssFirstYear,
  rnh,
  rnhTax,
  getCurrentTaxRankYear,
} = storeToRefs(useTaxesStore());

const store = useTaxesStore();
const { t } = useI18n();
const firstYearKey = ref(0);
const secondYearKey = ref(0);

//current TaxRank year
const changeCurrentTaxRankYear = (
  taxRank: (typeof SUPPORTED_TAX_RANK_YEARS)[number],
) => {
  store.setCurrentTaxRankYear(taxRank);
};

// frequency
const setFrequency = (frequencyChoice: string) => {
  store.setDisplayFrequency(FrequencyChoices[frequencyChoice]);
};

// ssDiscount
const ssDiscountChoices = [
  -0.25, -0.2, -0.15, -0.1, -0.05, 0, +0.05, +0.1, +0.15, +0.2, +0.25,
];
const ssDiscountPosition = ref(
  store.ssDiscountChoices.indexOf(store.ssDiscount),
);
watch(
  () => ssDiscountPosition.value,
  (newPosition) => {
    store.setSsDiscount(ssDiscountChoices[newPosition]);
  },
);
watch(
  () => store.currentTaxRankYear,
  (newYear, oldYear) => {
    if (store.benefitsOfYouthIrs) {
      store.setYearOfYouthIrs(1);
    }
  }
);
const ssDiscountDisplay = computed(() => {
  return `${store.ssDiscount > 0 ? "+" : ""}${store.ssDiscount * 100}%`;
});

const setFirstYear = (value: boolean) => {
  store.setFirstYear(value);
  secondYearKey.value++;
};

const setSecondYear = (value: boolean) => {
  store.setSecondYear(value);
  firstYearKey.value++;
};

// youth IRS
const youthIrsYears = computed(() => {
  const validRange = store.youthIrsRange;
  return Array.from({ length: validRange }, (_, index) => index + 1);
});

const changeYouthIrsYear = (
  year: number,
) => {
  store.setYearOfYouthIrs(year);
};

</script>
