<template>
  <v-app>
    <v-app-bar app color="primary" dark> asdas </v-app-bar>

    <v-main>
      <v-container>
        <v-row class="text-center">
          <v-col class="mb-4">
            <h1 class="display-2 font-weight-bold mb-3">
              Portuguese Independent Worker
            </h1>
          </v-col>
        </v-row>
        <Form />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Form from "@/components/Form";

export default {
  name: "App",
  components: {
    Form,
  },
};
</script>
