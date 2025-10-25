import { mount, shallowMount } from "@vue/test-utils";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

export const mountComponent = (component, shallow, propsData, options) => {
  if (shallow) {
    return shallowMount(component, {
      propsData,
      ...options,
    });
  } else {
    return mount(component, {
      propsData,
      ...options,
    });
  }
};

export const wrapperSlots = {
  slots: {
    moreThanLimit: `<div>${globalThis.MORE_THAN_LIMIT}</div>`,
    lessThanLimit: `<div>${globalThis.LESS_THAN_LIMIT}</div>`,
  },
};

export const NO_OPTIONS_PATTERN = /No options/i;
export const FIRST_OPTION_PATTERN = /F/i;

const localVue = createLocalVue();

localVue.use(Vuex);

export const localVueConstructor = localVue;
