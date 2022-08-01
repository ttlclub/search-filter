import DButton from "discourse/components/d-button";

export default DButton.extend({
  pluginApiIdentifiers: ["ttl-sort-topic-order-button"],
  classNames: ["ttl-sort-topic-order-button"],
  click() {
    const ascending = "?ascending=true&order=created";
    const decending = "?order=created";

    if (!window.location.search.match("ascending")) {
        api.addDiscoveryQueryParam(decending, { replace: true, refreshModel: true });
        this.classList.add("rotate")
    } else {
      api.addDiscoveryQueryParam(ascending, { replace: true, refreshModel: true });
    }
  },
});
