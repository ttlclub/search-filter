import { computed } from "@ember/object";
import ComboBoxComponent from "select-kit/components/combo-box";
import { createPopper } from "@popperjs/core";

export default ComboBoxComponent.extend({
  pluginApiIdentifiers: ["avatar-frame-chooser"],
  classNames: ["avatar-frame-chooser"],

  selectKitOptions: {
    selectedNameComponent: "selected-flair",
  },

  modifyComponentForRow() {
    return "flair-row";
  },
  
  didInsertElement() {
      // 页面渲染完成后create popper
      // debugger
      this.createPopper();
  },

  createPopper() {
    // createPopper: 重写selct kit的popper
    const anchor = document.querySelector(`#${this.selectKit.uniqueID}-header`);
    const popper = document.querySelector(`#${this.selectKit.uniqueID}-body`);
    const strategy = 'fixed';
    const placement = 'bottom';
    const tagModifier = {
      name: 'tagModifier',
      enabled: true,
      phase: 'beforeWrite',
      fn({ state }) {
          state.styles.popper.bottom = "0";
          state.styles.popper.top = "unset";
          state.styles.popper.right = "0";
          state.styles.popper.transform = "unset";
      },
    };
    this.popper = createPopper(anchor, popper, {
        strategy,
        placement,
        modifiers: [tagModifier],
      });
},

  selectedContent: computed(
    "value",
    "content.[]",
    "selectKit.noneItem",
    function () {
      const content = (this.content || []).findBy(
        this.selectKit.valueProperty,
        this.value
      );

      if (content) {
        return this.selectKit.modifySelection(content);
      } else {
        return this.selectKit.noneItem;
      }
    }
  ),
});
