define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var Handlebars = require('handlebars');
    var BaseWidget = require("value-base-widget");
    var template = require("./grid-item.handlebars");
    var defaultTableBtn = {
        btnText:"button",
        type:"default",
        size:"xs",
        action:function(){
            seajs.log("按钮事件未指定","warn");
        }
    }
    var GridItem = BaseWidget.extend({
        attrs:{
            template:template,
            model:{},
            itemData:{},
            tableCfg:{}
        },
        btnMap:{},
        events:{
          "click button,.dropdown-menu a":function(e){
              var self = this;
              var $target = $(e.currentTarget),
                  btnkey = $target.data("btnkey");
              var itemData = this.get("itemData");
              var btnMap = self.btnMap,
                  handler = btnMap[btnkey];
              handler && handler.action && handler.action.call(self,itemData,$target);
          }
        },
        initAttrs:function(cfg,dataAttrsConfig){
            GridItem.superclass.initAttrs.call(this,cfg,dataAttrsConfig);
            this.setBtnMap();
            this.setModel();
        },
        setModel:function(){
            var model = this.get("model");
            model.tableCfg = this.get("tableCfg");
            model.itemData = this.get("itemData");
            model.btnList = this.getGridBtns();
        },
        setBtnMap:function(){
            var self = this;
            function setBtnTextRet(btnMeta){
                btnMeta.btnTextRet = $.result(btnMeta.btnText,self,self.get("itemData"));
            }
            var tableCfg = this.get("tableCfg");
            if(tableCfg.operators){
                var btnMap = tableCfg.operators.btnMap;
                Object.keys(btnMap).forEach(function(key){
                    var btnMeta = btnMap[key] = $.extend({},defaultTableBtn,btnMap[key]);
                    setBtnTextRet(btnMeta);
                    var dropdownItems = btnMeta.dropdownItems;
                    if(dropdownItems && dropdownItems.length){
                        dropdownItems.forEach(setBtnTextRet);
                    }
                });
                this.btnMap = tableCfg.operators.btnMap;
            }
        },
        updateSelf:function(){
            this.setBtnMap();
            var model = this.get("model");
            model.btnList = this.getGridBtns();
            this.renderPartial();
        },
        getGridBtns:function(){
            var tableCfg = this.get("tableCfg");
            var operators = tableCfg.operators;
            if(!operators){
                return;
            }
            var btnMap = this.btnMap;
            var btnsFilter = operators.btnsFilter;
            var keys = btnsFilter.call(this.get("itemData"));
            var btnList = keys.map(function(btnkey){
                var btnMeta = btnMap[btnkey];
                btnMeta["btnkey"] = btnkey;
                return btnMeta
            })
            return btnList;
        },
        templateHelpers:{
            "renderItemData":function(itemData,tableCfg){
                var tds = "";
                var cols = tableCfg.cols;
                cols.forEach(function(col){
                    var htmlText = ['<td>',format(itemData[col.property],col.format),'</td>'];
                    tds += htmlText.join("");
                });
                return new Handlebars.SafeString(tds);

                function format(displayVal,formatter){
                    return formatter ? formatter(displayVal,itemData):displayVal;
                }
            }
        }
    })
    return GridItem;
});
