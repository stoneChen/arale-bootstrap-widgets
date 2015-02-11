define("value/form-upload/1.0.0/form-upload-debug", [ "$-debug", "value/upload/1.0.0/upload-debug", "value/form/1.0.0/form-widget-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./upload-debug.handlebars" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    require("value/upload/1.0.0/upload-debug");
    var FormWidget = require("value/form/1.0.0/form-widget-debug");
    var template = require("./upload-debug.handlebars");
    var FormUpload = FormWidget.extend({
        attrs: {
            template: template,
            model: {},
            value: {},
            colWidth: 10,
            url: "",
            allowFileTypes: []
        },
        fileInfo: {},
        initAttrs: function(cfg, dataAttrsConfig) {
            FormUpload.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            var model = this.get("model");
            debugger;
            model.btnId = "file_btn_" + +new Date();
        },
        setup: function() {
            FormUpload.superclass.setup.call(this);
            this.bindAjaxUpload();
            var value = this.get("value");
            if (value.fileName) {
                this.fileInfo = value;
                var fileName = value.fileName;
                this.$(".sco-doc-title").text(fileName || "未选择内容");
            }
        },
        bindAjaxUpload: function() {
            var self = this;
            var url = this.get("url");
            var conf = {
                fieldName: "myfile",
                otherParams: {},
                fileType: {
                    allow: self.get("allowFileTypes")
                },
                formAction: url,
                onFileTypeFail: function(file, type) {
                    $.message("文件类型必须是" + type.allow.join(","), "danger");
                },
                onSubmit: function(btn, file) {
                    btn.attr("data-old-text", btn.text());
                    btn.text("上传中...");
                    return true;
                },
                onComplete: function(btn, response) {
                    var sco = response.data.model;
                    btn.text(btn.attr("data-old-text"));
                    var filename = sco.fileName;
                    self.$(".sco-doc-title").text(filename);
                    self.fileInfo = sco;
                }
            };
            this.$(".doc-choice").ajaxUpload(conf);
        },
        getValue: function() {
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
            };
        }
    });
    return FormUpload;
});

define("value/form-upload/1.0.0/upload-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, stack2, functionType = "function", escapeExpression = this.escapeExpression;
        buffer += '<div class="form-group">\n    <label class="col-xs-2 control-label ' + escapeExpression((stack1 = (stack1 = depth0.label, 
        stack1 == null || stack1 === false ? stack1 : stack1.requiredCls), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = (stack1 = depth0.label, 
        stack1 == null || stack1 === false ? stack1 : stack1.text), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '</label>\n    <div class="col-xs-10">\n        <label for="';
        if (stack2 = helpers.btnId) {
            stack2 = stack2.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack2 = depth0.btnId;
            stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
        }
        buffer += escapeExpression(stack2) + '" class="btn btn-default doc-choice">选择文件</label>\n        <span class="sco-doc-title">未选择内容</span>\n    </div>\n</div>';
        return buffer;
    });
});
