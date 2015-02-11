define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var FormWidget = require("value-form-widget");
    var template = require("./form-ueditor.handlebars");
    var defaultUEditorConfig = {
        serverUrl:'/upload',
        autoFloatEnabled:false,
        initialFrameWidth:'100%',
        initialFrameHeight:200,
        minFrameHeight:150,
        elementPathEnabled:false,
        wordCountMsg:'',
        enableAutoSave:false,//无效。。。
        saveInterval:90000000,
        zIndex:1000,
        toolbars:[[
            'source','undo', 'redo', '|',
            'bold', 'italic', 'underline','strikethrough','removeformat', 'formatmatch', 'autotypeset','pasteplain','|',
            'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'fontfamily', 'fontsize', '|',
            'indent','justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
            'link', 'unlink', 'anchor', '|',
            'imagecenter','simpleupload', 'insertimage', 'emotion'
        ]]
    }
    var FormCkeditor = FormWidget.extend({
        attrs: {
            template: template,
            config:{},
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
            var newId = 'ueditor_' + Date.now();
            self.$('script').prop('id',newId);
            var config = $.extend({},defaultUEditorConfig,self.get("config"));
            setTimeout(function () {
                var editorInstance = self.editorInstance = UE.getEditor(newId,config);
                editorInstance.addListener("contentChange", function () {
                    self.valid();
                });
            },10)
        },
        setModel: function () {//可以被子类覆盖
            var model = this.get("model");
            model.name = this.get("name");
            model.value = this.get("value");
        },
        getValue: function (pure) {
            var name = this.get("name");
            var value = this.editorInstance.getContent();
            if(pure){
                return value;
            }
            var ret = {};
            ret[name] = value;
            return ret;
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