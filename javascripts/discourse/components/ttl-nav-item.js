import Component from "@ember/component";
import I18n from "I18n";
import discourseComputed from "discourse-common/utils/decorators";
import { iconHTML } from "discourse-common/lib/icon-library";
import { inject as service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import { later, scheduleOnce } from '@ember/runloop';
import { observer } from '@ember/object';


export default Component.extend({
  tagName: "li",
  classNameBindings: ["active"],
  router: service(),
  activeChanged: observer("active", function () {
    this.updateActiveNav();
  }),


  didInsertElement() {
      // console.log("step:didInsertElement");
      if(this.active){
        scheduleOnce('afterRender', this, this.updateActiveNav);
      } 
  },


  updateActiveNav() {
    const selectedItem = document.querySelector('.active');
    const scollLeft = document.querySelector('.nav-pills').scrollLeft;
    const fontSize = document.defaultView.getComputedStyle(document.body, '').fontSize;
    const halfRectWidth = selectedItem.getBoundingClientRect().width / 2;
    const leftPosition =
       selectedItem.getBoundingClientRect().left - selectedItem.parentNode.getBoundingClientRect().left + document.querySelector('.nav-pills').scrollLeft;
    const marker = document.querySelector('.ttl-nav-line');

    marker.style.left = "".concat("calc(", leftPosition + halfRectWidth , "px", " - ", fontSize, ")");
  },


  @discourseComputed("label", "i18nLabel", "icon")
  contents(label, i18nLabel, icon) {
    let text = i18nLabel || I18n.t(label);
    if (icon) {
      return htmlSafe(`${iconHTML(icon)} ${text}`);
    }
    return text;
  },

  @discourseComputed("route", "router.currentRoute")
  active(route, currentRoute) {
    //console.log("step:active");
    if (!route) {
      return;
    }

    const routeParam = this.routeParam;
    if (routeParam && currentRoute) {
      // console.log("routeParam");
      return currentRoute.params["category_slug_path_with_id"] === routeParam;
    }
    // console.log("this.router.isActive");
    return this.router.isActive(route);
  },
});