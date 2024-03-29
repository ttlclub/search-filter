import { registerTopicFooterButton, getTopicFooterButtons } from "discourse/lib/register-topic-footer-button";
import { later } from "@ember/runloop";


/* export function footertTggleLike(post,likeAction) {
    // debugger
    if (likeAction && likeAction.get("canToggle")) {
      return likeAction.togglePromise(post);
    }
} */

export default {
    name: "topic-footer-buttons-extra",
    after: 'topic-footer-buttons',
    initialize() {
        registerTopicFooterButton({
            id: "like",
            icon() {
                if(this.topic.postStream.posts[0].likeAction) {
                    return this.topic.postStream.posts[0].likeAction.acted
                        ? "d-liked" 
                        : "d-unliked";
                } else {
                    return;
                }
            },

            classNames() {
                if(this.topic.postStream.posts[0].likeAction) {
                    return this.topic.postStream.posts[0].likeAction.acted
                        ? ["toggle-like", "has-like", "fade-out"]
                        : ["toggle-like", "like"];
                } else {
                    return;
                }               
            },
            // fix:是否显示按钮
            displayed() {
                if(this.topic.postStream.posts[0].likeAction) {
                    return this.topic.postStream.posts[0].likeAction.acted || this.topic.postStream.posts[0].likeAction.get("canToggle") 
                        ? true 
                        : false;
                } else {
                    return false;
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
                
                if (postLiked && canToggle) {
                    return likeAction.togglePromise(post).then(() => {
                        this.
                        heart.closest(".toggle-like").classList.remove("has-like");
                        // 调理不好了先这样
                        heart.firstChild.href.baseVal = "#far-heart";
                    });
                } 

                if (canToggle){
                    return new Promise((resolve) => {
                        later(() => {
                            likeAction.togglePromise(post).then(() => {
                                heart.closest(".toggle-like").classList.add("has-like");
                                heart.classList.add("heart-animation");
                                // 调理不好了先这样
                                heart.firstChild.href.baseVal = "#heart";
                                // resolve();
                            });
                        }, 100);
                    });
                }
            },
        });
        registerTopicFooterButton({
            id: "jump-to-comments",
            icon: "comments",
            classNames: ["comments"],
            displayed: true,
            action() {
                //debugger
                this.jumpToIndex(2);
            },
        });
    },
};