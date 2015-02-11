define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var FormWidget = require("value-form-widget");

    var template = require("./radio.handlebars");
    var FormRadio = FormWidget.extend({
        attrs: {
            template: template,
            model: {},
            checked: "",
            disabled:false,
            dataList: [],
            addNullChoice: false
        },
        _onChangeDataList:function(){
            this.setModel();
            this.renderPartial(".form-group");
        },
        initAttrs: function (cfg, dataAttrsConfig) {
            FormRadio.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setModel();
        },
        setModel: function () {//可以被子类覆盖
            var addNullChoice = this.get("addNullChoice");
            var dataList = this.get("dataList");
            if (addNullChoice) {
                dataList = [
                    {
                        label: "全部",
                        value: ""
                    }
                ].concat(dataList);
            }else{
                var checked = this.get("checked");
                if(!checked){
                    this.set("checked",dataList[0]["value"]);
                }
            }
            var model = this.get("model");
            model.name = this.get("name");
            model.checked = this.get("checked");
            model.disabled = this.get("disabled");
            model.dataList = dataList;
        },

        templateHelpers: {
            "dealRadioChecked": function (value, checked) {
                return value == checked ? "checked" : ""
            }
        },
        getItemData:function(value){
            var dataList = this.get("dataList");
            for (var i = 0; i < dataList.length; i++) {
                var itemData = dataList[i];
                if(itemData.value==value){
                    return itemData;
                }
            }
            return null;
        },
        getValue: function () {
            var name = this.get("name");
            var value = {};
            var val = this.$(":checked").val();
            if (val) {
                value[name] = val;
            }
            return value;
        },
        valid:function(){
            return this.$(":radio").valid();
        },
        clear: function () {
            this.$("input").prop("checked", false);
        }
    });
    module.exports = FormRadio;
});