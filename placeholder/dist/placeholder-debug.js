define("value/placeholder/1.0.0/placeholder-debug", [ "$-debug", "jquery/placeholder/2.0.8/placeholder-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    //是否支持placeholder
    var isPlaceholderSupport = "placeholder" in document.createElement("input");
    if (isPlaceholderSupport) {
        return;
    }
    require("jquery/placeholder/2.0.8/placeholder-debug");
    var selector = "input[placeholder],textarea[placeholder]", liveUpdate = true, timer = setInterval(function() {
        if (!liveUpdate) {
            return;
        }
        $(selector).filter(function() {
            return !$(this).data("placeholder-enabled");
        }).placeholder();
    }, 200);
    $(document).on("focus", selector, function() {
        liveUpdate = false;
    }).on("blur", selector, function() {
        liveUpdate = true;
    });
});
