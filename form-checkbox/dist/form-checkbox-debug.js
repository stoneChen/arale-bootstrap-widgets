define("value/form-checkbox/1.0.0/form-checkbox-debug", [ "$-debug", "value/form/1.0.0/form-widget-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./checkbox-debug.handlebars" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var FormWidget = require("value/form/1.0.0/form-widget-debug");
    var template = require("./checkbox-debug.handlebars");
    var FormCheckbox = FormWidget.extend({
        attrs: {
            template: template,
            model: {},
            checked: [],
            dataList: []
        },
        initAttrs: function(cfg, dataAttrsConfig) {
            FormCheckbox.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setModel();
        },
        setModel: function() {
            //可以被子类覆盖
            var model = this.get("model");
            model.name = this.get("name");
            model.checked = this.get("checked");
            model.dataList = this.get("dataList");
        },
        templateHelpers: {
            dealCheckboxChecked: function(value, checkedList) {
                value = value + "";
                var checked = checkedList.indexOf(value) != -1;
                return checked ? "checked" : "";
            }
        },
        valid: function() {
            return this.$(":checkbox").valid();
        },
        getValue: function() {
            var name = this.get("name");
            var value = {};
            value[name] = this.$(":checked").val();
            return value;
        },
        clear: function() {
            this.$("input").prop("checked", false);
        }
    });
    module.exports = FormCheckbox;
});

define("value/form-checkbox/1.0.0/checkbox-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, stack2, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing, self = this;
        function program1(depth0, data, depth1) {
            var buffer = "", stack1, stack2, options;
            buffer += '\n            <label class="checkbox-inline">\n                <input type="checkbox" name="' + escapeExpression((stack1 = depth1.name, 
            typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" value="';
            if (stack2 = helpers.value) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.value;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '" ';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.dealCheckboxChecked, stack1 ? stack1.call(depth0, depth0.value, depth1.checked, options) : helperMissing.call(depth0, "dealCheckboxChecked", depth0.value, depth1.checked, options))) + "/>";
            if (stack2 = helpers.label) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.label;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + "\n            </label>\n        ";
            return buffer;
        }
        buffer += '<div class="form-group">\n    <label class="col-xs-2 control-label ' + escapeExpression((stack1 = (stack1 = depth0.label, 
        stack1 == null || stack1 === false ? stack1 : stack1.requiredCls), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = (stack1 = depth0.label, 
        stack1 == null || stack1 === false ? stack1 : stack1.text), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '</label>\n\n    <div class="col-xs-10">\n        ';
        stack2 = helpers.each.call(depth0, depth0.dataList, {
            hash: {},
            inverse: self.noop,
            fn: self.programWithDepth(1, program1, data, depth0),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += "\n    </div>\n</div>";
        return buffer;
    });
});
