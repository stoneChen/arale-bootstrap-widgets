define("value/dialog/1.0.0/dialog-debug", [ "$-debug", "gallery/bootstrap/3.2.0/bootstrap-debug", "./dialog-widget/dialog-widget-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./dialog-widget/dialog-debug.handlebars" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var Dialog;
    require("gallery/bootstrap/3.2.0/bootstrap-debug");
    var DialogWidget = require("./dialog-widget/dialog-widget-debug");
    var $body = $("body");
    var modalConfig = {
        backdrop: "static",
        keyboard: false
    };
    var dialogTpl = [ '<div class="modal fade">', '<span class="vertical-alignment-helper"></span>', "</div>" ].join("");
    var dialogContainerStack = [];
    //原来是全局所有弹窗只用一个容器，现在可以无限弹窗，此数组用于保存容器实例
    function createDialogContainer() {
        var newContainer = $(dialogTpl);
        $body.append(newContainer);
        dialogContainerStack.push(newContainer);
        return newContainer;
    }
    function closeTopDialog(innerInstance) {
        var $top = dialogContainerStack.pop();
        //返回最前面的modal，也即可操作的modal
        $top.modal("hide");
        setTimeout(function() {
            //为了保持modal淡出的效果，延迟销毁
            innerInstance.destroy();
        }, 500);
    }
    var commonBottomBtns = [ {
        btnkey: "cancel",
        btnType: "default",
        btnText: "取消",
        action: function() {
            var self = this;
            var cancel = this.get("cfg").cancel;
            var ret = cancel && cancel.call(this);
            if (ret !== false) {
                Dialog.close(self);
            }
        }
    }, {
        btnkey: "ok",
        btnType: "primary",
        btnText: "确定",
        action: function() {
            var self = this;
            var action = this.get("cfg").action;
            var ret = action && action.call(this);
            if (ret !== false) {
                Dialog.close(self);
            }
        }
    } ];
    Dialog = {
        close: function(innerInstance) {
            closeTopDialog(innerInstance);
        },
        confirm: function(cfg) {
            var confirm = new DialogWidget({
                dialogType: "confirm",
                cfg: cfg,
                bottomBtns: cfg.bottomBtns || commonBottomBtns,
                onClose: function() {
                    var closeAction = this.get("cfg").closeAction;
                    closeAction && closeAction.call(this);
                    closeTopDialog(this);
                }
            });
            var $dialogContainer = createDialogContainer();
            $dialogContainer.prepend(confirm.element);
            $dialogContainer.modal(modalConfig);
            return confirm;
        },
        complexBox: function(cfg) {
            var complexBox = new DialogWidget({
                dialogType: "complexBox",
                cfg: cfg,
                bottomBtns: cfg.bottomBtns || commonBottomBtns,
                afterSetup: function() {
                    this.element.css("width", cfg.width);
                    this.$(".modal-body").append(cfg.content);
                    this.$(".modal-body").css("maxHeight", cfg.bodyMaxHeight);
                },
                onClose: function() {
                    var closeAction = this.get("cfg").closeAction;
                    closeAction && closeAction.call(this);
                    closeTopDialog(this);
                }
            });
            var $dialogContainer = createDialogContainer();
            $dialogContainer.prepend(complexBox.element);
            $dialogContainer.modal(modalConfig);
            return complexBox;
        },
        simpleBox: function(cfg) {
            $.extend(cfg, {
                hasHeader: false,
                hasBottomBtns: false
            });
            var simpleBox = new DialogWidget({
                dialogType: "simpleBox",
                cfg: cfg,
                afterSetup: function() {
                    this.element.css("width", cfg.width);
                    this.$(".modal-content").empty().append(cfg.content);
                },
                onClose: function() {
                    var closeAction = this.get("cfg").closeAction;
                    closeAction && closeAction.call(this);
                    closeTopDialog(this);
                }
            });
            var $dialogContainer = createDialogContainer();
            $dialogContainer.prepend(simpleBox.element);
            $dialogContainer.modal(modalConfig);
            return simpleBox;
        }
    };
    return Dialog;
});

define("value/dialog/1.0.0/dialog-widget/dialog-widget-debug", [ "$-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var BaseWidget = require("value/base/1.0.0/base-debug");
    var template = require("value/dialog/1.0.0/dialog-widget/dialog-debug.handlebars");
    var DialogWidget = BaseWidget.extend({
        attrs: {
            parentNode: null,
            template: template,
            model: {},
            dialogType: "",
            cfg: {
                title: "提示",
                content: "",
                hasHeader: true,
                hasBottomBtns: true
            },
            bottomBtns: []
        },
        bottomBtnsObj: null,
        events: {
            "click .modal-footer button": function(e) {
                var self = this;
                var $target = $(e.currentTarget), btnkey = $target.data("btnkey");
                var handler = self.bottomBtnsObj[btnkey];
                handler && handler.action && handler.action.call(self, $target);
            },
            "click .close": function() {
                this.close();
            }
        },
        initAttrs: function(cfg, dataAttrsConfig) {
            DialogWidget.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setModel();
            this._convertBtnsToObj();
        },
        setModel: function() {
            var model = this.get("model");
            var cfg = this.get("cfg");
            model.bottomBtns = this.get("bottomBtns");
            model.title = cfg.title;
            model.hasHeader = cfg.hasHeader;
            model.hasBottomBtns = cfg.hasBottomBtns;
            if (this.get("dialogType") == "confirm") {
                model.content = cfg.content;
            }
        },
        _convertBtnsToObj: function() {
            //使按钮查找handler更快
            var bottomBtns = this.get("bottomBtns");
            var bottomBtnsObj = {};
            bottomBtns && bottomBtns.forEach(function(b) {
                bottomBtnsObj[b.btnkey] = b;
            });
            this.bottomBtnsObj = bottomBtnsObj;
        },
        showMask: function(flag) {
            var $mask = this.$(".dialog-mask");
            if (flag === false) {
                $mask.addClass("hide");
            } else {
                $mask.removeClass("hide");
            }
        },
        //        setup:function(){
        //            DialogWidget.superclass.setup.call(this);
        //            this.showMask();
        //        },
        close: function() {
            this.trigger("close");
        }
    });
    return DialogWidget;
});

define("value/dialog/1.0.0/dialog-widget/dialog-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n        <div class="modal-header">\n            <button type="button" class="close"><span aria-hidden="true">&times;</span></button>\n            <h4 class="modal-title">';
            if (stack1 = helpers.title) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.title;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "</h4>\n        </div>\n        ";
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n        <div class="modal-footer">\n            ';
            stack1 = helpers.each.call(depth0, depth0.bottomBtns, {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n        </div>\n        ";
            return buffer;
        }
        function program4(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n            <button type="button" class="btn btn-';
            if (stack1 = helpers.btnType) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.btnType;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" data-btnkey="';
            if (stack1 = helpers.btnkey) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.btnkey;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">';
            if (stack1 = helpers.btnText) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.btnText;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "</button>\n            ";
            return buffer;
        }
        buffer += '<div class="modal-dialog">\n    <div class="modal-content">\n        ';
        stack1 = helpers["if"].call(depth0, depth0.hasHeader, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\n        <div class="modal-body">\n            ';
        if (stack1 = helpers.content) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.content;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + "\n        </div>\n        ";
        stack1 = helpers["if"].call(depth0, depth0.hasBottomBtns, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\n    </div>\n    <div class="dialog-mask hide"></div>\n</div>';
        return buffer;
    });
});
