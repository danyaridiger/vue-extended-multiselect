<template>
  <div
    aria-label="Toggle options list"
    role="switch"
    :aria-checked="dropdownActive"
    :class="toggleSlotClass"
    :tabindex="increasedTabindex"
    @click.stop.left="toggleOptionsList"
    @click.stop.middle="toggleOptionsList"
    @keypress.stop="toggleOptionsList($event)"
  >
    <img
      alt=""
      v-if="!loading"
      :class="classesSummary"
      :src="icon"
    />
    <extended-multiselect-loader 
      v-else
      :icon-filter="loaderIconFilter"
      :icon-size="iconSize"
    />
    <svg
      version="1.1" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      width="0"
      height="0"
    >  
      <defs>
        <filter 
          x="0" 
          y="0" 
          width="1" 
          height="1" 
          id="basicFilter"
        >
          <feFlood flood-color="#BDBDBD"/>
          <feComposite 
            out="SourceGraphic" 
            in2="SourceGraphic" 
            operator="in" 
          />
        </filter>
        <filter 
          x="0" 
          y="0" 
          width="1" 
          height="1" 
          id="blackFilter"
        >
          <feFlood flood-color="#000000"/>
          <feComposite 
            out="SourceGraphic" 
            in2="SourceGraphic" 
            operator="in" 
          />
        </filter>
        <filter 
          x="0" 
          y="0" 
          width="1" 
          height="1" 
          id="greenFilter"
        >
          <feFlood flood-color="#068504"/>
          <feComposite 
            out="SourceGraphic" 
            in2="SourceGraphic" 
            operator="in" 
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script>
import Vue from "vue";

import ExtendedMultiselectLoader from "./ExtendedMultiselectLoader.vue";

import toggle from "../mixins/toggle";
import sizes from "../mixins/sizes";

/**
 * @mixes ToggleMixin
 * @mixes SizesMixin
 */
export default Vue.extend({
  name: "ExtendedMultiselectToggle",

  components: {
    ExtendedMultiselectLoader,
  },

  mixins: [toggle, sizes],

  props: {
    /**
     * Determines what class to use on toggle slot
     * @default false
     * @property {boolean} disabled
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether option list expanded or not
     * @property {boolean} dropdownActive
     */
    dropdownActive: {
      type: Boolean,
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
     * Defines a svg-filter for loader icons
     * @property {string} loaderIconFilter
     */
    loaderIconFilter: {
      type: String,
      required: true,
    },

    /**
     * Replaces toggle button with loader
     * @property {boolean} loading
     */
    loading: {
      type: Boolean,
      required: true,
    },

    /**
     * Determines toggle icon to be used in default toggle slot
     * @property {string} toggleIcon
     */
    toggleIcon: {
      type: String,
      required: true,
    },

    /**
     * Defines "tabindex" attribute of toggle button
     * @default null
     * @property {number|null} tabindex
     */
    tabindex: {
      type: Number,
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
  
  computed: {
    /**
     * Defines a list of toggle button classes
     * @method
     * @returns {Array} classes
     */
    classesSummary() {
      return [
        this.iconFilterClass,
        this.iconSizeClass,
        this.iconFilterRotationClass
      ];
    },
    
    /**
     * Determines kind of toggle icon based on
     * "toggleIcon" prop
     * @method
     * @returns {string} icon
     */
    icon() {
      const baseArrow = require("../assets/base-arrow.svg");

      switch(this.toggleIcon) {
        case "base-arrow":
          return baseArrow;
        case "double-arrow":
          return require("../assets/double-arrow.svg");
        case "wide-arrow":
          return require("../assets/wide-arrow.svg");
        case "circle-arrow":
          return require("../assets/circle-arrow.svg");
        case "inner-arrow":
          return require("../assets/inner-arrow.svg");
        case "triangle-arrow":
          return require("../assets/triangle-arrow.svg");
        case "triangle-circle-arrow":
          return require("../assets/triangle-circle-arrow.svg");
        default: 
          return baseArrow;
      }
    },

    /**
     * Defines svg-filter for toggle icon
     * @method
     * @returns {string} svg-filter
     */
    iconFilterClass() {
      const basicFilter = "extended__multiselect-filter";
      
      switch(this.iconFilter) {
        case "basic":
          return `${basicFilter}_basic`;
        case "black":
          return `${basicFilter}_black`;
        case "green":
          return `${basicFilter}_green`;
        default:
          return `${basicFilter}_basic`;
      }
    },

    /**
     * Defines rotation class of toggle icon based on
     * "dropdownActive" prop
     * @method
     * @returns {string} class
     */
    iconFilterRotationClass() {
      return this.dropdownActive 
       ? "extended__multiselect-toggle--active" 
       : "extended__multiselect-toggle--locked";
    },

    /**
     * Sets "tabindex" attibute of toggle button based on
     * given tabindex
     * @method
     * @returns {number} tabindex
     */
    increasedTabindex() {
      return this.tabindex ? this.tabindex + 1 : 0;
    },
  },
});
</script>
