<template>
    <div class="mx-2 md:mx-5 lg:mx-10 xl:mx-32 2xl:mx-60 3xl:mx-80">
        <a v-if="breakpoint.mdAndUp"
            className="cursor-pointer fixed top-5 right-5 text-blue-500 p-3 rounded-full shadow-sm hover:shadow-xl"
            target="_blank" href="https://github.com/franciscobmacedo/remotefreelancept">
            <img src="@/assets/github.png" />
        </a>
        <Form></Form>
        <Dashboard v-if="showDashboard"></Dashboard>
        <FooterBar />
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTaxesStore } from "@/store";
import { useRoute, useRouter } from 'vue-router'

import Form from "@/components/Form.vue";
import Dashboard from "@/components/Dashboard.vue";
import FooterBar from "@/components/FooterBar.vue";
import { useBreakpoint } from "@/composables/breakpoints";

const { breakpoint } = useBreakpoint();
const store = useTaxesStore();

const { showDashboard } = storeToRefs(store);


const route = useRoute()
console.log(route.query)
store.setParametersFromURL(route.query)


const router = useRouter();
console.log(router.currentRoute.value.query)



</script>
  