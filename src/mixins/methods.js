import localEmitter from "../tools/events.js";

const togglePattern = /^extended__multiselect-toggle_wrapper/i;

/**
 * @mixin ExtendedMultiselectMethodsMixin
 */
export default {
  methods: {
    /**
     * Emits "active" when dropdown options list is active
     * @method
     * @emits active
     */
    activeEmitter() {
      const eventData = this.simpleEvents ? null : {
        inputId: this.inputId,
      };

      /**
       * @event active
       * @type {object|null}
       * @property {string} inputId - id of search field set by "id" prop
       */
      this.$emit("active", eventData);
    },

    /**
     * Emits "close" when dropdown options list is rolled up
     * @method
     * @emits close
     */
    closeEmitter() {
      const eventData = this.simpleEvents 
       ? this.selectedOptions
       : this.createEventFields(this.selectedOptions, "options");

      /**
       * @event close
       * @type {object|Array}
       * @property {string} inputId - id of search field set by "id" prop
       * @property {Array} options - array of selected options
       */
      this.$emit("close", eventData);
    },

    /**
     * Creates payload for events that can be listened by outer listeners
     * @method
     * @param {UnionPropType} field - main payload of event
     * @param {string} fieldName - name of field with main payload of event
     * @returns {object} payload
     */
    createEventFields(field, fieldName) {
      const eventFields = {
        inputId: this.inputId,
      };

      Object.defineProperty(eventFields, fieldName, {
        value: field,
        enumerable: true,
      });

      return eventFields;
    },

    /**
     * Focuses search field if "click" native event was triggered on available element
     * @method
     * @emits extended:field-focus
     * @param {MouseEvent} mouseEvent - MouseEvent instance
     */
    fieldFocus(mouseEvent) {
      if (this.disabled) return;

      if (!this.toggleOptionsBySelect) {
        const customFilteredOptions = this.toggleOptionsRestrictor(mouseEvent);

        if (customFilteredOptions) return;
      }

      const customFilteredCancel = this.toggleCustomRestrictor(mouseEvent, 2);
      const customFilteredSelf = this.toggleCustomRestrictor(mouseEvent, 1);
      const filteredHasCancel = this.toggleDetector(mouseEvent, /^extended__multiselect-cancel_wrapper/i);
      const filteredHasToggle = this.toggleDetector(mouseEvent, togglePattern);

      if (customFilteredCancel) return;
      if (customFilteredSelf && this.dropdownActive === false) return;
      if (filteredHasCancel.length) return;
      if (filteredHasToggle.length && this.dropdownActive === false) return;
      
      this.emitter.$emit("extended:field-focus");
    },

    /**
     * Initialises options list loading by external async method
     * @method
     * @param {string} pattern - value of search field
     * @param {boolean} initialValue - preselected options flag
     */
    loadOptionsByExternalLoader(pattern, initialValue) {
      this.externalOptionsLoader = this.options;
      this.options(pattern).then(options => {
        this.rawOptions = options;
        if (initialValue) this.setPreselectedOptionsByConditions();
      });
    },

    /**
     * Makes removal of selected options based on external modelValue changes
     * @method
     * @param {boolean} single - "multiple" prop flag
     */
    removeSelectedOptions(single = false) {
      if (!single) {
        const modelValueMapped = this.value.map((option) => {
          return JSON.stringify(option);
        });

        this.selectedOptions = this.selectedOptions.filter((option) => {
          return modelValueMapped.includes(JSON.stringify(option));
        });
      } else {
        if (!this.value) this.cancel();
      }
    },

    /**
     * Emits event whose listener resets index of "enter" key pressing
     * @method
     * @emits extended:reset-index
     */
    resetEnterIndex() {
      this.emitter.$emit("extended:reset-index");
    },

    /**
     * Rolls up dropdown options list
     * @method
     * @emits extended:rollup-options
     */
    rollUp() {
      this.dropdownActive = false;
      this.emitter.$emit("extended:rollup-options");
    },

    /**
     * Rolls up dropdown options lists of other instances
     * @method
     * @emits extended:rollup-instances
     */
    rollupInstanses() {
      const root = this.$refs.extendedMultiselectWrapper;

      localEmitter.$emit("extended:rollup-instances", root);
    },

    /**
     * Triggers selection of option by "enter" key pressing
     * @method
     * @emits extended:select-enter
     * @param {KeyboardEvent} keyboardEvent - KeyboardEvent instance
     */
    selectByEnter(keyboardEvent) {
      this.emitter.$emit("extended:select-enter", keyboardEvent);
    },

    /**
     * Sets preselected option provided by "preselectedOption" prop
     * @method
     * @emits extended:preselect-option
     * @param {UnionPropType} preselectedOption - option to be selected
     * @param {boolean} restriction - restriction of preselected option
     */
    setPreselectedOption(preselectedOption, restriction = true) {
      const availableOptionType = this.optionTypeRestrictor(preselectedOption);
      const mappedSelectedOptions = this.selectedOptions.map((selectedOption) => {
        return JSON.stringify(selectedOption);
      });

      if (!availableOptionType) return;
      if (
        (!this.mappedOptions.includes(JSON.stringify(preselectedOption)) && restriction)
        && !mappedSelectedOptions.includes(JSON.stringify(preselectedOption))
      ) {
        if (this.showInsertWarnings) {
          console.warn("vue-extended-multiselect: option in «preselectedOption» property should be the same as analogue in «options» property");
        }

        return;
      }

      const isObjectOrArray = typeof preselectedOption === "object";
      const label = this.createLabel(isObjectOrArray, preselectedOption);

      this.emitter.$emit("extended:preselect-option", {
        label,
        option: preselectedOption,
      });
    },

    /**
     * Sets preselected options provided by "preselectedOptions" prop 
     * if "multiple" prop equals true
     * @method
     * @emits extended:preselect-option
     * @param {Array} preselectedOptions - options to be selected
     * @param {boolean} restriction - restriction of preselected options
     */
    setPreselectedOptions(preselectedOptions, restriction = true) {
      let allOptionsWereSelected = 0;
      const mappedSelectedOptions = this.selectedOptions.map((selectedOption) => {
        return JSON.stringify(selectedOption);
      });

      preselectedOptions.forEach((preselectedOption) => {
        const availableOptionType = this.optionTypeRestrictor(preselectedOption);
        
        if (!preselectedOption || !availableOptionType) return;
        if (this.selectedOptions.includes(preselectedOption)) return;

        if (
          (this.mappedOptions.includes(JSON.stringify(preselectedOption)) || !restriction)
           && !mappedSelectedOptions.includes(JSON.stringify(preselectedOption))
        ) {
          const isObjectOrArray = typeof option === "object";
          const label = this.createLabel(isObjectOrArray, preselectedOption);

          allOptionsWereSelected++;

          this.emitter.$emit("extended:preselect-option", {
            label,
            option: preselectedOption,
          });
        }
      });

      if (allOptionsWereSelected !== preselectedOptions.length && this.showInsertWarnings) {
        console.warn("vue-extended-multiselect: options in «preselectedOptions» property should be the same as analogues in «options» property");
      }
    },

    /**
     * Determines conditions that control preselected options installattion
     * if "modelValue" prop is defined
     * @method
     * @emits update:wrapper
     * @param {boolean} withRemoval - removal of selected options flag
     */
    setPreselectedOptionsByModelValue(withRemoval = false) {
      if (!this.value && !withRemoval) return;

      if (withRemoval) this.selectedOptionsWatcher();

      if (Array.isArray(this.value) && this.multiple) {
        if (withRemoval) this.removeSelectedOptions();

        this.setPreselectedOptions(this.value, false);
      } else {
        if (withRemoval) this.removeSelectedOptions(true);

        this.setPreselectedOption(this.value, false);
      }

      if (withRemoval) {
        this.updateModelValue();

        this.selectedOptionsWatcher = this.$watch("selectedOptions", () => {
          this.updateModelValue();
      
          if (this.resetSearchByValue) {
            this.emitter.$emit("extended:clear-field");
          }
        }, { deep: true });
      }
    },

    /**
     * Determines conditions that control preselected options installattion
     * by "preselectedOption" and "preselectedOptions" props
     * @method
     */
    setPreselectedOptionsByConditions() {
      if (this.preselectedOption && !this.multiple) {
        this.setPreselectedOption(this.preselectedOption);

        if (this.selectedOptions.length) {
          this.updateModelValue();
        }
      }
    
      if (!!this.preselectedOptions.length && this.multiple) {
        const initialLength = this.selectedOptions.length;

        this.setPreselectedOptions(this.preselectedOptions);

        if (initialLength !== this.selectedOptions.length) {
          this.updateModelValue();
        }
      }
    },
    
    /**
     * Defines a position of dropdown appearance
     * @method
     * @returns {string} position
     */
    toggleAppearanceRestrictor() {
      if (!window || !this.$refs.extendedMultiselectOptions) return "under";

      const innerHeight = window.innerHeight;
      const offsetHeight = this.$refs.extendedMultiselectOptions.$el.offsetHeight
       + this.$refs.extendedMultiselect.offsetHeight;
      const offsetTop = this.$refs.extendedMultiselect.getBoundingClientRect().y;
      const difference = innerHeight - offsetTop;

      if (difference > offsetHeight) {
        return "under";
      } else {
        return "atop";
      }
    },

    /**
     * Sets a position of dropdown appearance
     * @method
     */
    toggleAppearanceRestrictorActivate() {
      if (this.dropdownActive) {
        this.chosenToggleAppearanceSide = this.toggleAppearanceSide !== "auto"
         ? this.toggleAppearanceSide
         : this.toggleAppearanceRestrictor();
      }
    },
    
    /**
     * Restricts toggling of dropdown options list
     * @method
     * @emits extended:skip-block-blur
     * @param {MouseEvent} mouseEvent - MouseEvent instance
     * @returns {boolean} toggling
     */
    toggleBlockRestrictor(mouseEvent) {
      let generalRestriction;
      let filteredCustomSelf;
      const filteredHasBlock = this.toggleDetector(mouseEvent, /^extended__multiselect-block/i, true);
      const filteredHasSlot = this.toggleDetector(mouseEvent, /^extended__multiselect-options(?!_option)/i, true)
      const filteredSelf = this.toggleDetector(mouseEvent, /^extended__multiselect-clear/i, true);
          
      if (filteredSelf.length || filteredHasBlock.length || filteredHasSlot.length) {
        filteredCustomSelf = true;
      } else {
        filteredCustomSelf = this.toggleCustomRestrictor(mouseEvent);
      }
    
      if (this.extendedMultiselectToggle) {
        generalRestriction = (filteredHasBlock.length && this.dropdownActive && filteredCustomSelf)
         || (filteredSelf.length && this.dropdownActive && filteredCustomSelf)
         || (filteredHasSlot.length && this.dropdownActive && filteredCustomSelf);
      } else {
        generalRestriction = (filteredHasBlock.length && this.dropdownActive)
         || (filteredSelf.length && this.dropdownActive)
         || (filteredHasSlot.length && this.dropdownActive);
      }
      
      if (generalRestriction) {
        this.emitter.$emit("extended:skip-block-blur");
        return true;
      }
    
      return false;
    },

    /**
     * Restricts toggling of dropdown options list by clicking
     * on particular descendants of toggle wrapper element
     * @method
     * @param {MouseEvent} mouseEvent - MouseEvent instance
     * @param {number} blockType - type of block which needs restriction
     * @returns {boolean} restriction
     */
    toggleCustomRestrictor(mouseEvent, blockType) {
      let eventTarget = mouseEvent.target;
      const toggleWrapper = this.$refs.extendedMultiselect;
      const customToggle = toggleWrapper.children[blockType];
     
      while(eventTarget) {
        if (eventTarget === customToggle) return true;

        eventTarget = eventTarget.parentNode;
      }

      return false;
    },

    /**
     * Restricts toggling of dropdown options list by clicking
     * on particular elements defined by given pattern
     * @method
     * @param {MouseEvent} mouseEvent - MouseEvent instance
     * @param {string} pattern - pattern with block class partial name
     * @param {boolean} mode - marks whether restrict by parent element or by current target
     * @returns {Array} classes
     */
    toggleDetector(mouseEvent, pattern, mode) {
      let target = mouseEvent.target;

      let filteredHasToggle = Array.prototype.filter.call(target.classList, (className) => {
        return pattern.test(className) === true;
      });

      while(
        target
        && (target.classList 
          && !target.classList.contains("extended__multiselect-wrapper")
          || target.classList 
          && !target.classList.length)
        && mode
        && !filteredHasToggle.length
      ) {
        filteredHasToggle = Array.prototype.filter.call(target.classList, (className) => {
          return pattern.test(className) === true;
        });

        if (target.classList.contains("extended__multiselect-options_container")) {
          filteredHasToggle.push("extended__multiselect-options_container");
          return filteredHasToggle;
        }

        if (target.classList.contains("extended__multiselect-toggle_wrapper")) {
          filteredHasToggle.push("extended__multiselect-toggle_wrapper");
          return filteredHasToggle;
        }

        target = target.parentNode;
      }

      return filteredHasToggle;
    },

    /**
     * Toggles dropdown options list and activates
     * necessary methods with relevant events
     * @method
     */
    toggleOptions() {
      if (this.internalLoading || this.disabled || this.dropdownDisabled) return;

      this.dropdownActive = !this.dropdownActive;

      this.$nextTick(() => {
        this.toggleAppearanceRestrictorActivate();
      });

      if (!this.dropdownActive) {
        this.activeEmitter();
      } else {
        this.closeEmitter();
      }
    },

    /**
     * Prevents toggling dropdown options list
     * by selecting/deselecting option
     * @method
     * @param {MouseEvent} mouseEvent - MouseEvent instance
     * @returns {boolean} restriction 
     */
    toggleOptionsRestrictor(mouseEvent) {
      let eventTarget = mouseEvent.target;
      const optionsWrapper = this.$refs.optionsWrapper;

      while(eventTarget) {
        if (eventTarget === optionsWrapper) return true;

        eventTarget = eventTarget.parentNode;
      }

      return false;
    },

    /**
     * Collects restrictions from other methods and defines
     * general restriction of toggling dropdown options list
     * @method
     * @emits extended:skip-blur
     * @param {MouseEvent} mouseEvent - MouseEvent instance
     */
    toggleRestrictor(mouseEvent) {
      this.rollupInstanses();

      const targetContentBlock = this.toggleBlockRestrictor(mouseEvent);

      if (targetContentBlock) return;

      const filteredHasToggle = this.toggleDetector(mouseEvent, togglePattern);

      if (filteredHasToggle.length && this.dropdownActive) {

        this.emitter.$emit("extended:skip-blur");
      }
    },

    /**
     * Triggers modelValue updating when v-model has 
     * been changed programmatically
     * @method
     * @emits update:modelValue
     */
    updateModelValue() {
      if (this.multiple) {
        this.$emit("input", this.selectedOptions);
      } else {
        this.$emit("input", this.selectedOptions[0]);
      }
    },
  },

  watch: {
    dropdownActive: {
      /**
       * Forcibly rolls up dropdown options list by changing "dropdownActive" flag
       * @method
       * @emits extended:rollup-options
       * @param {boolean} value - "dropdownActive" flag
       */
      handler(value) {
        if (!value) {
          this.emitter.$emit("extended:rollup-options");
        }
      },
    },

    value: {
      /**
       * Changes selected options based on external modelValue changes
       * @method
       */
      handler(value, prevValue) {
        if (JSON.stringify(value) === JSON.stringify(prevValue) || this.skipNextRemoval) {
          this.skipNextRemoval = false;

          return;
        }

        this.setPreselectedOptionsByModelValue(true);
      },
    },
  },

  /**
   * "created" hook of the VueExtendedMultiselect component
   * @emits select
   * @emits clean
   * @emits option-created
   * @emits increase
   * @emits pattern-changed
   * @emits extended:rollup-options
   * @listens extended:available-options
   * @listens extended:expand-options
   * @listens extended:rollup-options
   * @listens extended:toggle-options
   * @listens extended:select-option
   * @listens extended:preselect-option
   * @listens extended:deselect-option
   * @listens extended:create-option
   * @listens extended:increase-display
   * @listens extended:loader-pattern-changed
   * @listens extended:search-pattern-changed
   */
  created() {
    this.selectedOptionsWatcher = this.$watch("selectedOptions", (value) => {
      this.updateModelValue();

      if (this.resetSearchByValue) {
        this.emitter.$emit("extended:clear-field");
      }
    }, { deep: true });
    
    this.chosenToggleAppearanceSide = this.toggleAppearanceSide;

    this.emitter.$on("extended:available-options", () => {
      this.$nextTick(() => {
        this.toggleAppearanceRestrictorActivate();
      });
    });

    this.emitter.$on("extended:expand-options", () => {
      if (this.dropdownActive || this.dropdownDisabled) return;
      
      this.dropdownActive = true;
      
      this.$nextTick(() => {
        this.toggleAppearanceRestrictorActivate();
      });
      this.activeEmitter();
    });

    this.emitter.$on("extended:rollup-options", () => {
      if (!this.dropdownActive) return;

      this.closeEmitter();
      this.dropdownActive = false;
    });

    this.emitter.$on("extended:toggle-options", () => {
      this.toggleOptions();
    });

    this.emitter.$on("extended:select-option", (option) => {
      const eventData = this.simpleEvents 
       ? option.option
       : this.createEventFields(option.option, "option");

      if (this.multiple) {
        this.selectedOptions.push(option.option);
        /**
         * @event select
         * @type {Object}
         * @property {string} inputId - id of search field set by "id" prop
         * @property {UnionPropType} option - just now selected option
         */
        this.$emit("select", eventData);
      } else {
        this.selectedOptions = [option.option];
        /**
         * @see select
         */
        this.$emit("select", eventData);
      }

      this.updateModelValue();
    });

    this.emitter.$on("extended:preselect-option", (option) => {
      if (this.multiple) {
        this.selectedOptions.push(option.option);
      } else {
        this.selectedOptions = [option.option];
      }
  
      this.updateModelValue();
    });

    this.emitter.$on("extended:deselect-option", (index = null, clearAll, skipNextRemoval) => {
      if (this.multiple && !clearAll) {
        const deselectedOption = this.selectedOptions[index];

        const eventData = this.simpleEvents 
         ? deselectedOption 
         : this.createEventFields(deselectedOption, "option");
  
        /**
         * @event clean
         * @type {Object}
         * @property {string} inputId - id of search field set by "id" prop
         * @property {UnionPropType} option - just now deselected option
         */
        this.$emit("clean", eventData);

        if (skipNextRemoval) {
          this.skipNextRemoval = true;
        }

        this.selectedOptions.splice(index, 1);
        this.updateModelValue();

        return;
      } else {
        if (!this.selectedOptions.length) return;
        
        const eventData = this.simpleEvents
         ? this.selectedOptions
         : this.createEventFields(this.selectedOptions, "option");

        /**
         * @event clean
         * @type {Object}
         * @property {string} inputId - id of search field set by "id" prop
         * @property {UnionPropType} options - just now deselected options
         */
        this.$emit("clean", eventData);

        this.selectedOptions = [];
        this.updateModelValue();
      }

      if (this.toggleOptionsBySelect) {
        this.emitter.$emit("extended:rollup-options");
      }
    });
    
    this.emitter.$on("extended:create-option", (createdOption) => {
      const eventData = this.simpleEvents 
       ? createdOption 
       : this.createEventFields(createdOption, "option");

      /**
       * @event option-created
       * @type {PluginObject}
       * @property {string} inputId - id of search field set by "id" prop
       * @property {UnionPropType} option - option created by user
       */
      this.$emit("option-created", eventData);
    });

    this.emitter.$on("extended:increase-display", (limit) => {
      const eventData = this.simpleEvents ? limit : this.createEventFields(limit, "limit");

      /**
       * @event increase
       * @type {Object}
       * @property {string} inputId - id of search field set by "id" prop
       * @property {limit} - current limit of options to be shown next
       */
      this.$emit("increase", eventData);
    });

    this.emitter.$on("extended:loader-pattern-changed", (pattern) => {
      const eventData = this.simpleEvents 
       ? pattern 
       : this.createEventFields(pattern, "pattern");

      /**
       * @event pattern-changed
       * @type {Object}
       * @property {string} inputId - id of search field set by "id" prop
       * @property {pattern} - pattern of internal search for available options
       */
      this.$emit("pattern-changed", eventData);
    });

    this.emitter.$on("extended:search-pattern-changed", (pattern) => {
      const eventData = this.simpleEvents 
       ? pattern 
       : this.createEventFields(pattern, "pattern");

      /**
       * @event pattern-changed
       * @type {Object}
       * @property {string} inputId - id of search field set by "id" prop
       * @property {pattern} - pattern of internal search for available options
       */
      this.$emit("pattern-changed", eventData);
    });
  },

  /**
   * "mounted" hook of the VueExtendedMultiselect component
   * @emits extended:rollup-options
   * @listens extended:rollup-instances
   * @listens extended:loader-pattern-changed
   */
  mounted() {
    if (typeof this.options === "function") {
      this.loadOptionsByExternalLoader(null, true);
    } else {
      this.rawOptions = this.options;
      this.setPreselectedOptionsByConditions();
    }

    this.setPreselectedOptionsByModelValue();
    
    const root = this.$refs.extendedMultiselectWrapper;
    
    this.clickOutside.init(root, () => {
      this.emitter.$emit("extended:rollup-options");
    });

    if (
      this.defaultExpanded 
       && !this.disabled
       && typeof this.options !== "function"
    ) {
      this.dropdownActive = true;

      this.$nextTick(() => {
        this.toggleAppearanceRestrictorActivate();
      });
    }

    this.emitter.$on("extended:loader-pattern-changed", (pattern) => {
      this.loadOptionsByExternalLoader(pattern, false);
    });

    localEmitter.$on("extended:rollup-instances", (instanceRef) => {
      if (instanceRef !== root) {
        this.emitter.$emit("extended:rollup-options");
      }
    });
  },
};