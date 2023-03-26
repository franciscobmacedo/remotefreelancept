const directives = {
  focus: { mounted: (el: HTMLInputElement) => el.focus() },
  unfocus: { mounted: (el: HTMLInputElement) => el.blur() },
};

export default directives;
