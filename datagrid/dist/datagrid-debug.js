define("value/datagrid/1.0.0/datagrid-debug", [ "$-debug", "gallery/backbone/1.1.0/backbone-debug", "gallery/underscore/1.5.2/underscore-debug", "value/datasource/1.0.0/datasource-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "value/form-text/1.0.0/form-text-debug", "value/form/1.0.0/form-widget-debug", "gallery/handlebars/1.0.2/runtime-debug", "./data-grid-text-debug.handlebars", "value/form-select/1.0.0/form-select-debug", "jquery/select2/3.4.5/select2-zh-cn-debug", "./data-grid-select-debug.handlebars", "value/form-buttons/1.0.0/form-buttons-debug", "./data-grid-buttons-debug.handlebars", "value/form-radio/1.0.0/form-radio-debug", "value/form-checkbox/1.0.0/form-checkbox-debug", "./grid-item/grid-item-debug", "./grid-item/grid-item-debug.handlebars", "value/paginator/1.0.0/paginator-debug", "./data-grid-debug.handlebars" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var BackboneHistory = require("gallery/backbone/1.1.0/backbone-debug").history;
    var DataSource = require("value/datasource/1.0.0/datasource-debug");
    var BaseWidget = require("value/base/1.0.0/base-debug");
    var FormText = require("value/form-text/1.0.0/form-text-debug");
    var textTemplate = require("./data-grid-text-debug.handlebars");
    var FormSelect = require("value/form-select/1.0.0/form-select-debug");
    var selectTemplate = require("./data-grid-select-debug.handlebars");
    var FormButtons = require("value/form-buttons/1.0.0/form-buttons-debug");
    var ButtonsTemplate = require("./data-grid-buttons-debug.handlebars");
    var FormRadio = require("value/form-radio/1.0.0/form-radio-debug");
    var FormCheckbox = require("value/form-checkbox/1.0.0/form-checkbox-debug");
    var GridItem = require("./grid-item/grid-item-debug");
    var Paginator = require("value/paginator/1.0.0/paginator-debug");
    var template = require("./data-grid-debug.handlebars");
    var instances = {};
    var getCurFragment = function() {
        return BackboneHistory.fragment;
    };
    var searchDataStorageMap = {};
    //以页面hash为key存储搜索条件记录，前提为每个页面最多只出现一个datagrid，否则会有问题
    var searchDataStorage;
    //搜索条件记录，由于从list到view或new等，再回到list会创建新实例，所以不能放在实例上
    var Datagrid = BaseWidget.extend({
        attrs: {
            parentNode: null,
            template: template,
            model: {},
            url: "",
            urlIds: [],
            queryParams: {},
            hasPaginator: true,
            paginatorCfg: {
                targetPage: 1,
                pageSize: 15,
                symbolMapping: {
                    previous: '<span class="glyphicon glyphicon-arrow-left"></span> 上一页',
                    next: '下一页 <span class="glyphicon glyphicon-arrow-right"></span>'
                }
            },
            //            topOperation:{
            //                searchGroup:{
            //                    input:{
            //                        name:""
            //                    },
            //                    select:false,
            //                    searchBtn:true
            //                },
            //                btnsGroup:[
            ////                    {
            ////                        href:"#new",
            ////                        text:"新增"
            ////                    }
            //                ]
            ////                ,filtersGroup:[
            ////                    {
            ////                        name:"",
            ////                        type:"radio",
            ////                        dataList:[]
            ////                    }
            ////                ]
            //            },
            tableCfg: {
                cols: []
            }
        },
        paginator: null,
        tableBtns: null,
        groupBtns: null,
        $searchGroup: null,
        $filterGroup: null,
        formWidgets: {},
        searchDOM: null,
        events: {
            "keyup input.keywords": function(event) {
                if (event.which === 13) {
                    this.doSearch();
                }
            },
            "click input:checkbox,input:radio": function() {
                this.doSearch();
            },
            "click .top-operation .btn-group a": function(e) {
                var self = this;
                var $target = $(e.currentTarget), btnkey = $target.data("btnkey");
                var handler = this.groupBtns[btnkey];
                handler && handler.action && handler.action.call(self, $target);
            }
        },
        initAttrs: function(cfg, dataAttrsConfig) {
            Datagrid.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            instances[this.cid] = this;
            //注册this
            this.setModel();
            this._initDataSource();
            this.setSearchDataStorage();
        },
        setSearchDataStorage: function() {
            var fragment = getCurFragment();
            searchDataStorage = searchDataStorageMap[fragment] || {};
        },
        registerWidget: function(name, inst) {
            inst.set("dataGrid", this);
            this.formWidgets[name] = inst;
        },
        getWidget: function(name) {
            return this.formWidgets[name];
        },
        setModel: function() {
            var model = {
                cid: this.cid,
                topOperation: this.get("topOperation"),
                tableCfg: this.get("tableCfg")
            };
            this.set("model", model);
        },
        setup: function() {
            this.$searchGroup = this.$("div.search-group");
            this.$filterGroup = this.$("div.filter-group");
            var topOperation = this.get("topOperation");
            if (topOperation) {
                this._initTopOperation();
                this._convertGroupBtns();
            }
            this._convertTableBtns();
            this.initPaginator();
            Datagrid.superclass.setup.call(this);
        },
        initPaginator: function() {
            var self = this;
            var hasPaginator = this.get("hasPaginator");
            if (!hasPaginator) {
                return;
            }
            this.paginator = new Paginator({
                parentNode: this.$("div.paginator-wrapper"),
                pageClick: function(targetPage) {
                    self.doSearch(targetPage);
                }
            });
        },
        _convertTableBtns: function() {
            var tableCfg = this.get("tableCfg");
            if (!tableCfg.operators) {
                return;
            }
            this.tableBtns = tableCfg.operators.btnMap;
        },
        _convertGroupBtns: function() {
            //按钮组的事件提取
            var topOperation = this.get("topOperation");
            var btnsGroup = topOperation.btnsGroup;
            var groupBtns = {};
            btnsGroup && btnsGroup.forEach(function(btnCfg) {
                if (btnCfg.btnkey) {
                    groupBtns[btnCfg.btnkey] = btnCfg;
                }
            });
            this.groupBtns = groupBtns;
        },
        _initTopOperation: function() {
            //todo 传入组件对象还是配置对象，传入组件对象调用成本过高，传入配置对象，灵活性变差
            var topOperation = this.get("topOperation");
            var search = topOperation.searchGroup, filters = topOperation.filtersGroup;
            search && this._initSearchGroup(search);
            filters && this._initFiltersGroup(filters);
        },
        _initSearchGroup: function(search) {
            var self = this;
            //由于需要扩展searchGroup，将这三个控件分开调用方法初始化，外部调用datagrid时，可以使用instance.before，可以使用instance.after方法自由调整控件顺序
            self.insertSearchText(search);
            self.insertSearchSelect(search);
            self.insertSeachBtn(search);
        },
        insertSearchText: function(search) {
            var self = this;
            if (search.input) {
                var textName = search.input.name;
                var value = decodeURIComponent(searchDataStorage[textName] || "");
                var textObj = new FormText({
                    template: textTemplate,
                    name: textName,
                    value: value,
                    nodeData: search.input.nodeData,
                    needEncode: true
                });
                self.insertSearchWidget(textName, textObj);
            }
        },
        insertSearchSelect: function(search) {
            var self = this;
            if (search.select) {
                var selectName = search.select.name;
                var selectObj = new FormSelect($.extend(true, search.select, {
                    selected: searchDataStorage[selectName],
                    addNullChoice: search.select.addNullChoice,
                    template: selectTemplate
                }));
                self.insertSearchWidget(selectName, selectObj);
            }
        },
        insertSeachBtn: function(search) {
            var self = this;
            if (search.searchBtn) {
                var btnName = "data-grid-btn";
                var btnObj = new FormButtons({
                    template: ButtonsTemplate,
                    btns: [ {
                        btnkey: btnName,
                        text: "搜索",
                        type: "default",
                        handler: function($target) {
                            self.doSearch();
                        }
                    } ]
                });
                self.insertSearchWidget(btnName, btnObj);
            }
        },
        insertSearchWidget: function(wName, wObj) {
            var self = this;
            self.registerWidget(wName, wObj);
            self.$searchGroup.append(wObj.element);
        },
        _initFiltersGroup: function(filters) {
            var self = this;
            filters.forEach(function(filter) {
                var wObj, name = filter.name;
                var type = filter.type;
                filter.checked = filter.checked || searchDataStorage[name];
                if (type == "radio") {
                    wObj = new FormRadio(filter);
                } else if (type == "checkbox") {
                    wObj = new FormCheckbox(filter);
                } else {
                    seajs.log("过滤组type错误：" + type, "error");
                    return;
                }
                self.registerWidget(name, wObj);
                self.$filterGroup.append(wObj.element);
            });
        },
        _initDataSource: function() {
            var self = this;
            var url = this.get("url");
            var ids = this.get("urlIds");
            var ds = this.dataSource = new DataSource({
                source: function(query, done) {
                    $.extend(true, query, self.get("queryParams"));
                    $.eduAjax({
                        url: url,
                        ids: ids,
                        rest: "get",
                        data: query,
                        done: function(data) {
                            done(data);
                        }
                    });
                }
            });
            ds.on("data", this._setResult.bind(self));
        },
        getSearchData: function() {
            var data = {};
            var formWidgets = this.formWidgets;
            Object.keys(formWidgets).forEach(function(name) {
                $.extend(data, formWidgets[name].getValue());
            });
            return data;
        },
        _setResult: function(data) {
            this.renderTable(data.collection);
            this.renderPagination(data);
        },
        renderTable: function(collection) {
            var self = this;
            var tableCfg = self.get("tableCfg");
            var cols = tableCfg.cols;
            var $fragment = $.getDocFragment();
            if (collection.length) {
                collection.forEach(function(itemData) {
                    new GridItem({
                        parentNode: $fragment,
                        tableCfg: tableCfg,
                        itemData: itemData
                    });
                });
            } else {
                $fragment.append('<tr><td colspan="' + (cols.length + 1) + '"><div class="">查询无结果</div></td></tr>');
            }
            this.$("tbody").empty().append($fragment);
        },
        renderPagination: function(data) {
            var hasPaginator = this.get("hasPaginator");
            if (!hasPaginator) {
                return;
            }
            this.paginator.set("renderData", {
                totalCount: data.totalCount,
                currentPage: data.currentPage,
                totalPages: data.totalPages
            });
        },
        doSearch: function(targetPage) {
            targetPage = targetPage || 1;
            var searchData = this.getSearchData();
            searchData["currentPage"] = targetPage;
            this.recordSearchData(searchData);
            this.dataSource.getData(searchData);
        },
        recordSearchData: function(searchData) {
            var fragment = getCurFragment();
            searchDataStorage = searchDataStorageMap[fragment] = searchData;
        },
        fetch: function() {
            this.doSearch(searchDataStorage["currentPage"] || 1);
        }
    });
    return Datagrid;
});

define("value/datagrid/1.0.0/data-grid-text-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
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
            buffer += escapeExpression((stack1 = data.key, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '="' + escapeExpression(typeof depth0 === functionType ? depth0.apply(depth0) : depth0) + '"';
            return buffer;
        }
        buffer += '<div class="search-item">\r\n    <input type="text" class="form-control keywords" name="';
        if (stack1 = helpers.name) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.name;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" value="';
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
        stack1 = helpers.each.call(depth0, depth0.nodeData, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += " />\r\n</div>";
        return buffer;
    });
});

define("value/datagrid/1.0.0/data-grid-select-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing, self = this;
        function program1(depth0, data, depth1) {
            var buffer = "", stack1, stack2, options;
            buffer += '\r\n            <option value="';
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
            buffer += escapeExpression(stack2) + "</option>\r\n        ";
            return buffer;
        }
        buffer += '<div class="search-item">\r\n    <select class="form-control">\r\n        ';
        stack1 = helpers.each.call(depth0, depth0.dataList, {
            hash: {},
            inverse: self.noop,
            fn: self.programWithDepth(1, program1, data, depth0),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n    </select>\r\n</div>";
        return buffer;
    });
});

define("value/datagrid/1.0.0/data-grid-buttons-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
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
            buffer += '\r\n        <button type="button" class="btn btn-';
            if (stack1 = helpers.type) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.type;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + ' search-btn" data-btnkey="';
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
            if (stack1 = helpers.text) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.text;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "</button>\r\n    ";
            return buffer;
        }
        buffer += '<div class="search-item">\r\n    ';
        stack1 = helpers.each.call(depth0, depth0.btns, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n</div>\r\n";
        return buffer;
    });
});

define("value/datagrid/1.0.0/grid-item/grid-item-debug", [ "$-debug", "gallery/handlebars/1.0.2/runtime-debug", "value/base/1.0.0/base-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var BaseWidget = require("value/base/1.0.0/base-debug");
    var template = require("value/datagrid/1.0.0/grid-item/grid-item-debug.handlebars");
    var defaultTableBtn = {
        btnText: "button",
        type: "default",
        size: "xs",
        action: function() {
            seajs.log("按钮事件未指定", "warn");
        }
    };
    var GridItem = BaseWidget.extend({
        attrs: {
            template: template,
            model: {},
            itemData: {},
            tableCfg: {}
        },
        btnMap: {},
        events: {
            "click button,.dropdown-menu a": function(e) {
                var self = this;
                var $target = $(e.currentTarget), btnkey = $target.data("btnkey");
                var itemData = this.get("itemData");
                var btnMap = self.btnMap, handler = btnMap[btnkey];
                handler && handler.action && handler.action.call(self, itemData, $target);
            }
        },
        initAttrs: function(cfg, dataAttrsConfig) {
            GridItem.superclass.initAttrs.call(this, cfg, dataAttrsConfig);
            this.setBtnMap();
            this.setModel();
        },
        setModel: function() {
            var model = this.get("model");
            model.tableCfg = this.get("tableCfg");
            model.itemData = this.get("itemData");
            model.btnList = this.getGridBtns();
        },
        setBtnMap: function() {
            var self = this;
            function setBtnTextRet(btnMeta) {
                btnMeta.btnTextRet = $.result(btnMeta.btnText, self, self.get("itemData"));
            }
            var tableCfg = this.get("tableCfg");
            if (tableCfg.operators) {
                var btnMap = tableCfg.operators.btnMap;
                Object.keys(btnMap).forEach(function(key) {
                    var btnMeta = btnMap[key] = $.extend({}, defaultTableBtn, btnMap[key]);
                    setBtnTextRet(btnMeta);
                    var dropdownItems = btnMeta.dropdownItems;
                    if (dropdownItems && dropdownItems.length) {
                        dropdownItems.forEach(setBtnTextRet);
                    }
                });
                this.btnMap = tableCfg.operators.btnMap;
            }
        },
        updateSelf: function() {
            this.setBtnMap();
            var model = this.get("model");
            model.btnList = this.getGridBtns();
            this.renderPartial();
        },
        getGridBtns: function() {
            var tableCfg = this.get("tableCfg");
            var operators = tableCfg.operators;
            if (!operators) {
                return;
            }
            var btnMap = this.btnMap;
            var btnsFilter = operators.btnsFilter;
            var keys = btnsFilter.call(this.get("itemData"));
            var btnList = keys.map(function(btnkey) {
                var btnMeta = btnMap[btnkey];
                btnMeta["btnkey"] = btnkey;
                return btnMeta;
            });
            return btnList;
        },
        templateHelpers: {
            renderItemData: function(itemData, tableCfg) {
                var tds = "";
                var cols = tableCfg.cols;
                cols.forEach(function(col) {
                    var htmlText = [ "<td>", format(itemData[col.property], col.format), "</td>" ];
                    tds += htmlText.join("");
                });
                return new Handlebars.SafeString(tds);
                function format(displayVal, formatter) {
                    return formatter ? formatter(displayVal, itemData) : displayVal;
                }
            }
        }
    });
    return GridItem;
});

define("value/datagrid/1.0.0/grid-item/grid-item-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, stack2, options, functionType = "function", escapeExpression = this.escapeExpression, self = this, helperMissing = helpers.helperMissing;
        function program1(depth0, data, depth1) {
            var buffer = "", stack1;
            buffer += "\n        <td>\n            ";
            stack1 = helpers.each.call(depth0, depth1.btnList, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n        </td>\n    ";
            return buffer;
        }
        function program2(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n                ";
            stack1 = helpers["if"].call(depth0, depth0.dropdown, {
                hash: {},
                inverse: self.program(6, program6, data),
                fn: self.program(3, program3, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n            ";
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n                    <div class="btn-group">\n                        <a href="javascript:void(0)" class="btn btn-';
            if (stack1 = helpers.type) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.type;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + " btn-";
            if (stack1 = helpers.size) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.size;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + ' dropdown-toggle" data-toggle="dropdown">\n                            ';
            if (stack1 = helpers.btnTextRet) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.btnTextRet;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '\n                            <span class="caret"></span>\n                        </a>\n                        <ul class="dropdown-menu">\n\n                        ';
            stack1 = helpers.each.call(depth0, depth0.dropdownItems, {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n                        </ul>\n                    </div>\n                ";
            return buffer;
        }
        function program4(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n                            <li>\n                                <a href="javascript:void(0)" data-btnkey="';
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
            if (stack1 = helpers.btnTextRet) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.btnTextRet;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</a>\n                            </li>\n                        ";
            return buffer;
        }
        function program6(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n                <button type="button" class="btn btn-';
            if (stack1 = helpers.size) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.size;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + " btn-";
            if (stack1 = helpers.type) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.type;
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
            buffer += escapeExpression(stack1) + '" >';
            if (stack1 = helpers.btnTextRet) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.btnTextRet;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "</button>&nbsp;\n                ";
            return buffer;
        }
        buffer += "<tr>\n    ";
        options = {
            hash: {},
            data: data
        };
        buffer += escapeExpression((stack1 = helpers.renderItemData, stack1 ? stack1.call(depth0, depth0.itemData, depth0.tableCfg, options) : helperMissing.call(depth0, "renderItemData", depth0.itemData, depth0.tableCfg, options))) + "\n\n    ";
        stack2 = helpers["if"].call(depth0, (stack1 = depth0.tableCfg, stack1 == null || stack1 === false ? stack1 : stack1.operators), {
            hash: {},
            inverse: self.noop,
            fn: self.programWithDepth(1, program1, data, depth0),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += "\n</tr>\n";
        return buffer;
    });
});

define("value/datagrid/1.0.0/data-grid-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, stack2, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1, stack2;
            buffer += '\r\n        <div class="top-operation">\r\n            ' + "\r\n            ";
            stack2 = helpers["if"].call(depth0, (stack1 = depth0.topOperation, stack1 == null || stack1 === false ? stack1 : stack1.btnsGroup), {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\r\n            " + "\r\n            ";
            stack2 = helpers["if"].call(depth0, (stack1 = depth0.topOperation, stack1 == null || stack1 === false ? stack1 : stack1.searchGroup), {
                hash: {},
                inverse: self.noop,
                fn: self.program(5, program5, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\r\n            " + "\r\n            ";
            stack2 = helpers["if"].call(depth0, (stack1 = depth0.topOperation, stack1 == null || stack1 === false ? stack1 : stack1.filtersGroup), {
                hash: {},
                inverse: self.noop,
                fn: self.program(7, program7, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\r\n        </div>\r\n    ";
            return buffer;
        }
        function program2(depth0, data) {
            var buffer = "", stack1, stack2;
            buffer += '\r\n                <div class="btn-group pull-right">\r\n                    ';
            stack2 = helpers.each.call(depth0, (stack1 = depth0.topOperation, stack1 == null || stack1 === false ? stack1 : stack1.btnsGroup), {
                hash: {},
                inverse: self.noop,
                fn: self.program(3, program3, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\r\n                </div>\r\n            ";
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n                        <a class="btn btn-default" href="';
            if (stack1 = helpers.href) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.href;
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
            if (stack1 = helpers.text) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.text;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "</a>\r\n                    ";
            return buffer;
        }
        function program5(depth0, data) {
            return '\r\n                <div class="search-group clearfix">\r\n                </div>\r\n            ';
        }
        function program7(depth0, data) {
            return '\r\n                <div class="filter-group form-horizontal">\r\n                </div>\r\n            ';
        }
        function program9(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n                    <th width="';
            if (stack1 = helpers.width) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.width;
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
            buffer += escapeExpression(stack1) + "</th>\r\n                ";
            return buffer;
        }
        function program11(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n                    <th width="' + escapeExpression((stack1 = (stack1 = (stack1 = (stack1 = depth0.tableCfg, 
            stack1 == null || stack1 === false ? stack1 : stack1.operators), stack1 == null || stack1 === false ? stack1 : stack1.col), 
            stack1 == null || stack1 === false ? stack1 : stack1.width), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = (stack1 = (stack1 = (stack1 = depth0.tableCfg, 
            stack1 == null || stack1 === false ? stack1 : stack1.operators), stack1 == null || stack1 === false ? stack1 : stack1.col), 
            stack1 == null || stack1 === false ? stack1 : stack1.text), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</th>\r\n                ";
            return buffer;
        }
        buffer += '<div class="data-grid">\r\n    ';
        stack1 = helpers["if"].call(depth0, depth0.topOperation, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n    <div class="datagrid-result mrgb10">\r\n        <table class="table table-bordered table-hover">\r\n            <thead>\r\n            <tr>\r\n                ';
        stack2 = helpers.each.call(depth0, (stack1 = depth0.tableCfg, stack1 == null || stack1 === false ? stack1 : stack1.cols), {
            hash: {},
            inverse: self.noop,
            fn: self.program(9, program9, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += "\r\n                ";
        stack2 = helpers["if"].call(depth0, (stack1 = depth0.tableCfg, stack1 == null || stack1 === false ? stack1 : stack1.operators), {
            hash: {},
            inverse: self.noop,
            fn: self.program(11, program11, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '\r\n            </tr>\r\n            </thead>\r\n\r\n            <tbody>\r\n            </tbody>\r\n\r\n        </table>\r\n        <div class="paginator-wrapper pull-right"></div>\r\n    </div>\r\n</div>';
        return buffer;
    });
});
