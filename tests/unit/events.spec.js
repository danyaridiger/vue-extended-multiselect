import { fireEvent } from "@testing-library/dom";
import { mountComponent, localVueConstructor } from "../utils/mount";
import { 
  mockOptionSelection,
  mockOptionsLoader,
  createNewOptionsWrapper,
} from "../utils/utils";

import store from "../../src/vuex/store";

import VueExtendedMultiselect from "../../src/components/VueExtendedMultiselect.vue";
import ExtendedMultiselectInput from "../../src/components/ExtendedMultiselectInput.vue";
import ExtendedMultiselectMultiple from "../../src/components/ExtendedMultiselectMultiple.vue";

let wrapper;

describe("events", () => {
  it("correctly emits 'pattern-changed' event", async () => {
    const propsData = {
      options: globalThis.OPTIONS,
    };
    
    wrapper = await mountComponent(VueExtendedMultiselect, true, propsData);

    wrapper.vm.$data.emitter.$emit(
      "extended:search-pattern-changed", 
      globalThis.SEARCH_VALUE,
    );

    expect(wrapper.emitted()['pattern-changed'][0][0]).toEqual(globalThis.SEARCH_VALUE);

    propsData.options = mockOptionsLoader;
    wrapper = await mountComponent(VueExtendedMultiselect, true, propsData);

    wrapper.vm.$data.emitter.$emit(
      "extended:loader-pattern-changed", 
      globalThis.SEARCH_VALUE_WITH_RESULTS,
    );

    expect(wrapper.emitted()['pattern-changed'][0][0]).toEqual(globalThis.SEARCH_VALUE_WITH_RESULTS);
  });


  it("correctly emits 'select' event", async () => {
    const propsData = {
      defaultExpanded: true,
      simpleEvents: false,
      inputId: globalThis.INPUT_ID,
      options: globalThis.OPTIONS,
      preselectedOption: 126,
    };

    wrapper = await mountComponent(VueExtendedMultiselect, false, propsData);

    expect(wrapper.emitted().select).not.toBeDefined();
    
    const multipleWrapper = wrapper.find(".extended__multiselect-block--multiple > div");

    expect(multipleWrapper.element.children).toHaveLength(1);

    await mockOptionSelection(wrapper);

    expect(wrapper.emitted().select[0][0].option.label).toEqual("First Option");
    expect(wrapper.emitted().select[0][0].inputId).toEqual(globalThis.INPUT_ID);
  });


  it("correctly emits 'clean' event", async () => {
    const propsData = {
      showClearIcon: true,
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(VueExtendedMultiselect, false, propsData);

    const cleanButton = wrapper.find(".extended__multiselect-cancel");

    await mockOptionSelection(wrapper);

    await fireEvent.click(cleanButton.element);

    expect(wrapper.emitted().clean).toBeDefined();
  });
  

  it("correctly emits 'option-created' event", async () => {
    const propsData = {
      defaultExpanded: true,
      createOnTheGo: true,
      inputId: globalThis.INPUT_ID,
    };

    store.commit("SET_SEARCH_VALUE", globalThis.SEARCH_VALUE);

    wrapper = await mountComponent(VueExtendedMultiselect, false, propsData, { 
      localVueConstructor,
      store,
    });

    await fireEvent.mouseDown(createNewOptionsWrapper(wrapper).element);

    expect(wrapper.emitted()['option-created'][0][0]).toEqual(globalThis.SEARCH_VALUE);
  });


  it("correctly emits 'active' event", async () => {
    wrapper = await mountComponent(VueExtendedMultiselect, false);

    const inputWrapper = wrapper.findComponent(ExtendedMultiselectInput);
    const field = inputWrapper.find("input");

    await fireEvent.focus(field.element);

    expect(wrapper.emitted().active[0][0]).toBeNull();
  });


  it("correctly emits 'close' event", async () => {
    const propsData = {
      defaultExpanded: true,
      simpleEvents: false,
      inputId: globalThis.INPUT_ID,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(VueExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);

    expect(wrapper.emitted().close[0][0].inputId).toEqual(globalThis.INPUT_ID);
    expect(wrapper.emitted().close[0][0].options).toHaveLength(1);
  });
  

  it("correctly emits 'increase' event", async () => {
    expect.assertions(1);
    
    const propsData = {
      multiple: true,
      toggleMultipleBlocksLimit: true,
      multipleBlocksLimit: 1,
      increaseDisplayBy: 1,
      preselectedOptions: globalThis.OPTIONS,
      options: globalThis.OPTIONS,
    };
    const wrapper = await mountComponent(VueExtendedMultiselect, false, propsData);

    const multipleWrapper = wrapper.findComponent(ExtendedMultiselectMultiple);
    const increaserWrapper = multipleWrapper.find(".extended__multiselect-increaser");

    await fireEvent.click(increaserWrapper.element);
        
    expect(wrapper.emitted().increase[0][0]).toEqual(2);
  });
});