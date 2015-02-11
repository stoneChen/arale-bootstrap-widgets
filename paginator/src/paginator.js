define(function (require, exports, module) {
    "use strict";
    var $ = require('$');
    var BaseWidget = require("value-base");
    var template = require("./paginator.handlebars");
    var Paginator = BaseWidget.extend({
        attrs:{
            template:template,
            model:{},
            pageSize:15,
            symbolMapping:{
                previous: '<span class="glyphicon glyphicon-arrow-left"></span> 上一页',
                next: '下一页 <span class="glyphicon glyphicon-arrow-right"></span>'
            },
            renderData:{
//                totalCount:0,
//                currentPage:1,
//                totalPages:5
            },
            pageClick:function(){}
        },
        events:{
            "click .normal a":function(ev){
                var $target = $(ev.currentTarget);
                var callback = this.get("pageClick");
                callback.call(this,$target.data("target"));
            }
        },
//        setup:function(){
//
//        }
        _onChangeRenderData:function(data){
            var cur = data.currentPage;
            var total = data.totalPages;
            var totalCount = data.totalCount;
            var previosPage = cur - 1;//Math.max((cur - 1), 1);
            var nextPage = cur + 1;//Math.min((cur + 1), total);
            function getStat(type) {
                var flag;
                if (type == "previous") {
                    flag = cur > 1;
                } else {
                    flag = (total > 1) && (cur < total);
                }
                return flag ? "normal" : "disabled";
            }
            var symbolMapping = this.get("symbolMapping");
            var pagination;
            if(totalCount){
                pagination =  {
                    totalCount:totalCount,
                    currentPage:cur,
                    totalPages:total,
                    pages:[
                        {
                            stat: getStat('previous'),
                            text: symbolMapping.previous,
                            target:previosPage
                        },
                        {
                            stat: getStat('next'),
                            text: symbolMapping.next,
                            target:nextPage
                        }
                    ]
                };
            }else{
                pagination = null;
            }
            var model = this.get("model");
            model.pagination = pagination;
            this.renderPartial();
        }
    })
    return Paginator;
});