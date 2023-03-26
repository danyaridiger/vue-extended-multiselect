/**
 * @mixin MultipleMethodsMixin
 */
export default {
  methods: {
    /**
     * Deselects option by users click on its element cancel icon 
     * if "multiple" prop equals true
     * @method
     * @emits extended:deselect-option
     * @prop {number} index - index of deselected option
     */
    deselectBlock(index) {
      if (this.loading || this.disabled) return;

      this.emitter.$emit("extended:deselect-option", index);
    },

    /**
     * Shows next hidden options
     * This behavior restricts by "toggleMultipleBlocksLimit" prop 
     * if "multiple" prop equals true
     * @method
     * @emits extended:increase-display
     */
    showMoreOptions() {

      this.optionsLimitIncreaser += this.increaseDisplayBy;
      this.emitter.$emit("extended:increase-display", this.optionsLimitIncreaser);
    },
  },

  watch: {
    selectedOptions: {
      /**
       * If limit of selected options was achieved restricts further
       * extension of options container if "multiple" prop equals true
       * @method
       * @param {Array} - array of selected options
       */
      handler(value) {
        if (!value.length || value.length <= this.multipleBlocksLimit) {
          this.optionsLimitIncreaser = this.multipleBlocksLimit;
        }
      },
    },
  },

  /**
   * "created" hook of ExtendedMultiselectMultiple component
   */
  created() {
    this.optionsLimitIncreaser = this.multipleBlocksLimit;
  },
};