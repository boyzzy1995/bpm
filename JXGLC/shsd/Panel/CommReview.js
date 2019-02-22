Ext.define('JXGLC.shsd.Panel.CommReview', {
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
        width: 1000,
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
                property: 'ContractDate',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/CommReviewDataInfo.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SearchYear: year,
                    Kword: '',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '嘉兴管理处-开工审查意见书',
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
        //海塘安全交底表Store
        me.SeawallSecurityStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            sorters: {
                property: 'ContractDate',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/ProSecurityAdviceDataInfo.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SearchYear: year,
                    Kword: '',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '嘉兴管理处-海塘安全交底',
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
        //批后监管检查记录表Store
        me.InspectionRecordStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            sorters: {
                property: 'ContractDate',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/ProSuperviseCheckDataInfo.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SearchYear: year,
                    Kword: '',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '嘉兴管理处-批后监管检查记录表',
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
        //会议记录表Store
        me.MeetingStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            sorters: {
                property: 'ContractDate',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/MeetingDataInfo.ashx'),
                extraParams: {
                    method: 'GetData',
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });
        //主表布局
        me.CommReviewGrid = Ext.create("JXGLC.shsd.Grid.CommReviewGrid", {
            store: me.templateStore,
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.templateStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.Zhuanf(record, "开工审查意见书");

                },
                itemclick: function(grid, record, item, rowIndex, e, eOpts) {
                    me.loadEachStore();
                },
            },
            tools: [{
                type: 'refresh',
                handler: function(event, toolEl, panel) {
                    me.templateStore.reload();
                }
            }]
        });




        //////////////////////////////////海塘安全交底表////////////////////////////////////////////
        //发起流程
        me.btnSeawallSecurity = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加海塘交底安全表',
            store: me.templateStore,
            sm: me.CommReviewGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.CommReviewGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.ChildAddNew("嘉兴管理处-海塘安全交底", "海塘安全交底表- ",me.SeawallSecurityStore,me.btnCorrectionsAttachment);
            }
        });
        //补正附件按钮
        me.btnCorrectionsAttachment = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加补正附件',
            id: 'CA1',
            updateStatus: function() {
                this.setDisabled(true);
            },
            handler: function() {
                me.ChildAddAttachmentNew("嘉兴管理处-补正附件", "补正附件- ", "嘉兴管理处-海塘安全交底", "sonhiddenTaskID1",me.SeawallSecurityGrid,"添加海塘交底安全表");
            }
        });
        //海塘交底安全表Grid
        me.SeawallSecurityGrid = Ext.create("JXGLC.shsd.Grid.SeawallSecurityGrid", {
            tbar: [me.btnSeawallSecurity, me.btnCorrectionsAttachment],
            store: me.SeawallSecurityStore,
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.Zhuanf(record, "海塘交底安全表");
                },
                itemclick: function(grid, record, item, rowIndex, e, eOpts) {
                    var me = this,
                        TaskID,
                        processName,
                        SeawallSecurityStore = me.SeawallSecurityStore,
                        SeawallSecurityparams = SeawallSecurityStore.getProxy().getExtraParams(),

                        recs = me.SeawallSecurityGrid.getSelectionModel().getSelection(),
                        ids = [];

                    Ext.each(recs, function(rec) {
                        ids.push(rec.get("TaskID"));
                        TaskID = rec.get("TaskID");
                        processName = rec.get("");
                    });

                    document.getElementById('sonhiddenTaskID1').innerText = TaskID; //TaskID
                    me.btnCorrectionsAttachment.setDisabled(false);

                },
            },
        });
        ////////////////////////////////////海塘安全交底表/////////////////////////////////////////////





        ////////////////////////////////////批后监管记录表/////////////////////////////////////////////
        //按钮
        me.btnInspectionRecord = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加批后监管记录表',
            store: me.templateStore,
            sm: me.CommReviewGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.CommReviewGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.ChildAddNew("嘉兴管理处-批后监管检查记录表", "批后监管检查记录表- ",me.InspectionRecordStore,me.btnCorrectionsAttachment1);
            }
        });
        //补正附件按钮
        me.btnCorrectionsAttachment1 = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加补正附件',
            id: 'CA2',
            updateStatus: function() {
                this.setDisabled(true);
            },
            handler: function() {
                me.ChildAddAttachmentNew("嘉兴管理处-补正附件", "补正附件- ", "嘉兴管理处-批后监管检查记录表", "sonhiddenTaskID2",me.InspectionRecordGrid,"批后监管检查记录表");
            }
        });
        //批后监管记录表Grid
        me.InspectionRecordGrid = Ext.create("JXGLC.shsd.Grid.InspectionRecordGrid", {
            tbar: [me.btnInspectionRecord, me.btnCorrectionsAttachment1],
            store: me.InspectionRecordStore,
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.InspectionRecordStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.Zhuanf(record,"批后监管记录表");
                },
                itemclick: function(grid, record, item, rowIndex, e, eOpts) {
                    var me = this,
                        TaskID,
                        InspectionRecordStore = me.InspectionRecordStore,
                        InspectionRecordparams = InspectionRecordStore.getProxy().getExtraParams(),

                        recs = me.InspectionRecordGrid.getSelectionModel().getSelection(),
                        ids = [];

                    Ext.each(recs, function(rec) {
                        ids.push(rec.get("TaskID"));
                        TaskID = rec.get("TaskID");
                    });

                    document.getElementById('sonhiddenTaskID2').innerText = TaskID; //TaskID
                    me.btnCorrectionsAttachment1.setDisabled(false);
                },
            },
        });

        ////////////////////////////////////批后监管记录表/////////////////////////////////////////////




        ////////////////////////////////////会议记录表////////////////////////////////////////////////
        //按钮
        me.btnMeeting = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加会议情况记录表',
            store: me.templateStore,
            sm: me.CommReviewGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.CommReviewGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addMeeting("嘉兴管理处-会议情况记录表", "会议情况记录表- ");
            }
        });
        //编辑
        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            text: '编辑',
            margin: 0,
            updateStatus: function() {
                this.setDisabled(true);
            },
            handler: function() {
                me.edit();
            }
        });
        //删除
        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            text: '删除',
            margin: 0,
            updateStatus: function() {
                this.setDisabled(true);
            },
            handler: function() {
                me.deleteSelection();
            }
        });
        me.MeetingGrid = Ext.create("JXGLC.shsd.Grid.MeetingGrid", {
            tbar: [me.btnMeeting, me.btnEdit,me.btnDelete],
            store: me.MeetingStore,
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.MeetingStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    me.read(record);
                },
                itemclick: function(grid, record, item, rowIndex, e, eOpts) {
                    me.btnEdit.setDisabled(false);
                    me.btnDelete.setDisabled(false);
                },
            },
        });
        ////////////////////////////////////会议记录表////////////////////////////////////////////////

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
        //导航栏'添加审查意见书'按钮
        me.btnAddMainContract = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加审查意见书',
            handler: function() {
                me.addNew("嘉兴管理处-开工审查意见书", "添加审查意见书- ",me.templateStore);
            }
        });
        //开工审查意见书添加补正附件按钮
        me.btnMainCorrectionsAttachment = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加补正附件',
            id: 'CA4',
            sm:me.CommReviewGrid,
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.CommReviewGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.AddAttachmentNew("嘉兴管理处-补正附件", "补正附件- ", "嘉兴管理处-开工审查意见书");
            }
        });
        //导航栏"搜索框"
        me.Search = Ext.create('YZSoft.src.form.field.Search', {
            store: me.templateStore,
            width: 160
        });
        
        me.menuPublic = Ext.create('YZSoft.src.button.Button', {
            margin: 0,
            padding: '3 15 3 15',
            text: "授权",
            perm: 'Public',
            store: me.templateStore,
            sm: me.CommReviewGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.CommReviewGrid, this.perm, 1, -1));
            },
            handler: function(item) {
                me.publicFlow(me.CommReviewGrid);
            }
        });

        me.btnhiddenTaskId = Ext.create('YZSoft.src.button.Button', {
            text: '1',
            hidden: true,
            id: 'hiddenTaskID',
        });
        me.btnsonhiddenTaskId1 = Ext.create('YZSoft.src.button.Button', {
            text: '1',
            hidden: true,
            id: 'sonhiddenTaskID1',
        });
        me.btnsonhiddenTaskId2 = Ext.create('YZSoft.src.button.Button', {
            text: '1',
            hidden: true,
            id: 'sonhiddenTaskID2',
        });
        //头部按钮布局
        me.CommReviewPanel = Ext.create('Ext.panel.Panel', {
            border: false,
            layout: 'border',
            bodyCls: 'yz-docked-noborder-top',
            tbar: [me.btnAddMainContract, me.menuPublic,me.btnMainCorrectionsAttachment,"年份查找：", me.ComboxsjEdit, '事件描述', me.Search, me.btnSearch3, me.btnhiddenTaskId, me.btnsonhiddenTaskId1, me.btnsonhiddenTaskId2],
            items: [me.CommReviewGrid]
        });
        //主表
        me.mainPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            border: false,
            activeItem: 0,
            layout: 'card',
            items: [me.CommReviewPanel]
        });
        me.OtherPanel = new Ext.TabPanel({
            region: 'south',
            height: 200,
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
            items: [me.SeawallSecurityGrid, me.InspectionRecordGrid, me.MeetingGrid]
        });
        //导航栏布局
        var cfg = {
            title: '',
            layout: 'border',
            border: false,
            items: [me.mainPanel, me.OtherPanel],
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
            ProcessName: '嘉兴管理处-开工审查意见书',
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
   
    addNew: function(url, title,store) {
        var me=this;
        YZSoft.BPM.src.ux.FormManager.openPostWindow(url, {
            title: title,
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 600,
            listeners: {
                submit: function(name, result) {
                    store.reload({ loadMask: false });
                }
            }
        });
    },
    ChildAddNew: function(url, title,store,btn) {
        var tid;
        tid = document.getElementById('hiddenTaskID').innerText;
        YZSoft.BPM.src.ux.FormManager.openPostWindow(url, {
            title: title,
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 600,
            params: {
                taskid: tid
            },
            listeners: {
                submit: function(name, result) {
                    store.reload({ loadMask: false });
                    btn.setDisabled(true);
                }
            }
        });

    },
    addMeeting: function() {
        var sendvalue;
        var me = this,
            recs = me.CommReviewGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
            sendvalue = rec.get("TaskID");
        });
        YZSoft.BPM.src.ux.FormManager.openFormApplication('嘉兴管理处/涉河涉堤/嘉兴管理处-会议情况记录表','','New', Ext.apply({
            sender: this,
            title: '会议情况记录表',
            dlgModel: 'Dialog',
            params: {
                TaskID: sendvalue
            },
            listeners: {
                submit: function(action, data) {
                    me.MeetingStore.reload({
                        loadMask: {
                            msg: '保存已成功',
                            delay: 'x'
                        },
                        callback: function() {
                            var rec = me.MeetingStore.getById(data.Key);
                            if (rec)
                                me.MeetingGrid.getSelectionModel().select(rec);

                        }

                    });
                     me.btnEdit.setDisabled(true);
                     me.btnDelete.setDisabled(true);
                }
            }
        }, this.dlgCfg));
    },
    edit: function() {
        var me = this,
            TaskID;
        var recs = me.MeetingGrid.getSelectionModel().getSelection();
        var CommReviewrecs = me.CommReviewGrid.getSelectionModel().getSelection();
        if (recs.length == 0)
            return;
        Ext.each(CommReviewrecs, function(rec) {
            TaskID = rec.get("TaskID");
        });
        
        YZSoft.BPM.src.ux.FormManager.openFormApplication('嘉兴管理处/涉河涉堤/嘉兴管理处-会议情况记录表', recs[0].data.Guid, 'Edit', Ext.apply({
            sender: this,
            title: '会议情况记录表',
            dlgModel: 'Dialog',
            params: {
                TaskID: TaskID
            },
            listeners: {
                submit: function(action, data) {
                    me.MeetingStore.reload({
                        loadMask: {
                            msg: '保存已成功',
                            delay: 'x'
                        }
                    });
                }
            }
        }, this.dlgCfg));
    },
    ChildAddAttachmentNew: function(url, title, processName, id,grid) {
        
        var tid = document.getElementById('hiddenTaskID').innerText;
        var sonTid = document.getElementById(id).innerText;
        YZSoft.BPM.src.ux.FormManager.openPostWindow(url, {
            title: title,
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 600,
            params: {
                taskid: tid,
                linktaskid: sonTid,
                processName: processName
            },
            listeners: {
                submit: function(name, result) {
                    //me.store.reload({ loadMask: false });
                }
            }
        });
    },
    AddAttachmentNew:function(url, title, processName){
        var tid = document.getElementById('hiddenTaskID').innerText;
        YZSoft.BPM.src.ux.FormManager.openPostWindow(url, {
            title: title,
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 600,
            params: {
                taskid: tid,
                linktaskid: tid,
                processName: processName
            },
            listeners: {
                submit: function(name, result) {
                    //me.store.reload({ loadMask: false });
                }
            }
        });
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
            recs = me.CommReviewGrid.getSelectionModel().getSelection(),
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
    Zhuanf: function(record, title) {
        YZSoft.BPM.src.ux.FormManager.openTaskForRead(record.data.TaskID, Ext.apply({}, {
            sender: this,
            title: title
        }));
    },
   
    read: function (record) {
        var me = this;
        var recs = me.MeetingGrid.getSelectionModel().getSelection();

        if (recs.length == 0)
            return;
        
        YZSoft.BPM.src.ux.FormManager.openFormApplication('嘉兴管理处/涉河涉堤/嘉兴管理处-会议情况记录表', record.data.Guid, 'Read', Ext.apply({
            sender: this,
            title: "会议情况记录表"
        }, this.dlgCfg));
    },
    loadEachStore: function() {
        var me = this,
            TaskID,
            SeawallSecurityStore = me.SeawallSecurityStore,
            SeawallSecurityparams = SeawallSecurityStore.getProxy().getExtraParams(),

            InspectionRecordStore = me.InspectionRecordStore,
            InspectionRecordparams = InspectionRecordStore.getProxy().getExtraParams(),

            MeetingStore = me.MeetingStore,
            Meetingparams = MeetingStore.getProxy().getExtraParams(),

            recs = me.CommReviewGrid.getSelectionModel().getSelection(),
            ids = [];

        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
            TaskID = rec.get("TaskID");
        });
        Ext.apply(SeawallSecurityparams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(InspectionRecordparams, {
            FatherTaskId: TaskID,
        });

        Ext.apply(Meetingparams, {
            FatherTaskId: TaskID,
        });

        SeawallSecurityStore.loadPage(1);
        InspectionRecordStore.loadPage(1);
        MeetingStore.loadPage(1);

        document.getElementById('hiddenTaskID').innerText = TaskID; //TaskID
        me.setBtnDisabled();
    },
    setBtnDisabled:function(){
        var me=this;
        me.btnCorrectionsAttachment.setDisabled(true);
        me.btnCorrectionsAttachment1.setDisabled(true);
        me.btnEdit.setDisabled(true);
        me.btnDelete.setDisabled(true);
    },
    deleteSelection: function () {
        var me = this,
            recs = me.MeetingGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        Ext.each(recs, function (rec) {
            ids.push(rec.get("Guid"));
        });

        Ext.Msg.show({
            title: '删除确认',
            msg: '您确定要删除选中项吗？',
            buttons: Ext.Msg.OKCANCEL,
            defaultFocus: 'cancel',
            icon: Ext.MessageBox.INFO,

            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url(me, '../StoreDataService/MeetingDataInfo.ashx'),
                    method: 'POST',
                    params: {
                        method: 'delete'
                    },
                    jsonData: ids,
                    waitMsg: { msg: '正在删除...', target: me.MeetingGrid },
                    success: function (action) {
                        me.MeetingStore.reload({
                            loadMask: {
                                msg: Ext.String.format('{0}个对象已删除！', recs.length),
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

                        me.MeetingStore.reload({ mbox: mbox });
                    }
                });
            }
        });
    }
});