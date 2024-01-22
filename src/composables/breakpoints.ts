import { onMounted, reactive } from "vue";

const screens = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const xs = (val: number) => val >= screens.xs && val <= screens.sm;
const sm = (val: number) => val >= screens.sm && val <= screens.md;
const md = (val: number) => val >= screens.md && val <= screens.lg;
const lg = (val: number) => val >= screens.lg && val <= screens.xl;
const xl = (val: number) => val >= screens.xl;

export enum BreakPointEnum {
  xs = "xs",
  sm = "sm",
  md = "mf",
  lg = "lg",
  xl = "xl",
  all = "all",
}

const getBreakpoint = (w: number) => {
  if (xs(w)) return BreakPointEnum.xs;
  else if (sm(w)) return BreakPointEnum.sm;
  else if (md(w)) return BreakPointEnum.md;
  else if (lg(w)) return BreakPointEnum.lg;
  else if (xl(w)) return BreakPointEnum.xl;
  else return BreakPointEnum.all;
};

export interface BreakPoint {
  w: number;
  h: number;
  is: BreakPointEnum;
  smAndUp: boolean;
  mdAndUp: boolean;
  lgAndUp: boolean;
  smAndDown: boolean;
}

export const useBreakpoint = () => {
  const breakpoint = reactive({
    w: 0,
    h: 0,
    is: "xs",
    smAndUp: false,
    mdAndUp: false,
    lgAndUp: false,
    smAndDown: false,
  } as BreakPoint);
  const setBreakpoints = () => {
    const point = getBreakpoint(window.innerWidth);
    breakpoint.w = window.innerWidth;
    breakpoint.h = window.innerHeight;
    breakpoint.is = point;
    breakpoint.smAndDown =
      point == BreakPointEnum.xs || point == BreakPointEnum.sm;
    breakpoint.smAndUp = point != BreakPointEnum.xs;
    breakpoint.mdAndUp =
      point != BreakPointEnum.xs && point != BreakPointEnum.sm;
    breakpoint.lgAndUp =
      point != BreakPointEnum.xs &&
      point != BreakPointEnum.sm &&
      point != BreakPointEnum.md;
  };
  onMounted(() => {
    setBreakpoints();
    window.addEventListener("resize", () => {
      setBreakpoints();
    });
  });

  return {
    breakpoint,
  };
};
