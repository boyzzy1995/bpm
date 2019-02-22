Ext.define('sjy.FixedAssets.PurchaseApply.Panel.PurchaseApply', {
    //继承的panel
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.BPM.src.model.Draft',
        'YZSoft.BPM.src.ux.Render',
        'YZSoft.BPM.src.ux.FormManager',
        'YZSoft.src.ux.RecordSecurityManager',
    ],
    dlgCfg: {
        dlgModel: 'Dialog', //Tab,Window,Dialog
        width: 700,
        height: 400
    },
    stepdefer: 2000,
    //具体处理
    constructor: function(config) {
        var me = this;
        var date = new Date;
        var year = date.getFullYear();
        var st = year + "-01-01T00:00:00";
        var et = (parseInt(year) + 1) + "-01-01T00:00:00";
        var sortable = config.sortable !== false;
        //定义主表
        me.templateStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            sorters: {
                property: 'ContractDate',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/PurchaseApply_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SearchYear: year,
                    Kword: '',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '固定资产申请',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });
        //主表布局
        me.temlateGrid = Ext.create("Ext.grid.Panel", {
            title: '固定资产采购申请',
            region: 'center',
            store: me.templateStore,
            border: false,
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, {
                mode: 'MULTI'
            }),
            columns: {
                defaults: {},
                items: [{
                    xtype: 'rownumberer'
                }, {
                    header: '物品',
                    dataIndex: 'Goods',
                    width: 150,
                    align: 'left'
                }, {
                    header: '申请人',
                    dataIndex: 'Applicant',
                    width: 150,
                    align: 'left'
                }, {
                    header: '申请时间',
                    dataIndex: 'ApplyTime',
                    width: 150,
                    align: 'left'
                }, {
                    header: '申请部门',
                    dataIndex: 'ApplyDepart',
                    width: 150,
                    align: 'left'
                },  {
                    header: '部门领导',
                    dataIndex: 'DLeaderN',
                    width: 150,
                    align: 'left'
                },  {
                    header: '分管院长',
                    dataIndex: 'DirLeaderN',
                    width: 150,
                    align: 'left'
                }, {
                    header: '流程状态',
                    text: 'State',
                    dataIndex: 'State',
                    width: 200,
                    align: 'left',
                    sortable: sortable,
                    renderer: YZSoft.BPM.src.ux.Render.renderTaskState,
                }]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.templateStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.Zhuanf(record);
                },
                itemclick: function(grid, record, item, rowIndex, e, eOpts) {

                },
            },
            tools: [{
                type: 'refresh',
                handler: function(event, toolEl, panel) {
                    me.templateStore.reload();
                }
            }]
        });


        //按钮
        //导航栏"年份查找日历框"
        me.sttDate = Ext.create('YZSoft.src.form.field.DayField', {
            margin: '0 30 0 0',
            value: new Date(new Date() - (new Date().getDate() - 1) * 24 * 60 * 60 * 1000)
        });
        //下拉列表框
        me.ComboxsjEdit = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                fields: ['year'],
                data: this.setYear() //[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
            }),
            displayField: 'year',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: true,
            lastQuery: '',
            value: new Date().getFullYear()
        });
        //导航栏'搜索'按钮
        me.btnSearch3 = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: RS.$('All_Search'),
            handler: function() {
                me.onSearch3Click();
            }
        });
        //导航栏'申请采购'按钮
        me.btnApply= Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '申请采购',
            handler: function() {
                me.addNew();
            }
        });

        //导航栏"搜索框"
        me.Search = Ext.create('YZSoft.src.form.field.Search', {
            store: me.templateStore,
            width: 160
        });

        //头部按钮布局
        me.temlatePanel = Ext.create('Ext.panel.Panel', {
            border: false,
            layout: 'border',
            bodyCls: 'yz-docked-noborder-top',
            
            items: [me.temlateGrid]
        });
        //主表
        me.mainPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            border: false,
            activeItem: 0,
            layout: 'card',
            items: [me.temlatePanel]
        });

        //导航栏布局
        var cfg = {
            title: '',
            layout: 'border',
            border: false,
            tbar: [me.btnApply, "年份查找：", me.ComboxsjEdit, '事件描述', me.Search, me.btnSearch3],
            items: [me.mainPanel],
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onSearch3Click: function() {
        var me = this,
            store = me.templateStore,
            params = store.getProxy().getExtraParams(),
            st = me.ComboxsjEdit.getValue(),
            keyword = me.Search.getValue();
        Ext.apply(params, {
            SearchYear: st,
            Kword: keyword,
            method: 'GetHistoryTasks',
            HistoryTaskType: 'AllAccessable',
            SpecProcessName: '',
            byYear: '1',
            Year: st,
            SearchType: 'AdvancedSearch',
            ProcessName: '固定资产申请',
            PostUserAccount: '',
            PostDateType: 'period',
            TaskStatus: 'all',
            RecipientUserAccount: '',
            Keyword: keyword,
            TaskID: '',
            SerialNum: '',
        });
        me.templateStore.loadPage(1);
    },

    onActivate: function() {
        this.templateStore.load({
            loadMask: false
        });
    },

    ///////////////////////同步加载//////////////////////////////////////

    ajaxSyncCall: function(urlStr, paramsStr) {
        var obj;
        var value;
        if (window.ActiveXObject) {
            obj = new ActiveXObject('Microsoft.XMLHTTP');
        } else if (window.XMLHttpRequest) {
            obj = new XMLHttpRequest();
        }
        obj.open('POST', urlStr, false);
        obj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        obj.send(paramsStr);
        alert(paramsStr);
        return obj.responseText;
    },

    addNew: function() {
        YZSoft.BPM.src.ux.FormManager.openPostWindow('固定资产申请', {
            title: '固定资产申请 - ',
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 600,
            listeners: {
                submit: function(name, result) {
                    //me.store.reload({ loadMask: false });
                }
            }
        });
    },

    setYear: function() {
        //[['1', '第一季度'], ['2', '第二季度'], ['3', '第三季度'], ['4', '第四季度']]
        var sb = '[';

        var year = new Date().getFullYear();

        for (var i = 0; year - i > 2000; i++) {
            sb += '["' + (year - i) + '"],';
        }
        return eval('(' + sb.substr(0, sb.length - 1) + '])');
    },
    onCheckSchedule: function() {
        var sendvalue;
        var me = this,
            store = me.checkProjectScheduleStore,
            params = store.getProxy().getExtraParams(),
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
            sendvalue = rec.get("TaskID");
        });
        Ext.apply(params, {
            TaskID: sendvalue,
        });
        store.loadPage(1);
    },
    Zhuanf: function(record) {
        YZSoft.BPM.src.ux.FormManager.openTaskForRead(record.data.TaskID, Ext.apply({}, {
            sender: this,
            title: "固定资产申请"
        }));
    },
});