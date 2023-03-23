# Patch notes

Current vue-extended-multiselect version: **0.1.6**

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