

search(options = {}){
    if(this.search_type == SEARCH_TYPE_CATS_TAGS)
    {
        const topic_id = this.searchTerm;
        console.log(topic_id);
        let url = "/t/" + topic_id;
        window.location.replace(url);
    }
    else
    {
        if (options.collapseFilters) {
        document
            .querySelector("details.advanced-filters")
            ?.removeAttribute("open");
        }
        this.set("page", 1);
        this._search();
    }
  },

