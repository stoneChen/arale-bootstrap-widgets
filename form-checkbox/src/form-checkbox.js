define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var FormWidget = require("value-form-widget");

    var template = require("./checkbox.handlebars");
    var FormCheckbox = FormWidget.extend({
        attrs:{
            template:template,
            model:{},
            checked:[],
            dataList:[]
        },
        initAttrs:function(cfg,dataAttrsConfig){
            FormCheckbox.superclass.initAttrs.call(this,cfg,dataAttrsConfig);
            this.setModel();
        },
        setModel:function(){//可以被子类覆盖
            var model = this.get("model");
            model.name = this.get("name");
            model.checked = this.get("checked");
            model.dataList = this.get("dataList");
        },

        templateHelpers:{
            "dealCheckboxChecked":function(value,checkedList){
                value = value + "";
                var checked = (checkedList.indexOf(value) != -1);
                return checked ? "checked":""
            }
        },
        valid:function(){
            return this.$(":checkbox").valid();//尚未用到
        },
        getValue:function(){
            var name = this.get("name");
            var value = {};
            value[name] = this.$(":checked").val();
            return value;
        },
        clear:function(){
            this.$("input").prop("checked",false);
        }
    });
    module.exports = FormCheckbox;
});