define("value/form-text/1.0.0/form-text-debug", [ "$-debug", "value/form/1.0.0/form-widget-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./text-debug.handlebars" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var FormWidget = require("value/form/1.0.0/form-widget-debug");
    var template = require("./text-debug.handlebars");
    var FormText = FormWidget.extend({
        attrs: {
            template: template,
            model: {},
            verticalLayout: false,
            //纵向表单布局，即label与控件不在同一行
            type: "text",
            //text(default) | password
            value: "",
            needEncode: false,
            disabled: false,
            colWidth: 10
        },
        inputElement: null,
        initAttrs: function(cfg, dataAttrsConfig) {
            FormText.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setModel();
        },
        setup: function() {
            FormText.superclass.setup.call(this);
            this.inputElement = this.$("input");
        },
        events: {},
        setModel: function() {
            var model = this.get("model");
            model.value = this.get("value");
            model.type = this.get("type");
            model.name = this.get("name");
            model.verticalLayout = this.get("verticalLayout");
            model.nodeData = this.get("nodeData");
            model.colWidth = this.get("colWidth");
            model.disabled = this.get("disabled");
        },
        getValue: function() {
            var name = this.get("name");
            var needEncode = this.get("needEncode");
            var value = {};
            value[name] = needEncode ? encodeURIComponent(this.inputElement.val()) : this.inputElement.val();
            return value;
        },
        clear: function() {
            this.inputElement.val("");
        },
        valid: function() {
            return this.inputElement.valid();
        }
    });
    module.exports = FormText;
});

define("value/form-text/1.0.0/text-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, stack2, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            return "vertical-form-group";
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += escapeExpression((stack1 = data.key, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '="' + escapeExpression(typeof depth0 === functionType ? depth0.apply(depth0) : depth0) + '"';
            return buffer;
        }
        function program5(depth0, data) {
            return "disabled";
        }
        buffer += '<div class="form-group ';
        stack1 = helpers["if"].call(depth0, depth0.verticalLayout, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '">\n    <label class="col-xs-2 control-label ' + escapeExpression((stack1 = (stack1 = depth0.label, 
        stack1 == null || stack1 === false ? stack1 : stack1.requiredCls), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = (stack1 = depth0.label, 
        stack1 == null || stack1 === false ? stack1 : stack1.text), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '</label>\n\n    <div class="col-xs-';
        if (stack2 = helpers.colWidth) {
            stack2 = stack2.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack2 = depth0.colWidth;
            stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
        }
        buffer += escapeExpression(stack2) + '">\n        <input type="';
        if (stack2 = helpers.type) {
            stack2 = stack2.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack2 = depth0.type;
            stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
        }
        buffer += escapeExpression(stack2) + '" class="form-control" name="';
        if (stack2 = helpers.name) {
            stack2 = stack2.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack2 = depth0.name;
            stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
        }
        buffer += escapeExpression(stack2) + '" value="';
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
        stack2 = helpers.each.call(depth0, depth0.nodeData, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += " ";
        stack2 = helpers["if"].call(depth0, depth0.disabled, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += "/>\n    </div>\n</div>";
        return buffer;
    });
});
