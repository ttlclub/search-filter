import { registerTopicFooterButton, getTopicFooterButtons } from "discourse/lib/register-topic-footer-button";
import { later } from "@ember/runloop";


export function footertTggleLike(post,likeAction) {
    // debugger
    if (likeAction && likeAction.get("canToggle")) {
      return likeAction.togglePromise(post).then((result) => {
          // this.topic.appEvents.trigger("page:like-toggled", post, likeAction);
          // return this._warnIfClose(result);
      });
    }
}

export default {
    name: "topic-footer-buttons-like",
    after: 'topic-footer-buttons',
    initialize() {

        registerTopicFooterButton({
            id: "like",
            icon() {
                const post = this.topic.postStream.posts[0]; 
                let postLiked;
                if(post.likeAction) {
                    postLiked = post.likeAction.acted;
                    console.log(postLiked);
                    return postLiked
                        ? "d-liked" 
                        : "d-unliked";
                } else {
                    return;
                }
                

            },
            classNames() {
                const post = this.topic.postStream.posts[0]; 
                let postLiked;
                if(post.likeAction) {
                    postLiked = post.likeAction.acted;
                    console.log(postLiked);
                    return postLiked
                        ? ["toggle-like", "has-like", "fade-out"]
                        : ["toggle-like", "like"];
                } else {
                    return;
                }               
            },
            action() {
                // debugger
                const currentUser = this.currentUser;
                const topic = this.topic;
                const post = this.topic.postStream.posts[0];
                const likeAction = post.likeAction;
                let postLiked;
                let canToggle;
                
                if (likeAction) {            
                    postLiked = likeAction.acted;
                    canToggle = likeAction.get("canToggle");
                } else {
                    return;
                }

                const heart = document.querySelector(
                    `#topic-footer-button-like .d-icon`
                );
                
                if (postLiked) {
                    heart.closest(".toggle-like").classList.remove("has-like");
                    return footertTggleLike(post,likeAction);
                } 

                heart.closest(".toggle-like").classList.add("has-like");
                heart.classList.add("heart-animation");
            
                return new Promise((resolve) => {
                    later(() => {
                        footertTggleLike(post,likeAction).then(() => resolve());
                    }, 400);
                });
    
            },
        });

    },
};