define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var FormWidget = require("value-form-widget");
    var template = require("./form-ckeditor.handlebars");
    var FormCkeditor = FormWidget.extend({
        attrs: {
            template: template,
            model: {},
            commonValid:false,
            name:"",
            value:""
        },
        initAttrs: function (cfg, dataAttrsConfig) {
            FormCkeditor.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setModel();
        },
        setup:function(){
            var self = this;
            var editorInstance = self.editorInstance = CKEDITOR.replace(this.$('textarea')[0]);
            editorInstance.on("change",function(){
                self.valid();
            })
        },
        setModel: function () {//可以被子类覆盖
            var model = this.get("model");
            model.name = this.get("name");
            model.value = this.get("value");
        },
        getValue: function (pure) {
            var name = this.get("name");
            var value = CKEDITOR.instances[name].getData();
            if(pure){
                return value;
            }
            var value = {};
            value[name] = CKEDITOR.instances[name].getData();
            return value;
        },
        clear: function () {
//            this.inputElement.val("");
        },
        valid:function(){
            var rules = this.getRules();
            if(!rules.required){
                return true;
            }
            if(this.getValue(true)){
                this.element.removeClass("has-error");
                return true;
            }else{
                this.showError();
                return false;
            }
        },
        showError:function(){
            this.element.addClass("has-error");
            var $error = this.$("div.error");
            if(!$error.length){
                var messages = this.getMessages();
                var $container = this.$("div[class^=col]");
                $container.append('<div class="error"><i class="fa fa-remove"></i> ' + messages.required + '</div>')
            }
        }
    });
    module.exports = FormCkeditor;
});