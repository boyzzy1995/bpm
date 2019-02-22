Ext.define('zgs.FixedAssets.Manage.Panel.Manage', {
    //继承的panel
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.BPM.src.model.Draft',
        'YZSoft.BPM.src.ux.Render',
        'YZSoft.BPM.src.ux.FormManager',
        'YZSoft.src.menu.Item',
        'YZSoft.src.ux.RecordSecurityManager',
        'YZSoft.BPM.TaskOperation.Manager',
        'YZSoft.src.button.PanelExpandButton',
        'Ext.data.JsonStore',
        'YZSoft.BPM.src.model.Worklist',
        'YZSoft.BPM.TaskOperation.Manager',
        'YZSoft.BPM.src.ux.Render',
        'YZSoft.src.button.Button',
        'YZSoft.src.menu.Item',
        'YZSoft.BPM.src.form.field.ProcessNameComboBox',
        'YZSoft.BPM.src.panel.TaskSearchPanel',
        'Ext.button.Button',
        'Ext.grid.Panel',
        'Ext.toolbar.Paging',
        'YZSoft.src.sts',
        'YZSoft.src.button.PanelExpandButton',
        'YZSoft.BPM.src.ux.FormManager'
    ],
    dlgCfg: {
        dlgModel: 'Dialog', //Tab,Window,Dialog
        width: 600,
        height: 600
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
                property: 'LaunchDate',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/Manage_EvenDateInfo.ashx'),
                extraParams: {
                    method: 'GetData',
                    Year: year,
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });


        //主表布局
        me.MainGrid = Ext.create("zgs.FixedAssets.Manage.Grid.ManageGrid", {
            store: me.templateStore,
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.templateStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    YZSoft.BPM.src.ux.FormManager.openFormApplication('总公司/日常办公/总公司固定资产档案卡', record.data.AssetID, 'Read', Ext.apply({
                        sender: this,
                        title: "固定资产档案卡"
                    }, this.dlgCfg));
                },
                itemclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.gridClick();
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

        //导航栏'添加'按钮
        me.btnAddProject = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加',
            handler: function() {
                me.addNew();
            }
        });
        //导航栏'导出Excel'
        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.MainGrid,
            templateExcel: YZSoft.$url(me, '固定资产模板.xls'), //导出模板，不设置则按缺省方式导出
            params: {},
            fileName: '浙江省钱塘江管理局勘测设计院固定资产',
            allowExportAll: true, //可选项，缺省使用YZSoft.EnvSetting.Excel.AllowExportAll中的设置，默认值false
            //maxExportPages: 10, //可选项，缺省使用YZSoft.EnvSetting.Excel.MaxExportPages中的设置，默认值100
            listeners: {
                beforeload: function(params) {
                    var me = this,
                        money,
                        grid = me.MainGrid;

                    YZSoft.Ajax.request({
                        url: YZSoft.$url('zgs/FixedAssets/Manage/StoreDataService/Manage_EvenDateInfo.ashx'),
                        method: 'POST',
                        params: {Method: 'getFixedAssetSum'},
                        dataType: "json",
                        waitMsg: {
                            msg: '正在查询...',
                            target: grid,
                            autoClose: true
                        },
                        success: function(action) {
                            money = action.result.sum;
                            
                        },
                        failure: function(action) {
                            var json = JSON.parse(action.responseText);
                            var mbox = Ext.Msg.show({
                                title: RS.$('All_MsgTitle_Error'),
                                msg: json.message,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    }); 
                    params.ReportDate = new Date();
                    params.Money = 12;
                }
            }
        });
        //导航栏"更换"按钮
        me.btnTurn = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '更换',
            store: me.MainGrid,
            sm: me.MainGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.MainGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.Turn();
            }
        });

        //导航栏"金额"按钮
        me.btnSum = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '金额',

            updateStatus: function() {
                this.setDisabled(false);
            },
            handler: function() {
                me.getSum();
            }
        });
        //导航栏'报废'按钮
        me.btnAbolishProject = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '报废',
            store: me.MainGrid,
            sm: me.MainGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.MainGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.Abolish(me.MainGrid);
            }
        });

        me.searchPanel = Ext.create('zgs.FixedAssets.Manage.Panel.SearchPanel', {
            hidden: config.collapseSearchPanel === true,
            region: 'north',
            disableTaskState: true,
            store: me.templateStore
        });

        me.btnSearch = Ext.create('YZSoft.src.button.PanelExpandButton', {
            text: RS.$('All_Search'),
            expandPanel: me.searchPanel
        });

        me.toolBar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                me.btnAddProject,
                me.btnSum,
                me.btnTurn,
                me.btnAbolishProject,
                me.btnExcelExport,
                '->',
                me.btnSearch
            ]
        });

        me.sts = Ext.create('YZSoft.src.sts', {
            tbar: me.toolBar,
            store: me.templateStore,
            sm: me.MainGrid.getSelectionModel(),
            request: {
                params: {
                    Method: 'GetProcessingPermision'
                }
            }
        });

        //头部按钮布局
        me.HeadPanel = Ext.create('Ext.panel.Panel', {
            border: false,
            layout: 'border',
            bodyCls: 'yz-docked-noborder-top',
            items: [me.MainGrid]
        });


        //主表
        me.mainPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            border: false,
            activeItem: 0,
            layout: 'card',
            items: [me.HeadPanel]
        });

        //导航栏布局
        var cfg = {
            title: '',
            layout: 'border',
            border: false,
            tbar: me.toolBar,
            items: [me.searchPanel, me.mainPanel],
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },
    //重大事项"搜索"按钮
    onSearch3Click: function() {
        var me = this,
            store = me.templateStore,
            params = store.getProxy().getExtraParams(),
            st = me.ComboxsjEdit.getValue(),
            keyword = me.Search.getValue();
        Ext.apply(params, {
            SearchYear: st,
            Kword: keyword,
            method: 'GetData',
            HistoryTaskType: 'AllAccessable',
            SpecProcessName: '',
            byYear: '1',
            Year: st,
            SearchType: 'AdvancedSearch',
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
    //监管记录"搜索"按钮
    onSearchClick: function(store, DateCombox, SearchCombox) {
        var me = this,
            params = store.getProxy().getExtraParams(),
            st = DateCombox.getValue(),
            keyword = SearchCombox.getValue();
        Ext.apply(params, {
            SearchYear: st,
            Kword: keyword,
            method: 'GetHistoryTasks',
            HistoryTaskType: 'AllAccessable',
            SpecProcessName: '',
            byYear: '1',
            Year: st,
            SearchType: 'AdvancedSearch',
            PostUserAccount: '',
            PostDateType: 'period',
            TaskStatus: 'all',
            RecipientUserAccount: '',
            Keyword: keyword,
            TaskID: '',
            SerialNum: '',
        });
        store.loadPage(1);
    },
    onActivate: function(times) {
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
        return obj.responseText;
    },
    //添加项目
    addNew: function() {
        var me = this;
        YZSoft.BPM.src.ux.FormManager.openFormApplication('总公司/日常办公/总公司固定资产档案卡', '', 'New', Ext.apply({
            sender: this,
            title: '固定资产档案卡',
            dlgModel: 'Dialog',
            listeners: {
                submit: function(action, data) {
                    me.templateStore.reload({
                        loadMask: {
                            msg: '保存已成功',
                            delay: 'x'
                        },
                        callback: function() {

                        }

                    });
                }
            }
        }, this.dlgCfg));

    },
    read: function(record) {
        var me = this;
        var recs = me.MainGrid.getSelectionModel().getSelection();

        if (recs.length == 0)
            return;

        YZSoft.BPM.src.ux.FormManager.openFormApplication('总公司/日常办公/总公司固定资产档案卡', record.data.AssetID, 'Read', Ext.apply({
            sender: this,
            title: "固定资产档案卡"
        }, this.dlgCfg));
    },
    getSum: function() {
        var me = this,
            grid = me.MainGrid;
        var params = {
            Method: 'getFixedAssetSum'
        };

        YZSoft.Ajax.request({
            url: YZSoft.$url(me, '../StoreDataService/Manage_EvenDateInfo.ashx'),
            method: 'POST',
            params: params,
            dataType: "json",
            waitMsg: {
                msg: '正在查询...',
                target: grid,
                autoClose: true
            },
            success: function(action) {
                money = action.result.sum;
                var mbox = Ext.Msg.show({
                    title: '查询结果',
                    msg: '当前可用固定资产金额为：' + action.result.sum + '元',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.WARNING
                });
            },
            failure: function(action) {
                var json = JSON.parse(action.responseText);
                var mbox = Ext.Msg.show({
                    title: RS.$('All_MsgTitle_Error'),
                    msg: json.message,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        });
    },

    //报废按钮
    Abolish: function(grid) {
        var me = this;
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var params = {
            Method: 'breakOrOut'
        };

        var AssetID;
        var items = [];
        var i = 0;

        Ext.each(recs, function(rec) {
            items.push({
                ID: i,
                AssetID: rec.data.AssetID
            });
            i++;
        });
        var json_taskid=Ext.util.JSON.encode(items);
        var dlg = Ext.create('YZSoft.BPM.src.dialogs.ConfirmDlg', {
            autoShow: true,
            autoClose: true,
            title: '报废确认',
            inform: {
                title: '报废任务',
            },
            label: '请输入报废理由：',
            validateEmpty: true,
            fn: function(btn, text) {
                if (btn != 'ok')
                    return;

                Ext.apply(params, {
                    reason: text,
                    assetID: json_taskid
                });

                YZSoft.Ajax.request({
                    url: YZSoft.$url(me, '../StoreDataService/Manage_EvenDateInfo.ashx'),
                    method: 'POST',
                    params: params,
                    dataType: "json",
                    waitMsg: {
                        msg: '正在报废...',
                        target: grid,
                        autoClose: true
                    },
                    success: function(action) {
                        var json = JSON.parse(action.responseText);

                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.format('{0}个对象已报废！', recs.length),
                                delay: 'x'
                            }
                        });
                    },
                    failure: function(action) {
                        var json = JSON.parse(action.responseText);
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: json.message,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                    }
                });
            }
        });
    },
    //授权
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
    setYear: function() {
        //[['1', '第一季度'], ['2', '第二季度'], ['3', '第三季度'], ['4', '第四季度']]
        var sb = '[';

        var year = new Date().getFullYear();

        for (var i = 0; year - i > 2000; i++) {
            sb += '["' + (year - i) + '"],';
        }
        return eval('(' + sb.substr(0, sb.length - 1) + '])');
    },


    OpenTask: function(record, title) {
        YZSoft.BPM.src.ux.FormManager.openTaskForRead(record.data.TaskID, Ext.apply({}, {
            sender: this,
            title: title
        }));
    },
    //主表点击事件
    gridClick: function() {
        var me = this,
            State,
            recs = me.MainGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length != 1)
            me.btnTurn.setDisabled(true);

        for (var i = 0; i < recs.length; i++) {
            if (recs[i].data.State == '报废') {
                me.btnAbolishProject.setDisabled(true);
            }
        };
    },
    //转出
    Turn: function(grid) {
        var me = this;
        var view = YZSoft.ViewManager.addView(me, 'zgs.FixedAssets.Manage.Panel.Turn', {
            title: '更换保管人',
            closable: true,
            grid: me.MainGrid,
        });
    },
});