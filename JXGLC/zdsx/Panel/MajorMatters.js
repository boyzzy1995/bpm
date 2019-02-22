Ext.define('JXGLC.zdsx.Panel.MajorMatters', {
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
                property: 'LaunchDate',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/Project_EvenDataInfo.ashx'),
                extraParams: {
                    method: 'GetData',
                    Year: year,
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });
        //日常监管表Store
        me.DailyRegulationStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            sorters: {
                property: 'ContractDate',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/Daily_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SearchYear: year,
                    Kword: '',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '嘉兴管理处-日常监管',
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
        //专项监管表Store
        me.SpecialSupervisionStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            sorters: {
                property: 'ContractDate',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/Special_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SearchYear: year,
                    Kword: '',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '嘉兴管理处-专项监管',
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
        me.MainGrid = Ext.create("JXGLC.zdsx.Grid.MainGrid", {
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




        //////////////////////////////////日常监管////////////////////////////////////////////

        //发起流程
        me.btnDailyRegulation = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加整改信息',
            updateStatus: function() {
                this.setDisabled(true);
            },
            handler: function() {
                me.addModifyInfo("嘉兴管理处-嘉兴管理处河道堤防重点工程与面上项目整改", "添加整改信息- ", me.DailyRegulationStore);
            }
        });
        //授权
        me.DailyMenuPublic = Ext.create('YZSoft.src.button.Button', {
            margin: 0,
            padding: '3 15 3 15',
            text: "授权",
            perm: 'Public',
            updateStatus: function() {
                this.setDisabled(true);
            },
            handler: function(item) {
                me.publicFlow(me.DailyRegulationGrid);
            }
        });
        //查看整改信息
        me.btnDailyCheckInfo = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '查看整改信息',
            id: 'C1',
            updateStatus: function() {
                this.setDisabled(true);
            },
            handler: function() {
                me.readModifyInfo("嘉兴管理处/重大事项/嘉兴管理处-嘉兴管理处河道堤防重点工程与面上项目整改", "查看整改信息- ", me.DailyRegulationGrid);
            }
        });
        //下拉列表框
        me.DailyDateComboxs = new Ext.form.ComboBox({
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
        me.DailySearchComboxs = Ext.create('YZSoft.src.form.field.Search', {
            store: me.templateStore,
            width: 160
        });
        //导航栏'搜索'按钮
        me.btnDailySearch = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: RS.$('All_Search'),
            handler: function() {
                me.onSearchClick(me.DailyRegulationStore, me.DailyDateComboxs, me.DailySearchComboxs);
            }
        });
        //日常监管表Grid
        me.DailyRegulationGrid = Ext.create("JXGLC.zdsx.Grid.DailyRegulationGrid", {
            tbar: [me.btnDailyRegulation, me.DailyMenuPublic, me.btnDailyCheckInfo, "年份查找：", me.DailyDateComboxs, '事件描述', me.DailySearchComboxs, me.btnDailySearch],
            store: me.DailyRegulationStore,
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.DailyRegulationStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.OpenTask(record, "日常监管记录表");
                },
                itemclick: function(grid, record, item, rowIndex, e, eOpts) {
                    var me = this,
                        TaskID,
                        DailyRegulationStore = me.DailyRegulationStore,
                        DailyRegulationparams = DailyRegulationStore.getProxy().getExtraParams(),

                        recs = me.DailyRegulationGrid.getSelectionModel().getSelection(),
                        ids = [];

                    Ext.each(recs, function(rec) {
                        ids.push(rec.get("TaskID"));
                        TaskID = rec.get("TaskID");

                    });

                    document.getElementById('TaskID1').innerText = TaskID; //TaskID

                    me.btnDailyCheckInfo.setDisabled(false);
                    me.btnDailyRegulation.setDisabled(false);
                    me.DailyMenuPublic.setDisabled(false);
                },
            },
        });
        ////////////////////////////////////日常监管/////////////////////////////////////////////





        ////////////////////////////////////专项监管/////////////////////////////////////////////
        //按钮
        me.btnSpecialSupervision = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加整改信息',
            updateStatus: function() {
                this.setDisabled(true);
            },
            handler: function() {
                me.addModifyInfo("嘉兴管理处-嘉兴管理处河道堤防重点工程与面上项目整改", "添加整改信息- ", me.SpecialSupervisionStore);
            }
        });
        //授权
        me.SpecialMenuPublic = Ext.create('YZSoft.src.button.Button', {
            margin: 0,
            padding: '3 15 3 15',
            text: "授权",
            perm: 'Public',
            updateStatus: function() {
                this.setDisabled(true);
            },
            handler: function(item) {
                me.publicFlow(me.SpecialSupervisionGrid);
            }
        });
        //查看整改信息
        me.btnSpecialCheckInfo = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '查看整改信息',
            id: 'C2',
            updateStatus: function() {
                this.setDisabled(true);
            },
            handler: function() {
                me.readModifyInfo("嘉兴管理处/重大事项/嘉兴管理处-嘉兴管理处河道堤防重点工程与面上项目整改", "查看整改信息- ", me.SpecialSupervisionGrid);
            }
        });
        //下拉列表框
        me.SpecialDateComboxs = new Ext.form.ComboBox({
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
        me.SpecialSearchComboxs = Ext.create('YZSoft.src.form.field.Search', {
            store: me.templateStore,
            width: 160
        });
        //导航栏'搜索'按钮
        me.btnSpecialSearch = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: RS.$('All_Search'),
            handler: function() {
                me.onSearchClick(me.SpecialSupervisionStore, me.SpecialDateComboxs, me.SpecialSearchComboxs);
            }
        });
        //专项监管记录表Grid
        me.SpecialSupervisionGrid = Ext.create("JXGLC.zdsx.Grid.SpecialSupervisionGrid", {
            tbar: [me.btnSpecialSupervision, me.SpecialMenuPublic, me.btnSpecialCheckInfo, "年份查找：", me.SpecialDateComboxs, '事件描述', me.SpecialSearchComboxs, me.btnSpecialSearch],
            store: me.SpecialSupervisionStore,
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.SpecialSupervisionStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.OpenTask(record, "专项监管表");
                },
                itemclick: function(grid, record, item, rowIndex, e, eOpts) {
                    var me = this,
                        TaskID,
                        SpecialSupervisionStore = me.SpecialSupervisionStore,
                        SpecialSupervisionparams = SpecialSupervisionStore.getProxy().getExtraParams(),

                        recs = me.SpecialSupervisionGrid.getSelectionModel().getSelection(),
                        ids = [];

                    Ext.each(recs, function(rec) {
                        ids.push(rec.get("TaskID"));
                        TaskID = rec.get("TaskID");
                    });

                    document.getElementById('TaskID1').innerText = TaskID; //TaskID

                    me.SpecialMenuPublic.setDisabled(false);
                    me.btnSpecialCheckInfo.setDisabled(false);
                    me.btnSpecialSupervision.setDisabled(false);
                },
            },
        });

        ////////////////////////////////////专项监管/////////////////////////////////////////////

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

        //导航栏'添加项目'按钮
        me.btnAddProject = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '添加项目',
            handler: function() {
                me.addNew();
            }
        });
        me.btnAddDaily = Ext.create('YZSoft.src.button.Button', {
            margin: 0,
            padding: '3 15 3 15',
            text: "添加日常监管记录",
            perm: 'Public',
            store: me.templateStore,
            sm: me.MainGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.MainGrid, this.perm, 1, -1));
            },
            handler: function(item) {
                me.ChildAddNew('嘉兴管理处-日常监管', '日常监管记录表', me.DailyRegulationStore);
            }
        });
        me.btnAddSpecial = Ext.create('YZSoft.src.button.Button', {
            margin: 0,
            padding: '3 15 3 15',
            text: "添加专项监管记录",
            perm: 'Public',
            store: me.templateStore,
            sm: me.MainGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.MainGrid, this.perm, 1, -1));
            },
            handler: function(item) {
                me.ChildAddNew('嘉兴管理处-专项监管', '专项监管记录表', me.SpecialSupervisionStore);
            }
        });
        //导航栏'结束项目'按钮
        me.btnEndProject = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '结束项目',
            store: me.MainGrid,
            sm: me.MainGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.MainGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.EndAndAbolishClick('endProject', '结束');
            }
        });
        //导航栏'通知归档'按钮
        me.btnNoticeFinished = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '通知归档',
            store: me.MainGrid,
            sm: me.MainGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.MainGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.NoticeFinished();
            }
        });

        me.btnhiddenTaskId = Ext.create('YZSoft.src.button.Button', {
            text: '1',
            hidden: true,
            id: 'TaskID',
        });
        me.btnsonhiddenTaskId1 = Ext.create('YZSoft.src.button.Button', {
            text: '1',
            hidden: true,
            id: 'TaskID1',
        });
        me.btnsonhiddenTaskId2 = Ext.create('YZSoft.src.button.Button', {
            text: '1',
            hidden: true,
            id: 'TaskID2',
        });
        //头部按钮布局
        me.HeadPanel = Ext.create('Ext.panel.Panel', {
            border: false,
            layout: 'border',
            bodyCls: 'yz-docked-noborder-top',
            tbar: [me.btnAddProject, me.btnAddDaily, me.btnAddSpecial, me.btnEndProject, me.btnNoticeFinished, "年份查找：", me.ComboxsjEdit, '事件描述', me.Search, me.btnSearch3, me.btnhiddenTaskId, me.btnsonhiddenTaskId1, me.btnsonhiddenTaskId2],
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
            items: [me.DailyRegulationGrid, me.SpecialSupervisionGrid]
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
        YZSoft.BPM.src.ux.FormManager.openFormApplication('嘉兴管理处/重大事项/嘉兴管理处-嘉兴管理处河道堤防重点工程与面上项目', '', 'New', Ext.apply({
            sender: this,
            title: '嘉兴管理处河道堤防重点工程与面上项目',
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
    //添加日常监管，专项监管记录表
    ChildAddNew: function(url, title, store) {
        var tid = document.getElementById('TaskID').innerText,
            me = this,
            XMState,
            recs = me.MainGrid.getSelectionModel().getSelection();
        if (recs.length == 0)
            return;
        Ext.each(recs, function(rec) {
            XMState = rec.get("State");
        });
        if (XMState == '已结束') {
            var mbox = Ext.Msg.show({
                title: '错误提示',
                msg: '该项目已经结束不能再添加相关记录!',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }
        YZSoft.BPM.src.ux.FormManager.openPostWindow(url, {
            title: title,
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 600,
            params: {
                FTaskId: tid
            },
            listeners: {
                submit: function(name, result) {
                    store.reload({ loadMask: false });
                }
            }
        });

    },
    read: function(record) {
        var me = this;
        var recs = me.MainGrid.getSelectionModel().getSelection();

        if (recs.length == 0)
            return;

        YZSoft.BPM.src.ux.FormManager.openFormApplication('嘉兴管理处/重大事项/嘉兴管理处-嘉兴管理处河道堤防重点工程与面上项目', record.data.TaskID, 'Read', Ext.apply({
            sender: this,
            title: "重大事项"
        }, this.dlgCfg));
    },
    //添加整改信息
    addModifyInfo: function(url, title, store) {
        var tid = document.getElementById('TaskID1').innerText,
            me = this,
            XMState,
            recs = me.MainGrid.getSelectionModel().getSelection();
        if (recs.length == 0)
            return;
        Ext.each(recs, function(rec) {
            XMState = rec.get("State");
        });
        if (XMState == '已结束') {
            var mbox = Ext.Msg.show({
                title: '错误提示',
                msg: '该项目已经结束不能再添加整改信息!',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }
        YZSoft.BPM.src.ux.FormManager.openPostWindow(url, {
            title: title,
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 600,
            params: {
                FTaskId: tid
            },
            listeners: {
                submit: function(name, result) {

                }
            }
        });
    },
    //查看整改信息
    readModifyInfo: function(url, title, grid) {
        var tid;
        var recs = grid.getSelectionModel().getSelection();
        tid = document.getElementById('TaskID1').innerText;
        var me = this;
        YZSoft.Ajax.request({
            url: YZSoft.$url(me, '../StoreDataService/Daily_EventInfoData.ashx'),
            method: 'POST',
            params: {
                method: 'getTaskIDForRec',
                TaskID: tid
            },
            dataType: "json",
            success: function(action) {
                var json = JSON.parse(action.responseText);
                if (json.TaskID == '') {
                    var mbox = Ext.Msg.show({
                        title: '错误提示',
                        msg: '该记录还没添加整改信息!',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                } else {
                    me.Zhuanf(json.TaskID);
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
    //结束按钮
    EndAndAbolishClick: function(met, txt) {
        var me = this,
            TaskID,
            recs = me.MainGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;
        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
            TaskID = rec.get("TaskID");
        });

        Ext.Msg.show({
            title: txt + '确认',
            msg: '您确定要' + txt + '选中项吗？',
            buttons: Ext.Msg.OKCANCEL,
            defaultFocus: 'cancel',
            icon: Ext.MessageBox.INFO,

            fn: function(btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url(me, '../StoreDataService/Project_EvenDataInfo.ashx'),
                    method: 'POST',
                    params: {
                        method: met,
                        TaskID: TaskID
                    },
                    jsonData: ids,
                    waitMsg: {
                        msg: '正在' + txt + '...',
                        target: me.grid
                    },
                    success: function(action) {
                        me.templateStore.reload({
                            loadMask: {
                                msg: Ext.String.format('{0}个对象已' + txt + '！', recs.length),
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
    NoticeFinished: function() {
        var me = this,
            TaskID,
            recs = me.MainGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;
        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
            TaskID = rec.get("TaskID");
        });
        YZSoft.SelUsersDlg.show({
            fn: function(users) {
                if (users.length == 0)
                    return;

                var accounts = [],
                    dspNames = [];

                Ext.each(users, function(user) {
                    accounts.push(user.Account);
                   
                });

             

                YZSoft.Ajax.request({
                    url: YZSoft.$url(me, '../StoreDataService/Project_EvenDataInfo.ashx'),
                    method: 'POST',
                    params: {
                        method: 'informeArchival',
                        TaskID: TaskID,
                        accounts: accounts
                    },
                    jsonData: {
                        TaskID: TaskID,
                        accounts: accounts
                    },
                    success: function(action) {
                        var json = JSON.parse(action.responseText);
                        if (json) {
                            var mbox = Ext.Msg.show({
                                title: '成功提示',
                                msg: '发送信息成功!',
                                buttons: Ext.Msg.OK,

                            });
                        } else {
                            var mbox = Ext.Msg.show({
                                title: '错误提示',
                                msg: '发送信息失败请与管理员联系!',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.WARNING
                            });
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
    //查看整改信息的方法
    Zhuanf: function(tid) {
        YZSoft.BPM.src.ux.FormManager.openTaskForRead(tid, Ext.apply({}, {
            sender: this,
            title: '查看整改信息'
        }));
    },
    //主表点击事件
    loadEachStore: function() {
        var me = this,
            TaskID,
            XMState,
            DailyRegulationStore = me.DailyRegulationStore,
            DailyRegulationparams = DailyRegulationStore.getProxy().getExtraParams(),

            SpecialSupervisionStore = me.SpecialSupervisionStore,
            SpecialSupervisionparams = SpecialSupervisionStore.getProxy().getExtraParams(),

            recs = me.MainGrid.getSelectionModel().getSelection(),
            ids = [];

        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
            TaskID = rec.get("TaskID");
            XMState = rec.get("State");
        });
        Ext.apply(DailyRegulationparams, {
            FTaskId: TaskID,
        });
        Ext.apply(SpecialSupervisionparams, {
            FTaskId: TaskID,
        });

        DailyRegulationStore.loadPage(1);
        SpecialSupervisionStore.loadPage(1);

        document.getElementById('TaskID').innerText = TaskID; //TaskID
        me.clearBtn();
        if (XMState == '已结束') {
            me.btnEndProject.setDisabled(true);
        }

    },
    clearBtn: function() {
        var me = this;
        me.btnDailyCheckInfo.setDisabled(true);
        me.btnDailyRegulation.setDisabled(true);
        me.DailyMenuPublic.setDisabled(true);
        me.SpecialMenuPublic.setDisabled(true);
        me.btnSpecialCheckInfo.setDisabled(true);
        me.btnSpecialSupervision.setDisabled(true);
    }
});