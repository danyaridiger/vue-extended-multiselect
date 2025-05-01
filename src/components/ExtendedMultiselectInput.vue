<template>
  <div v-if="showSearchField">
    <input
      aria-controls="extended-search-field"
      ref="extendedInput"
      type="text"
      :accesskey="$attrs.accesskey"
      :autocomplete="$attrs.autocomplete"
      :class="searchFieldClass"
      :disabled="disabled"
      :id="inputId"
      :name="$attrs.name"
      :placeholder="appropriatePlaceholder"
      :spellcheck="$attrs.spellcheck"
      :tabindex="$attrs.tabindex"
      :translate="$attrs.translate"
      v-model="searchValue"
      @blur.prevent="rollUp"
      @focus.prevent="expand"
      @input="search"
    />
    <div
      class="extended__multiselect-block"
      v-show="!searchFieldForwarding && !multiple && !placeholderBlockShown"
      @click="expand"
    >
      <slot
        name="labelBlock"
        :label-block-value="singleLabel"
      >
        <span>{{ singleLabel }}</span>
      </slot>
    </div>
    <span
      v-if="placeholderBlockShown"
      class="extended__multiselect-placeholder"
    >
      {{ appropriatePlaceholder }}
    </span>
    <extended-multiselect-multiple
      v-show="multiple && !!selectedOptions.length"
      :style="multipleBlocksMargin"
      :disabled="disabled"
      :loading="loading"
      :icon-filter="loaderIconFilter"
      :placeholder-block-shown="!selectedOptions.length"
      :show-deselect-icon-loader="showDeselectIconLoader"
      :toggle-multiple-blocks-limit="toggleMultipleBlocksLimit"
      :appropriate-placeholder="appropriatePlaceholder"
      :empty-objects-placeholder="emptyObjectsPlaceholder"
      :label="label"
      :multiple-blocks-limit-message="multipleBlocksLimitMessage"
      :theme-type="themeType"
      :increase-display-by="increaseDisplayBy"
      :multipleBlocksLimit="multipleBlocksLimit"
      :selected-options="selectedOptions"
      :emitter="emitter"
      :create-custom-option-label="createCustomOptionLabel"
    >
      <template
        v-if="$scopedSlots.multipleBlocks"
        #multipleBlocks="{ selectedOptions, deselectBlock }"
      >
        <slot
          name="multipleBlocks"
          :selected-options="selectedOptions"
          :deselect-block="deselectBlock"
        >
        </slot>
      </template>
      <template
        v-if="$scopedSlots.optionBlock"
        #optionBlock="{ label, deselectBlock, index }"
      >
        <slot 
          name="optionBlock"
          :label="label"
          :index="index"
          :deselect-block="deselectBlock"
        >
        </slot>
      </template>
      <template
        v-if="$slots.maxElements"
        #maxElements
      >
        <slot name="maxElements"></slot>
      </template>
      <template
        v-if="$scopedSlots.showMore && toggleMultipleBlocksLimit"
        #showMore="{ showMoreOptions }"
      >
        <slot 
          name="showMore"
          :show-more-options="showMoreOptions"
        >
        </slot>
      </template>
    </extended-multiselect-multiple>
  </div>
  <div v-else-if="!showSearchField && multiple">
    <extended-multiselect-multiple
      :disabled="disabled"
      :loading="loading"
      :icon-filter="loaderIconFilter"
      :show-deselect-icon-loader="showDeselectIconLoader"
      :toggle-multiple-blocks-limit="toggleMultipleBlocksLimit"
      :empty-objects-placeholder="emptyObjectsPlaceholder"
      :label="label"
      :multiple-blocks-limit-message="multipleBlocksLimitMessage"
      :theme-type="themeType"
      :increase-display-by="increaseDisplayBy"
      :multipleBlocksLimit="multipleBlocksLimit"
      :selected-options="selectedOptions"
      :emitter="emitter"
      :create-custom-option-label="createCustomOptionLabel"
    >
      <template
        v-if="$scopedSlots.multipleBlocks"
        #multipleBlocks="{ selectedOptions, deselectBlock }"
      >
        <slot
          name="multipleBlocks"
          :selected-options="selectedOptions"
          :deselect-block="deselectBlock"
        >
        </slot>
      </template>
      <template
        v-if="$scopedSlots.optionBlock"
        #optionBlock="{ label, deselectBlock, index }"
      >
        <slot 
          name="optionBlock"
          :label="label"
          :index="index"
          :deselect-block="deselectBlock"
        >
        </slot>
      </template>
      <template
        v-if="$scopedSlots.showMore && toggleMultipleBlocksLimit"
        #showMore="{ showMoreOptions }"
      >
        <slot 
          name="showMore"
          :show-more-options="showMoreOptions"
        ></slot>
      </template>
    </extended-multiselect-multiple>
    <input
      class="extended__multiselect-input--hidden"
      ref="extendedInput"
      type="text"
      @blur.prevent="rollUp"
      @focus.prevent="expand"
    />
  </div>
  <div
    class="extended__multiselect-block"
    v-else
  >
    <span
      v-if="hintBlockShown"
      class="extended__multiselect-placeholder"
    >
      {{ appropriatePlaceholder }}
    </span>
    <slot
      name="labelBlock"
      :label-block-value="singleLabel"
    >
      <span>{{ singleLabel }}</span>
    </slot>
    <input
      class="extended__multiselect-input--hidden"
      ref="extendedInput"
      type="text"
      @blur.prevent="rollUp"
      @focus.prevent="expand"
    />
  </div>
</template>

<script>
import Vue from "vue";

import Debounce from "../tools/Debounce";

import ExtendedMultiselectMultiple from "./ExtendedMultiselectMultiple.vue";

import inputMethods from "../mixins/input_methods";

/**
 * @mixes InputMethodsMixin
 */
export default Vue.extend({
  name: "ExtendedMultiselectInput",

  mixins: [inputMethods],

  components: {
    ExtendedMultiselectMultiple,
  },

  props: {
    /**
     * Determines whether to take search value from current
     * selected option if "multiple" prop equals false
     * @property {boolean} autoSelectSearchValue
     */
    autoSelectSearchValue: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines which placeholder to use
     * depending on the options creation mode
     * @property {boolean} createOnTheGo
     */
    createOnTheGo: {
      type: Boolean,
      required: true,
    },

    /**
     * Blocks search field
     * @property {boolean} disabled
     */
    disabled: {
      type: Boolean,
      required: true,
    },
    
    /**
     * Provides "loading" state of component
     * to ExtendedMultiselectMultiple child component
     * @property {boolean} loading
     */
    loading: {
      type: Boolean,
      required: true,
    },
    
    /**
     * Determines whether to use ExtendedMultiselectMultiple 
     * child component and some other related functionality
     * @property {boolean} multiple
     */
    multiple: {
      type: Boolean,
      required: true,
    },

    /**
     * Renews the pattern of internal search for available options
     * @property {boolean} searchFilterActive
     */
    searchFilterActive: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to show search field
     * @property {boolean} showSearchField
     */
    showSearchField: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to show loader icon in multiple
     * options block if "loading" prop equals true
     * @default true
     * @property {boolean} showDeselectIconLoader
     */
    showDeselectIconLoader: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines whether to allow user to increase limit of shown 
     * elements with selected options by special icon
     * @property {boolean} toggleMultipleBlocksLimit
     */
    toggleMultipleBlocksLimit: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to roll up options list
     * by option selection
     * @property {boolean} toggleOptionsBySelect
     */
    toggleOptionsBySelect: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to clear value of search field
     * after next switch of search field display
     * @property {boolean} togglingSavesSearchValue
     */
    togglingSavesSearchValue: {
      type: Boolean,
      required: true,
    },

    /**
     * Placeholder which will be shown
     * if "createOnTheGo" prop equals true
     * @property {string} createOptionPlaceholder
     */
    createOptionPlaceholder: {
      type: String,
      required: true,
    },

    /**
     * Placeholder used in internal options filters
     * and provided to ExtendedMultiselectMultiple child component
     * @property {string} emptyObjectsPlaceholder
     */
    emptyObjectsPlaceholder: {
      type: String,
      required: true,
    },

    /**
     * Defines a svg-filter for loader icons
     * @property {string} loaderIconFilter
     */
    loaderIconFilter: {
      type: String,
      required: true,
    },

    /**
     * Determines field of option which will be displayed as label
     * @property {string} label
     */
    label: {
      type: String,
      required: true,
    },

    /**
     * "placeholder" attribute for search field
     * @property {string} placeholder
     */
    placeholder: {
      type: String,
      required: true,
    },
    
    /**
     * Provides current theme of extended multiselect
     * to ExtendedMultiselectMultiple child component
     * @property {string} themeType
     */
    themeType: {
      type: String,
      required: true,
    },

    /**
     * Provides limit of hidden options amount to be shown next
     * @property {number} increaseDisplayBy
     */
    increaseDisplayBy: {
      type: Number,
      required: true,
    },

    /**
     * Provides limit of multiple option blocks amount
     * to ExtendedMultiselectMultiple child component
     * @default null
     * @property {number} multipleBlocksLimit
     */
    multipleBlocksLimit: {
      type: Number,
      default: null,
    },

    /**
     * Provides list of selected options
     * to ExtendedMultiselectMultiple child component
     * @property {Array} selectedOptions
     */
    selectedOptions: {
      type: Array,
      required: true,
    },

    /**
     * Reactive instance of LocalEmitter class
     * @property {object} emitter
     */
    emitter: {
      type: Object,
      required: true,
    },

    /**
     * Provides function that creates custom label for
     * block with selected option to ExtendedMultiselectMultiple 
     * child component
     * @property {Function} createCustomOptionLabel
     */
    createCustomOptionLabel: {
      type: Function,
      required: true,
    },

    /**
     * Loader function provided by user.
     * @property {Function} externalOptionsLoader
     * @default null
     * @param {string} value - value of search field
     */
    externalOptionsLoader: {
      type: Function,
      default: null,
    },

    /**
     * Provides function that creates limit message for maximal of selected
     * options to ExtendedMultiselectMultiple child component
     * @property {Function} multipleBlocksLimitMessage
     */
    multipleBlocksLimitMessage: {
      type: Function,
      required: true,
    },

    /**
     * "id" attribute of search field
     * @default null
     * @property {string|number} inputId
     */
    inputId: {
      type: [String, Number],
      default: null,
    },
  },

  data() {
    return {
      blurSkip: false,
      reversePrevented: false,
      searchFieldFocused: false,
      optionWillBeTriggered: false,
      searchFieldPreserving: false,
      searchPlaceholderPreserving: false,
      searchValue: "",
      singleLabel: "",
      blurSkipByToggleIcon: 0,
      blurSkipByBlock: 0,
      searchDebounce: new Debounce(() => {
        const searchPattern = this.searchValue ? new RegExp(`${this.searchValue}`, "i") : null;

        if (this.externalOptionsLoader) {
          this.emitter.$emit("extended:loader-pattern-changed", this.searchValue);
        } else {
          this.emitter.$emit("extended:search-pattern-changed", this.searchValue);
          this.setSearchPattern(searchPattern);
        }
      }, 250),
    };
  },

  computed: {
    /**
     * Defines "placeholder" attribute of search field
     * @method
     * @returns {string} placeholder
     */
    appropriatePlaceholder() {
      return this.createOnTheGo ? this.createOptionPlaceholder : this.placeholder;
    },

    /**
     * Determines whether to show placeholder block
     * if search field is hidden
     * @function
     * @returns {boolean} display
     */
    hintBlockShown() {
      if (this.selectedOptions.length) return false;

      return true;
    },

    /**
     * Sets "margin-top" css property to multiple option blocks
     * if search field is shown
     * @method
     * @returns {Object|null} margin-top
     */
    multipleBlocksMargin() {
      return this.searchFieldForwarding ? { marginTop: "4px" } : null;
    },

    /**
     * Determines whether to show placeholder block
     * @function
     * @returns {boolean} display
     */
    placeholderBlockShown() {
      if (this.selectedOptions.length || this.searchFieldForwarding) return false;

      return true;
    },

    /**
     * Defines classes of search field
     * @method
     * @returns {Array} classes
     */
    searchFieldClass() {
      const mainClass = this.searchFieldForwarding 
       ? "extended__multiselect-input"
       : "extended__multiselect-input--hidden";
      const searchFieldClasses = [];

      if (this.optionWillBeTriggered) {
        searchFieldClasses.push("extended__multiselect-input--trigger-option");
      }

      if (this.searchPlaceholderPreserving) {
        searchFieldClasses.push("extended__multiselect-input--preserved");
      }

      searchFieldClasses.push(mainClass);
      
      return searchFieldClasses;
    },

    /**
     * Determines whether to show search field
     * over element with selected option
     * @method
     * @returns {boolean} display
     */
    searchFieldForwarding() {
      return this.searchFieldFocused 
        || this.optionWillBeTriggered 
        || this.searchFieldPreserving;
    },
  },
});
</script>
