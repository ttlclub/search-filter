import SearchAdvancedOptionsComponent from "discourse/components/search-advanced-options";
import { action } from "@ember/object";

export default SearchAdvancedOptionsComponent.extend({
    tagName:"", 


    @action
    onChangeSearchTermForTags(tags) {
        // 更新内部属性searchedTerms.tags，然后更新组件桥梁属性searchTerm
        this.set("searchedTerms.tags", tags.length ? tags : null);
        this.set("searchedTerms.special.all_tags", true);
        // this.set("searchedTerms.special.in.title", true);
        this._updateSearchTermForTags();
    },

})