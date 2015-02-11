define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var FormWidget = require("value-form-widget");
    require("select2");
    require("select2-css");
    var template = require("./select.handlebars");
    var FormSelect = FormWidget.extend({
        attrs: {
//            select2:{//示例，既可以传true也可以传｛...｝
//
//            },
            template: template,
            model: {},
            verticalLayout:false,//纵向表单布局，即label与控件不在同一行
            selected: "",
            dataList: [],
            addNullChoice:true,
            disabled:false
        },
        actualDOM: null,
        _onChangeDataList: function () {
            var model = this.get("model");
            var dataList = this.get("dataList") || [];
            dataList = this.addNullChoice(dataList);
            model.dataList = dataList;
            this.renderPartial("select");
        },
        _onChangeSelected:function(val){
            var model = this.get("model");
            model.selected = val;
        },
        initAttrs: function (cfg, dataAttrsConfig) {
            FormSelect.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setModel();
        },
        setModel: function () {//可以被子类覆盖
            var dataList = this.get("dataList");
            dataList = this.addNullChoice(dataList);
            var model = this.get("model");
            model.verticalLayout = this.get("verticalLayout");
            model.name = this.get("name");
            model.selected = this.get("selected");
            model.dataList = dataList;
            model.disabled = this.get("disabled");
        },
        addNullChoice:function(dataList){
            var addNullChoice = this.get("addNullChoice");
            if(addNullChoice){
                dataList = [{
                    label:"-请选择-",
                    value:""
                }].concat(dataList);
            }
            return dataList;
        },
        setup: function () {
            FormSelect.superclass.setup.call(this);
            this.setActualDOM();
            var options = this.get("select2");
            if (options) {
                if (options === true) {
                    options = {};
                }
                this.actualDOM.select2(options);
            }
        },
        setActualDOM: function () {
            this.actualDOM = this.element.find("select");
        },
        templateHelpers: {
            "dealSelected": function (value, selected) {
                return value == selected ? "selected" : ""
            }
        },
        valid:function(){
            return this.$("select").valid();
        },
        getValue: function () {
            var value = {};
            var val = this.$("select").val();
            if(val){
                var name = this.get("name");
                value[name] = this.$("select").val();
            }
            return value;
        },
        clear: function () {
            this.$("select").val("");
        }
    })
    module.exports = FormSelect;
});
