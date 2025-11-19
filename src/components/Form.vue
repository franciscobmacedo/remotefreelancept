<template>
  <transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="transform opacity-0"
  >
    <SaveSimulationDialog
      v-if="showNewSimulationDialog"
      @close="showNewSimulationDialog = false"
      @saved="simulationSaved"
    />
  </transition>
  <div
    class="text-center transition delay-5 duration-100 ease-in-out flex"
    :class="{ 'h-screen': validationCount === 0 }"
  >
    <div class="m-auto container max-w-2xl">
      <div class="relative md:h-44">
        <h4
          class="font-semibold mt-4 md:mt-0"
          :class="
            validationCount > 0
              ? 'text-lg md:text-xl lg:text-2xl'
              : 'text-lg sm:text-xl md:text-2-xl lg:text-3xl xl:text-4xl'
          "
        >
          {{ t.formTitle }}
        </h4>
        <p
          class="md:mt-3 md:mb-5 text-sm md:text-xl text-neutral-600 font-light"
        >
          {{ t.simulateNetIncome }}
        </p>
        <div class="flex flex-col justify-around items-center md:flex-row">
          <div class="flex items-center justify-center w-full">
            <div
            class="relative group w-7/12"
          >
            <div class="relative">
              <FormattedNumberInput
                v-model:value="internalIncome"
                :placeholder="t.incomePlaceholder"
                custom-class="pl-7"
                data-cy="income"
                @click="showDropdown = true"
                @update:value="showDropdown = false"
              />

              <ChevronDownIcon
                class="absolute h-4 left-2 bottom-3 text-neutral-600"
              />
              <div
                class="hidden absolute right-6 bottom-3 transition delay-5 duration-100 ease-in-out"
                :class="{ 'group-hover:block': breakpoint.mdAndUp }"
              >
                <button
                  class="uppercase text-primary text-xs border-[0.5px] border-primary rounded-full px-5 py-[2px] hover:border-primary hover:text-primary focus:bg-sky-100"
                  @click="store.setIncome(store.income - changeAmount.value)"
                >
                  - {{ changeAmount.text }}
                </button>
                <button
                  class="uppercase text-primary text-xs border-[0.5px] border-primary rounded-full px-5 py-[2px] ml-1 hover:border-primary hover:text-primary focus:bg-sky-100"
                  @click="store.setIncome(store.income + changeAmount.value)"
                >
                  + {{ changeAmount.text }}
                </button>
              </div>
              <CurrencyEuroIcon
                class="absolute h-5 text-neutral-600 right-0 bottom-3"
              />
            </div>
            <transition
              enter-active-class="duration-300 ease-out"
              enter-from-class="transform opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="duration-200 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="transform opacity-0"
            >
              <div
                v-if="showDropdown"
                v-click-outside="() => (showDropdown = false)"
                class="transition delay-5 duration-100 pt-5 pb-5 ease-in-out absolute w-full h-fit bg-neutral-100 rounded-md drop-shadow-md z-10"
                @click="showDropdown = false"
              >
                <div
                  class="flex flex-wrap gap-2 content-center justify-items-center place-items-center place-content-center text-center"
                >
                  <CurrencyButton
                    v-for="defaultIncome in defaultIncomes"
                    :key="defaultIncome"
                    :value="defaultIncome"
                  />
                </div>
              </div>
            </transition>
          </div>
          <div class="w-1/12">/</div>
          <div :class="income === null ? 'w-4/12' : 'w-3/12'">
            <FrequencyButton />
          </div>
          </div>
          <div v-if="income !== null" class="inline-flex gap-5">
            <button
            class="text-sm hover:text-income hover:font-medium py-5 flex gap-2 items-center"
            @click="store.reset()"
          >
            {{ t.reset }}
            <ArrowPathIcon class="h-3" />
          </button>
          <button
            class="text-sm hover:text-secondary hover:font-medium py-5 flex gap-2 items-center"
            @click="share"
          >
            {{ t.share }}
            <ShareIcon class="h-3" />
          </button>
          <button
            data-cy="save-simulation-button"
            class="text-sm hover:text-tertiary hover:font-medium py-5 flex gap-2 items-center"
            @click="showNewSimulationDialog = true"
          >
            {{ t.saveAction }}
            <BookmarkIcon class="h-3" />
          </button>
          </div>
        </div>
      </div>
    </div>
    <ToastDialog v-if="showToast" :text="toastMessage" @close="closeToast" />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  CurrencyEuroIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  ShareIcon,
  BookmarkIcon,
} from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useTaxesStore } from "@/store";
import { useBreakpoint } from "@/composables/breakpoints";
import CurrencyButton from "@/components/CurrencyButton.vue";
import ToastDialog from "@/components/ToastDialog.vue";
import FormattedNumberInput from "@/components/FormattedNumberInput.vue";
import FrequencyButton from "@/components/FrequencyButton.vue";
import SaveSimulationDialog from "@/components/SaveSimulationDialog.vue";
import { FrequencyChoices } from "@/typings";
import { useI18n } from "@/i18n";

const { breakpoint } = useBreakpoint();
const { t } = useI18n();

// store
const { validationCount, incomeFrequency, income } =
  storeToRefs(useTaxesStore());
const store = useTaxesStore();

// dropdwon
const showDropdown = ref(false);

// income
const internalIncome = computed({
  get() {
    return store.income;
  },
  set(value) {
    store.setIncome(value ? value : 0);
  },
});
watch(
  () => income.value,
  () => {
    validationCount.value++;
  },
);

const defaultIncomes = computed(() => {
  switch (incomeFrequency.value) {
    case FrequencyChoices.Year:
      return [30000, 50000, 60000, 70000, 100000];
    case FrequencyChoices.Month:
      return [3000, 5000, 6000, 7000, 10000];
    case FrequencyChoices.Day:
      return [200, 300, 500, 700, 1000];
  }
});

const changeAmount = computed(() => {
  switch (incomeFrequency.value) {
    case FrequencyChoices.Month:
      return { value: 1000, text: "1k" };
    case FrequencyChoices.Day:
      return { value: 100, text: "100" };
    default:
      return { value: 5000, text: "5k" };
  }
});

// share
const showToast = ref(false);
const toastMessage = ref("");
const showNewSimulationDialog = ref(false);

const closeToast = () => {
  showToast.value = false;
};

const share = () => {
  toastMessage.value = t.value.linkCopied;
  navigator.clipboard.writeText(window.location.href);
  showToast.value = true;
};

const simulationSaved = () => {
  showNewSimulationDialog.value = false;
  toastMessage.value = t.value.simulationSaved;
  showToast.value = true;
};
</script>
