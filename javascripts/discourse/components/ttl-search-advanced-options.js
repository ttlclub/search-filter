import SearchAdvancedOptionsComponent from "discourse/components/search-advanced-options";
import Category from "discourse/models/category";
import Component from "@ember/component";
import I18n from "I18n";
import { action } from "@ember/object";
import { escapeExpression } from "discourse/lib/utilities";

const REGEXP_BLOCKS = /(([^" \t\n\x0B\f\r]+)?(("[^"]+")?))/g;

const REGEXP_USERNAME_PREFIX = /^(user:|@)/gi;
const REGEXP_CATEGORY_PREFIX = /^(category:|#)/gi;
const REGEXP_TAGS_PREFIX = /^(tags?:|#(?=[a-z0-9\-]+::tag))/gi;
const REGEXP_IN_PREFIX = /^(in|with):/gi;
const REGEXP_STATUS_PREFIX = /^status:/gi;
const REGEXP_MIN_POSTS_PREFIX = /^min_posts:/gi;
const REGEXP_MAX_POSTS_PREFIX = /^max_posts:/gi;
const REGEXP_MIN_VIEWS_PREFIX = /^min_views:/gi;
const REGEXP_MAX_VIEWS_PREFIX = /^max_views:/gi;
const REGEXP_POST_TIME_PREFIX = /^(before|after):/gi;
const REGEXP_TAGS_REPLACE = /(^(tags?:|#(?=[a-z0-9\-]+::tag))|::tag\s?$)/gi;

const REGEXP_SPECIAL_IN_LIKES_MATCH = /^in:likes$/gi;
const REGEXP_SPECIAL_IN_TITLE_MATCH = /^in:title$/gi;
const REGEXP_SPECIAL_IN_MESSAGES_MATCH = /^in:(personal|messages)$/gi;
const REGEXP_SPECIAL_IN_SEEN_MATCH = /^in:seen$/gi;

const REGEXP_CATEGORY_SLUG = /^(\#[a-zA-Z0-9\-:]+)/gi;
const REGEXP_CATEGORY_ID = /^(category:[0-9]+)/gi;
const REGEXP_POST_TIME_WHEN = /^(before|after)/gi;

const IN_OPTIONS_MAPPING = { images: "with" };

let _extraOptions = [];

function inOptionsForUsers() {
  return [
    { name: I18n.t("search.advanced.filters.unseen"), value: "unseen" },
    { name: I18n.t("search.advanced.filters.posted"), value: "posted" },
    { name: I18n.t("search.advanced.filters.created"), value: "created" },
    { name: I18n.t("search.advanced.filters.watching"), value: "watching" },
    { name: I18n.t("search.advanced.filters.tracking"), value: "tracking" },
    { name: I18n.t("search.advanced.filters.bookmarks"), value: "bookmarks" },
  ].concat(..._extraOptions.map((eo) => eo.inOptionsForUsers).filter(Boolean));
}

function inOptionsForAll() {
  return [
    { name: I18n.t("search.advanced.filters.first"), value: "first" },
    { name: I18n.t("search.advanced.filters.pinned"), value: "pinned" },
    { name: I18n.t("search.advanced.filters.wiki"), value: "wiki" },
    { name: I18n.t("search.advanced.filters.images"), value: "images" },
  ].concat(..._extraOptions.map((eo) => eo.inOptionsForAll).filter(Boolean));
}

function statusOptions() {
  return [
    { name: I18n.t("search.advanced.statuses.open"), value: "open" },
    { name: I18n.t("search.advanced.statuses.closed"), value: "closed" },
    { name: I18n.t("search.advanced.statuses.public"), value: "public" },
    { name: I18n.t("search.advanced.statuses.archived"), value: "archived" },
    {
      name: I18n.t("search.advanced.statuses.noreplies"),
      value: "noreplies",
    },
    {
      name: I18n.t("search.advanced.statuses.single_user"),
      value: "single_user",
    },
  ].concat(..._extraOptions.map((eo) => eo.statusOptions).filter(Boolean));
}

function postTimeOptions() {
  return [
    { name: I18n.t("search.advanced.post.time.before"), value: "before" },
    { name: I18n.t("search.advanced.post.time.after"), value: "after" },
  ].concat(..._extraOptions.map((eo) => eo.postTimeOptions).filter(Boolean));
}

export function addAdvancedSearchOptions(options) {
  _extraOptions.push(options);
}

// extend 高级搜索component，在hbs里把别的组件都去掉，只留下tag chooser
export default SearchAdvancedOptionsComponent.extend({
    // 重写包住component的标签，原来的标签是details，不重写打不开
    tagName:"", 

    // init() {
    //     this._super(...arguments);
    
    //     this.setProperties({
    //       searchedTerms: {
    //         username: null,
    //         category: null,
    //         tags: null,
    //         in: null,
    //         special: {
    //           in: {
    //             title: false,
    //             likes: false,
    //             messages: false,
    //             seen: false,
    //           },
    //           all_tags: true,
    //         },
    //         status: null,
    //         min_posts: null,
    //         max_posts: null,
    //         min_views: null,
    //         max_views: null,
    //         time: {
    //           when: "before",
    //           days: null,
    //         },
    //       },
    //       inOptions: this.currentUser
    //         ? inOptionsForUsers().concat(inOptionsForAll())
    //         : inOptionsForAll(),
    //       statusOptions: statusOptions(),
    //       postTimeOptions: postTimeOptions(),
    //       showAllTagsCheckbox: false,
    //     });
    // },

      @action
      onChangeSearchTermForTags(tags) {
        // 更新内部属性searchedTerms.tags，然后更新组件桥梁属性searchTerm
        this.set("searchedTerms.tags", tags.length ? tags : null);
        this.set("searchedTerms.special.all_tags", true);
        this._updateSearchTermForTags();
    },

})