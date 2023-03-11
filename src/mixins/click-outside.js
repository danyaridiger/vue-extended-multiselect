import ExtendedClickOutside from "extended-click-outside";
/**
 * @mixin ClickOutsideMixin
 */
export default {
  data() {
    return {
      clickOutside: new ExtendedClickOutside(),
    };
  },
};