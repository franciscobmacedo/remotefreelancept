<template>
  <div class="flex">
    <div class="w-full pt-10 mx-2 md:mx-5 lg:mx-10 xl:mx-32 2xl:mx-60 3xl:mx-80">
      <h4 class="font-semibold text-center lg:text-left text-lg md:text-xl lg:text-2xl lg:w-[500px] mb-8">
        {{ t.savedSimulations }}
      </h4>
      <ul v-if="store.storedSimulations" class="flex md:inline-flex flex-col gap-3">
        <li
v-for="simulation in storedSimulationsSortedByDate" :key="simulation.id"
          class="inline-flex gap-4 w-full justify-between border-2 border-gray-300 px-3 py-2 rounded-md">
          <div>
            <p class="font-semibold">{{ simulation.simulationName }}</p>
            <span class="font-light text-sm">{{ formatISOString(simulation.createdAt, currentLanguage) }}</span>
          </div>
          <div class="flex items-center">
            <router-link :to="{ name: 'Simulator', query: simulation.parameters }" class="inline-flex group p-2" data-cy="open-simulation">
              <ArrowRightEndOnRectangleIcon class="w-5 text-gray-500 group-hover:text-gray-900" />
            </router-link>
            <button class="inline-flex p-2 group" @click="store.deleteSimulation(simulation.id)" data-cy="delete-simulation">
              <TrashIcon class="w-5 text-gray-500 group-hover:text-red-600" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  ArrowRightEndOnRectangleIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import { useTaxesStore } from "@/store";
import { formatISOString } from "@/utils"
import router from '@/router'
import { useI18n } from "@/i18n";

const store = useTaxesStore();
const { t, currentLanguage } = useI18n();

const storedSimulationsSortedByDate = computed(() => {
  const simulations = [...store.storedSimulations];
  return simulations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
})

store.$onAction(({ after, name }) => {
  after(() => {
    if (name === 'deleteSimulation' && !store.hasStoredSimulations) {
      router.push('/')
    }
  })
})

</script>
