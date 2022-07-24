import Component from "@ember/component";
import I18n from "I18n";
import discourseComputed from "discourse-common/utils/decorators";
import { iconHTML } from "discourse-common/lib/icon-library";
import { inject as service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import { later, scheduleOnce } from '@ember/runloop';
import { observer, computed} from '@ember/object';
import Category from "discourse/models/category";
import DiscourseURL, { getCategoryAndTagUrl } from "discourse/lib/url";
import { alias, and, equal, notEmpty, or } from "@ember/object/computed";


export default Component.extend({
  tagName: "li",
  classNameBindings: ["active"],
  // attributesBindings: ["style"],
  router: service(),
  activeChanged: observer("active", function () {
    // let categoryText = document.querySelector(".ttl-nav-bar .nav-pills li.active a");
    if(this.active) {
      this.updateActiveNav();
    } else {
      // categoryText.style.color = "#646464";
    }
    // debugger
    // this.updateActiveNav();
      // this.updateActiveNav();
  }),
  // userID: alias("tag.id"),

  // @discourseComputed("category.color")
  // style(categoryColor) { 
  //   return "".concat("color:","#",categoryColor,";");
  // },


  didInsertElement() {
    if(this.active) {
      this.updateActiveNav();

    }
    // const marker = document.querySelector('.ttl-nav-line');
    // this.updateActiveNav( () => {
    //     marker.style.visibility = "visible";
    // });
  },
    
    //    categoryAndTagUrl: function() {
    //        let selectedCategory = Category.findById(parseInt(this.categoryId, 10));
    //        let categoryAndTagUrl = getCategoryAndTagUrl(selectedCategory, false, userID);
    //        console.log(categoryAndTagUrl);
    //        return categoryAndTagUrl;
    //     },
  @discourseComputed("active")
  getResult(active) {
    // this.updateActiveNav();
    if (active) {
      this.updateActiveNav();
      return true;
    } else {
      // return false;
    }
  },

  @discourseComputed("active", "category.color")
  updateActiveNav() {
    // debugger
    // console.log(this.active);
    if(this.active) {
      const selectedItem = document.querySelector('.active');
      // console.log(selectedItem);
      const scollLeft = document.querySelector('.nav-pills').scrollLeft;
      const fontSize = document.defaultView.getComputedStyle(document.body, '').fontSize;
      if(selectedItem) {
          const halfRectWidth = selectedItem.getBoundingClientRect().width / 2;
          const leftPosition =
              selectedItem.getBoundingClientRect().left - selectedItem.parentNode.getBoundingClientRect().left + document.querySelector('.nav-pills').scrollLeft;
          const marker = document.querySelector('.ttl-nav-line');
          const categoryColor = this.category.color;
          let categoryText = document.querySelector(".ttl-nav-bar .nav-pills li.active a");
          let no_categoryText = document.querySelectorAll(".ttl-nav-bar .nav-pills li:not(.active) a");
  
          marker.style.left = "".concat("calc(", leftPosition + halfRectWidth , "px", " - ", fontSize, ")");
          marker.style.backgroundColor = "".concat("#",categoryColor);
          // console.log(categoryColor);
          
          categoryText.style.color = "".concat("#",categoryColor);
          [].forEach.call(no_categoryText, function(t) {
            // do whatever
            t.style.color = "#646464";
          });
          // no_categoryText.style.color ="#646464";
          // console.log(categoryColor);
          //console.log(categoryText.style.color)

      }
            // categoryText.style.color = "#646464" ;
            // console.log("#646464");
          
              // callback();
    }
    
  },

  @discourseComputed("category.isParent", "category.default_list_filter")
  modifiedRoute(isParent, defaultListFilter) {
    let categoryRoute = "discovery.category";
    if(isParent && (defaultListFilter === "none")) {
      return categoryRoute.replceWith("discovery.categoryNone");
    }
    return categoryRoute;
  },

  @discourseComputed("category.id", "category.slug")
  buildRouteParam(categoryId, categorySlug) {
    let buildRouteParam = [];
    buildRouteParam.push(categorySlug, categoryId);
    return buildRouteParam.join("/");
  },

  @discourseComputed("label", "i18nLabel", "icon")
  contents(label, i18nLabel, icon) {
    let text = i18nLabel || I18n.t(label);
    if (icon) {
      return htmlSafe(`${iconHTML(icon)} ${text}`);
    }
    return text;
  },

  @discourseComputed("modifiedRoute", "router.currentRoute")
  active(route, currentRoute) {
    if (!route) {
      return;
    }

    const routeParam = this.buildRouteParam;
    if (routeParam && currentRoute) {
      const currentRouteParams = currentRoute.params["category_slug_path_with_id"] || currentRoute.params["category_slug_path_with_id"];
      return currentRouteParams === routeParam;
    }
    
    return this.router.isActive(route);
  },
});