import { createApp } from "vue";
import "./style.scss";
import App from "@/App.vue";
import router from "./router";
import { createPinia } from "pinia";
import directives from "./directives.js";
import vClickOutside from "click-outside-vue3";

const app = createApp(App);

for (const [name, directive] of Object.entries(directives)) {
  app.directive(name, directive);
}

app.use(createPinia());
app.use(vClickOutside);
app.use(router);
app.mount("#app");
