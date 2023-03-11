/**
 * @mixin ToggleMixin
 */
export default {
  computed: {
    /**
     * Toggles classes of slots if "loading"
     * or "disabled" props equals true
     * @method
     * @returns {string} class
     */
    toggleSlotClass() {
      return (this.loading || this.internalLoading || this.disabled)
       ? "extended__multiselect-toggle--disabled"
       : "extended__multiselect-toggle";
    },
  },

  methods: {
    /**
     * Emits an event which listeners will toggle options list
     * @method
     * @emits extended:toggle-options
     * @param {MouseEvent|KeyboardEvent} event - MouseEvent or KeyboardEvent instance
     */
    toggleOptionsList(event) {
      if (event && event.code === "Tab") return;
      
      this.emitter.$emit("extended:toggle-options");
    },
  },
};