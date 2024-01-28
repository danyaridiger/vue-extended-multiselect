<template>
  <section
    aria-owns="extended-search-field"
    ref="extendedMultiselectWrapper"
    role="combobox"
    :aria-roledescription="roledescription"
    :class="wrapperClasses"
    :tabindex="tabindexIfSearch"
    @click.stop.left="fieldFocus"
    @click.stop.middle="fieldFocus"
    @keyup.stop.esc="rollUp"
    @keyup.stop.enter="selectByEnter"
    @mousedown.stop.left="toggleRestrictor"
    @mousedown.stop.middle="toggleRestrictor"
    @mouseleave.stop="resetEnterIndex"
  >
    <div
      ref="extendedMultiselect"
      :class="classes"
      :style="[displayWrongValue, expanded]"
    >
      <div>
        <extended-multiselect-input
          :accesskey="$attrs.accesskey"
          :autocomplete="$attrs.autocomplete"
          :name="$attrs.name"
          :spellcheck="$attrs.spellcheck"
          :tabindex="$attrs.tabindex"
          :translate="$attrs.translate"
          :auto-select-search-value="autoSelectSearchValue"
          :create-on-the-go="createOnTheGo"
          :disabled="disabled"
          :loading="internalLoading"
          :loader-icon-filter="loaderIconFilter"
          :multiple="multiple"
          :search-filter-active="searchFilterActive"
          :show-deselect-icon-loader="showDeselectIconLoader"
          :toggling-saves-search-value="togglingSavesSearchValue"
          :toggle-options-by-select="toggleOptionsBySelect"
          :placeholder="placeholder"
          :show-search-field="showSearchField"
          :empty-objects-placeholder="emptyObjectsPlaceholder"
          :label="label"
          :multiple-blocks-limit-message="multipleBlocksLimitMessage"
          :theme-type="themeType"
          :increase-display-by="increaseDisplayBy"
          :multipleBlocksLimit="multipleBlocksLimit"
          :toggle-multiple-blocks-limit="toggleMultipleBlocksLimit"
          :selected-options="selectedOptions"
          :emitter="emitter"
          :create-custom-option-label="createCustomOptionLabel"
          :create-option-placeholder="createOptionPlaceholder"
          :external-options-loader="externalOptionsLoader"
          :input-id="inputId"
        >
          <template
            v-if="$scopedSlots.labelBlock"
            #labelBlock="{ labelBlockValue }"
          >
            <slot
              name="labelBlock"
              :label-block-value="labelBlockValue"
            >
            </slot>
          </template>
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
        </extended-multiselect-input>
      </div>
      <div class="extended__multiselect-toggle_wrapper">
        <slot 
          name="toggle"
          :toggle-options-list="toggleOptionsList"
        >
          <extended-multiselect-toggle
            :tabindex="$attrs.tabindex"
            :disabled="disabled"
            :dropdown-active="dropdownActive"
            :loading="internalLoading"
            :icon-filter="iconFilter"
            :loader-icon-filter="loaderIconFilter"
            :icon-size="iconSize"
            :toggle-icon="toggleIcon"
            :emitter="emitter"
          />
        </slot>
      </div>
      <div class="extended__multiselect-cancel_wrapper">
        <slot
          name="cancel"
          :cancel="cancel"
        >
          <extended-multiselect-cancel
            v-if="showClearIcon"
            :tabindex="$attrs.tabindex"
            :disabled="disabled"
            :show-search-field="showSearchField"
            :loading="internalLoading"
            :icon-filter="iconFilter"
            :loader-icon-filter="loaderIconFilter"
            :icon-size="iconSize"
            :selected-options="selectedOptions"
            :emitter="emitter"
          />
        </slot>
      </div>
    </div>
    <transition
      name="extended-toggle"
      type="transition"
    >
      <extended-multiselect-options
        v-if="dropdownActive"
        :auto-select-created-option="autoSelectCreatedOption"
        :clear-by-select-when-multiple="clearBySelectWhenMultiple"
        :create-on-the-go="createOnTheGo"
        :disabled-primitive-options-converted="disabledPrimitiveOptionsConverted"
        :highlight-options="highlightOptions"
        :loading="internalLoading"
        :multiple="multiple"
        :selected-options-shown="selectedOptionsShown"
        :show-insert-warnings="showInsertWarnings"
        :show-marker="showMarker"
        :chosen-toggle-appearance-side="chosenToggleAppearanceSide"
        :create-option-type="createOptionType"
        :disable-by-field="disableByField"
        :empty-objects-placeholder="emptyObjectsPlaceholder"
        :label="label"
        :search-by-field="searchByField"
        :theme-type="themeType"
        :any-option-wrapper-block-height="anyOptionWrapperBlockHeight"
        :max-options-count="maxOptionsCount"
        :min-options-count="minOptionsCount"
        :options-padding="optionsPadding"
        :toggle-max-height="toggleMaxHeight"
        :toggle-min-height="toggleMinHeight"
        :create-option-fields="createOptionFields"
        :options="restrictedOptions"
        :restricted-options="restrictedOptions"
        :selected-options="selectedOptions"
        :special-keys-block="specialKeysBlock"
        :preselected-option="preselectedOption"
        :preselected-options="preselectedOptions"
        :emitter="emitter"
        :create-custom-option-label="createCustomOptionLabel"
        :external-options-loader="externalOptionsLoader"
      >
        <template
          v-if="$slots.listHeader"
          #listHeader
        >
          <slot name="listHeader"></slot>
        </template>
        <template
          v-if="$slots.moreThanLimit && maxOptionsCount"
          #moreThanLimit
        >
          <slot name="moreThanLimit"></slot>
        </template>
        <template
          v-if="$slots.lessThanLimit && minOptionsCount"
          #lessThanLimit
        >
          <slot name="lessThanLimit"></slot>
        </template>
        <template
          v-if="$scopedSlots.option"
          #option="{ option, createCustomOptionLabel }"
        >
          <slot 
            name="option"
            :option="option"
            :create-custom-option-label="createCustomOptionLabel"
          >
          </slot>
        </template>
        <template 
          v-if="$slots.marker"
          #marker="{ selected }"
        >
          <slot 
            name="marker"
            :selected="selected"
          >
          </slot>
        </template>
        <template
          v-if="$slots.noResults && noResultsBlockShown"
          #noResults
        >
          <slot name="noResults"></slot>
        </template>
        <template
          v-if="$slots.noOptions"
          #noOptions
        >
          <slot name="noOptions"></slot>
        </template>
        <template
          v-if="$slots.listFooter"
          #listFooter
        >
          <slot name="listFooter"></slot>
        </template>
      </extended-multiselect-options>
    </transition>
  </section>
</template>

<script>
import Vue from "vue";

import ExtendedMultiselectInput from "./ExtendedMultiselectInput.vue";
import ExtendedMultiselectToggle from "./ExtendedMultiselectToggle.vue";
import ExtendedMultiselectCancel from "./ExtendedMultiselectCancel.vue";
import ExtendedMultiselectOptions from "./ExtendedMultuselectOptions.vue";

import {
  themeTypes,
  loaderThemeTypes,
  toggleIcons,
  iconFilters,
  iconSizes,
  createOptionTypes,
  specialKeysToBlock,
  toggleAppearenceSides,
  UnionPropType,
} from "../sets/sets";

import clickOutside from "../mixins/click-outside";
import events from "../mixins/events";
import methods from "../mixins/methods";
import toggle from "../mixins/toggle";
import cancel from "../mixins/cancel";
import preselectedOptionsUtils from "../mixins/preselected_options";

import store from "../vuex/store";

/**
 * @todo Mark optional parameters of methods
 */

/**
 * @author Ridiger Daniil Dmitrievich, 2022
 * @mixes ClickOutsideMixin
 * @mixes EventsMixin
 * @mixes ExtendedMultiselectMethodsMixin
 * @mixes ToggleMixin
 * @mixes CancelMixin
 * @mixes PreselectedOptionsMixin
 * @version 0.4.0
 */
export default Vue.extend({
  name: "VueExtendedMultiselect",

  components: {
    ExtendedMultiselectInput,
    ExtendedMultiselectToggle,
    ExtendedMultiselectCancel,
    ExtendedMultiselectOptions,
  },

  mixins: [clickOutside, events, methods, toggle, cancel, preselectedOptionsUtils],

  store,

  props: {
    /**
     * Determines whether to select just now created option
     * automatically
     * @default false
     * @property {boolean} autoSelectCreatedOption
     */
    autoSelectCreatedOption: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether to take search value from current
     * selected option if "multiple" prop equals false
     * @default false
     * @property {boolean} autoSelectSearchValue
     */
    autoSelectSearchValue: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether to clear search field by option selection
     * @default false
     * @property {boolean} clearBySelectWhenMultiple
     */
    clearBySelectWhenMultiple: {
      type: Boolean,
      default: false,
    },

    /**
     * Allows user to create new options from search field 
     * @default false
     * @property {boolean} createOnTheGo
     */
    createOnTheGo: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether options list should be expanded by default
     * @default false
     * @property {boolean} defaultExpanded
     */
    defaultExpanded: {
      type: Boolean,
      default: false,
    },

    /**
     * Disables extended multiselect
     * @default false
     * @property {boolean} disabled
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Disables dropdown toggle
     * @default false
     * @property {boolean} dropdownDisabled
     */
    dropdownDisabled: {
      type: Boolean,
      default: false,
    },
    
    /**
     * Switches options highlighting while hovering
     * @default true
     * @property {boolean} highlightOptions
     */
    highlightOptions: {
      type: Boolean,
      default: true,
    },

    /**
     * Switches loading state of extended multiselect
     * @default false
     * @property {boolean} loading
     */
    loading: {
      type: Boolean,
      default: false,
    },

    /**
     * Allows user to select multiple options
     * @default false
     * @property {boolean} multiple
     */
    multiple: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether to show special hint if no options were found
     * @default true
     * @property {boolean} noResultsBlockShown
     */
    noResultsBlockShown: {
      type: Boolean,
      default: true,
    },
    
    /**
     * Determines whether to clear search field by selection/deselection of options
     * @default true
     * @property {boolean} resetSearchByValue
     */
    resetSearchByValue: {
      type: Boolean,
      default: true,
    },

    /**
     * Allows user to use internal search for options
     * @default true
     * @property {boolean} searchFilterActive
     */
    searchFilterActive: {
      type: Boolean,
      default: true,
    },

    /**
     * Switches full payload of extended multiselect events
     * @default true
     * @property {boolean} simpleEvents
     */
    simpleEvents: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines whether to show selected options in options list
     * @default false
     * @property {boolean} selectedOptionsShown
     */
    selectedOptionsShown: {
      type: Boolean,
      default: false,
    },

    /**
     * Allows user to deselect all options by special icon
     * @default false
     * @property {boolean} showClearIcon
     */
    showClearIcon: {
      type: Boolean,
      default: false,
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
     * Determines whether to show useful internal warnings in console
     * @default false
     * @property {boolean} showInsertWarnings
     */
    showInsertWarnings: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether to show slot with special marker beside option in options list
     * @default false
     * @property {boolean} showMarker
     */
    showMarker: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether to show search field which allows user
     * to search for options with internal search
     * @default true
     * @property {boolean} showSearchField
     */
    showSearchField: {
      type: Boolean,
      default: true,
    },

    /**
     * Allows user to increase limit of shown elements with selected options
     * by special icon
     * @default false
     * @property {boolean} toggleMultipleBlocksLimit
     */
    toggleMultipleBlocksLimit: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether to roll up options list by selection of option
     * @default true
     * @property {boolean} toggleOptionsBySelect
     */
    toggleOptionsBySelect: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines whether to save current search value if
     * display of options list was toggled
     * @default true
     * @property {boolean} togglingSavesSearchValue
     */
    togglingSavesSearchValue: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines whether to define special class for extended multiselect
     * if value is wrong
     * Irregularity of value is defined by user
     * @default false
     * @property {boolean} wrongCurrentValue
     */
    wrongCurrentValue: {
      type: Boolean,
      default: false,
    },

    /**
     * Placeholder for the search field to be used if
     * user is allowed to create new options
     * @default "Select or create features"
     * @property {string} createOptionPlaceholder
     */
    createOptionPlaceholder: {
      type: String,
      default: "Select or create features",
    },

    /**
     * Defines kind for all options which will be created by user
     * @default "primitive"
     * @property {string} createOptionType
     */
    createOptionType: {
      type: String,
      default: "primitive",
      validator(value) {
        return createOptionTypes.includes(value);
      },
    },

    /**
     * Determines a field in options of type "object"
     * which value will be used to disable such options.
     * @default "disabled"
     * @property {string} disableByField
     */
    disableByField: {
      type: String,
      default: "disabled",
    },

    /**
     * Placeholder for options of type "object"
     * or Array instances which length/keys length equals 0
     * @default "Empty Object/Array"
     * @property {string} emptyObjectsPlaceholder
     */
    emptyObjectsPlaceholder: {
      type: String,
      default: "Empty Object/Array",
    },

    /**
     * Defines "border-color" css-property for extended multiselect with wrong value
     * @default "#FF0000"
     * @property {string} errorBorderColor
     */
    errorBorderColor: {
      type: String,
      default: "#FF0000",
    },

    /**
     * Defines svg-filter with color settings for all icons except loader
     * @default "basic"
     * @property {string} iconFilter
     */
    iconFilter: {
      type: String,
      default: "basic",
      validator(value) {
        return iconFilters.includes(value);
      },
    },

    /**
     * Defines sizes for all icons in pixels except loader
     * @default "large"
     * @property {string} iconSize
     */
    iconSize: {
      type: String,
      default: "large",
      validator(value) {
        return iconSizes.includes(value);
      },
    },

    /**
     * Defines field in options of type "object" that will be the label of option
     * @default "label"
     * @property {string} label
     */
    label: {
      type: String,
      default: "label",
    },

    /**
     * Defines svg-filter with color settings for loader icon
     * @default "loader-default"
     * @property {string} loaderIconFilter
     */
    loaderIconFilter: {
      type: String,
      default: "loader-default",
      validator(value) {
        return loaderThemeTypes.includes(value);
      },
    },
    
    /**
     * Placeholder for search field to be used if
     * user is not allowed to create new options
     * @default "Select features"
     * @property {string} placeholder
     */
    placeholder: {
      type: String,
      default: "Select features",
    },

    /**
     * Determines field in options of type "object"
     * to use in internal search.
     * @default ""
     * @property {string} searchByField
     */
    searchByField: {
      type: String,
      default: "",
    },

    /**
     * Defines overall color theme for extended multiselect 
     * @default "basic"
     * @property {string} themeType
     */
    themeType: {
      type: String,
      default: "basic",
      validator(value) {
        return themeTypes.includes(value);
      },
    },

    /**
     * Defines which side options list will be displayed on
     * @default "auto"
     * @property {string} toggleAppearanceSide
     */
    toggleAppearanceSide: {
      type: String,
      default: "auto",
      validator(value) {
        return toggleAppearenceSides.includes(value);
      },
    },

    /**
     * Defines kind of toggle icon from icons collection
     * @default "base-arrow"
     * @property {string} toggleIcon
     */
    toggleIcon: {
      type: String,
      default: "base-arrow",
      validator(value) {
        return toggleIcons.includes(value);
      },
    },

    /**
     * Defines gap which increases limit of displayed elements with selected options
     * @default 5
     * @property {number} increaseDisplayBy
     */
    increaseDisplayBy: {
      type: Number,
      default: 5,
    },
    
    /**
     * Maximal limit of selected options
     * @default null
     * @property {number|null} maxOptionsCount
     */
    maxOptionsCount: {
      type: Number,
      default: null,
    },

    /**
     * Minimal limit of selected options
     * @default null
     * @property {number|null} minOptionsCount
     */
    minOptionsCount: {
      type: Number,
      default: null,
    },

    /**
     * Defines limit of displayed elements with selected options
     * @default null
     * @property {number|null} multipleBlocksLimit
     */
    multipleBlocksLimit: {
      type: Number,
      default: null,
    },

    /**
     * Defines maximal limit of options list length
     * @default null
     * @property {number|null} optionsCountRestriction
     */
    optionsCountRestriction: {
      type: Number,
      default: null,
    },

    /**
     * Defines maximal value in pixels of "max-height" css-property for options list
     * @default 400
     * @property {number} toggleMaxHeight
     */
    toggleMaxHeight: {
      type: Number,
      default: 400,
    },

    /**
     * Defines minimal value in pixels of "max-height" css-property for options list
     * @default null
     * @property {number} toggleMaxHeight
     */
    toggleMinHeight: {
      type: Number,
      default: null,
    },

    /**
     * Defines a list of fields for options of type "object" created by user
     * @default ["label"]
     * @property {Array} createOptionFields
     */
    createOptionFields: {
      type: Array,
      default: () => ["label"],
      validator(value) {
        return !value.some((field) => {
          return typeof field !== "string";
        });
      },
    },

    /**
     * Defines a list of primitive types for options.
     * Options of given types will be disabled for selection.
     * @default []
     * @property {Array} disabledPrimitiveOptions
     */
    disabledPrimitiveOptions: {
      type: Array,
      default: () => [],
      validator(value) {
        return value.every((option) => {
          return typeof option === "string" || typeof option === "number" 
           || typeof option === "boolean"
           || typeof option === "function";
        });
      },
    },

    /**
     * Raw options list
     * @default []
     * @property {Array|Function} options
     */
    options: {
      type: [Array, Function],
      default: () => [],
    },

    /**
     * Defines a list with "padding-top", "padding-left", "padding-bottom"
     * and "padding-right" css-properties for options in options list.
     * Property "padding-top" matches index zero.
     * Property "padding-right" matches index three.
     * @default []
     * @property {Array} optionsPadding
     */
    optionsPadding: {
      type: Array,
      default: () => [],
      validator(value) {
        return value.length < 5
        && !value.some((padding) => {
          return typeof padding !== "number";
        });
      },
    },

    /**
     * Defines a list of options that will be select by default
     * @default []
     * @property {Array} preselectedOptions
     */
    preselectedOptions: {
      type: Array,
      default: () => [],
    },

    /**
     * Defines a list of keys which in combination with mouse buttons or "enter" key
     * will prevent selection of option
     * @default []
     * @property {Array} specialKeysBlock
     */
    specialKeysBlock: {
      type: Array,
      default: () => [],
      validator(value) {
        return value.every((keyBlock) => {
          return specialKeysToBlock.includes(keyBlock);
        });
      },
    },

    /**
     * Defines value of extended multiselect that can be used in "v-model" attribute
     * @default []
     * @property {Array|null} value
     */
    value: {
      type: UnionPropType,
      default: null,
    },

    /**
     * Defines function that creates custom label for each option
     * @default (option)=>null
     * @property {Function} createCustomOptionLabel
     */
    createCustomOptionLabel: {
      type: Function,
      default: (option) => null,
    },

    /**
     * Defines function that creates notification when maximal limit 
     * of selected options has been reached
     * @default (number)=>string
     * @property {Function} multipleBlocksLimitMessage
     */
    multipleBlocksLimitMessage: {
      type: Function,
      default: (number) => `and ${number} more items`,
    },

    /**
     * Defines "height" css-property of every option element
     * @property {number} anyOptionWrapperBlockHeight
     */
    anyOptionWrapperBlockHeight: {
      type: [Number, String],
      default: "auto",
    },

    /**
     * "id" attribute of search field
     * @default null
     * @property {string|number|null} inputId
     */
    inputId: {
      type: [String, Number],
      default: null,
    },

    /**
     * Defines options that will be select by default
     * @default null
     * @property {UnionPropType|null} preselectedOption
     */
    preselectedOption: {
      type: UnionPropType,
      default: null,
    },
  },

  provide() {
    return {
      loaderIconFilter: this.loaderIconFilter,
    };
  },

  data() {
    return {
      dropdownActive: false,
      skipNextRemoval: false,
      externalOptionsLoader: null,
      chosenToggleAppearanceSide: null,
      selectedOptionsWatcher: null,
      rawOptions: [],
      selectedOptions: [],
    };
  },

  computed: {
    /**
     * Defines a list of extended multiselect wrapper classes
     * @method
     * @returns {Array} classes
     */
    classes() {
      let theme;
      const localClassList = [];

      switch(this.themeType) {
        case "basic":
          theme = "extended__multiselect";
          break;
        case "slate-grey":
          theme = "extended__multiselect-slate-grey";
          break;
        case "slate-blue":
          theme = "extended__multiselect-slate-blue";
          break;
        case "teal":
          theme = "extended__multiselect-teal";
          break;
        case "strict":
          theme = "extended__multiselect-strict";
          break;
        default: theme = "extended__multiselect";
      }

      localClassList.push(theme);

      const clear = this.showClearIcon 
       ? "extended__multiselect-clear--active"
       : "extended__multiselect-clear--locked";

      localClassList.push(clear);
      localClassList.push("extended__multiselect-container");
      
      return localClassList;
    },

    /**
     * Defines a list of disabled primitive options given in "disabledPrimitiveOptions" prop
     * @method
     * @returns {Array} options
     */
    disabledPrimitiveOptionsConverted() {
      if (!this.disabledPrimitiveOptions) return null;

      return this.disabledPrimitiveOptions.map((disabledOption) => {
        if (Array.isArray(disabledOption) || typeof disabledOption === "object") {
          return null;
        }

        return disabledOption;
      });
    },

    /**
     * Determines whether to display irregularity of value by "border-color" css-property
     * @method
     * @returns {Object|null} styles
     */
    displayWrongValue() {
      return this.wrongCurrentValue ? { borderColor: this.errorBorderColor } : null; 
    },

    /**
     * Defines styles depending on current options list dropdown state
     * @method
     * @returns {Object|null} styles
     */
    expanded() {
      let borderStyles;

      if (this.chosenToggleAppearanceSide === "atop") {
        borderStyles = {
          borderTopLeftRadius: 0, 
          borderTopRightRadius: 0,
        };
      } else {
        borderStyles = {
          borderBottomLeftRadius: 0, 
          borderBottomRightRadius: 0,
        };
      }

      return this.dropdownActive ? borderStyles : null;
    },

    /**
     * Determines whether to activate loading state by "loading" prop
     * or by internal loading sign
     * @method
     * @returns {boolean} loading
     */
    internalLoading() {
      return this.loading;
    },

    /**
     * Defines mapped list of previously restricted options
     * @method
     * @returns {Array} options
     */
    mappedOptions() {
      return this.restrictedOptions.map((restrictedOption) => {
        return JSON.stringify(restrictedOption);
      });
    },

    /**
     * Defines a list of options filtered by maximal admissible options amount
     * @method
     * @returns {Array} options
     */
    restrictedOptions() {
      if (!this.rawOptions) return;

      return this.optionsCountRestriction
       ? this.rawOptions.filter((_, index) => index + 1 <= this.optionsCountRestriction)
       : this.rawOptions;
    },

    /**
     * Defines "aria-roledescription" attribute of extended multiselect wrapper
     * @method
     * @returns {string} aria-roledescription
     */
    roledescription() {
      return this.multiple ? "Multiselect" : "Select";
    },
    
    /**
     * Defines "tabindex" attribute of extended multiselect wrapper if needed
     * @method
     * @returns {number} tabindex
     */
    tabindexIfSearch() {
      return this.showSearchField ? this.$attrs.tabindex : -1;
    },

    /**
     * Defines special class which indicates disabled or loading state
     * of extended multiselect wrapper
     * @method
     * @returns {string} class
     */
    wrapperClasses() {
      return this.disabled && !this.internalLoading
       ? "extended__multiselect-wrapper--disabled"
       : "extended__multiselect-wrapper";
    },
  },
});
</script>

<style>

@import "../styles/main.css";

</style>