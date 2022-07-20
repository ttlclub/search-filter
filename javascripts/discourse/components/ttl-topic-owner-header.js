import Component from "@ember/component";
import { alias } from "@ember/object/computed";

export default Component.extend({
    firstPost: alias("topic.postStream.posts.0"),
    firstPostUser: alias("topic.posters.0.user"),
    // testUser: this.creator(),

    didInsertElement() {
        // console.log(this.testUser);
    },
});