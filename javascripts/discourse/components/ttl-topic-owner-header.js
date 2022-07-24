import Component from "@ember/component";
import { alias, match, and, gt, gte, not, or} from "@ember/object/computed";
import CardContentsBase from "discourse/mixins/card-contents-base";
import User from "discourse/models/user";

export default Component.extend(CardContentsBase,{
    firstPost: alias("topic.postStream.posts.0"),
    firstPostUser: alias("topic.posters.0.user"),
    //enoughPostsForFiltering: gte("topicPostCount", 2),
    showFilter: and(
        "viewingTopic",
        "topic.postStream.hasNoFilters",
        //"enoughPostsForFiltering"
      ),
    //_showCallback: null,
    // topicPostCount: null,
    hasUserFilters: gt("postStream.userFilters.length", 0),
    
    // testUser: this.creator(),

    didInsertElement() {
        // console.log(this.testUser);
    },

    // _showCallback(username) {
    //     const args = {
    //       forCard: true,
    //       include_post_count_for: this.get("topic.id"),
    //     };
    
    //     return User.findByUsername(username, args)
    //       .then((user) => {
    //         if (user.topic_post_count) {
    //           this.set(
    //             "topicPostCount",
    //             user.topic_post_count[args.include_post_count_for]
    //           );
    //         }
    //         this.setProperties({ user });
    //         console.log(this.topicPostCount);
    //         return user;
    //       })
    //       .catch()
    //       .finally();
    //   },

    actions: {
        filterPoster(post) {
            // console.log(this.topic.postStream)
            this.get("topic.postStream")
                .filterParticipant(post.username)
                .then(() => this.updateQueryParams);
        },
        cancelFilter() {
            const postStream = this.postStream;
            postStream.cancelFilter();
            postStream.refresh();
            // this._close();
        },
    },
});