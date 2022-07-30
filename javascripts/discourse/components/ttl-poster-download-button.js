import Component from "@ember/component";
// import discourseComputed from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import { alias } from "@ember/object/computed";

export default Component.extend({
  tagName: "div",
  classNames: ["ttl-poster-download-button"],

  @action
  filterPoster() {
    const participants = this.model.details.participants.length;
    console.log(participants);

  },
});
