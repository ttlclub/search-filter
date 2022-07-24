import MultiSelectComponent from "select-kit/components/multi-select";
import TagsMixin from "select-kit/mixins/tags";
import { action, computed } from "@ember/object";
import { makeArray } from "discourse-common/lib/helpers";
import { createPopper } from "@popperjs/core";
import discourseComputed from "discourse-common/utils/decorators";

// 重写原来的tag chooser组件，原来的tag chooser也是extend的多选下拉框且没有新方法，所以直接重写
export default MultiSelectComponent.extend(TagsMixin, {
  //tagName: "",
  pluginApiIdentifiers: ["ttl-tag-chooser"],
  classNames: ["ttl-tag-chooser"],
  ttlTags: [
    {
      header: "分级",
      body: settings.ttl_tags_age.split("|"),
      active: false,
      isSingleSelect: true,
      disable: true,
    },
    {
      header: "篇幅/状态",
      body: settings.ttl_tags_state.split("|"),
      active: false,
      isSingleSelect: true,
      disable: true,
    },
    {
      header: "标签",
      body: settings.ttl_tags_free.split("|"),
      active: false,
      isSingleSelect: false,
      disable: true,
    },
  ],
  ages:["大众", "少年", "r18"],
  states:["连载", "短篇完结", "长篇完结"],

  selectKitOptions: {
    filterable: true,
    filterIcon: "search",
    filterPlaceholder: "tagging.choose_for_topic",
    limit: null,
    allowAny: "canCreateTag",
    maximum: "maximumTagCount",
  },
  uType: computed("currentUser", function() {
    // 0 游客
    let uType = 0;
    const u = this.currentUser;
    if (u) {
      // 1 注册用户
      uType = 1;
      const uGroups = u.groups;
      const inR18Group = uGroups.find((value) => {
        const r18Id = 52;
        return value["id"] === r18Id ? true : false;
      });
      if (inR18Group)
      // 2 r18用户
        uType = 2;
    }
    return uType;
  }),
  cType: computed("category", function(){
    // 0 普通区or无
    let cType = 0;
    if(this.category) { 
      if(this.category === 7 || this.category === 13) {
        // 1 文区
        cType = 1;
      } 
      if(this.category === 12 || this.category === 13) {
        // 2 子区
        cType = 2;
      } 
    }
    return cType;
  }),

  showStateTag: computed("cType", function(){
    return this.cType === 1 ? false : true; 
  }),
  showAge1Tag: computed("cType", function() {
    return this.cType === 2 ? true : false;
  }),
  showAge2Tag: computed("cType", "uType", function() {
    if(this.uType === 0) {
      return true;
    } 
    if(this.cType === 2) {
      return true;
    }
  }),
  showAge3Tag: computed("cType", "uType", function() {
    return this.uType === 2 ? false : true;
  }),

  modifyComponentForRow() {
    return "tag-chooser-row";
  },

  blockedTags: null,
  attributeBindings: ["categoryId"],
  excludeSynonyms: false,
  excludeHasSynonyms: false,

  canCreateTag: computed("site.can_create_tag", "allowCreate", function () {
    return this.allowCreate && this.site.can_create_tag;
  }),

  maximumTagCount: computed(
    "siteSettings.max_tags_per_topic",
    "unlimitedTagCount",
    function () {
      if (!this.unlimitedTagCount) {
        return parseInt(
          this.options.limit ||
          this.options.maximum ||
          this.get("siteSettings.max_tags_per_topic"),
          10
        );
      }
      return null;
    }
  ),

  init() {
    this._super(...arguments);

    this.setProperties({
      blockedTags: this.blockedTags || [],
      termMatchesForbidden: false,
      termMatchErrorMessage: null,
    });
  },

  didInsertElement() {
    // 页面渲染完成后create popper

    this.createPopper();
    // wj:check currentuser
  },

  didRender() {

  },
  // // wj:rewrite toggle fun open card-cloak (fun from discourse/app/assets/javascripts/select-kit/addon/components/select-kit.js 891)
  // _toggle(event) {
  //   if (this.selectKit.isExpanded) {

  //     const cardCloak = document.querySelector(".card-cloak");
  //     cardCloak.classList.add("hidden");
  //     cardCloak.style.setProperties("z-index","100")

  //     this._close(event);
  //   } else {
  //     const cardCloak = document.querySelector(".card-cloak");
  //     cardCloak.classList.remove("hidden");

  //     this._open(event);
  //   }
  // },

  value: computed("tags.[]", function () {
    return makeArray(this.tags).uniq();
  }),

  content: computed("tags.[]", function () {
    return makeArray(this.tags)
      .uniq()
      .map((t) => this.defaultItem(t, t));
  }),

  actions: {
    // 原来的tag chooser component里原封不动复制过来的
    onChange(value, items) {
      if (this.attrs.onChange) {
        this.attrs.onChange(value, items);
      } else {
        this.set("tags", value);
      }
    },
  },


  @action
  setTagActive(tag, collection, event) {
    // setTagActive: 设置标签为选中状态
    if (this.isActive(tag, this.content)) {
      // 已选中
      event.target.classList.toggle("active");
      this.selectKit.deselect({ id: tag, name: tag });
    } else {
      // 未选中
      if (collection.isSingleSelect) {
        // 单选
        if (
          collection.body.some((element) =>
            this.isActive(element, this.content)
          )
        ) {
          // 该组已有其他tag被选中
          const selected_tag = collection.body.find((element) =>
            this.isActive(element, this.content)
          );

          this.selectKit.deselect({ id: selected_tag, name: selected_tag });
          event.target.parentNode.classList.remove("active");

          this.selectKit.select(tag, { id: tag, name: tag });
          event.target.classList.add("active");
        } else {
          // 该组未有其他tag被选中
          event.target.classList.toggle("active");
          this.selectKit.select(tag, { id: tag, name: tag });
        }
      } else {
        // 非单选
        event.target.classList.toggle("active");
        this.selectKit.select(tag, { id: tag, name: tag });
      }
    }
  },

  disableTag(tag) {
    let age1 = document.querySelector(tag);
    age1.disabled = true;
    console.log("disabled");
  },

  isActive(tag, content) {
    // isActive: 判断标签是否选中
    if (content) {
      if (content.findBy("id", tag)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  // wj:currentUserIdentity
  @discourseComputed("category","currentUser")
  disabledTags(category, currentUser) {
    // const disabledtags=[[]];
    // 0 游客
    let uType = 0;
    const u = currentUser;
    if (u) {
      // 1 注册用户
      uType = 1;
      const uGroups = u.groups;
      const inR18Group = uGroups.find((value) => {
        const r18Id = 52;
        return value["id"] === r18Id ? true : false;
      });
      if (inR18Group)
      // 2 r18用户
        uType = 2;
    }
    // 0 普通区or无
    let cType = 0;
    if(this.category) { 
      if(this.category == 5) {
        // 1 文区
        cType = 1;
      } 
      if(this.category == 12 || this.category == 13) {
        cType = 2;
      } 
    }

    if(cType !== 1) {
      disableTag("#states button");
    }
  },

createPopper() {
  // createPopper: 重写selct kit的popper
  const anchor = document.querySelector(`#${this.selectKit.uniqueID}-header`);
  const popper = document.querySelector(`#${this.selectKit.uniqueID}-body`);
  const strategy = "fixed";
  const placement = "bottom";
  const tagModifier = {
    name: "tagModifier",
    enabled: true,
    phase: "beforeWrite",
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

search(query) {
  // 原来的tag chooser component里原封不动复制过来的
  const selectedTags = makeArray(this.tags).filter(Boolean);

  const data = {
    q: query,
    limit: 20,
    categoryId: this.categoryId,
  };

  if (selectedTags.length || this.blockedTags.length) {
    data.selected_tags = selectedTags
      .concat(this.blockedTags)
      .uniq()
      .slice(0, 100);
  }

  if (!this.everyTag) {
    data.filterForInput = true;
  }
  if (this.excludeSynonyms) {
    data.excludeSynonyms = true;
  }
  if (this.excludeHasSynonyms) {
    data.excludeHasSynonyms = true;
  }

  return this.searchTags("/tags/filter/search", data, this._transformJson);
},

_transformJson(context, json) {
  // 原来的tag chooser component里原封不动复制过来的
  if (context.isDestroyed || context.isDestroying) {
    return [];
  }

  let results = json.results;

  context.setProperties({
    termMatchesForbidden: json.forbidden ? true : false,
    termMatchErrorMessage: json.forbidden_message,
  });

  if (context.blockedTags) {
    results = results.filter((result) => {
      return !context.blockedTags.includes(result.id);
    });
  }

  if (context.get("siteSettings.tags_sort_alphabetically")) {
    results = results.sort((a, b) => a.id > b.id);
  }

  return results.uniqBy("id");
},
});
