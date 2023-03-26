<template>
  <div class="mx-2 md:mx-5 lg:mx-10 xl:mx-32 2xl:mx-60 3xl:mx-80">
    <Form></Form>
    <Dashboard v-if="showDashboard"></Dashboard>
    <FooterBar />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTaxesStore } from "@/stores";
import Form from "@/components/Form.vue";
import Dashboard from "@/components/Dashboard.vue";
import FooterBar from "@/components/FooterBar.vue";

const { showDashboard } = storeToRefs(useTaxesStore());
</script>
