Ext.define('sjy.glsc.Panel.ProductRegistrationPersonal', {
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
        width: 826,
        height: 500
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
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/ProductRegistrantion/PRe_PersonEventInfoData.ashx'),
                extraParams: {
                    method: 'GetData',
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });
        
        //主表布局
        me.temlateGrid = Ext.create("Ext.grid.Panel", {
            title: '个人成品登记表',
            region: 'center',
            store: me.templateStore,
            border: false,
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, {mode:'MULTI'}),
            columns: {
                defaults: {},
                items: [{
                    xtype: 'rownumberer'
                }, {
                    header: '项目编号',
                    dataIndex: 'No',
                    width: 80,
                    align: 'left'
                }, {
                    header: '成品名称',
                    dataIndex: 'Title',
                    width: 450,
                    align: 'left'
                },{
                    header: '阶段',
                    dataIndex: 'Stage',
                    width: 80,
                    align: 'left'
                },{
                    header: '政府批文',
                    dataIndex: 'GovComment',
                    width: 120,
                    align: 'left'
                },{
                    header: '登记人',
                    dataIndex: 'Registrant',
                    width: 100,
                    align: 'left'
                },{
                    header: '登记时间',
                    dataIndex: 'LaunchDate',
                    width: 80,
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
                    this.read();
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

        //年份查找下拉列表框
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

        //导航栏'授权'按钮 
        me.MenuPublic = Ext.create('YZSoft.src.button.Button', {
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
         //阶段
        me.Stage = new Ext.form.ComboBox({    
            store: new Ext.data.ArrayStore({
                fields: ['Stage'],
                data: [
                    ['规划'],
                    ['咨询'],
                    ['方案'],
                    ['科研'],
                    ['初设'],
                    ['施工图']
                ] //[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
            }),
            displayField: 'Stage',
            valueField : 'Stage',
            typeAhead: true,
            mode: 'local',
            forceSelection: false,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: true,
            lastQuery: '',
            value: ''
        });

        //导航栏'新增'按钮
        me.btnAddProject = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '新增',
            handler: function() {
                me.addNew();
            }
        });

        //导航栏'编辑'按钮
        me.btnEditProject = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '编辑',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.edit();
            }
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
        //头部按钮布局
        me.temlatePanel = Ext.create('Ext.panel.Panel', {
            border: false,
            layout: 'border',
            tbar:[me.btnAddProject,me.btnEditProject,me.MenuPublic,"年份查找:",me.ComboxsjEdit,"阶段:",me.Stage,'事件描述', me.Search, me.btnSearch3],
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
            items: [me.mainPanel],
        };
        Ext.apply(cfg, config);
        me.callParent([cfg]);

    },

    //添加项目
    addNew: function() {
        var me = this;
        YZSoft.BPM.src.ux.FormManager.openFormApplication('设计院/管理手册/成品登记表', '', 'New', Ext.apply({
            sender: this,
            title: '成品登记表',
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

    //编辑项目
    edit: function() {
        var me = this;
        var sm = me.temlateGrid.getSelectionModel(),
            recs = sm.getSelection() || [];
        var TaskID;
        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function(rec) {
                TaskID=rec.get("id");
        });

        YZSoft.BPM.src.ux.FormManager.openFormApplication('设计院/管理手册/成品登记表',TaskID, 'edit', Ext.apply({
            sender: this,
            title: '成品登记表',
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

    //查看项目
    read: function() {
        var me = this;
        var sm = me.temlateGrid.getSelectionModel(),
            recs = sm.getSelection() || [];
        var TaskID;
        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function(rec) {
                TaskID=rec.get("id");
        });

        YZSoft.BPM.src.ux.FormManager.openFormApplication('设计院/管理手册/成品登记表',TaskID, 'read', Ext.apply({
            sender: this,
            title: '成品登记表',
            dlgModel: 'Dialog',
        }, this.dlgCfg));
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
    onSearch3Click: function() {
        var me = this,
        store = me.templateStore,
        params = store.getProxy().getExtraParams(),
        SearchYear = me.ComboxsjEdit.getValue();
        Keyword = me.Search.getValue();
        Stage = me.Stage.getValue();
        Ext.apply(params, {
            Kword:Keyword,
            beginYear: SearchYear,
            stage:Stage
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
     publicFlow: function(grid) {
        var me=this;
        var account;
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];
     
        if (recs.length == 0)
            return;
  
        var params = {
            Method: 'authorizedUser'
        };
        var wid;
        var items = [];
        Ext.each(recs, function(rec) {
            wid=rec.get("id");
            items.push({
                wid: rec.get("id"),
                /*wid: rec.data.TaskID*/
            });
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
                    url: YZSoft.$url(me,'../StoreDataService/EventInfoData/ProductRegistrantion/PRe_PersonEventInfoData.ashx'),
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
});
