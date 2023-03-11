/**
 * @mixin LabelsMixin
 */
export default {
  methods: {
    /**
     * Creates label of any kind of option
     * @method
     * @param {option} UnionPropType
     * @returns {string} label
     */
    optionCreateLabel(option) {
      const isFunction = typeof option === "function";

      if (!option && isFunction) return "";

      const customOptionLabel = this.createCustomOptionLabel(option);

      if (customOptionLabel) return customOptionLabel;
  
      if (Array.isArray(option) && option.length > 0) {
        return option.join(", ");
      }

      if (typeof option !== "object") return option.toString();

      if (Object.keys(option).length === 0) {
        return this.emptyObjectsPlaceholder;
      }

      const hasLabel = Object.getOwnPropertyNames(option).includes(this.label);
  
      if (hasLabel) {
        return typeof option[this.label] === "object" ? JSON.stringify(option[this.label]) : option[this.label];
      }

      return "";
    },
  },
};