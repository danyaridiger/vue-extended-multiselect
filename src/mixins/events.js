import Vue from "vue";

/**
 * @mixin EventsMixin
 */
export default {
    data() {
        return {
            emitter: new Vue({}),
        };
    },
};