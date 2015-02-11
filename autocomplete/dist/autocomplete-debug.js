define("value/autocomplete/1.0.0/autocomplete-debug", [ "$-debug", "arale/autocomplete/1.3.0/autocomplete-debug", "arale/overlay/1.1.2/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var AutoComplete = require("arale/autocomplete/1.3.0/autocomplete-debug");
    var ValueAutoComplete = AutoComplete.extend({
        parseElement: function() {
            var that = this;
            this.templatePartials || (this.templatePartials = {});
            $.each([ "header", "footer", "html" ], function(index, item) {
                that.templatePartials[item] = that.get(item);
            });
            AutoComplete.superclass.parseElement.call(this);
        }
    });
    module.exports = ValueAutoComplete;
});
