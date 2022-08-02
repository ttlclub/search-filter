import DButton from "discourse/components/d-button";
import { addDiscoveryQueryParam } from "discourse/controllers/discovery-sortable";
export default DButton.extend({
  pluginApiIdentifiers: ["ttl-sort-topic-order-button"],
  classNames: ["ttl-sort-topic-order-button"],
  click() {
    const ascending = "?ascending=true&order=created";
    const decending = "?order=created";

    if (!window.location.search.match("ascending")) {
        addDiscoveryQueryParam("order", { replace: "created", refreshModel: true });
        this.classList.add("rotate")
    } else {
        // addDiscoveryQueryParam(ascending, { replace: true, refreshModel: true });
    }
  },
});
