<template>
  <div
    id="defaultModal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full bg-black bg-opacity-15"
  >
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl md:h-auto"
    >
      <!-- Modal content -->
      <div class="relative bg-neutral-200 rounded-lg shadow">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-4 border-b rounded-t">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ t.saveSimulationTitle }}
          </h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            data-modal-hide="defaultModal"
            @click="$emit('close')"
          >
            <XMarkIcon class="w-5 h-5" />
            <span class="sr-only">{{ t.closeModal }}</span>
          </button>
        </div>

        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <form autocomplete="off" @submit.prevent="storeSimulation">
            <div class="mb-6">
              <input
                id="simulation-name"
                v-model="simulationName"
                type="text"
                autocomplete="off"
                data-cy="simulation-name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                :placeholder="t.simulationNamePlaceholder"
                required
              />
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                data-cy="save-new-simulation-button"
                class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                {{ t.save }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useTaxesStore } from "@/store";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useI18n } from "@/i18n";

// store
const store = useTaxesStore();
const { t } = useI18n();
const simulationName = ref("");

const emit = defineEmits(["close", "saved"]);

const storeSimulation = () => {
  store.storeSimulation(simulationName.value);
  emit("saved");
};
</script>
