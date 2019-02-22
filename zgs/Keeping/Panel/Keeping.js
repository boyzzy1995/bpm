Ext.define('zgs.FixedAssets.Keeping.Panel.Keeping', {
    //继承的panel
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.BPM.src.model.Draft',
        'YZSoft.BPM.src.ux.Render',
        'YZSoft.BPM.src.ux.FormManager',
        'YZSoft.src.menu.Item',
        'YZSoft.src.ux.RecordSecurityManager',
        'YZSoft.BPM.TaskOperation.Manager',
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
                url: YZSoft.$url(me, '../StoreDataService/Keeping_EventDataInfo.ashx'),
                extraParams: {
                    method: 'GetData',
                    SearchYear: year,
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });

        //主表布局
        me.MainGrid = Ext.create("zgs.FixedAssets.Keeping.Grid.KeepingGrid", {
            store: me.templateStore,
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.templateStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.read(record);

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
         me.toolBar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                "年份查找：", me.ComboxsjEdit,'事件描述', me.Search, me.btnSearch3
            ]
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
            tbar: me.toolBar,
            border: false,
            items: [me.mainPanel, me.OtherPanel],
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
     onSearchClick: function(store,DateCombox,SearchCombox) {
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
    //添加项目
    addNew: function() {
        var me = this;
        YZSoft.BPM.src.ux.FormManager.openFormApplication('设计院/日常办公/固定资产档案卡', '', 'New', Ext.apply({
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

        YZSoft.BPM.src.ux.FormManager.openFormApplication('设计院/日常办公/固定资产档案卡', record.data.AssetID, 'Read', Ext.apply({
            sender: this,
            title: "固定资产保管"
        }, this.dlgCfg));
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
    }
});