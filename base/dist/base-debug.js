define("value/base/1.0.0/base-debug", [ "arale/templatable/0.9.2/templatable-debug", "$-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    "use strict";
    //    var $ = require("$");
    var Templatable = require("arale/templatable/0.9.2/templatable-debug");
    var Widget = require("arale/widget/1.1.1/widget-debug");
    var cachedWidgets = [];
    var BaseWidget = Widget.extend({
        Implements: Templatable,
        attrs: {
            parentNode: null
        },
        initAttrs: function(cfg, dataAttrsConfig) {
            BaseWidget.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            cachedWidgets.push(this);
        },
        setup: function() {
            this.render();
        },
        getOuterHTML: function() {
            return this.element[0].outerHTML;
        },
        hide: function() {
            this.element.hide();
        },
        show: function() {
            this.element.show();
        }
    });
    BaseWidget.destroyAll = function() {
        cachedWidgets.forEach(function(w) {
            w.destroy();
        });
    };
    module.exports = BaseWidget;
});
