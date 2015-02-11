define("value/form/1.0.0/form-debug", [ "$-debug", "jquery/validator/1.11.1/validator-bootstrap3-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    require("jquery/validator/1.11.1/validator-bootstrap3-debug");
    //    var Handlebars = require("handlebars");
    //    var Widget = require("arale-widget");
    //    var Templatable = require("arale-templatable");
    //    var formTpl = require('./form.handlebars');
    var BaseWidget = require("value/base/1.0.0/base-debug");
    var VERTICAL_LAYOUT_CLASS_NAME = "form-vertical";
    var Form = BaseWidget.extend({
        //        Implements: Templatable,
        element: "<form></form>",
        attrs: {
            className: "form-horizontal",
            parentNode: null,
            submitHandler: null,
            verticalLayout: false,
            //纵向表单布局，即label与控件不在同一行
            widgets: []
        },
        formWidgets: null,
        //添加至form中后,便于获取组件实例,变成对象
        //        initialize: function (cfg) {
        //            Form.superclass.initialize.call(this, cfg);
        //        },
        setup: function() {
            this._parseWidgets();
            this.setClassName();
            Form.superclass.setup.call(this);
        },
        setClassName: function() {
            var verticalLayout = this.get("verticalLayout");
            if (verticalLayout) {
                this.set("className", VERTICAL_LAYOUT_CLASS_NAME);
            }
        },
        _parseWidgets: function() {
            var self = this;
            var formWidgets = {};
            var $form = this.element;
            var rules = {}, messages = {};
            var widgets = this.get("widgets");
            widgets.forEach(function(w) {
                //插入form中
                $form.append(w.element);
                var name = w.get("name");
                //提取校验规则
                var commonValid = w.get("commonValid");
                if (commonValid) {
                    var rs = w.getRules();
                    var ms = w.getMessages();
                    if (!$.isEmptyObject(rs)) {
                        rules[name] = rs;
                    }
                    if (!$.isEmptyObject(ms)) {
                        messages[name] = w.getMessages();
                    }
                }
                //将实例转存到对象中,方便以后获取
                formWidgets[name] = w;
                //将form实例set到widget中,建立联系
                w.set("form", self);
            });
            //绑定校验规则
            var rulesModel = {
                rules: rules,
                messages: messages,
                submitHandler: function() {}
            };
            this.element.validate(rulesModel);
            this.formWidgets = formWidgets;
        },
        registerWidget: function(widgetInstance) {
            var widgetName = widgetInstance.get("name");
            this.formWidgets[widgetName] = widgetInstance;
        },
        getWidget: function(widgetName) {
            return this.formWidgets[widgetName];
        },
        getFormData: function() {
            var formData = {};
            var widgets = this.formWidgets;
            Object.keys(widgets).forEach(function(k) {
                $.extend(formData, widgets[k].getValue());
            });
            return formData;
        },
        clear: function() {
            var widgets = this.formWidgets;
            Object.keys(widgets).forEach(function(k) {
                widgets[k].clear();
            });
        },
        submit: function() {
            //            this.element.submit();
            var pass = true;
            var widgets = this.formWidgets;
            Object.keys(widgets).forEach(function(k) {
                if (!widgets[k].valid()) {
                    pass = false;
                }
            });
            if (pass) {
                var submitHandler = this.get("submitHandler");
                submitHandler.call(this, this.element);
            }
        },
        destroy: function() {
            var widgets = this.formWidgets;
            Object.keys(widgets).forEach(function(k) {
                widgets[k].destroy();
            });
            Form.superclass.destroy.call(this);
        }
    });
    return Form;
});
