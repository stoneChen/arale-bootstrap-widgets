define("value/form/1.0.0/form-widget-debug", [ "$-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    //    var Templatable = require("arale-templatable");
    //    var Widget = require("arale-widget");
    var BaseWidget = require("value/base/1.0.0/base-debug");
    var FormWidget = BaseWidget.extend({
        //        Implements: Templatable,
        attrs: {
            parentNode: null,
            name: "",
            label: "",
            nodeData: {},
            btns: {},
            //按钮点击事件统一在此注册
            commonValid: true,
            //是否为jquery-validator常规验证
            validateCfg: {
                rules: {},
                messages: {}
            }
        },
        initAttrs: function(cfg, dataAttrsConfig) {
            FormWidget.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this._setLabel();
        },
        _setLabel: function() {
            if (!this.get("label")) {
                return;
            }
            var model = this.get("model");
            //根据rules中的设置设定是否必填
            var required = this.getRules().required;
            required = required ? "required" : "";
            model.label = {
                text: this.get("label"),
                requiredCls: required
            };
        },
        events: {
            "click button": function(e) {
                var self = this;
                var $target = $(e.currentTarget), btnkey = $target.data("btnkey");
                var btns = self.get("btns"), btnObj = btns[btnkey];
                //此时btns已经被转成对象形式,子类自行转换
                btnObj && btnObj.handler && btnObj.handler.call(self, $target);
            }
        },
        getRules: function() {
            var validateCfg = this.get("validateCfg");
            return validateCfg.rules;
        },
        getMessages: function() {
            var validateCfg = this.get("validateCfg");
            return validateCfg.messages;
        },
        valid: function() {
            //手动校验方法，给子类覆盖
            //            seajs.log("子类未覆盖此valid方法,实例:" + this.get("name"),"warn");
            return true;
        },
        clear: function() {
            //给子类覆盖
            seajs.log("子类未覆盖此clear方法,实例:" + this.get("name"), "warn");
        },
        getValue: function() {
            //给子类覆盖
            seajs.log("子类未覆盖此getValue方法,实例:" + this.get("name"), "warn");
        }
    });
    module.exports = FormWidget;
});
