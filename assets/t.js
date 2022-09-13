api.modifyClass("controller:full-page-search", {
    pluginId: "add-search-id",



  });


MyisValidSearchTerm(searchTerm, siteSettings) {
  if (searchTerm) {
    return searchTerm.trim().length >= this.siteSettings.min_search_term_length;
  } else {
    return false;
  }
},
_search() {
    if (this.searching) {
      return;
    }

    this.set("invalidSearch", false);
    const searchTerm = this.searchTerm;
    if (!this.MyisValidSearchTerm(searchTerm, this.siteSettings)) {
      this.set("invalidSearch", true);
      return;
    }

    let args = { q: searchTerm, page: this.page };

    if (args.page === 1) {
      this.set("bulkSelectEnabled", false);
      this.selected.clear();
      this.set("searching", true);
      scrollTop();
    } else {
      this.set("loading", true);
    }

    const sortOrder = this.sortOrder;
    if (sortOrder && SortOrders[sortOrder].term) {
      args.q += " " + SortOrders[sortOrder].term;
    }

    this.set("q", args.q);

    const skip = this.skip_context;
    if ((!skip && this.context) || skip === "false") {
      args.search_context = {
        type: this.context,
        id: this.context_id,
      };
    }

    const searchKey = getSearchKey(args);

    switch (this.search_type) {
      case SEARCH_TYPE_CATS_TAGS:
        let topic_id = searchTerm;
        console.log(topic_id);
        let url="/t/"+topic_id;
        window.location.replace(url);
        break;
      case SEARCH_TYPE_USERS:
        userSearch({ term: searchTerm, limit: 20 })
          .then(async (results) => {
            const model = (await translateResults({ users: results })) || {};
            this.set("model", model);
          })
          .finally(() => {
            this.setProperties({
              searching: false,
              loading: false,
            });
          });
        break;
      default:
        if (this.currentUser) {
          updateRecentSearches(this.currentUser, searchTerm);
        }
        ajax("/search", { data: args })
          .then(async (results) => {
            const model = (await translateResults(results)) || {};

            if (results.grouped_search_result) {
              this.set("q", results.grouped_search_result.term);
            }

            if (args.page > 1) {
              if (model) {
                this.model.posts.pushObjects(model.posts);
                this.model.topics.pushObjects(model.topics);
                this.model.set(
                  "grouped_search_result",
                  results.grouped_search_result
                );
              }
            } else {
              setTransient("lastSearch", { searchKey, model }, 5);
              model.grouped_search_result = results.grouped_search_result;
              this.set("model", model);
            }
          })
          .finally(() => {
            this.setProperties({
              searching: false,
              loading: false,
            });
          });
        break;
    }
  },
