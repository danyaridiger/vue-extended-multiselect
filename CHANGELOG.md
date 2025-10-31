# Patch notes

Current vue-extended-multiselect version: **1.0.3**

---

### 0.0.1 (11.03.2022)

- Component `vue-extended-multiselect` was released.

### 0.0.2 (11.03.2022)

- Adding "repository" section to package.json file.
- Removal of excess "public" directory.

### 0.1.0 (2023-03-18)

- Adding "dropdownDisabled" optional prop.
- Adding unit-test for new optional prop.
- Adding some new css-variabled.
- Removal of excess type from types.

### 0.1.1 (2023-03-20)

- Fixing bug with "pattern-changed" event with a call to the internal loader method.

### 0.1.2 (2023-03-22)

- Fixing bug with always fixed "height" css-property of option block.
- Setting default value of "anyOptionWrapperBlockHeight" optional prop to "auto".

### 0.1.3 (2023-03-22)

- Fixing a bug with v-model not clearing by computed property.

### 0.1.4 (2023-03-23)

- Fixing bug with hidden placeholder when "showSearchField" prop is set to false.
- Fixing bug with deselection of all options when "showSelectedOptions" prop is set to true.

### 0.1.5 (2023-03-23)

- Adding "selected" flag to "marker" slot.

### 0.1.6 (2023-03-23)

- Fixing bug with v-model not updating by clearing of all options.

### 0.1.7 (2023-03-23)

- Fixing bug with non-rendering "labelBlock" slot when "showSearchField" prop is set to false.

### 0.1.8 (2023-03-23)

- Fixing bug with "clean" event payload when all options were deselected.

### 0.2.0 (2023-03-26)

- Adding "multipleBlocks" slot for element with all selected options.
- Adding conditional rendering to all slots.
- Removal of some excess props inside the component.
- Ordering "Events" section in documentation in alphabetic order.
- Ordering props in alphabetic order inside the component.

### 0.2.1 (2023-09-01)

- Updating dependencies and dev-dependencies.

### 0.3.0 (2024-01-14)

- Updating dependencies and dev-dependencies.
- Removal of "sass" dev-dependency.
- Removal of "sass-loader" dev-dependency.

### 0.3.1 (2024-01-14)

- Changing some default styles and css-variables.

### 0.3.2 (2024-01-14)

- Adding css-variable --default-color for multiselect background color.

### 0.4.0 (2024-01-28)

- Adding link to page with live examples.
- Fixing bug with always basic icon filter.
- Fixing bug with rendering icon filter instead of loader icon filter.
- Fixing bug with "disabledPrimitiveOptions" prop accepting options of type "Array".

### 0.4.1 (2024-04-03)

- Adding JSDoc blocks to tools.
- Fixing bug with the placeholder disappearing after switching the list of options.

### 0.4.2 (2024-04-03)

- Fixing bug with incorrect extended multiselect base height.

### 0.4.3 (2024-04-03)

- Changing rotation of toggle icon.

### 0.5.0 (2024-04-04)

- Changing behaviour of "select" event: it no longer fires after setting preselected options.
- Fixing bug with incorrect modelValue type in preselected options setter method.

### 0.5.1 (2024-04-04)

- Fixing bug with incorrect options list placement.

### 0.5.2 (2024-04-04)

- Fixing bug with co-appearance of search field and placeholder.

### 0.5.3 (2024-04-04)

- Fixing bug with incorrect options list height calculation.

### 0.5.4 (2024-04-04)

- Fixing bug with incorrect options list appearance side after changing available options.

### 0.5.5 (2024-06-28)

- Fixing incorrect css-variables interpolation.

### 0.5.6 (2024-10-29)

- Fixing bug with the wrong number of blocks in the displayed limit message.

### 0.5.7 (2025-04-24)

- Removal of unnecessary identifiers.
- Changing default value of "--icons-align-self" css-variable to "center".

### 0.5.8 (2025-05-01)

- Fixing bug with search field flickering when selecting an option if some option was selected.
- Fixing bug with the generation of a layout shift that occurred when automatically calculating the height of the options block.

### 0.5.9 (2025-05-01)

- Fixing bug with incorrect multiple option blocks height.

### 0.5.10 (2025-07-03)

- Adding "ISSUE_TEMPLATE" folder with feedback config files.
- Updating dependencies and dev-dependencies.

### 1.0.0 (2025-10-25)

- Added "@babel/eslint-parser", "@commitlint/cli", "@commitlint/config-conventional",
  "jest-environment-jsdom", "eslint-config-prettier", "eslint-plugin-jest",
  "@typescript-eslint/eslint-plugin" and "eslint-plugin-vue" dev-dependencies.
- Added new workflows for dependency management and CI/CD goals.
- Added github issue templates.
- Added commitlint.
- Added prettier formatter and its specific rules for eslint.
- Added lint-staged to perform linting and formatting tasks.
- Added husky with "pre-commit" and "commit-msg" hooks.
- Added SECURITY.md file for package security policy.
- Added "types" section to package.json file.
- Added editor configuration file.
- Added .gitattributes configuration file.
- Added some new scripts to package.json file.
- Added coverage configuration for unit testing.
- Added enhanced null checking mechanism to pre-selected options.
- Changed main documentation and documentation for contributors.
- Changed package keywords.
- Changed Node.js platform version and added a treshold for the node platform versions.
- Changed eslint version and removed .eslintrc.js configuration file in favor of the new .eslintrc.json configuration file.
- Changed .gitignore and .npmignore configuration files and added .eslintignore configuration file.
- Expanded .eslintrc.json configuration file to provide TypeScript support.
- Fixed a bug with layout shifting when using the optional "dropdownDisabled" prop together with the optional "iconSize" prop.
- Removed "publish" workflow in favor of the new "release" workflow for automatically creating Github tags and releases.
- Removed explicit installation of "core-js" dependency.
- Removed unnecessary "iconFilter" prop in ExtendedMultiselectLoader component.
- Renamed "typings" directory to "types" and type declaration file to "index.d.ts".

### 1.0.1 (2025-10-25)

- Fixed output files configuration in package.json file.

### 1.0.2 (2025-10-26)

- Added types to output files configuration in package.json file.

### 1.0.3 (2025-10-31)

- Changed coverage paths in jest configuration file.
- Renamed unit-tests helper directory from "utils" to "tools".
- Renamed unit-tests tools with addition of the "tool" postfix.
