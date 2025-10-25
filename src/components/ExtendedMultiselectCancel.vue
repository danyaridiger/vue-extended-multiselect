<template>
  <div
    aria-label="Clear options list"
    role="button"
    :class="classes"
    :tabindex="increasedTabindex"
    @click="cancel"
    @keypress.stop="cancel"
  >
    <img
      alt=""
      v-if="!loading"
      :class="iconSizeClass"
      :src="require('../assets/cancel.svg')"
    />
    <extended-multiselect-loader
      v-else
      :icon-filter="loaderIconFilter"
      :icon-size="iconSize"
    />
  </div>
</template>

<script>
import Vue from "vue";

import ExtendedMultiselectLoader from "./ExtendedMultiselectLoader.vue";

import cancel from "../mixins/cancel";
import sizes from "../mixins/sizes";

/**
 * @mixes SizesMixin
 * @mixes CancelMixin
 */
export default Vue.extend({
  name: "ExtendedMultiselectCancel",

  components: {
    ExtendedMultiselectLoader,
  },

  mixins: [sizes, cancel],

  props: {
    /**
     * Blocks cancel button
     * @property {boolean} disabled
     */
    disabled: {
      type: Boolean,
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
     * Replaces cancel button with loader
     * @property {boolean} loading
     */
    loading: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines whether to clear current value of search field
     * @property {boolean} showSearchField
     */
    showSearchField: {
      type: Boolean,
      required: true,
    },

    /**
     * Defines "tabindex" attribute of cancel button
     * @default null
     * @property {number|null} tabindex
     */
    tabindex: {
      type: Number,
      default: null,
    },

    /**
     * List of selected options
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
  },

  computed: {
    /**
     * Toggles classes of component if "loading"
     * or "disabled" props equals true
     * @method
     * @returns {string} class
     */
    classes() {
      return this.loading || this.disabled
        ? "extended__multiselect-cancel--disabled"
        : "extended__multiselect-cancel";
    },

    /**
     * Sets "tabindex" attibute of clear button based on
     * given tabindex
     * @method
     * @returns {number} tabindex
     */
    increasedTabindex() {
      return this.tabindex ? this.tabindex + 2 : 0;
    },
  },
});
</script>
