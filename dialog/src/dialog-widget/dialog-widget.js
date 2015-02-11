define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var BaseWidget = require("value-base-widget");
    var template = require("./dialog.handlebars");
    var DialogWidget = BaseWidget.extend({
        attrs:{
            parentNode:null,
            template:template,
            model:{},
            dialogType:"",
            cfg:{
                title:"提示",
                content:"",
                hasHeader:true,
                hasBottomBtns:true,
                hasClose:true
            },
            bottomBtns:[]
        },
        bottomBtnsObj:null,
        events:{
            "click .modal-footer button":function(e){
                var self = this;
                var $target = $(e.currentTarget),
                    btnkey = $target.data("btnkey");
                var handler = self.bottomBtnsObj[btnkey];
                handler && handler.action && handler.action.call(self, $target);
            },
            "click .close":function(){
                this.close();
            }
        },
        initAttrs: function (cfg, dataAttrsConfig) {
            DialogWidget.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setModel();
            this._convertBtnsToObj();
        },
        setModel:function(){
            var model = this.get("model");
            var cfg = this.get("cfg");
            model.bottomBtns = this.get("bottomBtns");
            model.title = cfg.title;
            model.hasHeader = cfg.hasHeader;
            model.hasBottomBtns = cfg.hasBottomBtns;
            model.hasClose = cfg.hasClose;
            if(this.get("dialogType") == "confirm"){
                model.content = cfg.content
            }
        },
        _convertBtnsToObj:function(){//使按钮查找handler更快
            var bottomBtns = this.get("bottomBtns")
            var bottomBtnsObj = {};
            bottomBtns && bottomBtns.forEach(function(b){
                bottomBtnsObj[b.btnkey] = b;
            });
            this.bottomBtnsObj = bottomBtnsObj;
        },
        showMask:function(flag){
            var $mask = this.$(".dialog-mask");
            if(flag === false){
                $mask.addClass("hide");
            }else{
                $mask.removeClass("hide");
            }
        },
//        setup:function(){
//            DialogWidget.superclass.setup.call(this);
//            this.showMask();
//        },
        close:function(){
            this.trigger("close");
        }
    })
    return DialogWidget;
});