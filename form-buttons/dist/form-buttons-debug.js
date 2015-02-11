define("value/form-buttons/1.0.0/form-buttons-debug", [ "$-debug", "value/form/1.0.0/form-widget-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./buttons-debug.handlebars" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var FormWidget = require("value/form/1.0.0/form-widget-debug");
    var template = require("./buttons-debug.handlebars");
    var FormButton = FormWidget.extend({
        attrs: {
            template: template,
            model: {},
            fullXControl: false,
            //100%宽度，添加form-control className
            verticalLayout: false,
            //纵向表单布局，即label与控件不在同一行
            offsetType: 2,
            btns: []
        },
        initAttrs: function(cfg, dataAttrsConfig) {
            FormButton.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setModel();
        },
        setModel: function() {
            var model = this.get("model");
            model.btns = this.get("btns");
            model.verticalLayout = this.get("verticalLayout");
            model.offsetType = this.get("offsetType");
        },
        setup: function() {
            FormButton.superclass.setup.call(this);
            this.convertBtnsToObj();
        },
        convertBtnsToObj: function() {
            //使按钮查找handler更快
            var btns = this.get("btns");
            var btnsObj = {};
            btns.forEach(function(b) {
                btnsObj[b.btnkey] = b;
            });
            this.set("btns", btnsObj);
        },
        getValue: function() {},
        clear: function() {}
    });
    module.exports = FormButton;
});

define("value/form-buttons/1.0.0/buttons-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            return "vertical-form-group";
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n            <button type="button" class="btn btn-';
            if (stack1 = helpers.type) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.type;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + " ";
            stack1 = helpers["if"].call(depth0, depth0.fullXControl, {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '" data-btnkey="';
            if (stack1 = helpers.btnkey) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.btnkey;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">';
            if (stack1 = helpers.text) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.text;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "</button>\n        ";
            return buffer;
        }
        function program4(depth0, data) {
            return "btn-block";
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
        buffer += '">\n    <div class="col-xs-offset-';
        if (stack1 = helpers.offsetType) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.offsetType;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + ' col-xs-10">\n        ';
        stack1 = helpers.each.call(depth0, depth0.btns, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n    </div>\n</div>";
        return buffer;
    });
});
