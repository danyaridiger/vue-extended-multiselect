<template>
  <div class="extended__multiselect-block extended__multiselect-block--multiple">
    <div v-if="placeholderBlockShown" class="extended__multiselect-placeholder">
      {{ appropriatePlaceholder }}
    </div>
    <div>
      <slot
        name="multipleBlocks"
        :selected-options="limitRestriction"
        :deselect-block="deselectBlock"
      >
        <div v-for="(option, index) in limitRestriction" :key="index">
          <slot
            name="optionBlock"
            :label="optionCreateLabel(option)"
            :index="index"
            :deselect-block="deselectBlock"
          >
            <div :class="classes">
              <span>{{ optionCreateLabel(option) }}</span>
              <div :class="deselectClasses" @click.stop="deselectBlock(index)">
                <img
                  alt=""
                  class="extended__multiselect_deselect-block-icon"
                  v-if="!showLoaderIcon"
                  :src="require('../assets/cancel.svg')"
                />
                <extended-multiselect-loader
                  v-else
                  :icon-filter="iconFilter"
                  icon-size="deselect"
                />
              </div>
            </div>
          </slot>
        </div>
        <slot
          name="maxElements"
          v-if="optionsLimitAchieved && !toggleMultipleBlocksLimit"
        >
          {{ multipleBlocksLimitMessage(overLimitOptionsCount) }}
        </slot>
        <slot
          name="showMore"
          v-if="optionIncreaserAvailable"
          :show-more-options="showMoreOptions"
        >
          <div :class="[classes, increaserClass]" @click.stop="showMoreOptions">
            Show more options
          </div>
        </slot>
      </slot>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

import labels from "../mixins/labels";
import multiple_methods from "../mixins/multiple_methods";

import ExtendedMultiselectLoader from "./ExtendedMultiselectLoader.vue";

/**
 * @mixes LabelsMixin
 * @mixes MultipleMethodsMixin
 */
export default Vue.extend({
  name: "ExtendedMultiselectMultiple",

  components: {
    ExtendedMultiselectLoader,
  },

  mixins: [labels, multiple_methods],

  props: {
    /**
     * Blocks deselect block button
     * @property {boolean} disabled
     */
    disabled: {
      type: Boolean,
      required: true,
    },

    /**
     * Hides all deselect buttons if equals true
     * @property {boolean} loading
     */
    loading: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to show extended multiselect
     * placeholder element
     * @property {boolean} placeholderBlockShown
     */
    placeholderBlockShown: {
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
     * Allows to increase limit of displayed selected option blocks
     * @property {boolean} toggleMultipleBlocksLimit
     */
    toggleMultipleBlocksLimit: {
      type: Boolean,
      required: true,
    },

    /**
     * Defines placeholder for extended multiselect
     * placeholder element
     * @property {string} appropriatePlaceholder
     */
    appropriatePlaceholder: {
      type: String,
      default: "",
    },

    /**
     * Defines label for blocks with options of type "object"
     * or Array instances which length/keys length equals 0
     * @property {string} emptyObjectsPlaceholder
     */
    emptyObjectsPlaceholder: {
      type: String,
      required: true,
    },

    /**
     * Defines a svg-filter for icons
     * @property {string} iconFilter
     */
    iconFilter: {
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
     * Current theme of extended-multiselect
     * used in class definition
     * @property {string} themeType
     */
    themeType: {
      type: String,
      required: true,
    },

    /**
     * Limit of hidden options amount to be shown next
     * @property {number} increaseDisplayBy
     */
    increaseDisplayBy: {
      type: Number,
      required: true,
    },

    /**
     * Limit of option blocks amount
     * @property {number} multipleBlocksLimit
     */
    multipleBlocksLimit: {
      type: Number,
      default: null,
    },

    /**
     * List of selected options that will be shown as option blocks
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
     * Function that creates custom label for
     * block with selected option
     * @property {Function} createCustomOptionLabel
     */
    createCustomOptionLabel: {
      type: Function,
      required: true,
    },

    /**
     * Function that creates limit message for maximal of selected options
     * @property {Function} multipleBlocksLimitMessage
     */
    multipleBlocksLimitMessage: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      optionsLimitIncreaser: null,
      increaserClass: "extended__multiselect-increaser",
    };
  },

  computed: {
    /**
     * Defines class for every selected option block
     * depends on current theme of extended multiselect
     * @method
     * @returns {string} class
     */
    classes() {
      const basicClassName = "extended__multiselect--multiple";

      switch (this.themeType) {
        case "slate-grey":
          return `${basicClassName}-slate-grey`;
        case "slate-blue":
          return `${basicClassName}-slate-blue`;
        case "teal":
          return `${basicClassName}-teal`;
        case "strict":
          return `${basicClassName}-strict`;
        default:
          return `${basicClassName}-basic`;
      }
    },

    /**
     * Defines class for every deselect/loader icon in multiple
     * option blocks depends on "loading" prop
     * @method
     * @returns {string} class
     */
    deselectClasses() {
      return this.loading
        ? "extended__multiselect-block_cancel-wrapper--loading"
        : "extended__multiselect-block_cancel-wrapper";
    },

    /**
     * Defines current limited amount of displayed option blocks
     * @method
     * @returns {Array} UnionPropType
     */
    limitRestriction() {
      if (!this.optionsLimitIncreaser) return this.selectedOptions;

      return this.selectedOptions.filter((_, index) => {
        return ++index <= this.optionsLimitIncreaser;
      });
    },

    /**
     * Determines whether user can increase limited amount of displayed option blocks
     * @method
     * @returns {boolean} possibility
     */
    optionIncreaserAvailable() {
      return this.toggleMultipleBlocksLimit && this.optionsLimitAchieved;
    },

    /**
     * Determines whether current limit of displayed option blocks amount
     * was reached
     * @method
     * @returns {boolean} reaching
     */
    optionsLimitAchieved() {
      return (
        this.optionsLimitIncreaser &&
        this.selectedOptions.length > this.optionsLimitIncreaser
      );
    },

    /**
     * Amount of selected options exceeding the limit
     * determined by "multipleBlocksLimit" prop
     * @method
     * @returns {number|null} amount
     */
    overLimitOptionsCount() {
      if (this.selectedOptions.length <= this.optionsLimitIncreaser) return null;

      return this.selectedOptions.length - this.optionsLimitIncreaser;
    },

    /**
     * Determines whether to show loader icon if "loading" prop equals true
     * or show multiple option blocks as usual
     * @method
     * @returns {boolean} restriction
     */
    showLoaderIcon() {
      return this.showDeselectIconLoader ? this.loading : false;
    },

    /**
     * Defines styles for "padding-right" css-property
     * of every option block
     * @method
     * @returns {Object|null} styles
     */
    styles() {
      return this.loading ? { paddingRight: "7px" } : null;
    },
  },
});
</script>
