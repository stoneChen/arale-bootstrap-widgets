define(function(require, exports, module) {
    "use strict";
    var $ = require("$");
    //是否支持placeholder
    var isPlaceholderSupport = "placeholder" in document.createElement("input");
    if (isPlaceholderSupport) {
        return;
    }
    require("jq-placeholder");
    var selector = "input[placeholder],textarea[placeholder]",
        liveUpdate = true,
        timer = setInterval(function(){
            if(!liveUpdate){
                return
            }
            $(selector).filter(function(){
                return !($(this).data("placeholder-enabled"));
            }).placeholder();
        },200)
    $(document)
        .on("focus",selector,function(){
            liveUpdate = false
        })
        .on("blur",selector,function(){
            liveUpdate = true
        })
});
