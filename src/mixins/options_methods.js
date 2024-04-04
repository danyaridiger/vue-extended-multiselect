import { mapActions } from "vuex";
import { UnionPropType } from "../sets/sets";

/**
 * @mixin OptionsMethodsMixin
 */
export default {
  methods: {
    /**
     * Toggles "border-bottom-right-radius", "border-bottom-right-radius" 
     * and "top" css-properties of options wrapper
     * @method
     * @param {boolean} afterLoading - loading state flag
     */
    calculateTopOffset(afterLoading = false) {
      this.$nextTick(() => {
        if (!this.$refs.optionsWrapper) return;

        const offsetHeight = this.$refs.optionsWrapper.offsetHeight;
        const scrollHeight = this.$refs.optionsWrapper.scrollHeight;

        if (this.chosenToggleAppearanceSide === "atop") {
          if (scrollHeight > offsetHeight) {
            this.atopWithScroll = {
              borderTopRightRadius: 0,
            };
          }

          if (this.toggleMaxHeight >= offsetHeight || afterLoading) {
            this.heightFromMounted.top = `-${offsetHeight - 1}px`;
          }
        } else {
          if (scrollHeight > offsetHeight) {
            this.underWithScroll = {
              borderBottomRightRadius: 0,
            };
          }
        }
      });
    },

    /**
     * Restricts repeated selection of option
     * @method
     * @param {string} calculatedOptionLabel - displayed label of option
     */
    compareWithSelected(calculatedOptionLabel) {
      return !this.selectedOptions.find((selectedOption) => {
        let calculatedSelectedOptionLabel;

        if (typeof selectedOption === "object") {
          if (Object.keys(selectedOption).length === 0) {
            calculatedSelectedOptionLabel = this.emptyObjectsPlaceholder;
          } else if (Array.isArray(selectedOption)) {
            calculatedSelectedOptionLabel = selectedOption.join(", ");
          } else {
            calculatedSelectedOptionLabel = typeof selectedOption[this.label] === "object"
             ? JSON.stringify(selectedOption[this.label])
             : selectedOption[this.label].toString();
          }
        } else {
          calculatedSelectedOptionLabel = selectedOption.toString();
        }

        return calculatedSelectedOptionLabel === calculatedOptionLabel;
      });
    },

    /**
     * Creates new option by users input
     * if "createOnTheGo" prop equals true
     * @method
     * @emits extended:create-option
     */
    createNewOption() {
      if (this.loading) return;

      let newOption;

      switch(this.createOptionType) {
        case "primitive":
          newOption = this.searchValue;
          break;
        case "array":
          newOption = [this.searchValue];
          break;
        case "object":
          newOption = this.createObjectOption();
          break;
      }

      this.options.unshift(newOption);
      this.emitter.$emit("extended:create-option", newOption);

      if (this.autoSelectCreatedOption) {
        this.selectOption(newOption, { target: { id: "extended__multiselect" } });
        this.setSearchValue(null);
        this.setSearchPattern(null);
      }
    },

    /**
     * Creates option of type object
     * if "createOptionType" equals "object"
     * @method
     * @returns {UnionPropType} option
     */
    createObjectOption() {
      if (!this.createOptionFields) {
        if (this.showInsertWarnings) {
          console.warn("vue-extended-multiselect: if option should be object — option fields should not be empty");
        }

        return this.searchValue;
      }

      const newOption = {};

      this.createOptionFields.forEach((field) => {
        Object.defineProperty(newOption, field, {
          enumerable: true,
          writable: true,
          configurable: true,
          value: `${field}-${this.searchValue}`,
        });
      });

      return newOption;
    },

    /**
     * Recognises if option is disabled
     * @method
     * @param {UnionPropType} option - option to recognize
     * @returns {boolean} prohibition
     */
    defineDisabledOption(option) {
      if (typeof option === "object" && !Array.isArray(option)) return false;

      let convertedOption;
      if (Array.isArray(option) && !option.length) {
        convertedOption = this.emptyObjectsPlaceholder;
      } else {
        convertedOption = option;
      }

      if (this.disabledPrimitiveOptionsConverted.includes(convertedOption)) return true;

      return false;
    },

    /**
     * Filters options list by pattern of internal search for available options
     * @method
     * @param {Array} optionsList - pre-filtered list of oprions
     * @returns {boolean} filter
     */
    filterBySearchPattern(optionsList) {
      return optionsList.filter((option) => {
        if (typeof option === "object") {
          if (Array.isArray(option)) {
            return this.searchPattern.test(option.length ? option.join(", ") : this.emptyObjectsPlaceholder);
          }

          let internalSearchResult;

          if (this.searchByField.length) {
            if (!option[this.searchByField]) return false;

            internalSearchResult = option[this.searchByField].toString();
          } else {
            internalSearchResult = option[this.label].toString();
          }

          return this.searchPattern.test(internalSearchResult);
        } else {
          return this.searchPattern.test(option.toString());
        }
      });
    },

    /**
     * Blocks keys pressed in combination with "enter" key
     * for not to select options by them
     * @method
     * @param {KeyboardEvent} keyboardEvent - KeyboardEvent instance
     * @returns {boolean} block
     */
    keyBlocker(keyboardEvent) {
      if (!keyboardEvent) return false;

      const altKeyBlock = this.specialKeysBlock.includes("alt");
      const ctrlKeyBlock = this.specialKeysBlock.includes("ctrl");
      const shiftKeyBlock = this.specialKeysBlock.includes("shift");

      if (altKeyBlock && keyboardEvent.altKey) return true;
      if (ctrlKeyBlock && keyboardEvent.ctrlKey) return true;
      if (shiftKeyBlock && keyboardEvent.shiftKey) return true;

      return false;
    },

    /**
     * Searchs for already selected options in particular
     * for options of type "object"
     * @method
     * @param {UnionPropType} option - option for search
     * @returns {boolean} selected
     */
    lookForObjectOptions(option) {
      if (typeof option === "object") {
        let calculatedOptionLabel;

        if (Array.isArray(option) && !!option.length) {
          calculatedOptionLabel = option.join(", ");
        } else {
          const hasLabel = Object.getOwnPropertyNames(option).includes(this.label);

          if (hasLabel) {
            calculatedOptionLabel = typeof option[this.label] === "object" 
             ? JSON.stringify(option[this.label]) 
             : option[this.label].toString();
          } else {
            calculatedOptionLabel = JSON.stringify(option);
          }

          if (Object.keys(option).length === 0) {
            calculatedOptionLabel = this.emptyObjectsPlaceholder;
          }
        }

        return this.compareWithSelected(calculatedOptionLabel);
      } else {
        return !this.selectedOptions.includes(option);
      }
    },

    /**
     * Searches for already selected options in particular
     * for options of primitive types or of type "function"
     * @method
     * @param {UnionPropType} option - option for search
     * @returns {boolean} selected
     */
    lookForSimpleOptions(option) {
      if (typeof option === "object" && Object.keys(option).length === 0) {
        const emptyObject = this.selectedOptions.find((emptyObject) => {
          return typeof emptyObject === "object" && !Object.keys(emptyObject).length;
        });

        if (!emptyObject || this.selectedOptionsShown) return true;

        return false;
      }

      if (
        typeof option === "object"
         && !Array.isArray(option)
         && !Object.keys(option).includes(this.label)
      ) return false;

      return true;
    },

    /**
     * Defines a class for "marker" slot content
     * @method
     * @param {UnionPropType} option - option in options list
     * @returns {string} class
     */
    markerShapeClass(option) {
      if (this.lookForSimpleOptions(option) && this.lookForObjectOptions(option)) {
        return "extended__multiselect-marker-shape--selected";
      }

      return "extended__multiselect-marker-shape";
    },

    /**
     * Creates role of every option element for accessible applications
     * if it needed
     * @method
     * @param {UnionPropType} option - each option from options list
     * @returns {string|null} role
     */
    optionCreateRole(option) {
      if (this.optionIsDisabled(option)) return null;
      if (!option) return null;

      return "option";
    },

    /**
     * Determines whether option is disabled
     * @method
     * @param {UnionPropType} option - each option from options list
     * @returns {boolean} blocking
     */
    optionIsDisabled(option) {
      if (option[this.disableByField] || this.defineDisabledOption(option)) return true;

      return false;
    },

    /**
     * Defines various classes for options dependent from props
     * @method
     * @param {UnionPropType} option - each option from options list
     * @returns {Array} classes
     */
    optionHighlightClasses(option) {
      let theme = [];

      if (this.highlightOptions) {
        switch(this.themeType) {
          case "basic":
            theme.push("extended__multiselect-options_option");
            break;
          case "slate-grey":
            theme.push("extended__multiselect-options_option-slate-grey");
            break;
          case "slate-blue":
            theme.push("extended__multiselect-options_option-slate-blue");
            break;
          case "teal":
            theme.push("extended__multiselect-options_option-teal");
            break;
          case "strict":
            theme.push("extended__multiselect-options_option-strict");
            break;
          default: 
            theme.push("extended__multiselect-options_option");
        }
      }

      if (this.showMarker) {
        theme.push("extended__multiselect-options_option--marker");
      }

      if (option && option[this.disableByField]) {
        theme.push("extended__multiselect-options_option--disabled");
      }

      if (this.disabledPrimitiveOptionsConverted && option && this.defineDisabledOption(option)) {
        theme.push("extended__multiselect-options_option--disabled");
      }

      return theme;
    },

    /**
     * Selects option 
     * @method
     * @emits extended:deselect-option
     * @param {UnionPropType} option - option to select
     * @param {MouseEvent|KeyboardEvent} clickEvent - MouseEvent or KeyboardEvent instance
     */
    selectOption(option, clickEvent) {
      this.emitter.$emit("extended:trigger-selection", false);

      if (!clickEvent) return;
      if (this.keyBlocker(clickEvent)) return;
      if (this.loading) return;
      if (this.maxOptionsWereSelected) return;
      if (option[this.disableByField] || this.defineDisabledOption(option)) return;
      if (
        clickEvent.target.id === "extended__multiselect-toggle"
         || clickEvent.target.id === "extended__multiselect-cancel"
      ) return; 

      if (this.selectedOptionsShown || this.externalOptionsLoader) {
        const optionDeselected = this.lookForObjectOptions(option);

        if (!optionDeselected) {
          const index = this.selectedOptions.findIndex((selectedOption) => {
            return JSON.stringify(selectedOption) === JSON.stringify(option);
          });
    
          this.emitter.$emit("extended:deselect-option", null, false, true);
          
          return;
        }
      }

      const isObject = typeof option === "object" && !Array.isArray(option);

      if (isObject && !Object.keys(option).includes(this.label)) {
        if (this.showInsertWarnings) {
          console.warn("vue-extended-multiselect: wrong label type inserted");
        }
      }

      this.selectOptionEmitter(option);
    },

    /**
     * Emits select events or clear event
     * if prop "clearBySelectWhenMultiple" equals true
     * @method
     * @emits extended:clear-field
     * @emits extended:select-option
     * @param {UnionPropType} - option to select
     */
    selectOptionEmitter(option) {
      const isObjectOrArray = typeof option === "object";
      const label = this.createLabel(isObjectOrArray, option);
      
      if (this.multiple) {
        if (this.clearBySelectWhenMultiple) {
          this.emitter.$emit("extended:clear-field");
        }

        this.emitter.$emit("extended:select-option", {
          label,
          option,
        });
      } else {
        this.emitter.$emit("extended:select-option", {
          label,
          option,
        });
      }
    },

    /**
     * Determines an option which will be selected
     * by pressing "enter" key on it
     * @method
     * @param {MouseEvent} event - MouseEvent instance
     */
    setEnterIndex(event) {
      this.enterIndex = event.target.getAttribute("enter-locator");
    },

    /**
     * Determines whether to show marker beside option by its selection
     * @method
     * @param {UnionPropType} option - each option from options list
     * @returns {boolean} display
     */
    showCurrentMarker(option) {
      if (!this.lookForSimpleOptions(option) || !this.lookForObjectOptions(option)) {
        return true;
      }

      return false;
    },

    /**
     * Emits event which listener will add special class
     * to search field before option selection
     * @method
     * @emits extended:trigger-selection
     */
    triggerOptionBeforeSelection() {
      if (this.fieldWasShown) {
        this.emitter.$emit("extended:trigger-selection", true);
      }
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
    /**
     * Triggers appearance side restrictor to set a position 
     * of dropdown appearance
     * @function
     * @emits extended:available-options
     */
    availableOptions: {
      handler() {
        this.emitter.$emit("extended:available-options");
      },
    },
  },

  /**
   * "created" hook of ExtendedMultiselectOptions component
   * @listens extended:select-enter
   * @listens extended:reset-index
   */
  created() {
    const objectFields = this.restrictedOptions.filter((option) => {
      if (!option) return false;

      return typeof option === "object" && typeof option[this.label] === "object";
    });

    if (objectFields.length && this.showInsertWarnings) {
      console.warn("vue-extended-multiselect: «label» property can not be of type «object»");
    }

    this.emitter.$on("extended:select-enter", (keyboardEvent) => {
      if (!this.enterIndex) return;

      const option = this.availableOptions[this.enterIndex];
      this.selectOption(option, keyboardEvent);
    });

    this.emitter.$on("extended:reset-index", () => {
      this.enterIndex = null;
    });
  },

  /**
   * "mounted" hook of ExtendedMultiselectOptions component
   */
  mounted() {
    new ResizeObserver(() => {
      this.calculateTopOffset();
    }).observe(this.$refs.optionsWrapper);
  },
};