define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var Dialog;
    require("bootstrap");
    var DialogWidget = require("./dialog-widget/dialog-widget");
    var $body = $('body');
    var modalConfig = {
        backdrop: "static",
        keyboard: false
    }
    var dialogTpl = [
        '<div class="modal fade">',
            '<span class="vertical-alignment-helper"></span>',
        '</div>'
    ].join('');
    var dialogContainerStack = [];//原来是全局所有弹窗只用一个容器，现在可以无限弹窗，此数组用于保存容器实例
    function createDialogContainer() {
        var newContainer = $(dialogTpl);
        $body.append(newContainer);
        dialogContainerStack.push(newContainer);
        return newContainer;
    }

    function closeTopDialog(innerInstance) {
        var $top = dialogContainerStack.pop();//返回最前面的modal，也即可操作的modal
        $top.modal('hide');
        setTimeout(function () {//为了保持modal淡出的效果，延迟销毁
            innerInstance.destroy();
        }, 500)
    }
    var commonBottomBtns = [
        {
            btnkey: "cancel",
            btnType: "default",
            btnText: "取消",
            action: function () {
                var self = this;
                var cancel = this.get("cfg").cancel;
                var ret = cancel && cancel.call(this);
                if (ret !== false) {
                    Dialog.close(self);
                }
            }
        },
        {
            btnkey: "ok",
            btnType: "primary",
            btnText: "确定",
            action: function () {
                var self = this;
                var action = this.get("cfg").action;
                var ret = action && action.call(this);
                if (ret !== false) {
                    Dialog.close(self);
                }
            }
        }
    ];
    Dialog = {
        close: function (innerInstance) {
            closeTopDialog(innerInstance)
        },
        confirm: function (cfg) {
            var confirm = new DialogWidget({
                dialogType: "confirm",
                cfg: cfg,
                bottomBtns: cfg.bottomBtns || commonBottomBtns,
                onClose: function () {
                    var closeAction = this.get("cfg").closeAction;
                    closeAction && closeAction.call(this);
                    closeTopDialog(this)
                }
            });
            var $dialogContainer = createDialogContainer();
            $dialogContainer.prepend(confirm.element);
            $dialogContainer.modal(modalConfig);
            return confirm;
        },
        complexBox: function (cfg) {
            var complexBox = new DialogWidget({
                dialogType: "complexBox",
                cfg: cfg,
                bottomBtns: cfg.bottomBtns || commonBottomBtns,
                afterSetup: function () {
                    this.element.css("width", cfg.width)
                    this.$(".modal-body").append(cfg.content);
                    this.$(".modal-body").css('maxHeight', cfg.bodyMaxHeight);
                },
                onClose: function () {
                    var closeAction = this.get("cfg").closeAction;
                    closeAction && closeAction.call(this);
                    closeTopDialog(this)
                }
            })
            var $dialogContainer = createDialogContainer();
            $dialogContainer.prepend(complexBox.element);
            $dialogContainer.modal(modalConfig);
            return complexBox;
        },
        simpleBox: function (cfg) {
            $.extend(cfg, {
                hasHeader: false,
                hasBottomBtns: false
            })
            var simpleBox = new DialogWidget({
                dialogType: "simpleBox",
                cfg: cfg,
                afterSetup: function () {
                    this.element.css("width", cfg.width);
                    this.$(".modal-content").empty().append(cfg.content);
                },
                onClose: function () {
                    var closeAction = this.get("cfg").closeAction;
                    closeAction && closeAction.call(this);
                    closeTopDialog(this)
                }
            })
            var $dialogContainer = createDialogContainer();
            $dialogContainer.prepend(simpleBox.element);
            $dialogContainer.modal(modalConfig);
            return simpleBox;
        }
    };
    return Dialog;
});