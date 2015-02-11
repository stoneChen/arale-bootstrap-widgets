define("value/form-text-mobile/1.0.1/form-text-mobile-debug", [ "$-debug", "value/countdown/1.0.0/countdown-debug", "gallery/moment/2.8.3/moment-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "value/form-text/1.0.0/form-text-debug", "value/form/1.0.0/form-widget-debug", "gallery/handlebars/1.0.2/runtime-debug", "./form-text-mobile-debug.handlebars" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var Countdown = require("value/countdown/1.0.0/countdown-debug");
    var FormText = require("value/form-text/1.0.0/form-text-debug");
    var template = require("./form-text-mobile-debug.handlebars");
    var MobileText = FormText.extend({
        attrs: {
            url: "",
            colWidth: 5,
            mobileTip: false,
            explain: "",
            template: template
        },
        events: {
            "click .fetch-valicode-btn": function(ev) {
                if (this.valid()) {
                    this.fetch();
                }
            }
        },
        setModel: function() {
            MobileText.superclass.setModel.call(this);
            var model = this.get("model");
            model.mobileTip = this.get("mobileTip");
            model.explain = this.get("explain");
        },
        fetch: function() {
            var url = this.get("url");
            var $self = this;
            var mobileName = this.get("mobileName");
            var data = this.getValue();
            $.eduAjax({
                url: url,
                data: data,
                done: function() {
                    $self.startCountdown();
                }
            });
        },
        startCountdown: function() {
            var $fetchValicodeBtn = this.$(".fetch-valicode-btn");
            var $countdownWrapper = $fetchValicodeBtn.find("span");
            $fetchValicodeBtn.prop("disabled", true);
            new Countdown({
                element: $countdownWrapper,
                totalRemain: 60 * 1e3,
                format: function(hours, mins, seconds) {
                    return "(" + seconds + ")";
                },
                onTimeup: function() {
                    $fetchValicodeBtn.prop("disabled", false);
                    $countdownWrapper.text("");
                }
            });
        }
    });
    module.exports = MobileText;
});

define("value/form-text-mobile/1.0.1/form-text-mobile-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
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
            return '\r\n                <span class="glyphicon glyphicon-ok text-success"></span>\r\n            ';
        }
        function program7(depth0, data) {
            return "text-success";
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
        buffer += '">\r\n    <label class="col-xs-2 control-label ' + escapeExpression((stack1 = (stack1 = depth0.label, 
        stack1 == null || stack1 === false ? stack1 : stack1.requiredCls), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = (stack1 = depth0.label, 
        stack1 == null || stack1 === false ? stack1 : stack1.text), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '</label>\r\n\r\n    <div class="col-xs-';
        if (stack2 = helpers.colWidth) {
            stack2 = stack2.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack2 = depth0.colWidth;
            stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
        }
        buffer += escapeExpression(stack2) + '">\r\n        <input type="';
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
        buffer += ' />\r\n    </div>\r\n    <div class="col-xs-2">\r\n        <button type="button" class="btn btn-primary fetch-valicode-btn">获取验证码<span></span></button>\r\n    </div>\r\n    <div class="col-xs-2">\r\n        <div class="form-control just-show">\r\n            ';
        stack2 = helpers["if"].call(depth0, depth0.mobileTip, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '\r\n            <span class="email-tip   ';
        stack2 = helpers["if"].call(depth0, depth0.mobileTip, {
            hash: {},
            inverse: self.noop,
            fn: self.program(7, program7, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '">';
        if (stack2 = helpers.explain) {
            stack2 = stack2.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack2 = depth0.explain;
            stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
        }
        buffer += escapeExpression(stack2) + "</span>\r\n        </div>\r\n    </div>\r\n</div>";
        return buffer;
    });
});
