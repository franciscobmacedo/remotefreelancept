import { createApp } from "vue";
import "./style.scss";
import App from "@/App.vue";
import { createPinia } from "pinia";
import directives from "./directives.js";
import vClickOutside from "click-outside-vue3";
import router from "./router";

const app = createApp(App);

for (const [name, directive] of Object.entries(directives)) {
  app.directive(name, directive);
}
app.use(createPinia());
app.use(vClickOutside);

app.use(router);
app.mount("#app");
