import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";

export default Component.extend({
    tagName: "div",
    classNames: ["ttl-nav-bar"],
    // classNameBindings: ["isMarkerHidden"],

    didInsertElement(){
        // console.log("test nav bar");
    },

    @discourseComputed("site.categoriesList")
    categories(categoriesList) {
      if (this.currentUser?.indirectly_muted_category_ids) {
        return categoriesList.filter(
          (category) =>
            !this.currentUser.indirectly_muted_category_ids.includes(category.id)
        );
      } else {
        return categoriesList;
      }
    },
});