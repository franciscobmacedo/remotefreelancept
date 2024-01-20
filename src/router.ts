import { createRouter, createWebHistory } from "vue-router";
import Simulator from "@/views/Simulator.vue";
import About from "@/views/About.vue";

const routes = [
  {
    path: "/",
    name: "Simulator",
    component: Simulator,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export const updateUrlQuery = (param: string, value: any) => {
  const queryParams = { ...router.currentRoute.value.query };
  queryParams[param] = value;
  router.push({ query: queryParams });
};

export const clearUrlQuery = () => {
  router.push({ query: null });
};

export default router;
