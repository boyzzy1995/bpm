Ext.define('sjy.egineering.Panel.WTContractLD', {
    //继承的panel
    extend: 'Ext.panel.Panel',
    requires: [
    'YZSoft.BPM.src.model.Draft',
    'YZSoft.BPM.src.ux.Render',
    'YZSoft.BPM.src.ux.FormManager',
    'YZSoft.src.ux.RecordSecurityManager',
    'YZSoft.BPM.TaskOperation.Manager',
    'YZSoft.BPM.src.model.HistoryTask',
    'YZSoft.BPM.src.grid.HistoryTaskGrid',
    'Ext.data.JsonStore',
    'YZSoft.BPM.src.model.Worklist',
    'YZSoft.src.button.Button',
    'YZSoft.src.menu.Item',
    'YZSoft.BPM.src.form.field.ProcessNameComboBox',
    'YZSoft.BPM.src.panel.TaskSearchPanel',
    'Ext.button.Button',
    'Ext.grid.Panel',
    'Ext.toolbar.Paging',
    'YZSoft.src.sts',
    'YZSoft.src.button.PanelExpandButton',
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
        var sortable = config.sortable !== false;
        //Store
        //
        //

        //主表Store
        me.templateStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                /*property: 'LaunchDate',
                direction: 'DESC'*/
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/WTContractTemp_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetData',
                    ProcessName: '设计院-外托合同-大项目合作(大于100万)',
                
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });
        
        //主表布局
        me.temlateGrid = Ext.create("Ext.grid.Panel", {
            title: '外托合同大项目合作(大于100万)',
            region: 'center',
            store: me.templateStore,
            border: false,
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, {mode:'MULTI'}),
            columns: {
                defaults: {},
                items: [{
                        xtype: 'rownumberer'
                    }, {
                        header: '流程发起时间',
                        dataIndex: 'LaunchDate',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '外托合同编号',
                        dataIndex: 'WTContractID',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '外托合同名称',
                        dataIndex: 'WTContractTitle',
                        width: 300,
                        align: 'left'
                    }, {
                        header: '外托单位',
                        dataIndex: 'WTCompany',
                        width: 300,
                        align: 'left'
                    }, {
                        header: '合同时间',
                        dataIndex: 'ContractDate',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '报价',
                        dataIndex: 'Quotation',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '经办人',
                        dataIndex: 'Operator',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '分管院长',
                        dataIndex: 'Diractor',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '合同状态',
                        dataIndex: 'ContentStatue',
                        width: 150,
                        align: 'left'
                    }]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.templateStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                rowdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.Zhuanf("外托合同大项目合作(大于100万)", grid);
                },
            },
            tools: [{
                type: 'refresh',
                handler: function(event, toolEl, panel) {
                    me.templateStore.reload();
                }
            }]
        });

        //主表按钮
        //
        //
        //
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
        //导航栏"搜索框"
        me.Search = Ext.create('YZSoft.src.form.field.Search', {
            store: me.templateStore,
            width: 160
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
        //导航栏'添加外托合同'按钮
        me.btnAddWTContract = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加外托合同',
            handler: function() {
                me.addNew();
            }
        });
        //
        //导航栏'查看经济合同流转单'按钮
        me.btnCheckEconmic = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            text: "查看经济合同流转单",
            store: me.temlateStore,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.CheckEconmic();
            }
        });
        //导航栏'授权'按钮 
        me.WTMenuPublic = Ext.create('YZSoft.src.button.Button', {
            margin: 0,
            padding: '3 15 3 15',
            text: '授权',
            perm: 'Public',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function(item) {
                me.publicFlow(me.temlateGrid);
            }
        });
         //开始时间
        me.ComboxstEdit = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                fields: ['year'],
                data: this.setYear() //[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
            }),
            displayField: 'year',
            typeAhead: true,
            mode: 'local',
            forceSelection: false,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: true,
            lastQuery: '',
            value: '',
            emptyText : '请选择', 
            blankText:'请选择'
        });
        
        //结束时间
        me.ComboxendEdit = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                fields: ['year'],
                data: this.setYear() //[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
            }),
            displayField: 'year',
            typeAhead: true,
            mode: 'local',
            forceSelection: false,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: true,
            lastQuery: '',
            value: '',
            emptyText : '请选择', 
            blankText:'请选择'
        });

        //状态
        me.ComboxState = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                fields: ['key','value'],
                data: [["全部"," "],["流转中","Running"],["已批准","Approved"]] //[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
            }),
            displayField: 'key',
            valueField : 'value',
            typeAhead: true,
            mode: 'local',
            forceSelection: false,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: true,
            lastQuery: '',
            value: '',
            emptyText : '请选择', 
            blankText:'请选择'
        });

        
        //导航栏'发起成果提交单'按钮
        me.btnStartResultPut = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: "发起成果提交单",
            store: me.temlateStore,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.onStartResultPut();
            }
        });

        //导航栏'查看成果提交单'按钮
        me.btnCheckResultPut = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-abort',
            text: "查看成果提交单",
            store: me.temlateStore,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.onCheckStartResultPut();
            }
        });

        //导航栏'导出Excel'
        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.temlateGrid,
            templateExcel: YZSoft.$url(me, '外托合同-大项目合作(大于100万).xls'), //导出模板，不设置则按缺省方式导出
            params: {},
            fileName: '外托合同-大项目合作(大于100万)',
            allowExportAll: true, //可选项，缺省使用YZSoft.EnvSetting.Excel.AllowExportAll中的设置，默认值false
            //maxExportPages: 10, //可选项，缺省使用YZSoft.EnvSetting.Excel.MaxExportPages中的设置，默认值100
            listeners: {
                beforeload: function(params) {
                    var record = me.templateStore.getAt(0);
                     params.ReportDate = record.get("year");
                }
            }
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
        //项目设计大纲Panel
        me.OtherPanel = new Ext.TabPanel({
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
            items: [me.XMSJDGGrid]
        });
        //导航栏布局
        var cfg = {
            title: '',
            layout: 'border',
            border: false,
            tbar: [me.btnAddWTContract,me.btnStartResultPut,me.btnCheckEconmic,me.btnCheckResultPut,me.WTMenuPublic,"开始时间",me.ComboxstEdit,"结束时间",me.ComboxendEdit,"状态",me.ComboxState,'事件描述', me.Search, me.btnSearch3,me.btnExcelExport],
            items: [me.mainPanel],
        };
        Ext.apply(cfg, config);
        me.callParent([cfg]);

    },
    
    onActivate: function(times) {

        if (times == 0) {
            this.templateStore.load(YZSoft.EnvSetting.storeFirstLoadMask);
        } else {
            this.templateStore.reload({
                loadMask: false
            });
        }
    },
    addNew: function() {
        YZSoft.BPM.src.ux.FormManager.openPostWindow('设计院-外托合同-大项目合作(大于100万)', {
            title: '添加外托合同- ',
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
    onSearch3Click: function() {
        var me = this,
        store = me.templateStore,
        params = store.getProxy().getExtraParams(),
        StartYear = me.ComboxstEdit.getValue(),
        EndYear = me.ComboxendEdit.getValue(),
        Keyword = me.Search.getValue(),
        State=me.ComboxState.getValue();
        Ext.apply(params, {
            SearchType: 'QuickSearch',
            SearchBy: 'Deadline',
            startdate:StartYear,
            enddate:EndYear,
            SearchWord: Keyword,
            state:State,
            process: '设计院-外托合同-大项目合作(大于100万)'
        });
        me.templateStore.loadPage(1);
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
        /*alert(paramsStr);*/
        //var result = Ext.util.JSON.decode(obj.responseText);
        return obj.responseText;
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
    CheckEconmic: function() {
        var me = this,
            tid,
            recs = me.temlateGrid.getSelectionModel().getSelection();
        Ext.each(recs, function(rec) {
            tid = rec.get("TaskID");
        });
        YZSoft.Ajax.request({
            url: YZSoft.$url(me, '../StoreDataService/EventInfoData/WTContract.ashx'),
            method: 'POST',
            params: {
                method: 'getTaskIDForWT',
                TaskID: tid
            },
            dataType: "json",
            success: function(action) {
                var json = JSON.parse(action.responseText);
                if (json.TaskID == '') {
                    var mbox = Ext.Msg.show({
                        title: '错误提示',
                        msg: '该记录还没添加经济合同信息!',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                } else {
                    me.ZhuanfE(json.TaskID,"经济合同");
                }
            },
            failure: function(action) {
                var mbox = Ext.Msg.show({
                    title: '错误提示',
                    msg: YZSoft.HttpUtility.htmlEncode(action.result.errorMessage, true),
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        })
    },
    Zhuanf: function(title, grid) {
        var tid,
        me = this,
        recs = grid.getSelectionModel().getSelection(),
        ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
            tid = rec.get("TaskID");
        });
        YZSoft.BPM.src.ux.FormManager.openTaskForRead(tid, Ext.apply({}, {
            sender: this,
            title: title
        }));
        grid.getStore().reload();
    },
     ZhuanfE:function(tid,title){
        YZSoft.BPM.src.ux.FormManager.openTaskForRead(tid, Ext.apply({}, {
            sender: this,
            title: title
        }));
    },
    //授权
    publicFlow: function(grid) {
        var me=this;
        var account;
        var wid;
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];
     
        if (recs.length == 0)
            return;
  
        var params = {
            Method: 'authorizedUser'
        };
        
        var items = [];
        Ext.each(recs, function(rec) {
            wid=rec.get("TaskID");
        });

        YZSoft.SelUsersDlg.show({
            fn: function(users) {
                if (users.length == 0)
                    return;

                var accounts = [],
                    dspNames = [];

                Ext.each(users, function(user) {
                    account=user.Account;
                    accounts.push(user.Account);
                    dspNames.push(YZSoft.HttpUtility.htmlEncode(YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName)));
                });

                var userDisplayString = dspNames.toString();

                YZSoft.Ajax.request({
                    url: YZSoft.$url(me,'../StoreDataService/EventInfoData/WTContractTemp_EventInfoData.ashx'),
                    method: 'POST',
                    params: params,
                    jsonData: {
                        account: account,
                        wid:wid,
                    },
                    waitMsg: { msg: RS.$('All_Publicing'), target: grid },
                    getSuccessMessage: function(items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function(item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.formatHtml(RS.$('All_Public_ItemSuccess'), store.getById(item.ID).data.SerialNum, userDisplayString);
                        });

                        return msg;
                    },
                    success: function(action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg:"授权成功",
                                delay: 'x'
                            }
                        });
                    },
                    failure: function(action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('All_Public_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: "授权失败",
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                    }
                });
            }
        });
    },
    onStartResultPut: function(rec) {
        var sendvalue;
        var me = this,
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            sendvalue = rec.get("TaskID");
        });

        YZSoft.BPM.src.ux.FormManager.openPostWindow('设计院-外托合同-成果提交单', {
            title: '成果提交单 - ',
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1050,
            height: 700,
            params: {
                Taskid: sendvalue
            },
            listeners: {
                submit: function(name, result) {
                    //me.store.reload({ loadMask: false });
                }
            }
        });

    },

    onCheckStartResultPut: function(rec) {
        var sendvalue;
        var me = this,
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            sendvalue = rec.get("TaskID");
        });
        var view = YZSoft.ViewManager.addView(me, 'sjy.egineering.Panel.ResultPut', {
            title: '成果提交单',
            taskid: sendvalue,
            closable: true
        });
    }
});
