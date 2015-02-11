define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    require("value-upload");
    var FormWidget = require("value-form-widget");
    var template = require("./upload.handlebars");

    var FormUpload = FormWidget.extend({
        attrs:{
            template:template,
            model:{},
            value:{},
            colWidth:10,
            url:"",
            allowFileTypes:[]
        },
        fileInfo:{},
        initAttrs:function(cfg,dataAttrsConfig){
            FormUpload.superclass.initAttrs.call(this,cfg,dataAttrsConfig);
            var model = this.get("model");
            model.btnId = 'file_btn_' + (+new Date());
        },
        setup:function(){
            FormUpload.superclass.setup.call(this);
            this.bindAjaxUpload();
            var value = this.get("value");
            if(value.fileName){
                this.fileInfo = value;
                var fileName = value.fileName;
                this.$(".sco-doc-title").text(fileName|| "未选择内容");
            }
        },
        bindAjaxUpload: function () {
            var self = this;
            var url = this.get("url");
            var conf = {
                fieldName: 'myfile',
                otherParams: {
                },
                fileType: {
                    allow: self.get("allowFileTypes")
                },
                formAction:url,
                onFileTypeFail: function (file, type) {
                    $.message("文件类型必须是" + type.allow.join(","), 'danger');
                },
                onSubmit: function (btn, file) {
                    btn.attr("data-old-text", btn.text());
                    btn.text('上传中...');
                    return true;
                },
                onComplete: function (btn, response) {
                    var sco = response.data.model;
                    btn.text(btn.attr("data-old-text"));
                    var filename = sco.fileName;
                    self.$(".sco-doc-title").text(filename);
                    self.fileInfo = sco;
                }
            };
            this.$('.doc-choice').ajaxUpload(conf);
        },
        getValue:function(){
            var fileName = this.fileInfo.fileName;
            var fileSize = this.fileInfo.fileSize;
            var fileType = this.fileInfo.fileType;
            var encodeFile = this.fileInfo.encodeFile;
            var filePath = this.fileInfo.filePath;
            return {
                fileName: fileName,
                fileType: fileType,
                fileSize: fileSize,
                encodeFile: encodeFile,
                filePath: filePath
            }
        }
    });
    return FormUpload;
});