import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  /**
   * Vuex state
   * @alias VuexState
   * @property {string} loaderIconFilter - defines svg-filter with color settings for loader icon
   * @property {string|null} searchPattern - pattern of inner search for available options
   * @property {string|null} searchValue - value of search field
   */
  state: {
    loaderIconFilter: "loader-default",
    searchPattern: null,
    searchValue: null,
  },

  /**
   * Vuex getters
   * @alias VuexGetters
   */
  getters: {
    /**
     * Getter for loaderIconFilter property
     * @method
     * @param {Object} state - {@linkcode VuexState}
     * @returns {string} filter
     */
    loaderIconFilter(state) {
      return state.loaderIconFilter;
    },

    /**
     * Getter for searchPattern property
     * @method
     * @param {Object} state - {@linkcode VuexState}
     * @returns {string} pattern
     */
    searchPattern(state) {
      return state.searchPattern;
    },

    /**
     * Getter for searchValue property
     * @method
     * @param {Object} state - {@linkcode VuexState}
     * @returns {string} value
     */
    searchValue(state) {
      return state.searchValue;
    },
  },

  /**
   * Vuex mutations
   * @alias VuexMutations
   */
  mutations: {
    /**
     * Mutation of loaderIconFilter property
     * @method SET_LOADER_ICON_FILTER
     * @param {Object} state - {@linkcode VuexState}
     * @param {string} pfilter - new svg-filter with color settings for loader icon
     */
    SET_LOADER_ICON_FILTER(state, filter) {
      state.loaderIconFilter = filter;
    },

    /**
     * Mutation of searchPattern property
     * @method SET_SEARCH_PATTERN
     * @param {Object} state - {@linkcode VuexState}
     * @param {string} pattern - new pattern of inner search for available options
     */
    SET_SEARCH_PATTERN(state, pattern) {
      state.searchPattern = pattern;
    },

    /**
     * Mutation of searchValue property
     * @method SET_SEARCH_VALUE
     * @param {Object} state - {@linkcode VuexState}
     * @param {string} value - new value of search field
     */
    SET_SEARCH_VALUE(state, value) {
      state.searchValue = value;
    },
  },

  /**
   * Vuex actions
   * @alias VuexActions
   */
  actions: {
    /**
     * Action triggers {@linkcode SET_LOADER_ICON_FILTER} mutation
     * @method
     * @param {Object} store - Vuex store API
     * @param {Function} store.commit - method for mutation triggering
     * @param {string} pattern - new svg-filter with color settings for loader icon
     */
    setLoaderIconFilter({ commit }, filter) {
      commit("SET_LOADER_ICON_FILTER", filter);
    },

    /**
     * Action triggers {@linkcode SET_SEARCH_PATTERN} mutation
     * @method
     * @param {Object} store - Vuex store API
     * @param {Function} store.commit - method for mutation triggering
     * @param {string} pattern - new pattern of inner search for available options
     */
    setSearchPattern({ commit }, pattern) {
      commit("SET_SEARCH_PATTERN", pattern);
    },

    /**
     * Action triggers {@linkcode SET_SEARCH_VALUE} mutation
     * @method
     * @param {Object} store - Vuex store API
     * @param {Function} store.commit - method for mutation triggering
     * @param {string} value - new value of search field
     */
    setSearchValue({ commit }, value) {
      commit("SET_SEARCH_VALUE", value);
    },
  },
});
