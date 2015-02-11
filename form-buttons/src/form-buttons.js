define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var FormWidget = require("value-form-widget");

    var template = require("./buttons.handlebars");
    var FormButton = FormWidget.extend({
        attrs: {
            template: template,
            model: {},
            fullXControl:false,//100%宽度，添加form-control className
            verticalLayout:false,//纵向表单布局，即label与控件不在同一行
            offsetType:2,
            btns: [//涉及到按钮顺序,所以需要是数组
//                {                     //对象demo
//                    btnkey: "save",
//                    text: "保存",
//                    type: "primary",
//                    handler: function ($target) {
//                        this.get("form").submit();
//                    }
//                }
            ]
        },
        initAttrs: function (cfg, dataAttrsConfig) {
            FormButton.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setModel();
        },
        setModel:function(){
            var model = this.get("model");
            model.btns = this.get("btns");
            model.verticalLayout = this.get("verticalLayout");
            model.offsetType = this.get("offsetType");
        },
        setup:function(){
            FormButton.superclass.setup.call(this);
            this.convertBtnsToObj();
        },
        convertBtnsToObj:function(){//使按钮查找handler更快
            var btns = this.get("btns");
            var btnsObj = {};
            btns.forEach(function(b){
                btnsObj[b.btnkey] = b;
            });
            this.set("btns",btnsObj);
        },
        getValue:function(){},
        clear:function(){}
    })
    module.exports = FormButton;
});