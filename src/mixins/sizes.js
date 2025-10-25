/**
 * @mixin SizesMixin
 */
export default {
  props: {
    /**
     * Defines a svg-filter for icons
     * @property {string} iconFilter
     */
    iconFilter: {
      type: String,
      required: true,
    },

    /**
     * Provides size to create special size-class
     * for each kind of icon
     * @property {string} iconSize
     */
    iconSize: {
      type: String,
      required: true,
    },
  },

  computed: {
    /**
     * Defines classes for each kind of icon
     * @method
     * @returns {string} class
     */
    iconSizeClass() {
      let basicIconSize = "extended__multiselect";

      switch (this.$options._componentTag) {
        case "extended-multiselect-loader":
          basicIconSize += "-loader_icon";
          break;
        case "extended-multiselect-toggle":
          basicIconSize += "-toggle_icon";
          break;
        case "extended-multiselect-cancel":
          basicIconSize += "-cancel_icon";
          break;
        default:
          basicIconSize += "-toggle_icon";
      }

      switch (this.iconSize) {
        case "medium":
          return `${basicIconSize}-medium`;
        case "small":
          return `${basicIconSize}-small`;
        case "deselect":
          return `${basicIconSize}-deselect`;
        default:
          return `${basicIconSize}-large`;
      }
    },
  },
};
