define("value/paginator/1.0.0/paginator-debug", [ "$-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./paginator-debug.handlebars" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var BaseWidget = require("value/base/1.0.0/base-debug");
    var template = require("./paginator-debug.handlebars");
    var Paginator = BaseWidget.extend({
        attrs: {
            template: template,
            model: {},
            pageSize: 15,
            symbolMapping: {
                previous: '<span class="glyphicon glyphicon-arrow-left"></span> 上一页',
                next: '下一页 <span class="glyphicon glyphicon-arrow-right"></span>'
            },
            renderData: {},
            pageClick: function() {}
        },
        events: {
            "click .normal a": function(ev) {
                var $target = $(ev.currentTarget);
                var callback = this.get("pageClick");
                callback.call(this, $target.data("target"));
            }
        },
        //        setup:function(){
        //
        //        }
        _onChangeRenderData: function(data) {
            var cur = data.currentPage;
            var total = data.totalPages;
            var totalCount = data.totalCount;
            var previosPage = cur - 1;
            //Math.max((cur - 1), 1);
            var nextPage = cur + 1;
            //Math.min((cur + 1), total);
            function getStat(type) {
                var flag;
                if (type == "previous") {
                    flag = cur > 1;
                } else {
                    flag = total > 1 && cur < total;
                }
                return flag ? "normal" : "disabled";
            }
            var symbolMapping = this.get("symbolMapping");
            var pagination;
            if (totalCount) {
                pagination = {
                    totalCount: totalCount,
                    currentPage: cur,
                    totalPages: total,
                    pages: [ {
                        stat: getStat("previous"),
                        text: symbolMapping.previous,
                        target: previosPage
                    }, {
                        stat: getStat("next"),
                        text: symbolMapping.next,
                        target: nextPage
                    } ]
                };
            } else {
                pagination = null;
            }
            var model = this.get("model");
            model.pagination = pagination;
            this.renderPartial();
        }
    });
    return Paginator;
});

define("value/paginator/1.0.0/paginator-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
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
            var buffer = "", stack1, stack2;
            buffer += '\n    <div class="pagenation-info">\n        当前第 ' + escapeExpression((stack1 = (stack1 = depth0.pagination, 
            stack1 == null || stack1 === false ? stack1 : stack1.currentPage), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + " 页 , 共 " + escapeExpression((stack1 = (stack1 = depth0.pagination, 
            stack1 == null || stack1 === false ? stack1 : stack1.totalPages), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + " 页 , 总计 " + escapeExpression((stack1 = (stack1 = depth0.pagination, 
            stack1 == null || stack1 === false ? stack1 : stack1.totalCount), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + ' 条\n    </div>\n    <ul class="pagination">\n        ';
            stack2 = helpers.each.call(depth0, (stack1 = depth0.pagination, stack1 == null || stack1 === false ? stack1 : stack1.pages), {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\n    </ul>\n";
            return buffer;
        }
        function program2(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n            <li class="';
            if (stack1 = helpers.stat) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.stat;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">\n                <a href="javascript:void(';
            if (stack1 = helpers.target) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.target;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + ')" data-target="';
            if (stack1 = helpers.target) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.target;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">';
            if (stack1 = helpers.text) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.text;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</a>\n            </li>\n        ";
            return buffer;
        }
        buffer += '<div class="pagenation-component">\n';
        stack1 = helpers["if"].call(depth0, depth0.pagination, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n</div>\n";
        return buffer;
    });
});
