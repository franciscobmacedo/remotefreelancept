<template>
  <div
    class="text-center transition delay-5 duration-100 ease-in-out flex"
    :class="{ 'h-screen': validationCount === 0 }"
  >
    <div class="m-auto">
      <div class="relative md:h-44">
        <h4
          class="font-semibold"
          :class="validationCount > 0 ? 'text-lg md:text-xl lg:text-2xl lg:w-[500px]' : 'text-lg sm:text-xl md:text-2-xl lg:text-3xl xl:text-4xl'"
        >
          Remote freelancer from Portugal 🇵🇹
        </h4>
        <p class="md:mt-3 md:mb-5 text-sm md:text-xl text-neutral-600 font-light">
          simulate your net income
        </p>
        <div class="flex justify-around items-center">
          <div class="relative w-8/12 group">
            <div class="relative">
              <FormattedNumberInput
                v-model:value="internalIncome"
                placeholder="Income"
                @click="showDropdown = true"
                @update:value="showDropdown = false"
                class="pl-7"
              />

              <ChevronDownIcon
                class="absolute h-4 left-2 bottom-3 text-neutral-600"
              />
              <div
                class="
                  hidden
                  absolute
                  
                  right-6
                  bottom-3
                  transition
                  delay-5
                  duration-100
                  ease-in-out
                "
                :class="{'group-hover:block': breakpoint.mdAndUp}"
              >
                <button
                  class="
                    uppercase
                    text-primary text-xs
                    border-[0.5px] border-primary
                    rounded-full
                    px-5
                    py-[2px]
                    hover:border-primary hover:text-primary
                    focus:bg-sky-100
                  "
                  @click="store.setIncome(store.income - changeAmount.value)"
                >
                  - {{ changeAmount.text }}
                </button>
                <button
                  class="
                    uppercase
                    text-primary text-xs
                    border-[0.5px] border-primary
                    rounded-full
                    px-5
                    py-[2px]
                    ml-1
                    hover:border-primary hover:text-primary
                    focus:bg-sky-100
                  "
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
                v-click-outside="() => (showDropdown = false)"
                @click="showDropdown = false"
                v-if="showDropdown"
                class="
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
                "
              >
                <div
                  class="
                    flex flex-wrap
                    gap-2
                    content-center
                    justify-items-center
                    place-items-center place-content-center
                    text-center
                  "
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
          <div class="w-3/12">
            <FrequencyButton />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { CurrencyEuroIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useTaxesStore } from "@/stores";
import { useBreakpoint } from "@/composables/breakpoints";
import CurrencyButton from "@/components/CurrencyButton.vue";
import FormattedNumberInput from "@/components/FormattedNumberInput.vue";
import FrequencyButton from "@/components/FrequencyButton.vue";
import { FrequencyChoices } from "@/typings";


const { breakpoint } = useBreakpoint();


// store
const { validationCount, defaultIncomes, incomeFrequency, income } =
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
  }
);

const changeAmount = computed(() => {
  let result: {
    value: number;
    text: string;
  };
  switch (incomeFrequency.value) {
    case FrequencyChoices.Month:
      result = { value: 1000, text: "1k" };
      break;
    case FrequencyChoices.Day:
      result = { value: 100, text: "100" };
    default:
      result = { value: 5000, text: "5k" };
  }
  return result;
});
</script>
