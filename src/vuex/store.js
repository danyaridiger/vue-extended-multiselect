import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  /**
   * Vuex state
   * @alias VuexState
   * @property {string|null} searchPattern - pattern of inner search for available options
   * @property {string|null} searchValue - value of search field
   */
  state: {
    searchPattern: null,
    searchValue: null,
  },

  /**
   * Vuex getters
   * @alias VuexGetters
   */
  getters: {
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
