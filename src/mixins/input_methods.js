import { mapActions } from "vuex";

/**
 * @mixin InputMethodsMixin
 */
export default {
  methods: {
    /**
     * Expands options list
     * @method
     * @emits extended:expand-options
     */
    expand() {
      if (this.disabled) return;
      
      this.searchFieldFocused = true;
      this.emitter.$emit("extended:expand-options");
    },

    /**
     * Describes behavour of input blur event
     * when "multiple" prop equals true
     * @method
     */
    multipleBlur() {
      if (!this.multiple) {
        this.searchFieldFocused = false;
        return;
      }
    },
  
    /**
     * Rolls up options list if it needed
     * @method
     * @emits extended:rollup-options
     */
    rollUp() {
      if (this.disabled) return;

      this.multipleBlur();

      if (!this.togglingSavesSearchValue) {
        this.searchValue = "";
        this.setSearchValue(null);
        this.setSearchPattern(null);
      }

      if (this.blurSkipByToggleIcon > 0) {
        this.blurSkipByToggleIcon = 0;
        return;
      }
  
      if (this.blurSkipByBlock > 0) {
        this.blurSkipByBlock = 0;
        return;
      }

      this.blurSkip = true;
      this.blurSkipByBlock = 0;
      this.blurSkipByToggleIcon = 0;

      this.emitter.$emit("extended:rollup-options", true);
    },

    /**
     * Rolls up options list after option selection
     * and sets single option label
     * @method
     * @param {UnionPropType} option - option to be selected
     */
    rollupIfSelected(option) {
      if (this.toggleOptionsBySelect) {
        this.rollUp();
      }

      if (this.multiple) {
        return;
      } else {
        this.singleLabel = option.label;
      }
    },
    
    /**
     * Activates debounced version of options list filter
     * @method
     */
    search() {
      this.searchDebounce.start();
    },

    /**
     * @see {@linkcode VuexActions}
     */
    ...mapActions([
      "setSearchValue",
      "setSearchPattern"
    ]),
  },
  
  watch: {
    searchFieldForwarding: {
      /**
       * Determines whether option shall be triggered before selection
       * @function
       * @emits extended:renew-field-forwarding
       * @param {boolean} searchFieldForwarding - restrictor of triggered option 
       */
      handler(value) {
        if (value && this.autoSelectSearchValue && !this.multiple && this.singleLabel) {
          this.searchValue = this.singleLabel;
        }
        this.emitter.$emit("extended:renew-field-forwarding", value);
      }
    },

    searchPattern: {
      /**
       * Sets pattern of internal search for available options from search field to store
       * @method
       * @param {string} pattern - pattern of internal search for available options
       */
      handler(pattern) {
        if (this.searchFilterActive) {
          this.setSearchPattern(pattern);
        }
      },
    },

    /**
     * Sets value of search field from search field to store
     * @method
     * @param {string} value - value of search field
     */
    searchValue: {
      handler(value) {
        if (this.searchFilterActive) {
          this.setSearchValue(value);
        }
      },
    },
  },

  /**
   * "created" hook of the ExtendedMultiselectInput component
   * @listens extended:field-focus
   * @listens extended:rollup-options
   * @listens extended:select-option
   * @listens extended:preselect-option
   * @listens extended:deselect-option
   * @listens extended:clean-options
   * @listens extended:clear-field
   * @listens extended:skip-blur
   * @listens extended:skip-block-blur
   * @listens extended:skip-block-blur-zeroing
   * @listens extended:trigger-selection
   * @listens extended:preserve-search-field
   */
  created() {
    this.emitter.$on("extended:field-focus", () => {
      if (this.showSearchField) {
        this.$nextTick(() => {
          this.$refs.extendedInput.focus();
        });
      } else {
        this.$refs.extendedInput.focus();
      }
    });

    this.emitter.$on("extended:rollup-options", (internalRollup) => {
      if (this.blurSkip === true) {
        this.blurSkip = false;
        return;
      }

      if (internalRollup) {
        return;
      }
      
      this.rollUp();
    });

    this.emitter.$on("extended:select-option", (option) => {
      this.rollupIfSelected(option);
    });

    this.emitter.$on("extended:preselect-option", (option) => {
      this.rollupIfSelected(option);
    });

    this.emitter.$on("extended:deselect-option", () => {
      if (this.multiple) {
        return;
      } else {
        this.singleLabel = "";
      }
    });

    this.emitter.$on("extended:clean-options", () => {
      this.searchValue = null;
    });

    this.emitter.$on("extended:clear-field", () => {
      this.searchValue = null;
    });

    this.emitter.$on("extended:skip-blur", () => {
      this.blurSkipByToggleIcon++;
    });

    this.emitter.$on("extended:skip-block-blur", () => {
      this.blurSkipByBlock++;
    });

    this.emitter.$on("extended:skip-block-blur-zeroing", () => {
      this.blurSkipByBlock = 0;
    });

    this.emitter.$on("extended:trigger-selection", (triggerState) => {
      if (!this.toggleOptionsBySelect) {
        this.searchFieldFocused = false;
      }
      this.optionWillBeTriggered = triggerState;
    });

    this.emitter.$on("extended:preserve-search-field", (preserveState) => {
      if (!this.multiple && this.selectedOptions.length) {
        this.searchFieldPreserving = preserveState;
      }

      this.searchPlaceholderPreserving = preserveState;
    });
  },
};