define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var FormWidget = require("value-form-widget");

    var template = require("./text.handlebars");
    var FormText = FormWidget.extend({
        attrs:{
            template:template,
            model:{},
            verticalLayout:false,//纵向表单布局，即label与控件不在同一行
            type:"text",//text(default) | password
            value:"",
            needEncode:false,
            disabled:false,
            colWidth:10
        },
        inputElement:null,
        initAttrs:function(cfg,dataAttrsConfig){
            FormText.superclass.initAttrs.call(this,cfg,dataAttrsConfig);
            this.setModel();
        },
        setup:function(){
            FormText.superclass.setup.call(this);
            this.inputElement = this.$("input");
        },
        events:{
//            "blur input":function(event){
//                alert(123123)
//            }
        },
        setModel:function(){
            var model = this.get("model");
            model.value = this.get("value");
            model.type = this.get("type");
            model.name = this.get("name");
            model.verticalLayout = this.get("verticalLayout");
            model.nodeData = this.get("nodeData");
            model.colWidth = this.get("colWidth");
            model.disabled = this.get("disabled");
        },
        getValue:function(){
            var name = this.get("name");
            var needEncode = this.get("needEncode");
            var value = {};
            value[name] = needEncode ? encodeURIComponent(this.inputElement.val()) : this.inputElement.val();
            return value;
        },
        clear:function(){
            this.inputElement.val("");
        },
        valid:function(){
            return this.inputElement.valid();
        }
    })
    module.exports = FormText;
});
