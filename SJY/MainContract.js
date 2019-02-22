Ext.define('sjy.egineering.Panel.MainContract', {
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
                url: YZSoft.$url(me, '../StoreDataService/MainContract_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SearchYear: year,
                    Kword: '',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-工程合同',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    limit: 25,
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });
        //主表布局
        me.temlateGrid = Ext.create("Ext.grid.Panel", {
            title: '主合同',
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
                        header: '合同接收时间',
                        dataIndex: 'ReciveContractDate',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '合同编号',
                        dataIndex: 'MainContractID',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '合同名称',
                        dataIndex: 'MainContractTitle',
                        width: 500,
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
                        header: '项目负责人',
                        dataIndex: 'Leader',
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
                    },

                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.templateStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.Zhuanf(record, "主合同");
                },
                itemclick: function(grid, record, item, rowIndex, e, eOpts) {
                    var sendvalue;
                    var me = this,
                        WTContractStore = me.WTContractStore,
                        checkProjectScheduleStore = me.checkProjectScheduleStore,
                        params = WTContractStore.getProxy().getExtraParams(),
                        paramsStr = checkProjectScheduleStore.getProxy().getExtraParams(),
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
                    Ext.apply(paramsStr, {
                        TaskID: sendvalue,
                    });
                    WTContractStore.loadPage(1);
                    checkProjectScheduleStore.loadPage(1);
                },
            },
            tools: [{
                type: 'refresh',
                handler: function(event, toolEl, panel) {
                    me.templateStore.reload();
                }
            }]
        });

        //定义外拓合同列表
        me.WTContractStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/WTContract.ashx'),
                extraParams: {
                    method: 'GetData'
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        //外托合同布局
        me.WTContractGrid = Ext.create("Ext.grid.GridPanel", {
            title: '外托合同',
            region: 'center',
            store: me.WTContractStore,
            border: false,
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, {
                mode: 'MULTI'
            }),
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
                    },

                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.WTContractStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    this.Zhuanf(record, "外托合同");
                }
            },
            tools: [{
                type: 'refresh',
                handler: function(event, toolEl, panel) {
                    me.WTContractStore.reload();
                }
            }]
        });

        //查看项目款结算进度
        me.checkProjectScheduleStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
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
        me.checkProjectScheduleGrid = Ext.create("Ext.grid.GridPanel", {
            title: '项目款结算进度',
            region: 'center',
            store: me.checkProjectScheduleStore,
            border: false,
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, {
                mode: 'MULTI'
            }),
            columns: {
                defaults: {},
                items: [{
                        xtype: 'rownumberer'
                    }, {
                        header: '金额',
                        dataIndex: 'Money',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '结算日期',
                        dataIndex: 'Date',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '经办人',
                        dataIndex: 'OperatorName',
                        width: 500,
                        align: 'left'
                    },

                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.checkProjectScheduleStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.Zhuanf(record);
                }
            },
            tools: [{
                type: 'refresh',
                handler: function(event, toolEl, panel) {
                    me.checkProjectScheduleStore.reload();
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
        //导航栏'添加工程合同'按钮
        me.btnAddMainContract = Ext.create('Ext.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加工程合同',
            handler: function() {
                me.addNew();
            }
        });

        //导航栏'合同信息汇总'按钮
        me.btnAddThat = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '合同信息汇总',
            handler: function() {
                me.addThat(0);
            }
        });
        me.menuPublic = Ext.create('YZSoft.src.button.Button', {
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
        //导航栏'添加外托合同-大项目合作(大于100万)'按钮
        me.btnAddWTMainContractDYO = Ext.create('YZSoft.src.menu.Item', {
            iconCls: 'yz-btn-add',

            margin: 0,
            text: "添加外托合同-大项目合作(大于100万)",
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.AddWTMainContractDYO();
            }
        });
        //导航栏'添加外托合同-大项目合作(小于100万)'按钮
        me.btnAddWTMainContractXYO = Ext.create('YZSoft.src.menu.Item', {
            iconCls: 'yz-btn-add',
            margin: 0,
            text: "添加外托合同-大项目合作(小于100万)",
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.AddWTMainContractXYO();
            }
        });
        //导航栏'添加外托合同-小专业合作'按钮
        me.btnAddWTMainContractXZY = Ext.create('YZSoft.src.menu.Item', {
            iconCls: 'yz-btn-add',

            margin: 0,
            text: "添加外托合同-小专业合作",
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.AddWTMainContractXZY();
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
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.onAddSchedule();
            }
        });

        //导航栏'查看项目款结算进度'按钮
        me.btnCheckSchedule = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-inviteindicate',
            padding: '3 15 3 15',
            margin: 0,
            text: "查看项目款结算进度",
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.onCheckSchedule();
            }
        });

        //导航栏'废止合同'按钮
        me.btnAbolishContract = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-abort',
            padding: '3 15 3 15',
            text: "废止合同",
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.onAbolishClick();
            }
        });
        //导航栏'添加外托合同项目款结算'按钮
        me.btnAddWTSchedule = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: "添加外托合同项目款结算",
            store: me.WTContractGrid,
            sm: me.WTContractGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.WTContractGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.onAddWTSchedule();
            }
        });



        //导航栏'查看外托合同项目款结算进度'按钮
        me.btnCheckWTSchedule = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-inviteindicate',
            padding: '3 15 3 15',
            margin: 0,
            text: "查看外托合同项目款结算进度",
            store: me.WTContractGrid,
            sm: me.WTContractGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.WTContractGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.onCheckWTSchedule();
            }
        });
        //导航栏'外托合同废止合同'按钮
        me.btnAbolishWTContract = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-abort',
            text: "废止合同",
            store: me.WTContractGrid,
            sm: me.WTContractGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.WTContractGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.onAbolishWTClick();
            }
        });

        //导航栏'查看经济合同流转单'按钮
        me.btnCheckEconmic = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-abort',
            text: "查看经济合同流转单",
            store: me.WTContractStore,
            sm: me.WTContractGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.WTContractGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.CheckEconmic();
            }
        });

        //导航栏'发起成果提交单'按钮
        me.btnStartResultPut = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: "发起成果提交单",
            store: me.WTContractGrid,
            sm: me.WTContractGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.WTContractGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.onStartResultPut();
            }
        });

        //导航栏'查看成果提交单'按钮
        me.btnCheckResultPut = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-abort',
            text: "查看成果提交单",
            store: me.WTContractStore,
            sm: me.WTContractGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.WTContractGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.onCheckStartResultPut();
            }
        });

        //导航栏"搜索框"
        me.Search = Ext.create('YZSoft.src.form.field.Search', {
            store: me.templateStore,
            width: 160
        });
        //更多操作
        me.btnMore = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-more',
            padding: '3 15 3 15',
            text: '添加外托合同',
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            menu: {
                items: [
                    me.btnAddWTMainContractDYO,
                    '-',
                    me.btnAddWTMainContractXYO,
                    '-',
                    me.btnAddWTMainContractXZY,
                ]
            },
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {

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
        //外拓合同
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
            tbar: [me.btnAddWTSchedule, me.btnStartResultPut, me.btnCheckWTSchedule, me.btnCheckEconmic, me.btnCheckResultPut],
            items: [me.WTContractGrid, me.checkProjectScheduleGrid]
        });

        //导航栏布局
        var cfg = {
            title: '',
            layout: 'border',
            border: false,
            tbar: [me.btnAddMainContract, me.btnMore, me.btnAddThat, me.btnAddSchedule, me.menuPublic, "年份查找：", me.ComboxsjEdit, '事件描述', me.Search, me.btnSearch3],
            items: [me.mainPanel, me.WTPanel],
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
            ProcessName: '设计院-工程合同',
            PostUserAccount: '',
            PostDateType: 'period',
            TaskStatus: 'all',
            RecipientUserAccount: '',
            Keyword: keyword,
            TaskID: '',
            SerialNum: '',
            limit: 25,
        });
        me.templateStore.loadPage(1);
    },
    publicFlow: function(grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var params = {
            Method: 'PublicExt'
        };

        var items = [];
        Ext.each(recs, function(rec) {
            items.push({
                ID: rec.get("stepid"),
                TaskID: rec.data.TaskID
            });
        });

        YZSoft.SelUsersDlg.show({
            fn: function(users) {
                if (users.length == 0)
                    return;

                var accounts = [],
                    dspNames = [];

                Ext.each(users, function(user) {
                    accounts.push(user.Account);
                    dspNames.push(YZSoft.HttpUtility.htmlEncode(YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName)));
                });

                var userDisplayString = dspNames.toString();

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    method: 'POST',
                    params: params,
                    jsonData: {
                        items: items,
                        accounts: accounts
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
                                msg: Ext.String.formatHtml(RS.$('TaskOpt_Public_SuccessMsg'), action.result.processedItems.length, userDisplayString),
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
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                    }
                });
            }
        });
    },
    onAbolishWTClick: function() {
        var me = this,
            recs = me.WTContractGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
        });

        Ext.Msg.show({
            title: '废止确认',
            msg: '您确定要废除选中项吗？',
            buttons: Ext.Msg.OKCANCEL,
            defaultFocus: 'cancel',
            icon: Ext.MessageBox.INFO,

            fn: function(btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url(me, '../StoreDataService/EventInfoData/WTContract.ashx'),
                    method: 'POST',
                    params: {
                        method: 'disContract'
                    },
                    jsonData: ids,
                    waitMsg: {
                        msg: '正在废除...',
                        target: me.grid
                    },
                    success: function(action) {
                        me.WTContractStore.reload({
                            loadMask: {
                                msg: Ext.String.format('{0}个对象已废除！', recs.length),
                                delay: 'x'
                            }
                        });
                    },
                    failure: function(action) {
                        var mbox = Ext.Msg.show({
                            title: '错误提示',
                            msg: YZSoft.HttpUtility.htmlEncode(action.result.errorMessage, true),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });

                        me.WTContractStore.reload({
                            mbox: mbox
                        });
                    }
                });
            }
        });
    },
    CheckEconmic: function() {
        var me = this,
            tid,
            recs = me.WTContractGrid.getSelectionModel().getSelection();
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
                    me.ZhuanfE(json.TaskID, "经济合同");
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
        });
    },

    onAbolishClick: function() {
        var me = this,
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
        });

        Ext.Msg.show({
            title: '废止确认',
            msg: '您确定要废除选中项吗？',
            buttons: Ext.Msg.OKCANCEL,
            defaultFocus: 'cancel',
            icon: Ext.MessageBox.INFO,

            fn: function(btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url(me, '../StoreDataService/MainContract_EventInfoData.ashx'),
                    method: 'POST',
                    params: {
                        method: 'disContract'
                    },
                    jsonData: ids,
                    waitMsg: {
                        msg: '正在废除...',
                        target: me.grid
                    },
                    success: function(action) {
                        me.templateStore.reload({
                            loadMask: {
                                msg: Ext.String.format('{0}个对象已废除！', recs.length),
                                delay: 'x'
                            }
                        });
                    },
                    failure: function(action) {
                        var mbox = Ext.Msg.show({
                            title: '错误提示',
                            msg: YZSoft.HttpUtility.htmlEncode(action.result.errorMessage, true),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });

                        me.templateStore.reload({
                            mbox: mbox
                        });
                    }
                });
            }
        });
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
        YZSoft.BPM.src.ux.FormManager.openPostWindow('设计院-工程合同', {
            title: '添加工程合同 - ',
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 800,
            height: 600,
            listeners: {
                submit: function(name, result) {
                    //me.store.reload({ loadMask: false });
                }
            }
        });
    },
    addThat: function(activeTabIndex) {
        var me = this;
        YZSoft.Ajax.request({
            url: YZSoft.$url(me, '../StoreDataService/ContractMessage.ashx'),
            method: 'POST',
            params: {
                method: 'isPermit'
            },
            dataType: "json",
            success: function(action) {
                var json = JSON.parse(action.responseText);
                if (json.errcode == "0") {
                    var view = YZSoft.ViewManager.addView(me, 'sjy.egineering.Panel.InformationSummary', {
                        title: '合同信息汇总',
                        activeTabIndex: activeTabIndex,
                        closable: true
                    });
                } else {
                    alert("您没有权限查看！");
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
        });
    },
    onAddSchedule: function(rec) {
        var sendvalue;
        var me = this,
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
            sendvalue = rec.get("TaskID");
        });
        YZSoft.BPM.src.ux.FormManager.openFormApplication('设计院/合同管理/工程合同-项目款结算', sendvalue, 'New', Ext.apply({
            sender: me,
            title: '项目款结算',
            params: {
                TaskID: sendvalue
            },
            listeners: {
                submit: function(action, data) {
                    me.templateStore.reload({
                        loadMask: {
                            msg: '保存已成功',
                            delay: 'x'
                        },
                        callback: function() {
                            var rec = me.templateStore.getById(data.Key);
                            if (rec)
                                me.temlateGrid.getSelectionModel().select(rec);
                        }
                    });
                }
            }
        }, this.dlgCfg));
    },

    onAddWTSchedule: function(rec) {
        var sendvalue;
        var me = this,
            recs = me.WTContractGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            sendvalue = rec.get("TaskID");
        });
        YZSoft.BPM.src.ux.FormManager.openFormApplication('设计院/合同管理/工程合同-项目款结算', sendvalue, 'New', Ext.apply({
            sender: me,
            title: '外托合同项目款结算',
            params: {
                TaskID: sendvalue,
            },
            listeners: {
                submit: function(action, data) {
                    me.WTContractStore.reload({
                        loadMask: {
                            msg: '保存已成功',
                            delay: 'x'
                        },
                        callback: function() {
                            var rec = me.WTContractStore.getById(data.Key);
                            if (rec)
                                me.WTContractGrid.getSelectionModel().select(rec);
                        }
                    });
                }
            }
        }, this.dlgCfg));
    },

    onStartResultPut: function(rec) {
        var sendvalue;
        var me = this,
            recs = me.WTContractGrid.getSelectionModel().getSelection(),
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
            recs = me.WTContractGrid.getSelectionModel().getSelection(),
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
    onCheckWTSchedule: function() {
        var sendvalue;
        var me = this,
            store = me.checkProjectScheduleStore,
            params = store.getProxy().getExtraParams(),
            recs = me.WTContractGrid.getSelectionModel().getSelection(),
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
        me.WTContractStore.reload();
        me.checkProjectScheduleGrid.show();

    },
    AddWTMainContractXYO: function() {
        var cid, ctitle, tid, cstate,quotation,
            me = this,
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
            cid = rec.get("MainContractID");
            ctitle = rec.get("MainContractTitle");
            cstate = rec.get("ContentStatue");
            quotation = rec.get("Quotation");
            tid = rec.get("TaskID");
        });
        YZSoft.BPM.src.ux.FormManager.openPostWindow('设计院-外托合同-大项目合作（小于100万）', {
            title: '添加外托合同-大项目合作(小于100万) - ',
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 800,
            params: {
                MainContractID: cid,
                MainContractTitle: ctitle,
                TaskID: tid,
                ContractStatue: cstate,
                WT_Quotation:quotation
            },
            listeners: {
                submit: function(name, result) {
                    //me.store.reload({ loadMask: false });
                }
            }
        });
    },
    AddWTMainContractDYO: function() {
        var cid, ctitle, tid, cstate,quotation,
            me = this,
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
            cid = rec.get("MainContractID");
            ctitle = rec.get("MainContractTitle");
            cstate = rec.get("ContentStatue");
            quotation = rec.get("Quotation");
            tid = rec.get("TaskID");
        });
        YZSoft.BPM.src.ux.FormManager.openPostWindow('设计院-外托合同-大项目合作(大于100万)', {
            title: '添加外托合同-大项目合作(大于100万) - ',
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 800,
            params: {
                MainContractID: cid,
                MainContractTitle: ctitle,
                TaskID: tid,
                ContractStatue: cstate,
                WT_Quotation:quotation
            },
            listeners: {
                submit: function(name, result) {
                    //me.store.reload({ loadMask: false });
                }
            }
        });
    },
    AddWTMainContractXZY: function() {
        var cid, ctitle, tid, cstate,quotation,
            me = this,
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
            cid = rec.get("MainContractID");
            ctitle = rec.get("MainContractTitle");
            cstate = rec.get("ContentStatue");
            quotation = rec.get("Quotation");
            tid = rec.get("TaskID");
        });
        YZSoft.BPM.src.ux.FormManager.openPostWindow('设计院-外托合同-小专业合作', {
            title: '添加外托合同-小专业合作 - ',
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 800,
            params: {
                MainContractID: cid,
                MainContractTitle: ctitle,
                TaskID: tid,
                ContractStatue: cstate,
                WT_Quotation:quotation
            },
            listeners: {
                submit: function(name, result) {
                    //me.store.reload({ loadMask: false });
                }
            }
        });
    },
    Zhuanf: function(record, title) {
        YZSoft.BPM.src.ux.FormManager.openTaskForRead(record.data.TaskID, Ext.apply({}, {
            sender: this,
            title: title
        }));
    },
    //跳转到经济合同流转单
    ZhuanfE: function(tid, title) {
        YZSoft.BPM.src.ux.FormManager.openTaskForRead(tid, Ext.apply({}, {
            sender: this,
            title: title
        }));
    }
});