import { registerUnbound, registerHelper } from "discourse-common/lib/helpers";

// 判断tag是否选中的helper（只能在handlebar里使用）
registerUnbound("ttl-is-active", function(tag,content) { 
    if(content) {
        if(content.findBy("id",tag)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
});


