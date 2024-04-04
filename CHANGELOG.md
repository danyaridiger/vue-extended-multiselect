# Patch notes

Current vue-extended-multiselect version: **0.5.0**

***

### 0.0.1 (11.03.2022)

* Component `vue-extended-multiselect` was released.

### 0.0.2 (11.03.2022)

* Adding "repository" section to package.json file.
* Removal of excess "public" directory.

### 0.1.0 (2023-03-18)

* Adding "dropdownDisabled" optional prop.
* Adding unit-test for new optional prop.
* Adding some new css-variabled.
* Removal of excess type from types.

### 0.1.1 (2023-03-20)

* Fixing bug with "pattern-changed" event with a call to the internal loader method.

### 0.1.2 (2023-03-22)

* Fixing bug with always fixed "height" css-property of option block.
* Setting default value of "anyOptionWrapperBlockHeight" optional prop to "auto".

### 0.1.3 (2023-03-22)

* Fixing a bug with v-model not clearing by computed property.

### 0.1.4 (2023-03-23)

* Fixing bug with hidden placeholder when "showSearchField" prop is set to false.
* Fixing bug with deselection of all options when "showSelectedOptions" prop is set to true.

### 0.1.5 (2023-03-23)

* Adding "selected" flag to "marker" slot.

### 0.1.6 (2023-03-23)

* Fixing bug with v-model not updating by clearing of all options.

### 0.1.7 (2023-03-23)

* Fixing bug with non-rendering "labelBlock" slot when "showSearchField" prop is set to false.

### 0.1.8 (2023-03-23)

* Fixing bug with "clean" event payload when all options were deselected.

### 0.2.0 (2023-03-26)

* Adding "multipleBlocks" slot for element with all selected options.
* Adding conditional rendering to all slots.
* Removal of some excess props inside the component.
* Ordering "Events" section in documentation in alphabetic order.
* Ordering props in alphabetic order inside the component.

### 0.2.1 (2023-09-01)

* Updating dependencies and dev-dependencies.

### 0.3.0 (2024-01-14)

* Updating dependencies and dev-dependencies.
* Removal of "sass" dev-dependency.
* Removal of "sass-loader" dev-dependency.

### 0.3.1 (2024-01-14)

* Changing some default styles and css-variables.

### 0.3.2 (2024-01-14)

* Adding css-variable --default-color for multiselect background color.

### 0.4.0 (2024-01-28)

* Adding link to page with live examples.
* Fixing bug with always basic icon filter.
* Fixing bug with rendering icon filter instead of loader icon filter.
* Fixing bug with "disabledPrimitiveOptions" prop accepting options of type "Array".

### 0.4.1 (2024-04-03)

* Adding JSDoc blocks to tools.
* Fixing bug with the placeholder disappearing after switching the list of options.

### 0.4.2 (2024-04-03)

* Fixing bug with incorrect extended multiselect base height.

### 0.4.3 (2024-04-03)

* Changing rotation of toggle icon.

### 0.5.0 (2024-04-04)

* Changing behaviour of "select" event: it no longer fires after setting preselected options.
* Fixing bug with incorrect modelValue type in preselected options setter method.