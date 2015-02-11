define("value/form-hidden/1.0.0/form-hidden-debug", [ "$-debug", "value/form/1.0.0/form-widget-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./hidden-debug.handlebars" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var FormWidget = require("value/form/1.0.0/form-widget-debug");
    var template = require("./hidden-debug.handlebars");
    var FormRadio = FormWidget.extend({
        attrs: {
            template: template,
            model: {},
            name: "",
            value: ""
        },
        initAttrs: function(cfg, dataAttrsConfig) {
            FormRadio.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setModel();
        },
        setModel: function() {
            //可以被子类覆盖
            var model = this.get("model");
            model.name = this.get("name");
            model.value = this.get("value");
        },
        getValue: function() {
            var name = this.get("name");
            var value = {};
            value[name] = this.element.val();
            return value;
        },
        clear: function() {}
    });
    module.exports = FormRadio;
});

define("value/form-hidden/1.0.0/hidden-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression;
        buffer += '<input type="hidden" name="';
        if (stack1 = helpers.name) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.name;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" value="';
        if (stack1 = helpers.value) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.value;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '"/>';
        return buffer;
    });
});
