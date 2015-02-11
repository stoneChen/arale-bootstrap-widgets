define("value/form-select/1.0.0/form-select-debug", [ "$-debug", "value/form/1.0.0/form-widget-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "jquery/select2/3.4.5/select2-zh-cn-debug", "./select-debug.handlebars" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var FormWidget = require("value/form/1.0.0/form-widget-debug");
    require("jquery/select2/3.4.5/select2-zh-cn-debug");
    require("jquery/select2/3.4.5/select2-debug.css");
    var template = require("./select-debug.handlebars");
    var FormSelect = FormWidget.extend({
        attrs: {
            //            select2:{//示例，既可以传true也可以传｛...｝
            //
            //            },
            template: template,
            model: {},
            verticalLayout: false,
            //纵向表单布局，即label与控件不在同一行
            selected: "",
            dataList: [],
            addNullChoice: true,
            disabled: false
        },
        actualDOM: null,
        _onChangeDataList: function() {
            var model = this.get("model");
            var dataList = this.get("dataList") || [];
            dataList = this.addNullChoice(dataList);
            model.dataList = dataList;
            this.renderPartial("select");
        },
        _onChangeSelected: function(val) {
            var model = this.get("model");
            model.selected = val;
        },
        initAttrs: function(cfg, dataAttrsConfig) {
            FormSelect.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setModel();
        },
        setModel: function() {
            //可以被子类覆盖
            var dataList = this.get("dataList");
            dataList = this.addNullChoice(dataList);
            var model = this.get("model");
            model.verticalLayout = this.get("verticalLayout");
            model.name = this.get("name");
            model.selected = this.get("selected");
            model.dataList = dataList;
            model.disabled = this.get("disabled");
        },
        addNullChoice: function(dataList) {
            var addNullChoice = this.get("addNullChoice");
            if (addNullChoice) {
                dataList = [ {
                    label: "-请选择-",
                    value: ""
                } ].concat(dataList);
            }
            return dataList;
        },
        setup: function() {
            FormSelect.superclass.setup.call(this);
            this.setActualDOM();
            var options = this.get("select2");
            if (options) {
                if (options === true) {
                    options = {};
                }
                this.actualDOM.select2(options);
            }
        },
        setActualDOM: function() {
            this.actualDOM = this.element.find("select");
        },
        templateHelpers: {
            dealSelected: function(value, selected) {
                return value == selected ? "selected" : "";
            }
        },
        valid: function() {
            return this.$("select").valid();
        },
        getValue: function() {
            var value = {};
            var val = this.$("select").val();
            if (val) {
                var name = this.get("name");
                value[name] = this.$("select").val();
            }
            return value;
        },
        clear: function() {
            this.$("select").val("");
        }
    });
    module.exports = FormSelect;
});

define("jquery/select2/3.4.5/select2-debug.css", [], function() {
    seajs.importStyle(".select2-container{margin:0;position:relative;display:inline-block;zoom:1;*display:inline;vertical-align:middle}.select2-container,.select2-drop,.select2-search,.select2-search input{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.select2-container .select2-choice{display:block;height:26px;padding:0 0 0 8px;overflow:hidden;position:relative;border:1px solid #aaa;white-space:nowrap;line-height:26px;color:#444;text-decoration:none;border-radius:4px;background-clip:padding-box;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:#fff;background-image:-webkit-gradient(linear,left bottom,left top,color-stop(0,#eee),color-stop(0.5,#fff));background-image:-webkit-linear-gradient(center bottom,#eee 0,#fff 50%);background-image:-moz-linear-gradient(center bottom,#eee 0,#fff 50%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#eeeeee', GradientType=0);background-image:linear-gradient(top,#fff 0,#eee 50%)}.select2-container.select2-drop-above .select2-choice{border-bottom-color:#aaa;border-radius:0 0 4px 4px;background-image:-webkit-gradient(linear,left bottom,left top,color-stop(0,#eee),color-stop(0.9,#fff));background-image:-webkit-linear-gradient(center bottom,#eee 0,#fff 90%);background-image:-moz-linear-gradient(center bottom,#eee 0,#fff 90%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#eeeeee', GradientType=0);background-image:linear-gradient(top,#eee 0,#fff 90%)}.select2-container.select2-allowclear .select2-choice .select2-chosen{margin-right:42px}.select2-container .select2-choice>.select2-chosen{margin-right:26px;display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.select2-container .select2-choice abbr{display:none;width:12px;height:12px;position:absolute;right:24px;top:8px;font-size:1px;text-decoration:none;border:0;background:url(https://i.alipayobjects.com/e/201310/1JC9IarS8D.png) right top no-repeat;cursor:pointer;outline:0}.select2-container.select2-allowclear .select2-choice abbr{display:inline-block}.select2-container .select2-choice abbr:hover{background-position:right -11px;cursor:pointer}.select2-drop-mask{border:0;margin:0;padding:0;position:fixed;left:0;top:0;min-height:100%;min-width:100%;height:auto;width:auto;opacity:0;z-index:9998;background-color:#fff;filter:alpha(opacity=0)}.select2-drop{width:100%;margin-top:-1px;position:absolute;z-index:9999;top:100%;background:#fff;color:#000;border:1px solid #aaa;border-top:0;border-radius:0 0 4px 4px;-webkit-box-shadow:0 4px 5px rgba(0,0,0,.15);box-shadow:0 4px 5px rgba(0,0,0,.15)}.select2-drop-auto-width{border-top:1px solid #aaa;width:auto}.select2-drop-auto-width .select2-search{padding-top:4px}.select2-drop.select2-drop-above{margin-top:1px;border-top:1px solid #aaa;border-bottom:0;border-radius:4px 4px 0 0;-webkit-box-shadow:0 -4px 5px rgba(0,0,0,.15);box-shadow:0 -4px 5px rgba(0,0,0,.15)}.select2-drop-active{border:1px solid #5897fb;border-top:0}.select2-drop.select2-drop-above.select2-drop-active{border-top:1px solid #5897fb}.select2-container .select2-choice .select2-arrow{display:inline-block;width:18px;height:100%;position:absolute;right:0;top:0;border-left:1px solid #aaa;border-radius:0 4px 4px 0;background-clip:padding-box;background:#ccc;background-image:-webkit-gradient(linear,left bottom,left top,color-stop(0,#ccc),color-stop(0.6,#eee));background-image:-webkit-linear-gradient(center bottom,#ccc 0,#eee 60%);background-image:-moz-linear-gradient(center bottom,#ccc 0,#eee 60%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#eeeeee', endColorstr='#cccccc', GradientType=0);background-image:linear-gradient(top,#ccc 0,#eee 60%)}.select2-container .select2-choice .select2-arrow b{display:block;width:100%;height:100%;background:url(https://i.alipayobjects.com/e/201310/1JC9IarS8D.png) no-repeat 0 1px}.select2-search{display:inline-block;width:100%;min-height:26px;margin:0;padding-left:4px;padding-right:4px;position:relative;z-index:10000;white-space:nowrap}.select2-search input{width:100%;height:auto!important;min-height:26px;padding:4px 20px 4px 5px;margin:0;outline:0;font-family:sans-serif;font-size:1em;border:1px solid #aaa;border-radius:0;-webkit-box-shadow:none;box-shadow:none;background:#fff url(https://i.alipayobjects.com/e/201310/1JC9IarS8D.png) no-repeat 100% -22px;background:url(https://i.alipayobjects.com/e/201310/1JC9IarS8D.png) no-repeat 100% -22px,-webkit-gradient(linear,left bottom,left top,color-stop(0.85,#fff),color-stop(0.99,#eee));background:url(https://i.alipayobjects.com/e/201310/1JC9IarS8D.png) no-repeat 100% -22px,-webkit-linear-gradient(center bottom,#fff 85%,#eee 99%);background:url(https://i.alipayobjects.com/e/201310/1JC9IarS8D.png) no-repeat 100% -22px,-moz-linear-gradient(center bottom,#fff 85%,#eee 99%);background:url(https://i.alipayobjects.com/e/201310/1JC9IarS8D.png) no-repeat 100% -22px,linear-gradient(top,#fff 85%,#eee 99%)}.select2-drop.select2-drop-above .select2-search input{margin-top:4px}.select2-search input.select2-active{background:#fff url(https://i.alipayobjects.com/e/201310/1JCGcxNz9Z.gif) no-repeat 100%;background:url(https://i.alipayobjects.com/e/201310/1JCGcxNz9Z.gif) no-repeat 100%,-webkit-gradient(linear,left bottom,left top,color-stop(0.85,#fff),color-stop(0.99,#eee));background:url(https://i.alipayobjects.com/e/201310/1JCGcxNz9Z.gif) no-repeat 100%,-webkit-linear-gradient(center bottom,#fff 85%,#eee 99%);background:url(https://i.alipayobjects.com/e/201310/1JCGcxNz9Z.gif) no-repeat 100%,-moz-linear-gradient(center bottom,#fff 85%,#eee 99%);background:url(https://i.alipayobjects.com/e/201310/1JCGcxNz9Z.gif) no-repeat 100%,linear-gradient(top,#fff 85%,#eee 99%)}.select2-container-active .select2-choice,.select2-container-active .select2-choices{border:1px solid #5897fb;outline:0;-webkit-box-shadow:0 0 5px rgba(0,0,0,.3);box-shadow:0 0 5px rgba(0,0,0,.3)}.select2-dropdown-open .select2-choice{border-bottom-color:transparent;-webkit-box-shadow:0 1px 0 #fff inset;box-shadow:0 1px 0 #fff inset;border-bottom-left-radius:0;border-bottom-right-radius:0;background-color:#eee;background-image:-webkit-gradient(linear,left bottom,left top,color-stop(0,#fff),color-stop(0.5,#eee));background-image:-webkit-linear-gradient(center bottom,#fff 0,#eee 50%);background-image:-moz-linear-gradient(center bottom,#fff 0,#eee 50%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#eeeeee', endColorstr='#ffffff', GradientType=0);background-image:linear-gradient(top,#fff 0,#eee 50%)}.select2-dropdown-open.select2-drop-above .select2-choice,.select2-dropdown-open.select2-drop-above .select2-choices{border:1px solid #5897fb;border-top-color:transparent;background-image:-webkit-gradient(linear,left top,left bottom,color-stop(0,#fff),color-stop(0.5,#eee));background-image:-webkit-linear-gradient(center top,#fff 0,#eee 50%);background-image:-moz-linear-gradient(center top,#fff 0,#eee 50%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#eeeeee', endColorstr='#ffffff', GradientType=0);background-image:linear-gradient(bottom,#fff 0,#eee 50%)}.select2-dropdown-open .select2-choice .select2-arrow{background:transparent;border-left:0;filter:none}.select2-dropdown-open .select2-choice .select2-arrow b{background-position:-18px 1px}.select2-results{max-height:200px;padding:0 0 0 4px;margin:4px 4px 4px 0;position:relative;overflow-x:hidden;overflow-y:auto;-webkit-tap-highlight-color:rgba(0,0,0,0)}.select2-results ul.select2-result-sub{margin:0;padding-left:0}.select2-results ul.select2-result-sub>li .select2-result-label{padding-left:20px}.select2-results ul.select2-result-sub ul.select2-result-sub>li .select2-result-label{padding-left:40px}.select2-results ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub>li .select2-result-label{padding-left:60px}.select2-results ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub>li .select2-result-label{padding-left:80px}.select2-results ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub>li .select2-result-label{padding-left:100px}.select2-results ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub>li .select2-result-label{padding-left:110px}.select2-results ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub ul.select2-result-sub>li .select2-result-label{padding-left:120px}.select2-results li{list-style:none;display:list-item;background-image:none}.select2-results li.select2-result-with-children>.select2-result-label{font-weight:700}.select2-results .select2-result-label{padding:3px 7px 4px;margin:0;cursor:pointer;min-height:1em;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.select2-results .select2-highlighted{background:#3875d7;color:#fff}.select2-results li em{background:#feffde;font-style:normal}.select2-results .select2-highlighted em{background:transparent}.select2-results .select2-highlighted ul{background:#fff;color:#000}.select2-results .select2-no-results,.select2-results .select2-searching,.select2-results .select2-selection-limit{background:#f4f4f4;display:list-item}.select2-results .select2-disabled.select2-highlighted{color:#666;background:#f4f4f4;display:list-item;cursor:default}.select2-results .select2-disabled{background:#f4f4f4;display:list-item;cursor:default}.select2-results .select2-selected{display:none}.select2-more-results.select2-active{background:#f4f4f4 url(https://i.alipayobjects.com/e/201310/1JCGcxNz9Z.gif) no-repeat 100%}.select2-more-results{background:#f4f4f4;display:list-item}.select2-container.select2-container-disabled .select2-choice{background-color:#f4f4f4;background-image:none;border:1px solid #ddd;cursor:default}.select2-container.select2-container-disabled .select2-choice .select2-arrow{background-color:#f4f4f4;background-image:none;border-left:0}.select2-container.select2-container-disabled .select2-choice abbr{display:none}.select2-container-multi .select2-choices{height:auto!important;height:1%;margin:0;padding:0;position:relative;border:1px solid #aaa;cursor:text;overflow:hidden;background-color:#fff;background-image:-webkit-gradient(linear,0 0,0 100%,color-stop(1%,#eee),color-stop(15%,#fff));background-image:-webkit-linear-gradient(top,#eee 1%,#fff 15%);background-image:-moz-linear-gradient(top,#eee 1%,#fff 15%);background-image:linear-gradient(top,#eee 1%,#fff 15%)}.select2-locked{padding:3px 5px!important}.select2-container-multi .select2-choices{min-height:26px}.select2-container-multi.select2-container-active .select2-choices{border:1px solid #5897fb;outline:0;-webkit-box-shadow:0 0 5px rgba(0,0,0,.3);box-shadow:0 0 5px rgba(0,0,0,.3)}.select2-container-multi .select2-choices li{float:left;list-style:none}.select2-container-multi .select2-choices .select2-search-field{margin:0;padding:0;white-space:nowrap}.select2-container-multi .select2-choices .select2-search-field input{padding:5px;margin:1px 0;font-family:sans-serif;font-size:100%;color:#666;outline:0;border:0;-webkit-box-shadow:none;box-shadow:none;background:transparent!important}.select2-container-multi .select2-choices .select2-search-field input.select2-active{background:#fff url(https://i.alipayobjects.com/e/201310/1JCGcxNz9Z.gif) no-repeat 100%!important}.select2-default{color:#999!important}.select2-container-multi .select2-choices .select2-search-choice{padding:3px 5px 3px 18px;margin:3px 0 3px 5px;position:relative;line-height:13px;color:#333;cursor:default;border:1px solid #aaa;border-radius:3px;-webkit-box-shadow:0 0 2px #fff inset,0 1px 0 rgba(0,0,0,.05);box-shadow:0 0 2px #fff inset,0 1px 0 rgba(0,0,0,.05);background-clip:padding-box;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:#e4e4e4;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#eeeeee', endColorstr='#f4f4f4', GradientType=0);background-image:-webkit-gradient(linear,0 0,0 100%,color-stop(20%,#f4f4f4),color-stop(50%,#f0f0f0),color-stop(52%,#e8e8e8),color-stop(100%,#eee));background-image:-webkit-linear-gradient(top,#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-image:-moz-linear-gradient(top,#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-image:linear-gradient(top,#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%)}.select2-container-multi .select2-choices .select2-search-choice .select2-chosen{cursor:default}.select2-container-multi .select2-choices .select2-search-choice-focus{background:#d4d4d4}.select2-search-choice-close{display:block;width:12px;height:13px;position:absolute;right:3px;top:4px;font-size:1px;outline:0;background:url(https://i.alipayobjects.com/e/201310/1JC9IarS8D.png) right top no-repeat}.select2-container-multi .select2-search-choice-close{left:3px}.select2-container-multi .select2-choices .select2-search-choice .select2-search-choice-close:hover{background-position:right -11px}.select2-container-multi .select2-choices .select2-search-choice-focus .select2-search-choice-close{background-position:right -11px}.select2-container-multi.select2-container-disabled .select2-choices{background-color:#f4f4f4;background-image:none;border:1px solid #ddd;cursor:default}.select2-container-multi.select2-container-disabled .select2-choices .select2-search-choice{padding:3px 5px;border:1px solid #ddd;background-image:none;background-color:#f4f4f4}.select2-container-multi.select2-container-disabled .select2-choices .select2-search-choice .select2-search-choice-close{display:none;background:0}.select2-result-selectable .select2-match,.select2-result-unselectable .select2-match{text-decoration:underline}.select2-offscreen,.select2-offscreen:focus{clip:rect(0 0 0 0)!important;width:1px!important;height:1px!important;border:0!important;margin:0!important;padding:0!important;overflow:hidden!important;position:absolute!important;outline:0!important;left:0!important;top:0!important}.select2-display-none{display:none}.select2-measure-scrollbar{position:absolute;top:-10000px;left:-10000px;width:100px;height:100px;overflow:scroll}@media only screen and (-webkit-min-device-pixel-ratio:1.5),only screen and (min-resolution:144dpi){.select2-search input,.select2-search-choice-close,.select2-container .select2-choice abbr,.select2-container .select2-choice .select2-arrow b{background-image:url(https://i.alipayobjects.com/e/201310/1JCHRnbuYf.png)!important;background-repeat:no-repeat!important;background-size:60px 40px!important}.select2-search input{background-position:100% -21px!important}}");
});

define("value/form-select/1.0.0/select-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, stack2, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing, self = this;
        function program1(depth0, data) {
            return "vertical-form-group";
        }
        function program3(depth0, data) {
            return "disabled";
        }
        function program5(depth0, data, depth1) {
            var buffer = "", stack1, stack2, options;
            buffer += '\n            <option value="';
            if (stack1 = helpers.value) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.value;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" ';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.dealSelected, stack1 ? stack1.call(depth0, depth0.value, depth1.selected, options) : helperMissing.call(depth0, "dealSelected", depth0.value, depth1.selected, options))) + ">";
            if (stack2 = helpers.label) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.label;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + "</option>\n        ";
            return buffer;
        }
        buffer += '<div class="form-group ';
        stack1 = helpers["if"].call(depth0, depth0.verticalLayout, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '">\n    <label class="col-xs-2 control-label ' + escapeExpression((stack1 = (stack1 = depth0.label, 
        stack1 == null || stack1 === false ? stack1 : stack1.requiredCls), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = (stack1 = depth0.label, 
        stack1 == null || stack1 === false ? stack1 : stack1.text), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '</label>\n\n    <div class="col-xs-10">\n        <select class="form-control" name="';
        if (stack2 = helpers.name) {
            stack2 = stack2.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack2 = depth0.name;
            stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
        }
        buffer += escapeExpression(stack2) + '" ';
        stack2 = helpers["if"].call(depth0, depth0.disabled, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += ">\n        ";
        stack2 = helpers.each.call(depth0, depth0.dataList, {
            hash: {},
            inverse: self.noop,
            fn: self.programWithDepth(5, program5, data, depth0),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += "\n        </select>\n    </div>\n</div>\n";
        return buffer;
    });
});
