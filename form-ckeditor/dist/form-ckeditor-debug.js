define("value/form-ckeditor/1.0.0/form-ckeditor-debug", [ "$-debug", "value/form/1.0.0/form-widget-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./form-ckeditor-debug.handlebars" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var FormWidget = require("value/form/1.0.0/form-widget-debug");
    var template = require("./form-ckeditor-debug.handlebars");
    var FormCkeditor = FormWidget.extend({
        attrs: {
            template: template,
            model: {},
            commonValid: false,
            name: "",
            value: ""
        },
        initAttrs: function(cfg, dataAttrsConfig) {
            FormCkeditor.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setModel();
        },
        setup: function() {
            var self = this;
            var editorInstance = self.editorInstance = CKEDITOR.replace(this.$("textarea")[0]);
            editorInstance.on("change", function() {
                self.valid();
            });
        },
        setModel: function() {
            //可以被子类覆盖
            var model = this.get("model");
            model.name = this.get("name");
            model.value = this.get("value");
        },
        getValue: function(pure) {
            var name = this.get("name");
            var value = CKEDITOR.instances[name].getData();
            if (pure) {
                return value;
            }
            var value = {};
            value[name] = CKEDITOR.instances[name].getData();
            return value;
        },
        clear: function() {},
        valid: function() {
            var rules = this.getRules();
            if (!rules.required) {
                return true;
            }
            if (this.getValue(true)) {
                this.element.removeClass("has-error");
                return true;
            } else {
                this.showError();
                return false;
            }
        },
        showError: function() {
            this.element.addClass("has-error");
            var $error = this.$("div.error");
            if (!$error.length) {
                var messages = this.getMessages();
                var $container = this.$("div[class^=col]");
                $container.append('<div class="error"><i class="fa fa-remove"></i> ' + messages.required + "</div>");
            }
        }
    });
    module.exports = FormCkeditor;
});

define("value/form-ckeditor/1.0.0/form-ckeditor-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, stack2, functionType = "function", escapeExpression = this.escapeExpression;
        buffer += '<div class="form-group">\n    <label class="col-xs-2 control-label ' + escapeExpression((stack1 = (stack1 = depth0.label, 
        stack1 == null || stack1 === false ? stack1 : stack1.requiredCls), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = (stack1 = depth0.label, 
        stack1 == null || stack1 === false ? stack1 : stack1.text), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '</label>\n\n    <div class="col-xs-10">\n        <textarea class="ckeditor" name="';
        if (stack2 = helpers.name) {
            stack2 = stack2.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack2 = depth0.name;
            stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
        }
        buffer += escapeExpression(stack2) + '">';
        if (stack2 = helpers.value) {
            stack2 = stack2.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack2 = depth0.value;
            stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
        }
        buffer += escapeExpression(stack2) + "</textarea>\n    </div>\n</div>";
        return buffer;
    });
});
