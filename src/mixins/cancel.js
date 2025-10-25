import { mapActions } from "vuex";

/**
 * @mixin CancelMixin
 */
export default {
  methods: {
    /**
     * Removes all selected options or single selected option
     * when "multiple" prop equals false
     * @method
     * @emits extended:skip-block-blur-zeroing
     * @emits extended:deselect-option
     * @emits extended:clean-options
     */
    cancel() {
      if (this.disabled || this.loading) return;

      this.emitter.$emit("extended:skip-block-blur-zeroing");
      this.emitter.$emit("extended:deselect-option", null, true);

      if (!this.showSearchField) return;

      this.emitter.$emit("extended:clean-options");

      this.setSearchValue(null);
      this.setSearchPattern(null);
    },

    /**
     * @see {@linkcode VuexActions}
     */
    ...mapActions(["setSearchValue", "setSearchPattern"]),
  },
};
