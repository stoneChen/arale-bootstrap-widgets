define(function (require, exports, module) {
    "use strict";
    var $ = require("$");
    var BackboneHistory = require("backbone").history;
    var DataSource = require("value-data-source");
    var BaseWidget = require("value-base-widget");

    var FormText = require("value-form-text");
    var textTemplate = require("./data-grid-text.handlebars");

    var FormSelect = require("value-form-select");
    var selectTemplate = require("./data-grid-select.handlebars");

    var FormButtons = require("value-form-buttons");
    var ButtonsTemplate = require("./data-grid-buttons.handlebars");

    var FormRadio = require("value-form-radio");
    var FormCheckbox = require("value-form-checkbox");

    var GridItem = require("./grid-item/grid-item");
    var Paginator = require("value-paginator");
    var template = require("./data-grid.handlebars");

    var instances = {};
    var getCurFragment = function () {
        return BackboneHistory.fragment;
    }
    var searchDataStorageMap = {};//以页面hash为key存储搜索条件记录，前提为每个页面最多只出现一个datagrid，否则会有问题
    var searchDataStorage;//搜索条件记录，由于从list到view或new等，再回到list会创建新实例，所以不能放在实例上
    var Datagrid = BaseWidget.extend({
        attrs:{
            parentNode:null,
            template:template,
            model:{},
            url:"",
            urlIds:[],
            queryParams:{},
            hasPaginator:true,
            paginatorCfg:{
                targetPage:1,
                pageSize:15,
                symbolMapping:{
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
            tableCfg:{
                cols:[
//                    {text: "", width: "20%", property: ""}
                ]
//                operators:{
//                    col:{text: "操作",width: "20%"},
//                    btnMap:{
//                        "edit":{
//                            btnText:"",
//                            type:"default",//default|danger
//                            action:function(){}
//                        },
//                        "share":{
//                            btnText:"",
//                            type:"default",//default|danger
//                            dropdown:false,
//                            dropdownItems:[
//                                {btnText:"",actionkey:""}
//                            ]
//                        },
//                        "doShare":{
//                            action:function(){}
//                        }
//                    },
//                    btnsFilter:function(){
//                        return ["edit","share"]
//                    }
//                }
            }
        },
        paginator:null,
        tableBtns:null,
        groupBtns:null,
        $searchGroup:null,
        $filterGroup:null,
        formWidgets:{},
        searchDOM:null,
        events:{
            "keyup input.keywords":function(event){
                if(event.which === 13){
                    this.doSearch();
                }
            },
            "click input:checkbox,input:radio":function(){
                this.doSearch();
            },
            "click .top-operation .btn-group a":function(e){
                var self = this;
                var $target = $(e.currentTarget),
                    btnkey = $target.data("btnkey");
                var handler = this.groupBtns[btnkey];
                handler && handler.action && handler.action.call(self, $target);
            }
        },
        initAttrs:function(cfg,dataAttrsConfig){
            Datagrid.superclass.initAttrs.call(this,cfg,dataAttrsConfig);
            instances[this.cid] = this;//注册this
            this.setModel();
            this._initDataSource();
            this.setSearchDataStorage();
        },
        setSearchDataStorage: function () {
            var fragment = getCurFragment();
            searchDataStorage = searchDataStorageMap[fragment] || {};
        },
        registerWidget:function(name,inst){
            inst.set("dataGrid",this);
            this.formWidgets[name] = inst;
        },
        getWidget:function(name){
            return this.formWidgets[name];
        },
        setModel:function(){
            var model = {
                cid:this.cid,
                topOperation:this.get("topOperation"),
                tableCfg:this.get("tableCfg")
            };
            this.set("model",model);
        },
        setup:function(){
            this.$searchGroup = this.$("div.search-group");
            this.$filterGroup = this.$("div.filter-group");
            var topOperation = this.get("topOperation");
            if(topOperation){
                this._initTopOperation();
                this._convertGroupBtns();
            }
            this._convertTableBtns();
            this.initPaginator();
            Datagrid.superclass.setup.call(this);
        },
        initPaginator:function(){
            var self = this;
            var hasPaginator = this.get("hasPaginator");
            if(!hasPaginator){
                return;
            }
            this.paginator = new Paginator({
                parentNode:this.$("div.paginator-wrapper"),
                pageClick:function(targetPage){
                    self.doSearch(targetPage);
                }
            })
        },
        _convertTableBtns:function(){
            var tableCfg = this.get("tableCfg");
            if(!tableCfg.operators){
                return;
            }
            this.tableBtns = tableCfg.operators.btnMap;
        },
        _convertGroupBtns:function(){
            //按钮组的事件提取
            var topOperation = this.get("topOperation");
            var btnsGroup = topOperation.btnsGroup;
            var groupBtns = {};
            btnsGroup && btnsGroup.forEach(function(btnCfg){
                if(btnCfg.btnkey){
                    groupBtns[btnCfg.btnkey] = btnCfg;
                }
            })
            this.groupBtns = groupBtns;
        },
        _initTopOperation:function(){//todo 传入组件对象还是配置对象，传入组件对象调用成本过高，传入配置对象，灵活性变差
            var topOperation = this.get("topOperation");
            var search = topOperation.searchGroup,
                filters = topOperation.filtersGroup;
            search && this._initSearchGroup(search);
            filters && this._initFiltersGroup(filters);
        },
        _initSearchGroup:function(search){
            var self = this;
            //由于需要扩展searchGroup，将这三个控件分开调用方法初始化，外部调用datagrid时，可以使用instance.before，可以使用instance.after方法自由调整控件顺序
            self.insertSearchText(search);
            self.insertSearchSelect(search);
            self.insertSeachBtn(search);
        },
        insertSearchText: function (search) {
            var self = this;
            if(search.input){
                var textName = search.input.name;
                var value = decodeURIComponent(searchDataStorage[textName] || "");
                var textObj = new FormText({
                    template:textTemplate,
                    name:textName,
                    value:value,
                    nodeData:search.input.nodeData,
                    needEncode:true
                });
                self.insertSearchWidget(textName,textObj);
            }
        },
        insertSearchSelect: function (search) {
            var self = this;
            if(search.select){
                var selectName = search.select.name;
                var selectObj = new FormSelect($.extend(true,search.select, {
                    selected:searchDataStorage[selectName],
                    addNullChoice:search.select.addNullChoice,
                    template:selectTemplate
                }));
                self.insertSearchWidget(selectName,selectObj);
            }
        },
        insertSeachBtn: function (search) {
            var self = this;
            if(search.searchBtn){
                var btnName = 'data-grid-btn';
                var btnObj = new FormButtons({
                    template:ButtonsTemplate,
                    btns: [
                        {
                            btnkey: btnName,
                            text: "搜索",
                            type: "default",
                            handler: function ($target) {
                                self.doSearch();
                            }
                        }
                    ]
                });
                self.insertSearchWidget(btnName,btnObj);
            }
        },
        insertSearchWidget: function (wName,wObj) {
            var self = this;
            self.registerWidget(wName,wObj);
            self.$searchGroup.append(wObj.element);
        },
        _initFiltersGroup:function(filters){
            var self = this;
            filters.forEach(function(filter){
                var wObj,name = filter.name
                var type = filter.type;
                filter.checked = filter.checked || searchDataStorage[name];
                if(type == "radio"){
                    wObj = new FormRadio(filter);
                }else if(type == "checkbox"){
                    wObj = new FormCheckbox(filter)
                }else{
                    seajs.log("过滤组type错误：" + type,"error");
                    return;
                }
                self.registerWidget(name,wObj);
                self.$filterGroup.append(wObj.element);
            })
        },
        _initDataSource: function() {
            var self = this;
            var url = this.get("url");
            var ids = this.get("urlIds");
            var ds = this.dataSource = new DataSource({
                source: function(query,done){
                    $.extend(true,query,self.get("queryParams"));
                    $.eduAjax({
                        url: url,
                        ids:ids,
                        rest: "get",
                        data: query,
                        done:function(data){
                            done(data);
                        }
                    });
                }
            });
            ds.on("data",this._setResult.bind(self));
        },
        getSearchData:function(){
            var data = {};
            var formWidgets = this.formWidgets;
            Object.keys(formWidgets).forEach(function(name){
                $.extend(data, formWidgets[name].getValue());
            })
            return data;
        },
        _setResult:function(data){
            this.renderTable(data.collection);
            this.renderPagination(data);
        },
        renderTable:function(collection){
            var self = this;
            var tableCfg = self.get("tableCfg");
            var cols = tableCfg.cols;
            var $fragment = $.getDocFragment();
            if(collection.length){
                collection.forEach(function(itemData){
                    new GridItem({
                        parentNode:$fragment,
                        tableCfg:tableCfg,
                        itemData:itemData
                    })
                })
            }else{
                $fragment.append('<tr><td colspan="' + (cols.length + 1) + '"><div class="">查询无结果</div></td></tr>')
            }
            this.$("tbody").empty().append($fragment);
        },
        renderPagination:function(data){
            var hasPaginator = this.get("hasPaginator");
            if(!hasPaginator){
                return;
            }
            this.paginator.set("renderData",{
                totalCount:data.totalCount,
                currentPage:data.currentPage,
                totalPages:data.totalPages
            })
        },
        doSearch:function(targetPage){
            targetPage = targetPage || 1;
            var searchData = this.getSearchData();
            searchData["currentPage"] = targetPage;
            this.recordSearchData(searchData);
            this.dataSource.getData(searchData);
        },
        recordSearchData:function(searchData){
            var fragment = getCurFragment();
            searchDataStorage = searchDataStorageMap[fragment] = searchData;
        },
        fetch:function(){
            this.doSearch(searchDataStorage["currentPage"] || 1);
        }

    })
    return Datagrid;
});
