<template>
  <div
    ref="optionsWrapper"
    tabindex="-1"
    :class="classes"
    :style="styles"
  >
    <slot name="listHeader"></slot>
    <div
      v-if="showCreateNewOptionBlock"
      :class="optionHighlightClasses(null)"
      @mousedown="createNewOption"
    >
      {{ searchValue }}
    </div>
    <slot
      name="moreThanLimit"
      v-if="maxOptionsWereSelected"
    >
      <span>Maximum limit of selected options was achieved</span>
    </slot>
    <slot
      name="lessThanLimit"
      v-if="minOptionsWereNotSelected"
    >
      <span>Minimum amount of selected options was not achieved</span>
    </slot>
    <div class="extended__multiselect-options_container">
      <div
        role="listbox"
        v-for="(option, index) in availableOptions"
        :key="index"
      >
        <div
          v-if="option"
          :aria-setsize="availableOptions.length"
          :aria-posinset="index"
          :aria-labelledby="`option-label-${index}`"
          :aria-disabled="optionIsDisabled(option)"
          :class="optionHighlightClasses(option)"
          :style="optionHeightByProps"
          :enter-locator="index"
          :role="optionCreateRole(option)"
          @click.stop="selectOption(option, $event)"
          @keypress.stop="selectOption(option, $event)"
          @mousedown="triggerOptionBeforeSelection"
          @mouseenter.stop="setEnterIndex"
        >
          <div class="extended__multiselect-marker">
            <slot 
              name="marker"
              :option="option"
            >
              <div
                v-if="showMarker && showCurrentMarker(option)"
                :class="markerShapeClass(option)"
              >
              </div>
              <div 
                v-else-if="showMarker"
                class="extended__multiselect-marker-shape-only"
              >
              </div>
            </slot>
          </div>
          <slot
            name="option"
            :option="option"
            :create-custom-option-label="createCustomOptionLabel"
          >
            <span :id="`option-label-${index}`">
              {{ optionCreateLabel(option) }}
            </span>
          </slot>
        </div>
      </div>
    </div>
    <slot
      name="noResults"
      v-if="emptySearchResult"
    >
      <span>No results were found by search</span>
    </slot>
    <slot
      name="noOptions"
      v-if="emptyOptionsList"
    >
      <span>Options list is empty</span>
    </slot>
    <slot name="listFooter"></slot>
  </div>
</template>

<script>
import Vue from "vue";

import optionsMethods from "../mixins/options_methods";
import labels from "../mixins/labels";
import preselectedOptionsUtils from "../mixins/preselected_options";

import { mapGetters } from "vuex";

import { UnionPropType } from "../sets/sets";

/**
 * @mixes OptionsMethodsMixin
 * @mixes PreselectedOptionsMixin
 * @mixes LabelsMixin
 */
export default Vue.extend({
  name: "ExtendedMultiselectOptions",

  mixins: [optionsMethods, preselectedOptionsUtils, labels],

  props: {
    /**
     * Determines whether to immediately select just now created option
     * @property {boolean} autoSelectCreatedOption
     */
    autoSelectCreatedOption: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to show noResults slot
     * and block with new option's text
     * @property {boolean} createOnTheGo
     */
    createOnTheGo: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to emit clear event
     * by option selection
     * @property {boolean} clearBySelectWhenMultiple
     */
    clearBySelectWhenMultiple: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to define thematic class for
     * every option
     * @property {boolean} highlightOptions
     */
    highlightOptions: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines "loading" state of component
     * that disables option selection
     * @property {boolean} loading
     */
    loading: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to use functionality of
     * multiple select
     * @property {boolean} multiple
     */
    multiple: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to show selected options
     * in options list
     * @property {boolean} selectedOptionsShown
     */
    selectedOptionsShown: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to log warnings about incorrect props
     * @property {boolean} showInsertWarnings
     */
    showInsertWarnings: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to show marker slot
     * @property {boolean} showMarker
     */
    showMarker: {
      type: Boolean,
      required: true,
    },

    /**
     * Defines class of options list placement after expanse
     * @property {string} chosenToggleAppearanceSide
     */
    chosenToggleAppearanceSide: {
      type: String,
      required: true,
    },

    /**
     * Determines type of option that will be created
     * @property {string} createOptionType
     */
    createOptionType: {
      type: String,
      required: true,
    },

    /**
     * Determines a field in options of type "object"
     * which value will be used to disable such options.
     * @property {string} disableByField
     */
    disableByField: {
      type: String,
      required: true,
    },

    /**
     * Sets labels for options of type "object"
     * or Array instances which length/keys length equals 0
     * @property {string} emptyObjectsPlaceholder
     */
    emptyObjectsPlaceholder: {
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
     * Determines field in options of type "object"
     * to use in internal search.
     * @property {string} searchByField
     */
    searchByField: {
      type: String,
      required: true,
    },

    /**
     * Current theme of extended-multiselect
     * used in class definition
     * @property {string} themeType
     */
    themeType: {
      type: String,
      required: true,
    },

    /**
     * Defines "height" css-property of every option element
     * @property {number} anyOptionWrapperBlockHeight
     */
    anyOptionWrapperBlockHeight: {
      type: Number,
      required: true,
    },

    /**
     * Determines maximal limit of selected options
     * @property {number|null} maxOptionsCount
     */
    maxOptionsCount: {
      type: Number,
      default: null,
    },

    /**
     * Determines minimal limit of selected options
     * @property {number|null} minOptionsCount
     */
    minOptionsCount: {
      type: Number,
      default: null,
    },

    /**
     * Defines value of "max-height" css-property of options list
     * @property {number} toggleMaxHeight
     */
    toggleMaxHeight: {
      type: Number,
      required: true,
    },

    /**
     * Defines value of "min-height" css-property of options list
     * @property {number} toggleMinHeight
     */
    toggleMinHeight: {
      type: Number,
      default: null,
    },

    /**
     * List of fields for new options of type "object" created by user
     * if "createOnTheGo" prop equals true
     * Each field will have basic value of "searchValue" prop
     * @property {Array} createOptionFields
     */
    createOptionFields: {
      type: Array,
      required: true,
    },

    /**
     * Searches for options with listed primitive values
     * and disables it
     * @property {Array} disabledPrimitiveOptionsConverted
     */
    disabledPrimitiveOptionsConverted: {
      type: Array,
      required: true,
    },

    /**
     * Unfiltered options list
     * @property {Array} options
     */
    options: {
      type: Array,
      required: true,
    },

    /**
     * Defines value of "padding" css-property of every option
     * @property {Array} optionsPadding
     */
    optionsPadding: {
      type: Array,
      required: true,
    },
    
    /**
     * List of options which should be selected by default
     * if "multiple" prop equals true
     * @property {Array} preselectedOptions
     */
    preselectedOptions: {
      type: Array,
      required: true,
    },

    /**
     * List of options filtered by maximal available options amount
     * @property {Array} restrictedOptions
     */
    restrictedOptions: {
      type: Array,
      required: true,
    },

    /**
     * List of selected options or list with single selected option
     * if "multiple" prop equals false
     * @property {Array} selectedOptions
     */
    selectedOptions: {
      type: Array,
      required: true,
    },

    /**
     * List of key names that in combination with "enter" key
     * should cancel option selection
     * @property {Array} specialKeysBlock
     */
    specialKeysBlock: {
      type: Array,
      required: true,
    },

    /**
     * Creates custom label for every option in options list
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
     * Option which should be selected by default
     * if "multiple" prop equals false
     * @property {UnionPropType|null} preselectedOption
     */
    preselectedOption: {
      type: UnionPropType,
      default: null,
    },

    /**
     * Reactive instance of LocalEmitter class
     * @property {object} emitter
     */
    emitter: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      fieldWasShown: false,
      atopWithScroll: null,
      enterIndex: null,
      heightFromMounted: null,
      underWithScroll: null,
    };
  },

  computed: {
    /**
     * List of options filtered by "disabled" and "selected" signs
     * also by equality to null and undefined primitive values
     * or instance declarations
     * @method
     * @returns {Array} options
     */
    availableOptions() {
      let filteredOptions = this.restrictedOptions.filter((option) => {
        const availableOptionType = this.optionTypeRestrictor(option);

        if (!option || !availableOptionType) return false;

        if (!this.lookForSimpleOptions(option)) return false;

        if (this.selectedOptionsShown) return true;
          
        return this.lookForObjectOptions(option);
      });

      let finalOptionsList = filteredOptions;

      if (this.searchPattern) {
        finalOptionsList = this.filterBySearchPattern(filteredOptions);
      }

      return finalOptionsList;
    },

    /**
     * Defines a list of options list classes
     * @method
     * @returns {Array} classes
     */
    classes() {
      let theme = [];

      switch(this.themeType) {
        case "basic":
          theme.push("extended__multiselect-options");
          break;
        case "slate-grey":
          theme.push("extended__multiselect-options-slate-grey");
          break;
        case "slate-blue":
          theme.push("extended__multiselect-options-slate-blue");
          break;
        case "teal":
          theme.push("extended__multiselect-options-teal");
          break;
        case "strict":
          theme.push("extended__multiselect-options-strict");
          break;
        default:
          theme.push("extended__multiselect-options");
      }

      if (this.showMarker) {
        theme.push("extended__multiselect-options--marker");
      }

      if (this.chosenToggleAppearanceSide === "atop") {
        theme.push("extended__multiselect-options--atop");
      }

      return theme;
    },

    /**
     * Determines whether given options list is empty
     * @method
     * @returns {boolean} emptiness
     */
    emptyOptionsList() {
      return (!this.options.length || !this.options.filter((option) => !!option).length
       || !this.availableOptions.length) && !this.searchValue;
    },

    /**
     * Determines whether list of internal search results is empty
     * @method
     * @returns {boolean} emptiness
     */
    emptySearchResult() {
      return !this.availableOptions.length && !this.createOnTheGo && this.searchValue;
    },

    /**
     * Defines styles for "min-heigt", "max-height"
     * and "top" css-properties of options wrapper
     * @method
     * @returns {Object} styles
     */
    heightFromProps() {
      let heightRecord = {};
      
      if (this.chosenToggleAppearanceSide === "atop") {
        Object.defineProperty(heightRecord, "top", {
          enumerable: true,
          value: `-${this.toggleMaxHeight}px`,
        });
      }

      Object.defineProperty(heightRecord, "maxHeight", {
        enumerable: true,
        value: `${this.toggleMaxHeight}px`,
      });

      if (this.toggleMinHeight) {
        if (this.toggleMinHeight > this.toggleMaxHeight) {
          if (this.showInsertWarnings) {
            let errorMessage = "vue-extended-multiselect: «toggleMinHeight» property can not be greater than «toggleMaxHeight» property.";
            errorMessage += "«toggleMaxHeight» property was reset to default value of 400 pixels.";
            console.warn(errorMessage);
          }

          return Object.keys(heightRecord).length ? heightRecord : null;
        }

        Object.defineProperty(heightRecord, "minHeight", {
          enumerable: true,
          value: `${this.toggleMinHeight}px`,
        });
      }

      return Object.keys(heightRecord).length ? heightRecord : null;
    },

    /**
     * Determines whether maximal amount of options has been selected
     * @method
     * @returns {boolean} reaching
     */
    maxOptionsWereSelected() {
      return this.maxOptionsCount && this.multiple && this.selectedOptions.length === this.maxOptionsCount;
    },

    /**
     * Determines whether minimal amount of options has not been selected
     * @method
     * @returns {boolean} reaching
     */
    minOptionsWereNotSelected() {
      return this.minOptionsCount && this.multiple && this.selectedOptions.length < this.minOptionsCount;
    },

    /**
     * Defines styles for "padding" and "height" css-property 
     * of every option element
     * @method
     * @returns {Object} styles
     */
    optionHeightByProps() {
      let height = {
        height: `${this.anyOptionWrapperBlockHeight}px`,
      };

      if (this.optionsPadding.length) {
        const padding = {
          paddingTop: this.optionsPadding[0] ? `${this.optionsPadding[0]}px` : null,
          paddingLeft: this.optionsPadding[1] ? `${this.optionsPadding[1]}px` : null,
          paddingBottom: this.optionsPadding[2] ? `${this.optionsPadding[2]}px` : null,
          paddingRight: this.optionsPadding[3] ? `${this.optionsPadding[3]}px` : null,
        };

        return Object.assign(height, padding);
      }

      return height;
    },

    /**
     * Determines whether to show element with new custom option
     * @method
     * @returns {boolean} display
     */
    showCreateNewOptionBlock() {
      return this.createOnTheGo && !this.availableOptions.length && this.searchValue;
    },

    /**
     * Summarizes styles for options wrapper in combined collection
     * @method
     * @returns {Array} styles 
     */
    styles() {
      return [
        this.heightFromProps, 
        this.heightFromMounted, 
        this.atopWithScroll, 
        this.underWithScroll
      ];
    },

    /**
     * @see {@linkcode VuexGetters}
     */
    ...mapGetters([
      "searchValue",
      "searchPattern"
    ]),
  },
});
</script>
