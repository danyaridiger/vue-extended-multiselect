/**
 * @mixin PreselectedOptionsMixin
 */
export default {
  methods: {
    /**
     * Creates string label for any kind of option
     * @method
     * @param {boolean} isObjectOrArray - determines whether option is of type "object" or instance of Array
     * @param {UnionPropType} option - option which needs label
     * @returns {string} label
     */
    createLabel(isObjectOrArray, option) {
      let label;

      if (isObjectOrArray) {
        if (Array.isArray(option) && option.length > 0) {
          label = option.join(", ");
        } else {
          label = typeof option[this.label] === "object" 
           ? JSON.stringify(option[this.label]) 
           : option[this.label];
        }

        if (Object.keys(option).length === 0) {
          label = this.emptyObjectsPlaceholder;
        }
      } else {
        label = option.toString();
      }

      return label;
    },

    /**
     * Restricts wrong types of options in options list
     * @method
     * @param {UnionPropType} option - option to restrict
     * @returns {boolean} restriction
     */
    optionTypeRestrictor(option) {
      if (!option) return false;

      const isObjectArrayInstance = Object.getPrototypeOf(option).constructor.name 
       !== "Object"
       && Object.getPrototypeOf(option).constructor.name !== "Array";
      const isAnyInstance = typeof option === "object" && isObjectArrayInstance;
      const isSymbol = typeof option === "symbol";

      if (isSymbol && this.showInsertWarnings) {
        console.warn("vue-extended-multiselect: option can not be of type «symbol»");
      }

      if (isAnyInstance && this.showInsertWarnings) {
        console.warn("vue-extended-multiselect: option can not be an instance of any constructor function");
      }

      if (isSymbol || isAnyInstance) return false;

      return true;
    },
  }
};