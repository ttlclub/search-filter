
export default {
    name: "sort-topic-topic-button",
    after: "d-navigation",
    initialize() {

        const defaultButton = {
            type: "inline-button",
            // id of the button, required
            id: null,
            // icon displayed on the button
            icon: null,
            // local key path for title attribute
            title: null,
            translatedTitle: null,
            // local key path for label
            label: null,
            translatedLabel: null,
            // local key path for aria label
            ariaLabel: null,
            translatedAriaLabel: null,
            // is this button displayed in the mobile dropdown or as an inline button ?
            dropdown: false,
            // css class appended to the button
            classNames: [],
            // discourseComputed properties which should force a button state refresh
            // eg: ["topic.bookmarked", "topic.category_id"]
            dependentKeys: [],
            // should we display this button ?
            displayed: true,
            // is this button disabled ?
            disabled: false,
            // display order, higher comes first
            priority: 0,
          };
        const sortTopicButton={
            id: "sort-topic-topic-button",
            icon() {
                return "d-liked"
            },

            classNames() {
                return ;             
            },
            // fix:是否显示按钮
            displayed() {
                console.log(this);
                return true
            },
            action() {
                console.log(window.location.pathname);
            },
        };
        const normalizedButton = Object.assign(defaultButton, button);
    },
};