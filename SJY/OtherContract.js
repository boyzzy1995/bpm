
Ext.define('sjy.economic.Panel.OtherContract', {
    extend: 'Ext.panel.Panel',
    requires: [
    'YZSoft.BPM.src.model.Draft',
    'YZSoft.BPM.src.ux.Render',
    'YZSoft.BPM.src.ux.FormManager',
    'YZSoft.src.ux.RecordSecurityManager',
    'YZSoft.BPM.TaskOperation.Manager',
    ],
    dlgCfg: {
        dlgModel: 'Dialog', //Tab,Window,Dialog
        width: 700,
        height: 400
    },
    stepdefer: 2000,
    constructor: function (config) {
        var me = this;
        var date = new Date;
        var year = date.getFullYear();
        var sortable = config.sortable !== false;
        //调试时显示模块的权限
        me.templateStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            sorters: { property: 'LaunchDate', direction: 'DESC' },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/OContract_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SearchYear: year,
                    Kword: '',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-其他经济合同',
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
            }
        });
        //表格内容
        me.temlateGrid = Ext.create('Ext.grid.Panel', {
            title: '其他经济主合同',
            region: 'center',
            store: me.templateStore,
            border: false,
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, { mode: 'MULTI' }),
            columns: {
                defaults: {
                },
                items: [
                { xtype: 'rownumberer' },
                { header: '流程发起时间', dataIndex: 'LaunchDate', width: 150, align: 'left' },
                { header: '合同名称', dataIndex: 'Title', width: 150, align: 'left' },
                { header: '合同编号', dataIndex: 'ECID', width: 150, align: 'left' },
                { header: '乙方单位', dataIndex: 'BParty', width: 250, align: 'left' },
                { header: '项目负责人', dataIndex: 'LeaderName', width: 150, align: 'left' },
                { header: '分管院长', dataIndex: 'Director', width: 150, align: 'left' },
                {
                    header: '合同状态',
                    text: 'State',
                    dataIndex: 'State',
                    width: 150,
                    align: 'left',
                    sortable: sortable, 
                    renderer: YZSoft.BPM.src.ux.Render.renderTaskState,
                },
                /*{ header: '合同状态', dataIndex: 'ContractStatue', width: 150, align: 'left' },*/
                { header: '报价', dataIndex: 'Quotation', width: 150, align: 'left' },
                { header: '经办人', dataIndex: 'Operator', width: 150, align: 'left' },
                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.templateStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                rowdblclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    this.Zhuanf(record);
                },
                itemclick: function (grid, record, item, rowIndex, e, eOpts) {
                    var sendvalue;
                    var me = this,
                    store = me.OtherContractStore,
                    params = store.getProxy().getExtraParams(),
                    recs = me.temlateGrid.getSelectionModel().getSelection(),
                    ids = [];

                    if (recs.length == 0)
                        return;

                    Ext.each(recs, function (rec) {
                        ids.push(rec.get("TaskID"));
                        sendvalue = rec.get("TaskID");
                    });
                    Ext.apply(params, {
                        TaskID: sendvalue,
                    });
                    store.loadPage(1);
                },
            },
            tools: [{
                type: 'refresh',
                handler: function (event, toolEl, panel) {
                    me.templateStore.reload();
                }
            }]
        });
        //查看项目款列表Store
        me.OtherContractStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: { property: 'LaunchDate', direction: 'DESC' },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/PayContract.ashx'),
                extraParams: {
                    method: 'GetData'
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });
        //查看项目款列表Grid
        me.OtherContractGrid = Ext.create("Ext.grid.GridPanel", {
            title: '查看项目款列表',
            region: 'center',
            store: me.OtherContractStore,
            border: false,
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, { mode: 'MULTI' }),
            columns: {
                defaults: {
                },
                items: [
                { xtype: 'rownumberer' },
                { header: '报价', dataIndex: 'Quotation', width: 150, align: 'left' },
                { header: '金额', dataIndex: 'Money', width: 150, align: 'left' },
                { header: '结算日期', dataIndex: 'Date', width: 150, align: 'left' },
                { header: '经办人', dataIndex: 'OperatorName', width: 500, align: 'left' },
                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.OtherContractStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                rowdblclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    this.Zhuanf(record);
                }
            },
            tools: [{
                type: 'refresh',
                handler: function (event, toolEl, panel) {
                    me.OtherContractStore.reload();
                }
            }]
        });
        //导航栏"年份查找日历框"
        me.sttDate = Ext.create('YZSoft.src.form.field.DayField', {
            margin: '0 30 0 0',
            value: new Date(new Date() - (new Date().getDate() - 1) * 24 * 60 * 60 * 1000)
        });
        //下拉列表框
        me.ComboxsjEdit = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                fields: ['year'],
                data: this.setYear()//[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
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
        me.btnSearch2 = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: RS.$('All_Search'),
            handler: function () {
                me.onSearch2Click();
            }
        });
        me.Search = Ext.create('YZSoft.src.form.field.Search', {
            store: me.templateStore,
            width: 160
        });
        //导航栏'添加其他经济合同'按钮
        me.btnAddOtherContract = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: "添加其他经济合同",
            handler: function () {
                me.addNew();
            }
        });
        //导航栏'查看项目款结算进度'按钮
        me.btnCheckSchedule = Ext.create('Ext.button.Button', {
            iconCls: 'yz-btn-inviteindicate',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: "查看当前项目款结算进度",
            handler: function () {
                me.onSearch2Click();
            }
        });
        //导航栏'添加项目款结算'按钮
        me.btnAddSchedule = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: "添加项目款结算",
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function () {
                me.onAddSchedule();
            }
        });
        //导航栏'废止合同'按钮
        me.btnAbolishContract = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-abort',
            text: "废止合同",
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function () {
                me.onAbolishClick(me.temlateGrid);
            }
        });
         /*me.btnAbortContract = Ext.create('YZSoft.src.button.Button', {
            text: "撤销合同",
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function () {
                me.onAbort(me.temlateGrid);
            }
        });*/
        //头部按钮布局
        me.temlatePanel = Ext.create('Ext.panel.Panel', {
            border: false,
            layout: 'border',
            bodyCls: 'yz-docked-noborder-top',
            tbar: [me.btnAddOtherContract, me.btnAddSchedule, me.btnAbolishContract, "年份查找：", me.ComboxsjEdit, '事件描述', me.Search, me.btnSearch2,me.btnAbortContract
            ],
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
        //查看项目款结算进度
        me.WTPanel = new Ext.TabPanel({
            region: 'south',
            height: 300,
            border: false,
            activeItem: 0,
            activeTab: 0,
            bodyCls: 'yz-docked-noborder-top',
            enableTabScroll: true,
            layout: 'border',
            split: {
                cls: 'yz-spliter',
                size: 5,
                collapseOnDblClick: false,
                collapsible: true
            },
            items: [me.OtherContractGrid]
        });
        //导航栏布局
        var cfg = {
            title: '',
            layout: 'border',
            border: false,
            items: [me.mainPanel, me.WTPanel],
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onSearch2Click: function () {
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
            ProcessName: '设计院-其他经济合同',
            PostUserAccount: '',
            PostDateType: 'period',
            TaskStatus: 'all',
            RecipientUserAccount: '',
            Keyword:keyword,
            TaskID: '',
            SerialNum: '',
        });

        store.loadPage(1);
    },
    onAbolishClick: function (grid) {
        var me = this,
        recs = me.temlateGrid.getSelectionModel().getSelection(),
        ids = [];
        
        if (recs.length == 0)
            return;
        
        Ext.each(recs, function (rec) {
            ids.push(rec.get("TaskID"));
        });

        Ext.Msg.show({
            title: '废止确认',
            msg: '您确定要废除选中项吗？',
            buttons: Ext.Msg.OKCANCEL,
            defaultFocus: 'cancel',
            icon: Ext.MessageBox.INFO,

            fn: function (btn, text) {
                if (btn != 'ok')
                    return;
                me.onAbort(grid);
                YZSoft.Ajax.request({
                    url: YZSoft.$url(me, '../StoreDataService/OContract_EventInfoData.ashx'),
                    method: 'POST',
                    params: {
                        method: 'Abolish'
                    },
                    jsonData: ids,
                    waitMsg: { msg: '正在废除...', target: me.temlateGrid },
                    success: function (action) {
                        me.templateStore.reload({
                            loadMask: {
                                msg: Ext.String.format('{0}个对象已废除！', recs.length),
                                delay: 'x'
                            }
                        });
                    },
                    failure: function (action) {
                        var mbox = Ext.Msg.show({
                            title: '错误提示',
                            msg: YZSoft.HttpUtility.htmlEncode(action.result.errorMessage, true),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });

                        me.templateStore.reload({ mbox: mbox });
                    }
                });
            }
        });
    },
    onAbort:function(grid){
         var sm = grid.getSelectionModel(),
             recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var params = {
            Method: 'AboutExt'
        };

        var items = [];
        Ext.each(recs, function (rec) {
            items.push({
                ID:rec.get('TaskID'),
                TaskID: rec.data.TaskID
            });
        });

        var dlg = Ext.create('YZSoft.BPM.src.dialogs.ConfirmDlg', {
            autoShow: true,
            autoClose: true,
            title: RS.$('TaskOpt_Abort_ConfirmTitle'),
            inform: {
                title: RS.$('TaskOpt_Abort_Prompt_Caption'),
                msg: RS.$('TaskOpt_Abort_Prompt_Desc')
            },
            label: RS.$('TaskOpt_Abort_Comments'),
            validateEmpty: true,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                Ext.apply(params, {
                    Comments: text
                });

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    method: 'POST',
                    params: params,
                    jsonData: items,
                    waitMsg: { msg: RS.$('TaskOpt_Abort_LoadMask'), target: grid, autoClose: true },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.format(RS.$('TaskOpt_Abort_ItemSuccess'), store.getById(item.ID).data.SerialNum);
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('TaskOpt_Abort_SuccessMsg'), action.result.processedItems.length),
                                delay: 'x'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_Abort_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        });
    },
    onAddSchedule: function (rec) {
        var sendvalue;
        var me = this,
        recs = me.temlateGrid.getSelectionModel().getSelection(),
        ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function (rec) {
            ids.push(rec.get("TaskID"));
            sendvalue = rec.get("TaskID");
        });
        YZSoft.BPM.src.ux.FormManager.openFormApplication('设计院/合同管理/工程合同-项目款结算', sendvalue, 'New', Ext.apply({
            sender: me,
            title: '项目款结算',
            params: { TaskID: sendvalue },
            listeners: {
                submit: function (action, data) {
                    me.templateStore.reload({
                        loadMask: {
                            msg: '保存已成功',
                            delay: 'x'
                        },
                        callback: function () {
                            var rec = me.templateStore.getById(data.Key);
                            if (rec)
                                me.temlateGrid.getSelectionModel().select(rec);
                        }
                    });
                }
            }
        }, this.dlgCfg));
    },
    addNew: function () {
        YZSoft.BPM.src.ux.FormManager.openPostWindow('设计院-其他经济合同', {
            title: '添加其他经济合同 - ',
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 600,
            listeners: {
                submit: function (name, result) {
                    //me.store.reload({ loadMask: false });
                }
            }
        });
    },
    onActivate: function (times) {
        this.templateStore.load({ loadMask: false });
    },

    ///////////////////////同步加载//////////////////////////////////////

    ajaxSyncCall: function (urlStr, paramsStr) {
        var obj;
        var value;
        if (window.ActiveXObject) {
            obj = new ActiveXObject('Microsoft.XMLHTTP');
        }
        else if (window.XMLHttpRequest) {
            obj = new XMLHttpRequest();
        }
        obj.open('POST', urlStr, false);
        obj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        obj.send(paramsStr);
        return obj.responseText;
    },
    setYear: function () {
        //[['1', '第一季度'], ['2', '第二季度'], ['3', '第三季度'], ['4', '第四季度']]
        var sb = '[';

        var year = new Date().getFullYear();

        for (var i = 0; year - i > 2000; i++) {
            sb += '["' + (year - i) + '"],';
        }
        return eval('(' + sb.substr(0, sb.length - 1) + '])');
    },

    Zhuanf: function (record) {
        YZSoft.BPM.src.ux.FormManager.openTaskForRead(record.data.TaskID, Ext.apply({}, {
            sender: this,
            title: "其他经济合同"
        }));
    },
});