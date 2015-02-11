define(function (require, exports, module) {
    "use strict";
//    var $ = require("$");
    var Templatable = require("arale-templatable");
    var Widget = require("arale-widget");
    var cachedWidgets = [];
    var BaseWidget = Widget.extend({
        Implements: Templatable,
        attrs:{
            parentNode:null
        },
        initAttrs:function(cfg,dataAttrsConfig){
            BaseWidget.superclass.initAttrs.call(this,cfg,dataAttrsConfig);
            cachedWidgets.push(this);
        },
        setup:function(){
            this.render();
        },
        getOuterHTML:function(){
            return this.element[0].outerHTML;
        },
        hide:function(){
            this.element.hide();
        },
        show:function(){
            this.element.show();
        }
    })
    BaseWidget.destroyAll = function(){
        cachedWidgets.forEach(function(w){
            w.destroy();
        })
    }
    module.exports = BaseWidget;
});