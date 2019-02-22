Ext.define('sjy.glsc.Panel.Progress', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.BPM.src.ux.FormManager',
        'YZSoft.BPM.src.model.Task'
    ],
    border: false,
    bodyPadding: '30px',
    referenceHolder: true,
    scrollable: true,
    bodyStyle: 'background-color:#f5f5f5',

    constructor: function(config) {
        var me = this;
        var date = new Date;
        var year = date.getFullYear();
        var sortable = config.sortable !== false;
        var taskid = config.taskid;
        me.user = userInfo;

        var gridDefaults = {
            hideHeaders: false,
            border: true,
            rowLines: true,
            bodyStyle: 'border-top:0;'
            //viewConfig: {
            //    stripeRows: false
            //}
        };

        //项目设计大纲Store
        me.XMSJDGStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/XM_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-项目设计大纲流程',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                    refs.titlePanel.setTitle('项目管理手册', me.user.DisplayName || me.user.Account);
                    
                }
            }
        });

        //工程项目会议记录单Store
        me.CahierStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/CA_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-工程项目会议记录单',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });
        
        
        //设计评审表Store
        me.DesignReviewStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/DR_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-设计评审单表流程',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });
        
        
         //设计文件校审记录表Store
        me.DesDocProRecStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/DDM_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-设计文件校审记录流程',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });
        
        //电话或口头记录表Store
        me.PhoneOrOralRecordStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/PO_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-电话或口头记录表流程',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });

        //接口文件、资料交接记录表Store
        me.InterfaceDataRecordStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/ID_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-接口文件、资料交接记录流程',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });

        //设计审查会议纪要表Store
        me.SumOfTheDesRevConferenceStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/SOT_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-设计审查会议纪要',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });
        
        //技术质量、环境、安全交底记录表Store
        me.TecQuaEnvSafRecStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/TQE_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-技术质量、环境、安全交底记录表',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });
        
        //设计变更通知单流程Store
        me.DesignChangeNoticeStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/DCN_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-设计变更通知单流程',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });

         //服务报告单流程Store
        me.GenerationServiceReportStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/GSR_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-服务报告单流程',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });

        //技术资料归档审批表流程store
        me.DatArExaAndApprovalStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/DAE_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-技术资料归档审批表流程',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });

        //基础资料Store
        me.BasicDataStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/BDA_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-项目进度要求修改流程',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });

        //查看修改进度Store
        me.CheckDetailStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/TimeChange_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-基础资料附件表流程',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });

        //增加项目组成员进度Store
        me.AddTeamMemberStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/PM_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-项目成员增加',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: taskid,
                    Progress: 'progress'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                }
            }
        });

        me.XMSJDGGrid = Ext.create('sjy.glsc.Grid.XMSJDGGrid', Ext.apply({
            store: me.XMSJDGStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));

        me.CahierGrid = Ext.create('sjy.glsc.Grid.CahierGrid', Ext.apply({
            store: me.CahierStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));
        
        me.DesignReviewGrid = Ext.create('sjy.glsc.Grid.DesignReviewGrid', Ext.apply({
            store: me.DesignReviewStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));
        
        me.DesDocProRecGrid = Ext.create('sjy.glsc.Grid.DesDocProRecGrid', Ext.apply({
            store: me.DesDocProRecStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));

        me.PhoneOrOralRecordGrid = Ext.create('sjy.glsc.Grid.PhoneOrOralRecordGrid', Ext.apply({
            store: me.PhoneOrOralRecordStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));
        
        me.InterfaceDataRecordGrid = Ext.create('sjy.glsc.Grid.InterfaceDataRecordGrid', Ext.apply({
            store: me.InterfaceDataRecordStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));
        
        me.SumOfTheDesRevConferenceGrid = Ext.create('sjy.glsc.Grid.SumOfTheDesRevConferenceGrid', Ext.apply({
            store: me.SumOfTheDesRevConferenceStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));
        
        me.TecQuaEnvSafRecGrid = Ext.create('sjy.glsc.Grid.TecQuaEnvSafRecGrid', Ext.apply({
            store: me.TecQuaEnvSafRecStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));

         me.DesignChangeNoticeGrid = Ext.create('sjy.glsc.Grid.DesignChangeNoticeGrid', Ext.apply({
            store: me.DesignChangeNoticeStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));
        
        me.GenerationServiceReportGrid = Ext.create('sjy.glsc.Grid.GenerationServiceReportGrid', Ext.apply({
            store: me.GenerationServiceReportStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));

        me.DatArExaAndApprovalGrid = Ext.create('sjy.glsc.Grid.DatArExaAndApprovalGrid', Ext.apply({
            store: me.DatArExaAndApprovalStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));

        me.BasicDataGrid = Ext.create('sjy.glsc.Grid.BasicDataGrid', Ext.apply({
            store: me.BasicDataStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));
        
        me.CheckDetailGrid = Ext.create('sjy.glsc.Grid.CheckDetailGrid', Ext.apply({
            store: me.CheckDetailStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));

        me.AddTeamMemberGrid = Ext.create('sjy.glsc.Grid.AddTeamMemberGrid', Ext.apply({
            store: me.AddTeamMemberStore,
            viewConfig: {
                getRowClass: function(record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));

        var cfg = {
            tbar: ['->', me.btnRefresh],
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'begin'
            },
            defaults: {
                xtype: 'panel',
                border: false,
                bodyStyle: 'background-color:transparent'
            },
            items: [{
                xtype: 'panel',
                title: '',
                reference: 'titlePanel',
                ui: 'yzplain',
                style: 'background-color:transparent;',
                padding: '5px',
                margin: '0 0px 0px 0',
                width: 1200
            }, {
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'begin'
                },
                defaults: {
                    xtype: 'panel',
                    border: false,
                    width: 1200,
                    bodyStyle: 'background-color:transparent',
                    defaults: {
                        xtype: 'panel',
                        ui: 'yzplain',
                        layout: 'anchor',
                        padding: '20px',
                        margin: '0 30px 30px 0'
                    }
                },
                items: [{
                    items: [{
                        reference: 'XMSJDGGrid',
                        header: {
                            title: '项目设计大纲',
                        },
                        items: [
                            me.XMSJDGGrid
                        ]
                    }, {
                        reference: 'CahierGrid',
                        header: {
                            title: '工程会议记录单',
                        },
                        items: [
                            me.CahierGrid
                        ]
                    },{
                        reference: 'DesignReviewGrid',
                        header: {
                            title: '设计评审单',
                        },
                        items: [
                            me.DesignReviewGrid
                        ]
                    },{
                        reference: 'DesDocProRecGrid',
                        header: {
                            title: '设计文件校审记录表',
                        },
                        items: [
                            me.DesDocProRecGrid
                        ]
                    },{
                        reference: 'PhoneOrOralRecordGrid',
                        header: {
                            title: '电话或口头记录表',
                        },
                        items: [
                            me.PhoneOrOralRecordGrid
                        ]
                    },{
                        reference: 'InterfaceDataRecordGrid',
                        header: {
                            title: '接口文件、资料交接记录表',
                        },
                        items: [
                            me.InterfaceDataRecordGrid
                        ]
                    },{
                        reference: 'SumOfTheDesRevConferenceGrid',
                        header: {
                            title: '设计审查会议纪要',
                        },
                        items: [
                            me.SumOfTheDesRevConferenceGrid
                        ]
                    },{
                        reference: 'TecQuaEnvSafRecGrid',
                        header: {
                            title: '技术质量/环境/安全交底记录表',
                        },
                        items: [
                            me.TecQuaEnvSafRecGrid
                        ]
                    },{
                        reference: 'DesignChangeNoticeGrid',
                        header: {
                            title: '设计变更通知单表',
                        },
                        items: [
                            me.DesignChangeNoticeGrid
                        ]
                    },{
                        reference: 'GenerationServiceReportGrid',
                        header: {
                            title: '服务报告单表',
                        },
                        items: [
                            me.GenerationServiceReportGrid
                        ]
                    },{
                        reference: 'DatArExaAndApprovalGrid',
                        header: {
                            title: '技术资料归档审批表',
                        },
                        items: [
                            me.DatArExaAndApprovalGrid
                        ]
                    },{
                        reference: 'BasicDataGrid',
                        header: {
                            title: '基础资料',
                        },
                        items: [
                            me.BasicDataGrid
                        ]
                    },{
                        reference: 'CheckDetailGrid',
                        header: {
                            title: '修改进度',
                        },
                        items: [
                            me.CheckDetailGrid
                        ]
                    },{
                        reference: 'AddTeamMemberGrid',
                        header: {
                            title: '增加项目组成员',
                        },
                        items: [
                            me.AddTeamMemberGrid
                        ]
                    }]
                }]
            }]
        };


        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function(times) {
        if (times == 0) {
            this.XMSJDGStore.load({});
            this.CahierStore.load({});
            this.DesignReviewStore.load({});
            this.DesDocProRecStore.load({});
            this.PhoneOrOralRecordStore.load({});
            this.InterfaceDataRecordStore.load({});
            this.SumOfTheDesRevConferenceStore.load({});
            this.TecQuaEnvSafRecStore.load({});
            this.DesignChangeNoticeStore.load({});
            this.GenerationServiceReportStore.load({});
            this.DatArExaAndApprovalStore.load({});
            this.BasicDataStore.load({});
            this.CheckDetailStore.load({});
            this.AddTeamMemberStore.load({});
        } else {
            this.XMSJDGStore.reload({ loadMask: false });
            this.CahierStore.reload({ loadMask: false });
            this.DesignReviewStore.reload({ loadMask: false });
            this.DesDocProRecStore.reload({ loadMask: false });
            this.PhoneOrOralRecordStore.reload({ loadMask: false });
            this.InterfaceDataRecordStore.reload({ loadMask: false });
            this.SumOfTheDesRevConferenceStore.reload({ loadMask: false });
            this.TecQuaEnvSafRecStore.reload({ loadMask: false });
            this.DesignChangeNoticeStore.reload({ loadMask: false });
            this.GenerationServiceReportStore.reload({ loadMask: false });
            this.DatArExaAndApprovalStore.reload({ loadMask: false });
            this.BasicDataStore.reload({ loadMask: false });
            this.CheckDetailStore.reload({ loadMask: false });
            this.AddTeamMemberStore.reload({ loadMask: false });
        }
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
    renderSN: function(value, p, record) {
        return Ext.String.format("<a href='#'>{0}</a>", YZSoft.HttpUtility.htmlEncode(value));
    },

    onClickSN: function(view, cell, recordIndex, cellIndex, e, record) {
        if (e.getTarget().tagName == 'A')
            this.openForm(record);
    },

    openForm: function(record, config) {
        YZSoft.BPM.src.ux.FormManager.openTaskForRead(record.data.TaskID, Ext.apply(config || {}, {
            sender: this,
            title: Ext.String.format('{0}-{1}', record.data.ProcessName, record.data.SerialNum)
        }));
    }
});