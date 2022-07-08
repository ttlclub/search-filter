import SearchAdvancedOptionsComponent from "discourse/components/search-advanced-options";

// extend 高级搜索component，在hbs里把别的组件都去掉，只留下tag chooser
export default SearchAdvancedOptionsComponent.extend({
    // 重写包住component的标签，原来的标签是details，不重写打不开
    tagName:"", 

})