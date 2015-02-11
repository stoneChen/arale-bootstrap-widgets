define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var FormWidget = require("value-form-widget");

    var template = require("./hidden.handlebars");
    var FormRadio = FormWidget.extend({
        attrs:{
            template:template,
            model:{},
            name:"",
            value:""
        },
        initAttrs:function(cfg,dataAttrsConfig){
            FormRadio.superclass.initAttrs.call(this,cfg,dataAttrsConfig);
            this.setModel();
        },
        setModel:function(){//可以被子类覆盖
            var model = this.get("model");
            model.name = this.get("name");
            model.value = this.get("value");
        },
        getValue:function(){
            var name = this.get("name");
            var value = {};
            value[name] = this.element.val();
            return value;
        },
        clear:function(){
//            this.inputElement.val("");
        }
    });
    module.exports = FormRadio;
});