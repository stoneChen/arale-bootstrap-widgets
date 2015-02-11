define(function (require, exports, module) {
    var $ = require('$');
    var doc = document,
        $body = $('body'),
        getUID = (function () {
            var id = 0;
            return function () {
                return 'Upload' + id++;
            }
        })()
    var Upload = function (cfg) {
        this.btn = cfg.btn;
        this.fieldName = cfg.fieldName || 'file';
        this.formAction = cfg.formAction || 'fileUpload';
        this.fileType = cfg.fileType || {};
        this.otherParams = cfg.otherParams || {};
        this.onSubmit = cfg.onSubmit;//通过返回false,阻止表单提交
        this.onComplete = cfg.onComplete;
        this.onFileTypeFail = cfg.onFileTypeFail;
        this.f_domain = cfg.f_domain;
        this.form = null;
        this.iframe = null;
        this.init();
    }
    Upload.prototype = {
        init: function () {
            this.createFileEl();
        },
        createFileEl: function () {
            var self = this;
            var accepts = (this.fileType.allow || []).map(function(val){
                return "." + val;
            })
            var $file = $('<input type="file" class="hide" id="' + self.btn.prop('for') + '" name="' + self.fieldName + '" accept="' + accepts.join(",") + '"/>'),
                fileChange = function () {
                    var $file = $(this);
                    if (!self.checkFileType($file.val())) {//检查文件类型
                        $file.remove();//
                        self.createFileEl();
                        if (self.onFileTypeFail) {
                            self.onFileTypeFail(self.btn, self.fileType);
                        } else {
                            alert('file type is forbidden')
                        }
                        return;
                    }
                    if (self.onSubmit) {
                        if (!self.onSubmit(self.btn, $file)) {//返回false,则不提交表单
                            return;
                        }
                    }
                    self.btn.attr('disabled', true);
                    self.createForm();
                    $file.appendTo(self.form);
                    self.createOtherData();//创建其他表单数据
                    self.form.submit();
                    $file.remove();

                };
            $file.change(fileChange);
            self.btn.after($file);
        },
        createForm: function () {
            var self = this;
            var uID = getUID();
            var $iframe = $('<iframe frameborder="0"  style="display:none;" name="hiddenIframe' + uID + '" class="hide"></script></iframe>'),
                $form = $('<form action="' + this.formAction + '" target="hiddenIframe' + uID + '" enctype="multipart/form-data" method="post" style="display:none;"></form>');
            $iframe.on('load', function () {
                var iDoc = $iframe[0].contentWindow.document;
                if (iDoc.readyState && iDoc.readyState != 'complete') {
                    return;
                }
                if (iDoc.body.innerHTML) {//
                    self.onComplete.call(null, self.btn,JSON.parse(iDoc.body.innerHTML) );
                    self.destroyForm();
                    self.btn.attr('disabled', false);
                    self.createFileEl();
                }
            })
            $body.append($iframe);
            $body.append($form);
            this.iframe = $iframe;
            this.form = $form;
        },
        destroyForm: function () {
            this.form.remove();
            this.iframe.remove();
        },
        checkFileType: function (filepath) {
            var allow = this.fileType.allow,
                forbidden = this.fileType.forbidden,
                ext = filepath.match(/^.*\.(.+)$/);
            if(!ext){
                return false;
            }
            if (allow) {//默认allow,也可设置禁止项,但两者不能共存
                if ($.inArray(ext[1], allow) != -1) {
                    return true;
                }
            } else if (forbidden) {
                if ($.inArray(ext[1], forbidden) == -1) {
                    return true;
                }
            }
            return false;
        },
        createOtherData: function () {
            var otherParams = this.otherParams,
                htmlText = '';
            $.each(otherParams, function (k, v) {
                htmlText += '<input type="hidden" name="' + k + '" value="' + v + '"/>';
            })
            this.form.append(htmlText);
        },
        setOtherData: function (newData) {
            this.otherParams = newData;
        }
    }
    $.fn.ajaxUpload = function (cfg) {
        var instances = [];
        this.each(function () {
            var conf = $.extend({}, cfg);
            conf.btn = $(this);
            instances.push(new Upload(conf))
        })
        return instances;
    }
});