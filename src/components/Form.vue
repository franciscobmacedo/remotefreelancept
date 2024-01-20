<template>
  <div class="text-center transition delay-5 duration-100 ease-in-out flex"
    :class="{ 'h-screen': validationCount === 0 }">
    <div class="m-auto container  max-w-2xl">
      <div class="relative md:h-44 text-center">
        <h4 class="font-semibold  text-center text-lg" :class="validationCount > 0
          ? ' md:text-xl lg:text-2xl'
          : 'sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl'
          ">
          Remote freelancer from Portugal 🇵🇹
        </h4>
        <p class="md:mt-3 md:mb-5 text-sm md:text-xl text-neutral-600 font-light">
          simulate your net income
        </p>
        <div class="flex justify-center items-center">
          <div class="relative group" :class="income === null
            ? 'w-7/12'
            : 'w-6/12'
            ">
            <div class="relative">
              <FormattedNumberInput v-model:value="internalIncome" placeholder="Income" @click="showDropdown = true"
                @update:value="showDropdown = false" class="pl-7" data-cy="income" />

              <ChevronDownIcon class="absolute h-4 left-2 bottom-3 text-neutral-600" />
              <div class="
                  hidden
                  absolute
                  right-6
                  bottom-3
                  transition
                  delay-5
                  duration-100
                  ease-in-out
                " :class="{ 'group-hover:block': breakpoint.mdAndUp }">
                <button class="
                    uppercase
                    text-primary text-xs
                    border-[0.5px] border-primary
                    rounded-full
                    px-5
                    py-[2px]
                    hover:border-primary hover:text-primary
                    focus:bg-sky-100
                  " @click="store.setIncome(store.income - changeAmount.value)">
                  - {{ changeAmount.text }}
                </button>
                <button class="
                    uppercase
                    text-primary text-xs
                    border-[0.5px] border-primary
                    rounded-full
                    px-5
                    py-[2px]
                    ml-1
                    hover:border-primary hover:text-primary
                    focus:bg-sky-100
                  " @click="store.setIncome(store.income + changeAmount.value)">
                  + {{ changeAmount.text }}
                </button>
              </div>
              <CurrencyEuroIcon class="absolute h-5 text-neutral-600 right-0 bottom-3" />
            </div>
            <transition enter-active-class="duration-300 ease-out" enter-from-class="transform opacity-0"
              enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100"
              leave-to-class="transform opacity-0">
              <div v-click-outside="() => (showDropdown = false)" @click="showDropdown = false" v-if="showDropdown" class="
                  transition
                  delay-5
                  duration-100
                  pt-5
                  pb-5
                  ease-in-out
                  absolute
                  w-full
                  h-fit
                  bg-neutral-100
                  rounded-md
                ">
                <div class="
                    flex flex-wrap
                    gap-2
                    content-center
                    justify-items-center
                    place-items-center place-content-center
                    text-center
                  ">
                  <CurrencyButton v-for="defaultIncome in defaultIncomes" :key="defaultIncome" :value="defaultIncome" />
                </div>
              </div>
            </transition>
          </div>
          <div class="w-1/12">/</div>
          <div :class="income === null
            ? 'w-4/12'
            : 'w-3/12'
            ">
            <FrequencyButton />
          </div>
          <button v-if="income !== null" class="text-sm hover:text-income hover:font-medium pl-5 py-5 flex gap-2 items-center"
            @click="store.reset()">reset
            <ArrowPathIcon class="h-3" />
          </button>
          <button v-if="income !== null"
            class="text-sm hover:text-secondary hover:font-medium pl-5 py-5 flex gap-2 items-center"
            @click="share">share
            <ShareIcon class="h-3" />
          </button>
        </div>
      </div>
    </div>
    <Toast v-if="showToast" text="sharable link copied to clipboard" @close="closeToast" />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { CurrencyEuroIcon, ChevronDownIcon, ArrowPathIcon, ShareIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useTaxesStore } from "@/store";
import { useBreakpoint } from "@/composables/breakpoints";
import CurrencyButton from "@/components/CurrencyButton.vue";
import Toast from "@/components/Toast.vue";
import FormattedNumberInput from "@/components/FormattedNumberInput.vue";
import FrequencyButton from "@/components/FrequencyButton.vue";
import { FrequencyChoices } from "@/typings";

const { breakpoint } = useBreakpoint();

// store
const { validationCount, incomeFrequency, income } = storeToRefs(
  useTaxesStore()
);
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
  }
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

const closeToast = () => {
  showToast.value = false;
};

const share = () => {
  navigator.clipboard.writeText(window.location.href);
  showToast.value = true;
};
</script>
