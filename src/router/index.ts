import { createRouter, createWebHistory } from "vue-router";
import Simulator from "@/views/SimulatorView.vue";
import About from "@/views/AboutView.vue";

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
  linkActiveClass: "hover:text-neutral-600 decoration-neutral-600",
  linkExactActiveClass: "underline underline-offset-8",
});

export const updateUrlQuery = (param: string, value: any) => {
  const queryParams = { ...router.currentRoute.value.query };
  queryParams[param] = value;
  router.push({ query: queryParams });
};

export const clearUrlQuery = () => {
  router.push({ query: undefined });
};

export default router;
