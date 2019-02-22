Ext.define('sjy.glsc.Panel.ManagementManual', {
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
        'sjy.glsc.Grid.XMSJDGGrid',
        'sjy.glsc.Grid.CahierGrid',
        'sjy.glsc.Grid.DesignReviewGrid',
        'sjy.glsc.Grid.DesDocProRecGrid',
        'sjy.glsc.Grid.PhoneOrOralRecordGrid',
        'sjy.glsc.Grid.InterfaceDataRecordGrid',
        'sjy.glsc.Grid.SumOfTheDesRevConferenceGrid',
        'sjy.glsc.Grid.TecQuaEnvSafRecGrid',
        'sjy.glsc.Grid.DesignChangeNoticeGrid',
        'sjy.glsc.Grid.GenerationServiceReportGrid',
        'sjy.glsc.Grid.DatArExaAndApprovalGrid',

    ],
    dlgCfg: {
        dlgModel: 'Dialog', //Tab,Window,Dialog
        width: 900,
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
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/TN_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SearchYear: year,
                    Kword: '',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-任务通知单流程',
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
        //项目设计大纲Store
        me.XMSJDGStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
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
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });
  //站局领导沟通表
        me.LeaderReportStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                /*property: 'LaunchDate',
                direction: 'DESC'*/
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/Report/RR_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SearchYear: year,
                    Kword: '',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-站局领导汇报流程',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    /*FTaskid: tid ,*/
                    SerialNum: '',
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });
        //工程项目会议记录单Store
        me.CahierStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
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
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });
        //设计审评表Store
        me.DesignReviewStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
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
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });
        //设计文件校审记录表Store
        me.DesDocProRecStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
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
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        //设计文件校审记录表快速流程Store
        me.DesDocProRecNormalStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/DDMY_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SpecProcessName: '',
                    byYear: '1',
                    Year: year,
                    SearchType: 'AdvancedSearch',
                    ProcessName: '设计院-管理手册-设计文件校审记录流程(快速流程)',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });
        //电话或口头记录表Store
        me.PhoneOrOralRecordStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
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
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });
        //接口文件、资料交接记录表Store
        me.InterfaceDataRecordStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {

            },
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
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });
        //设计审查会议纪要表Store
        me.SumOfTheDesRevConferenceStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
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
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });
        //技术质量/环境/安全交底记录表Store
        me.TecQuaEnvSafRecStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
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
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });
        //设计变更通知单表Store
        me.DesignChangeNoticeStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
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
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        //服务报告单表Store
        me.GenerationServiceReportStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
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
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        //资料归档审批单表Store
        me.DatArExaAndApprovalStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
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
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        //基础资料Store
        me.BasicDataStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                property: 'LaunchDate',
                direction: 'DESC'
            },
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
                    ProcessName: '设计院-管理手册-基础资料附件表流程',
                    PostUserAccount: '',
                    PostDateType: 'period',
                    TaskStatus: 'all',
                    RecipientUserAccount: '',
                    Keyword: '',
                    TaskID: '',
                    SerialNum: '',
                    FatherTaskId: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        //查看修改进度Store
        me.CheckDetailStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            // model: 'Ext.data.Model',
            sorters: {
                /*property: 'LaunchDate',
                direction: 'DESC'*/
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/TimeChange_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    SearchYear: year,
                    Kword: '',
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
                    /*FTaskid: tid ,*/
                    SerialNum: '',
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });
      

        //主表布局
        me.temlateGrid = Ext.create("Ext.grid.Panel", {
            title: '任务通知单',
            region: 'center',
            store: me.templateStore,
            border: false,
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, { mode: 'MULTI' }),
            columns: {
                defaults: {},
                items: [{
                    xtype: 'rownumberer'
                }, {
                    header: '项目编号',
                    dataIndex: 'Pro_NO',
                    width: 150,
                    align: 'left'
                }, {
                    header: '项目名称',
                    dataIndex: 'Pro_Title',
                    width: 450,
                    align: 'left'
                }, {
                    header: '项目负责人',
                    dataIndex: 'Pro_LeaderN',
                    width: 150,
                    align: 'left'
                }, {
                    header: '项目类别',
                    dataIndex: 'Pro_Type',
                    width: 150,
                    align: 'left'
                }, {
                    header: '项目联系人',
                    dataIndex: 'TN_Conector',
                    width: 150,
                    align: 'left'
                }, {
                    header: '审查人',
                    dataIndex: 'TN_ExaminerN',
                    width: 150,
                    align: 'left'
                }, {
                    header: '副审查人',
                    dataIndex: 'checkName',
                    width: 150,
                    align: 'left'
                }, {
                    header: '流程发起时间',
                    dataIndex: 'CreateAt',
                    width: 150,
                    align: 'left'
                }, {
                    header: '流程状态',
                    text: 'State',
                    dataIndex: 'State',
                    width: 150,
                    align: 'left',
                    sortable: sortable,
                    renderer: YZSoft.BPM.src.ux.Render.renderTaskState,
                }, {
                    header: '隐藏流程状态',
                    dataIndex: 'TN_Statue',
                    width: 150,
                    align: 'left',
                    hidden: true
                }, {
                    header: '项目状态',
                    dataIndex: 'Pro_Statue',
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
                itemclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.rowclick(record);
                },
                rowdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    this.Zhuanf("任务通知单", grid);
                },
            },
            tools: [{
                type: 'refresh',
                handler: function(event, toolEl, panel) {
                    me.templateStore.reload();
                }
            }]
        });


        //发起子流程按钮
        //
        //
        //

        //项目设计大纲表'发起项目设计大纲流程'按钮
        me.btnXMSJDGNotifications = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '发起项目设计大纲流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-项目设计大纲流程', '项目设计大纲流程', me.XMSJDGGrid);
            }
        });
        //工程会议项目记录单'发起工程会议项目记录单流程'按钮
        me.btnCahierNotifications = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '发起工程会议项目记录单流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-工程项目会议记录单', '工程项目会议记录单', me.CahierGrid);
            }
        });

        //设计评审表'发起设计评审表单流程'按钮
        me.btnDesignReviewNotifications = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '发起设计评审表单流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-设计评审单表流程', '设计评审单表流程', me.DesignReviewGrid);
            }
        });

        //设计文件校审记录表'发起设计文件校审记录表流程'按钮
        me.btnDesDocProRecNotifications = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            margin: 0,
            padding: '3 15 3 15',
            text: '发起设计文件校审记录表流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-设计文件校审记录流程', '设计文件校审记录流程', me.DesDocProRecGrid);
            }
        });

        //设计文件校审记录表'发起设计文件校审记录表流程(快速流程)'按钮
        me.btnDesDocProRecNormalNotifications = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            margin: 0,
            padding: '3 15 3 15',
            text: '发起设计文件校审记录表流程(快速流程)',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-设计文件校审记录流程(快速流程)', '设计文件校审记录流程(快速流程)', me.DesDocProRecGrid);
            }
        });
        //电话或口头记录表'发起电话或口头记录表流程'按钮
        me.btnPhoneOrOralRecordNotifications = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '发起电话或口头记录表流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-电话或口头记录表流程', '电话或口头记录表流程', me.PhoneOrOralRecordGrid);
            }
        });

        //接口文件、资料交接记录表'发起接口文件、资料交接记录表流程'按钮
        me.btnInterfaceDataRecordNotifications = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '发起接口文件、资料交接记录表流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-接口文件、资料交接记录流程', '接口文件、资料交接记录流程', me.InterfaceDataRecordGrid);
            }
        });

        //设计审查会议纪要表'设计审查会议纪要表流程'按钮
        me.btnSumOfTheDesRevConferenceNotifications = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '发起设计审查会议纪要表流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-设计审查会议纪要', '设计审查会议纪要', me.SumOfTheDesRevConferenceGrid);
            }
        });

        //技术质量/环境/安全交底记录表'技术质量/环境/安全交底记录表流程'按钮
        me.btnTecQuaEnvSafRecNotifications = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '发起技术质量/环境/安全交底记录表流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-技术质量、环境、安全交底记录表', '技术质量、环境、安全交底记录表', me.TecQuaEnvSafRecGrid);
            }
        });

        //发起'设计变更通知单'流程按钮
        me.btnDesignChangeNoticeNotifications = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '发起设计变更通知单流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-设计变更通知单流程', '设计变更通知单流程', me.DesignChangeNoticeGrid);
            }
        });

        //发起'设计变更通知单'流程按钮
        me.btnCheckNum = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            text: '查看数量',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.CheckDESNum();
            }
        });

        //发起'服务报告单'流程按钮
        me.btnGenerationServiceReportNotifications = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '发起服务报告单流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-服务报告单流程', '服务报告单流程', me.GenerationServiceReportGrid);
            }
        });

        //发起'资料归档审批单'表按钮
        me.btnDatArExaAndApprovalNotifications = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '发起资料归档审批单表流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-技术资料归档审批表流程', '技术资料归档审批表流程', me.DatArExaAndApprovalGrid);
            }
        });
        //发起'资料基础表'按钮
        me.btnAddBasicData = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '发起基础资料流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-基础资料附件表流程', '基础资料附件表流程', me.DatArExaAndApprovalGrid);
            }
        });
        //基础资料表发起'授权'按钮
        me.btnPublicFlow = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '授权',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(true);
            },
            handler: function() {
                me.publicFlow(me.DatArExaAndApprovalGrid);
            }
        });

        //发起'修改进度要求流程'按钮
        me.btnModifyFlow = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '发起项目阶段完成时间新增(调整)表流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-项目进度要求修改流程', '项目进度要求流程', me.CheckDetailGrid);
            }
        });

        //发起'站局领导汇报流程'按钮
        me.btnAddLeaderReport = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '发起站局领导汇报流程',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addNewFlow('设计院-管理手册-站局领导汇报流程', '站局领导汇报流程', me.LeaderReportGrid);
            }
        });
        //开始时间
        me.ComboxstEdit = new Ext.form.DateField({
            selectOnFocus: true,
            allowBlank: true,
            value: '',
            format: 'Y-m-d ',
            /*Y-m-dH:i:s*/
            width: 120
        });
        //结束时间
        me.ComboxendEdit = new Ext.form.DateField({
            selectOnFocus: true,
            allowBlank: true,
            value: '',
            format: 'Y-m-d ',
            /*Y-m-dH:i:s*/
            width: 120
        });
        //登记人
        me.Registrant = Ext.create('sjy.glsc.Panel.User', {

        });
        //导航栏"搜索框"
        me.ReportSearch = Ext.create('YZSoft.src.form.field.Search', {
            store: me.templateStore,
            width: 160
        });
        //导航栏'搜索'按钮
        me.btnReportSearch = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: RS.$('All_Search'),
            handler: function() {
                me.onReportSearchClick();
            }
        });
        //表单Grid
        //
        //
        //


        //项目设计大纲Grid
        me.XMSJDGGrid = Ext.create('sjy.glsc.Grid.XMSJDGGrid', {
            title: '项目设计大纲',
            store: me.XMSJDGStore,
            region: 'center',
            tbar: [me.btnXMSJDGNotifications],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("项目设计大纲", grid);
                },
            }
        });

        //工程项目会议记录单Grid
        me.CahierGrid = Ext.create('sjy.glsc.Grid.CahierGrid', {
            title: '工程项目会议记录单',
            store: me.CahierStore,
            region: 'center',
            tbar: [me.btnCahierNotifications],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("工程项目会议记录单", grid);
                },
            }
        });

        //设计审评表Grid
        me.DesignReviewGrid = Ext.create('sjy.glsc.Grid.DesignReviewGrid', {
            title: '内部设计评审表',
            store: me.DesignReviewStore,
            region: 'center',
            tbar: [me.btnDesignReviewNotifications],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("设计评审表", grid);
                },
            }
        });

        //设计文件校审记录表Grid
        me.DesDocProRecGrid = Ext.create('sjy.glsc.Grid.DesDocProRecGrid', {
            title: '设计文件校审记录表',
            store: me.DesDocProRecStore,
            region: 'center',
            tbar: [me.btnDesDocProRecNotifications],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("设计文件校审记录表", grid);
                },
            }
        });

        //设计文件校审记录表(快速流程)Grid
        me.DesDocProRecNormalGrid = Ext.create('sjy.glsc.Grid.DesDocProRecNormalGrid', {
            title: '设计文件校审记录表(快速流程)',
            store: me.DesDocProRecNormalStore,
            region: 'center',
            tbar: [me.btnDesDocProRecNormalNotifications],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("设计文件校审记录表(快速流程)", grid);
                },
            }
        });
        //电话或口头记录表Grid
        me.PhoneOrOralRecordGrid = Ext.create('sjy.glsc.Grid.PhoneOrOralRecordGrid', {
            title: '电话或口头记录表',
            store: me.PhoneOrOralRecordStore,
            region: 'center',
            tbar: [me.btnPhoneOrOralRecordNotifications],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("电话或口头记录表", grid);
                },
                rowclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.btnPhoneOrOralRecordNotifications.setDisabled(false);
                }
            }
        });

        //接口文件、资料交接记录表Grid
        me.InterfaceDataRecordGrid = Ext.create('sjy.glsc.Grid.InterfaceDataRecordGrid', {
            title: '接口文件、资料交接记录表',
            store: me.InterfaceDataRecordStore,
            region: 'center',
            tbar: [me.btnInterfaceDataRecordNotifications],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("接口文件、资料交接记录表", grid);
                },
            }
        });

        //设计审查会议纪要表Grid
        me.SumOfTheDesRevConferenceGrid = Ext.create('sjy.glsc.Grid.SumOfTheDesRevConferenceGrid', {
            title: '设计审查会议纪要表',
            store: me.SumOfTheDesRevConferenceStore,
            region: 'center',
            tbar: [me.btnSumOfTheDesRevConferenceNotifications],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("设计审查会议纪要表", grid);
                },
            }
        });

        //技术质量/环境/安全交底记录表Grid
        me.TecQuaEnvSafRecGrid = Ext.create('sjy.glsc.Grid.TecQuaEnvSafRecGrid', {
            title: '技术质量/环境/安全交底记录表',
            store: me.TecQuaEnvSafRecStore,
            region: 'center',
            tbar: [me.btnTecQuaEnvSafRecNotifications],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("技术质量/环境/安全交底记录表", grid);
                },
            }
        });

        //设计变更通知单表Grid
        me.DesignChangeNoticeGrid = Ext.create('sjy.glsc.Grid.DesignChangeNoticeGrid', {
            title: '设计变更通知单表',
            store: me.DesignChangeNoticeStore,
            region: 'center',
            tbar: [me.btnDesignChangeNoticeNotifications, me.btnCheckNum],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("设计变更通知单表", grid);
                },
                rowclick: function(grid, record, tr, rowIndex, e, eOpts) {

                }
            }
        });

        //服务报告单表Grid
        me.GenerationServiceReportGrid = Ext.create('sjy.glsc.Grid.GenerationServiceReportGrid', {
            title: '服务报告单表(经营部)',
            store: me.GenerationServiceReportStore,
            region: 'center',
            tbar: [me.btnGenerationServiceReportNotifications],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("服务报告单表", grid);
                },
            }
        });
        //资料归档审批单表Grid
        me.DatArExaAndApprovalGrid = Ext.create('sjy.glsc.Grid.DatArExaAndApprovalGrid', {
            title: '资料归档审批单表',
            store: me.DatArExaAndApprovalStore,
            region: 'center',
            tbar: [me.btnDatArExaAndApprovalNotifications],
            listeners: {
                rowclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.btnPublicFlow.setDisabled(false);
                },
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("资料归档审批单表", grid);
                },
            }
        });
        //基础资料Grid
        me.BasicDataGrid = Ext.create('sjy.glsc.Grid.BasicDataGrid', {
            title: '基础资料',
            store: me.BasicDataStore,
            region: 'center',
            tbar: [me.btnAddBasicData, me.btnPublicFlow],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("基础资料", grid);
                },
            }
        });

        //查看修改进度Grid
        me.CheckDetailGrid = Ext.create('sjy.glsc.Grid.CheckDetailGrid', {
            title: '项目阶段完成时间新增（调整）表',
            store: me.CheckDetailStore,
            region: 'center',
            tbar: [me.btnModifyFlow],
            listeners: {
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("项目阶段完成时间新增（调整）表", grid);
                },
            }
        });
        //站局领导汇报表Grid
        me.LeaderReportGrid = Ext.create('sjy.glsc.Grid.LeaderReportGrid', {
            title: '站局领导汇报表',
            store: me.LeaderReportStore,
            region: 'center',
            tbar: [me.btnAddLeaderReport,"开始时间:", me.ComboxstEdit, "结束时间", me.ComboxendEdit, "登记人:", me.Registrant, '事件描述', me.ReportSearch, me.btnReportSearch],
            listeners: {
                scope: me,
                rowdblclick: function(grid, record, item, rowIndex, e, eOpts) {
                    me.Zhuanf("站局领导汇报表", grid);
                },
            }
        });

        //主表按钮
        //
        //
        //

        //导航栏'发起任务通知'按钮
        me.btnNotifications = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '发起任务通知',
            store: me.templateStore,
            handler: function() {
                me.Notifications('设计院-管理手册-任务通知单流程', '任务通知单 - ');
            }
        });

        //发起'项目组成员'按钮
        me.btnAddTeamMember = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '增加项目组成员',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.Notifications('设计院-管理手册-项目成员增加', '项目成员增加 - ', me.AddTeamMemberGrid);
            }
        });

        //导航栏'导出Excel'
        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.temlateGrid,
            templateExcel: YZSoft.$url(me, '任务通知单模板.xls'), //导出模板，不设置则按缺省方式导出
            params: {},
            fileName: '任务通知单',
            allowExportAll: true, //可选项，缺省使用YZSoft.EnvSetting.Excel.AllowExportAll中的设置，默认值false
            //maxExportPages: 10, //可选项，缺省使用YZSoft.EnvSetting.Excel.MaxExportPages中的设置，默认值100
            listeners: {
                beforeload: function(params) {
                    params.ReportDate = new Date()
                }
            }
        });

        //基础资料表发起'授权'按钮
        me.btnMissionInfoPublicFlow = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            text: '授权',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(true);
            },
            handler: function() {
                me.publicFlow(me.DatArExaAndApprovalGrid);
            }
        });

        //隐藏的TasKId
        me.btnhiddenTaskId = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            text: '1',
            hidden: true,
            id: 'hiddenTaskID',
            handler: function() {

            }
        });


        //隐藏的ProStatue
        me.btnhiddenProStatue = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            text: '1',
            hidden: true,
            id: 'hiddenProStatue',
            handler: function() {

            }
        });

        //隐藏的State
        me.btnhiddenProState = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            text: '1',
            hidden: true,
            id: 'hiddenProState',
            handler: function() {

            }
        });

        //隐藏的ProTitle
        me.btnhiddenProTitle = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            text: '1',
            hidden: true,
            id: 'hiddenProTitle',
            handler: function() {

            }
        });

        //隐藏的ProNO
        me.btnhiddenProNO = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            text: '1',
            hidden: true,
            id: 'hiddenProNO',
            handler: function() {

            }
        });

        //隐藏的TNStatue
        me.btnhiddenTNStatue = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            text: '1',
            hidden: true,
            id: 'hiddenTNStatue',
            handler: function() {

            }
        });


        //隐藏的XMSJDGStatue
        me.btnhiddenXMSJDGStatue = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            text: '1',
            hidden: true,
            id: 'hiddenXMStatue',
            handler: function() {

            }
        });

        //隐藏的ProLeaderA
        me.btnhiddenProLeaderA = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            text: '1',
            hidden: true,
            id: 'hiddenProLeaderA',
            handler: function() {

            }
        });

        //隐藏的ProLeaderN
        me.btnhiddenProLeaderN = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-add',
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),
            text: '1',
            hidden: true,
            id: 'hiddenProLeaderN',
            handler: function() {

            }
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

        //导航栏'结束项目'按钮
        me.btnEndProject = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '结束项目',
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.EndProjectClick();
            }
        });

        //导航栏'废止项目'按钮
        me.btnAbolishProject = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '废止项目',
            store: me.temlateGrid,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.EndAndAbolishClick('Abolish', '废止');
            }
        });

        //导航栏'授权'按钮 
        me.RwtzdMenuPublic = Ext.create('YZSoft.src.button.Button', {
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

        //导航栏'项目进度'按钮 
        me.btnProjectProgress = Ext.create('YZSoft.src.button.Button', {
            margin: 0,
            padding: '3 15 3 15',
            text: '项目进度',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function(item) {
                me.Progress();
            }
        });
        //导航栏'查看站局领导汇总表'按钮 
        me.btnCheckCommunicationReport = Ext.create('YZSoft.src.button.Button', {
            margin: 0,
            padding: '3 15 3 15',
            text: '查看站局领导沟通汇报表',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function(item) {
                me.CommunicationReport();
            }
        });
        
        //导航栏'查看站局登记表'按钮 
        me.btnCheckMonthReport = Ext.create('YZSoft.src.button.Button', {
            margin: 0,
            padding: '3 15 3 15',
            text: '查看每月汇报',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function(item) {
                me.MonthReport();
            }
        });

        me.searchPanel = Ext.create('sjy.glsc.Panel.SearchPanel', {
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
                me.btnNotifications,
                me.btnAddTeamMember,
                me.btnhiddenTaskId,
                me.btnhiddenProStatue,
                me.btnhiddenProState,
                me.btnhiddenTNStatue,
                me.btnhiddenXMSJDGStatue,
                me.btnhiddenProLeaderA,
                me.btnhiddenProLeaderN,
                me.btnhiddenProTitle,
                me.btnhiddenProNO,
                me.btnEndProject,
                me.btnAbolishProject,
                me.RwtzdMenuPublic,
                me.btnProjectProgress,
                me.btnCheckMonthReport,
                me.btnExcelExport,
                '->',
                me.btnSearch
            ]
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
            items: [me.XMSJDGGrid,me.LeaderReportGrid, me.TecQuaEnvSafRecGrid, me.CahierGrid, me.DesDocProRecNormalGrid, me.DesDocProRecGrid, me.DesignReviewGrid, me.PhoneOrOralRecordGrid, me.GenerationServiceReportGrid, me.SumOfTheDesRevConferenceGrid, me.DesignChangeNoticeGrid, me.InterfaceDataRecordGrid, me.BasicDataGrid, me.DatArExaAndApprovalGrid, me.CheckDetailGrid]
        });
        //导航栏布局
        var cfg = {
            title: '',
            layout: 'border',
            border: false,
            tbar: me.toolBar,
            items: [me.mainPanel, me.OtherPanel, me.searchPanel],
        };

        var cfgzj = {
            title: '',
            layout: 'border',
            border: false,
            tbar: me.toolBar,
        };
        Ext.apply(cfg, config);
        me.callParent([cfg]);

    },
    //查看修改进度
    CheckDetail: function(activeTabIndex) {
        var me = this,
            tid = document.getElementById('hiddenTaskID').innerText;
        var view = YZSoft.ViewManager.addView(me, 'sjy.glsc.Panel.CheckDetail', {
            title: '查看修改进度',
            params: {
                taskid: tid,
            },
            activeTabIndex: activeTabIndex,
            closable: true
        });
    },
    //项目进度
    Progress: function() {
        var me = this,
            tid = document.getElementById('hiddenTaskID').innerText;
        var view = YZSoft.ViewManager.addView(me, 'sjy.glsc.Panel.Progress', {
            title: '项目进度',
            taskid: tid,
            closable: true
        });
    },
    //查看每月汇报
    MonthReport: function() {
        var me = this,
            tid = document.getElementById('hiddenTaskID').innerText;

        var params = {
            Method: 'isPermit',
        };
        YZSoft.Ajax.request({
            url: YZSoft.$url(me, '../StoreDataService/EventInfoData/Report/RR_EventInfoData.ashx'),
            method: 'POST',
            params: params,
            dataType: "json",
            waitMsg: {
                msg: '正在查询...',
                target: me.temlateGrid,
                autoClose: true
            },
            success: function(action) {
                if (action.result.permit) {
                    var view = YZSoft.ViewManager.addView(me, 'sjy.glsc.Panel.Register', {
                        title: '每月汇报',
                        taskid: tid,
                        closable: true
                    });
                } else {
                    var mbox = Ext.Msg.show({
                        title: '错误提示',
                        msg: '你没有查看的权限',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING
                    })
                }
            },
            failure: function(action) {
                var json = JSON.parse(action.responseText);
                var mbox = Ext.Msg.show({
                    title: RS.$('All_MsgTitle_Error'),
                    msg: json.errorMessage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        });

    },
    //项目进度要求修改流程
    ModifyFlow: function() {
        var me = this,
            tid = document.getElementById('hiddenTaskID').innerText,
            tnstatue = document.getElementById('hiddenTNStatue').innerText,
            store = me.templateStore;
        if (tnstatue == 'running') {
            alert("任务通知单未结束，不能发起此流程");
            return;
        }
        YZSoft.BPM.src.ux.FormManager.openPostWindow('设计院-管理手册-项目进度要求修改流程', {
            title: '项目进度要求修改流程 - ',
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 600,
            params: {
                taskid: tid,
            },
            listeners: {
                submit: function(name, result) {
                    /*me.store.reload({ loadMask: false });*/
                    me.templateStore.reload();
                }
            }
        });
    },

    //添加新的'任务通知'流程
    Notifications: function(url, title) {
        var me = this,
            store = me.templateStore;
        var taskid = document.getElementById("hiddenTaskID").innerText;
        YZSoft.BPM.src.ux.FormManager.openPostWindow(url, {
            title: title,
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            params: { TaskID: taskid },
            height: 600,
            listeners: {
                submit: function(name, result) {
                    /*me.store.reload({ loadMask: false });*/
                    me.templateStore.reload();
                }
            }
        });
    },

    //添加新的子流程
    addNewFlow: function(url, title, grid) {
        var me = this,
            /*需要传入表单的参数*/
            tid = document.getElementById('hiddenTaskID').innerText,
            prostatue = document.getElementById('hiddenProStatue').innerText,
            tnstatue = document.getElementById('hiddenTNStatue').innerText,
            pro_title = document.getElementById('hiddenProTitle').innerText,
            pro_no = document.getElementById('hiddenProNO').innerText,
            pro_leadern = document.getElementById('hiddenProLeaderN').innerText,
            pro_leadera = document.getElementById('hiddenProLeaderA').innerText,
            recs = grid.getSelectionModel().getSelection(),
            params = {},
            ids = [];

        /*判断条件*/
        if (tnstatue != 'approved') {
            alert("任务通知单未获批准，不能发起此流程");
            return;
        }
        if (prostatue == '已废止') {
            alert("该项目已经废止，不能再发起流程!");
            return;
        }
        if (prostatue == '已结束') {
            alert("任务通知单已结束，不能发起此流程");
            return;
        }
        /*判断电话口头记录表是否被选中，判断是否是口头记录表grid*/
        if (recs.length != 0 && grid == me.PhoneOrOralRecordGrid) {
            Ext.each(recs, function(rec) {
                params = {
                    taskid: tid,
                    PO_Company: rec.get("PO_Company"),
                    PO_Phone: rec.get("PO_Phone"),
                    PO_PointOrSpeaker: rec.get("PO_PointOrSpeaker"),
                    PO_Time: rec.get("PO_Time"),
                    PO_RecordPer: rec.get("PO_RecordPer"),
                    PO_Content: rec.get("PO_Content")
                };
            });
        }
        /*判断是否是接口文件，判断接口文件是否被选中*/
        else if (recs.length != 0 && grid == me.InterfaceDataRecordGrid) {
            Ext.each(recs, function(rec) {
                params = {
                    taskid: tid,
                    Pro_Title: pro_title,
                    Pro_NO: pro_no,
                    ID_Provider: rec.get("ID_Provider"),
                    ID_Acceptor: rec.get("ID_Acceptor"),
                    ID_FileName: rec.get("ID_FileName"),
                    ID_Type: rec.get("ID_Type"),
                    ID_Content: rec.get("ID_Content"),
                    ID_Inspect1Content: rec.get("ID_Inspect1Content"),
                    ID_Inspect2Content: rec.get("ID_Inspect2Content")
                };
            });
        } else {
            params = {
                taskid: tid,
                Pro_Title: pro_title,
                Pro_NO: pro_no,
                Pro_LeaderA: pro_leadera,
                Pro_LeaderN: pro_leadern
            };
        }
        YZSoft.BPM.src.ux.FormManager.openPostWindow(url, {
            title: title,
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            height: 600,
            params: params,
            listeners: {
                submit: function(name, result) {
                    //me.store.reload({ loadMask: false });
                    grid.getStore().reload();
                }
            }
        });
    },
    //任务通知单搜索
    onSearch3Click: function() {
        var me = this,
            store = me.templateStore,
            params = store.getProxy().getExtraParams(),
            SearchYear = me.ComboxsjEdit.getValue(),
            Keyword = me.Search.getValue();
        Ext.apply(params, {
            SearchType: 'QuickSearch',
            SearchBy: 'Deadline',
            SearchYear: SearchYear,
            Keyword: Keyword
        });
        me.templateStore.loadPage(1);
    },
    //站局领导汇报表搜索
    onReportSearchClick:function(){
        var me = this,
            date = new Date,
        store = me.LeaderReportStore,
        params = store.getProxy().getExtraParams(),
        stYear=me.ComboxstEdit.getValue();
        edYear=me.ComboxendEdit.getValue();
        Keyword = me.Search.getValue();
        Registrant = me.Registrant.getValue();
        Ext.apply(params, {
            Kword:Keyword,
            startTime: stYear,
            endTime:edYear,
            registrant:Registrant,
        });
        store.loadPage(1);
    },
    //
    //
    //
    //任务通知单废止和结束按钮
    EndAndAbolishClick: function(met, txt) {
        var me = this,
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;
        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
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
                    url: YZSoft.$url(me, '../StoreDataService/EventInfoData/TN_EventInfoData.ashx'),
                    method: 'POST',
                    params: {
                        method: met
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

    //
    //
    //子流程删除按钮
    onDelete: function(url, grid, flag) {
        var me = this;
        var prostatue = document.getElementById('hiddenProStatue').innerText;
        var tnstatue = document.getElementById('hiddenTNStatue').innerText;
        if (flag == '任务通知') {
            if (tnstatue == '已批准') {
                alert("该项目已获批准，不允许删除");
                return;
            }
        }

        if (prostatue != '进行中') {
            alert("该项目已经结束或废止，不能再删除流程");
            return;
        }
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var params = {
            Method: 'Delete'
        };

        var items = [];
        var TaskID;
        Ext.each(recs, function(rec) {
            items.push(rec.get("TaskID"));
            TaskID = rec.data.TaskID;
        });

        var dlg = Ext.create('YZSoft.BPM.src.dialogs.ConfirmDlg', {
            autoShow: true,
            autoClose: true,
            title: RS.$('All_DeleteConfirm_Title'),
            inform: {
                title: RS.$('TaskOpt_Delete_Prompt_Caption'),
                msg: RS.$('TaskOpt_Delete_Prompt_Desc')
            },
            label: RS.$('TaskOpt_Delete_Comments'),
            validateEmpty: true,
            fn: function(btn, text) {
                if (btn != 'ok')
                    return;

                Ext.apply(params, {
                    Comments: text,
                    TaskID: TaskID
                });

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    method: 'POST',
                    params: params,
                    jsonData: items,
                    waitMsg: {
                        msg: RS.$('TaskOpt_Delete_LoadMask'),
                        target: grid,
                        autoClose: true
                    },
                    getSuccessMessage: function(items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function(item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>'

                            msg += Ext.String.format(RS.$('TaskOpt_Delete_ItemSuccess'), store.getById(item.ID).data.SerialNum);
                        });

                        return msg;
                    },
                    success: function(action) {
                        YZSoft.Ajax.request({
                            url: YZSoft.$url(me, '../StoreDataService/EventInfoData/' + url + '.ashx'),
                            method: 'POST',
                            params: {
                                method: 'delete'
                            },
                            jsonData: items,
                            waitMsg: {
                                msg: '正在删除...',
                                target: grid
                            },
                            success: function(action) {
                                grid.getStore().reload({
                                    loadMask: {
                                        msg: Ext.String.format('{0}个对象已删除！', recs.length),
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
                                grid.getStore().reload({
                                    mbox: mbox
                                });
                            }
                        });
                    },
                    failure: function(action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_Delete_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>'

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({
                                mbox: mbox
                            });
                        }
                    }
                });
            }
        });
    },
    /*设计变更单查看增加数量*/
    CheckDESNum: function() {
        var me = this,
            grid = me.DesignChangeNoticeGrid,
            taskid = document.getElementById('hiddenTaskID').innerText;
        YZSoft.Ajax.request({
            url: YZSoft.$url(me, '../StoreDataService/EventInfoData/DCN_EventInfoData.ashx'),
            params: {
                method: 'getDCNCount',
                taskid: taskid
            },
            waitMsg: { msg: "正在查询数量信息...", target: grid },
            success: function(action) {
                Ext.Msg.show({
                    title: '增加数量信息',
                    msg: '设计变更单总条数为:(' + action.result.count + ')',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.WARNING
                });
            },
            failure: function(action) {
                Ext.Msg.show({
                    title: '错误提示',
                    msg: action.result.errorMessage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.WARNING
                });

            }
        });
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


    rowclick: function(record) {
        var me = this,
            TaskID,
            Pro_Statue,
            TN_Statue,
            Pro_LeaderA,
            Pro_LeaderN,
            Pro_Title,
            Pro_NO,

            XMSJDGStore = me.XMSJDGStore,
            XMSJDGparams = XMSJDGStore.getProxy().getExtraParams(),

            CahierStore = me.CahierStore,
            CahierParams = CahierStore.getProxy().getExtraParams(),

            DesignReviewStore = me.DesignReviewStore,
            DesignReviewParams = DesignReviewStore.getProxy().getExtraParams(),

            DesDocProRecStore = me.DesDocProRecStore,
            DesDocProRecParams = DesDocProRecStore.getProxy().getExtraParams(),

            PhoneOrOralRecordStore = me.PhoneOrOralRecordStore,
            PhoneOrOralRecordParams = PhoneOrOralRecordStore.getProxy().getExtraParams(),

            InterfaceDataRecordStore = me.InterfaceDataRecordStore,
            InterfaceDataRecordParams = InterfaceDataRecordStore.getProxy().getExtraParams(),

            SumOfTheDesRevConferenceStore = me.SumOfTheDesRevConferenceStore,
            SumOfTheDesRevConferenceParams = SumOfTheDesRevConferenceStore.getProxy().getExtraParams(),

            TecQuaEnvSafRecStore = me.TecQuaEnvSafRecStore,
            TecQuaEnvSafRecParams = TecQuaEnvSafRecStore.getProxy().getExtraParams(),

            DesignChangeNoticeStore = me.DesignChangeNoticeStore,
            DesignChangeNoticeParams = DesignChangeNoticeStore.getProxy().getExtraParams(),

            GenerationServiceReportStore = me.GenerationServiceReportStore,
            GenerationServiceReportParams = GenerationServiceReportStore.getProxy().getExtraParams(),

            DatArExaAndApprovalStore = me.DatArExaAndApprovalStore,
            DatArExaAndApprovalParams = DatArExaAndApprovalStore.getProxy().getExtraParams(),

            BasicDataStore = me.BasicDataStore,
            BasicDataParams = BasicDataStore.getProxy().getExtraParams(),

            CheckDetailParams = me.CheckDetailStore.getProxy().getExtraParams(),

            DesDocProRecNormalParams = me.DesDocProRecNormalStore.getProxy().getExtraParams(),

            LeaderReportParams=me.LeaderReportStore.getProxy().getExtraParams(),

            recs = me.temlateGrid.getSelectionModel().getSelection(),
            ids = [];

        Ext.each(recs, function(rec) {
            ids.push(rec.get("TaskID"));
            TaskID = rec.get("TaskID");
            Pro_Statue = rec.get("Pro_Statue");
            TN_Statue = rec.get("TNState");
            Pro_Title = rec.get("Pro_Title");
            Pro_NO = rec.get("Pro_NO");
            Pro_LeaderA = rec.get("Pro_LeaderA");
            Pro_LeaderN = rec.get("Pro_LeaderN");
            Pro_State = rec.get("State");
        });


        Ext.apply(XMSJDGparams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(CahierParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(DesignReviewParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(DesDocProRecParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(DesDocProRecNormalParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(PhoneOrOralRecordParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(InterfaceDataRecordParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(SumOfTheDesRevConferenceParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(TecQuaEnvSafRecParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(DesignChangeNoticeParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(GenerationServiceReportParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(DatArExaAndApprovalParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(BasicDataParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(CheckDetailParams, {
            FatherTaskId: TaskID,
        });
        Ext.apply(LeaderReportParams, {
            FatherTaskId: TaskID,
        });

        XMSJDGStore.loadPage(1);
        CahierStore.loadPage(1);
        DesignReviewStore.loadPage(1);
        DesDocProRecStore.loadPage(1);
        PhoneOrOralRecordStore.loadPage(1);
        InterfaceDataRecordStore.loadPage(1);
        SumOfTheDesRevConferenceStore.loadPage(1);
        TecQuaEnvSafRecStore.loadPage(1);
        DesignChangeNoticeStore.loadPage(1);
        GenerationServiceReportStore.loadPage(1);
        DatArExaAndApprovalStore.loadPage(1);
        BasicDataStore.loadPage(1);
        me.CheckDetailStore.loadPage(1);
        me.DesDocProRecNormalStore.loadPage(1);
        me.LeaderReportStore.loadPage(1);

        document.getElementById('hiddenTaskID').innerText = TaskID; //TaskID
        document.getElementById('hiddenProStatue').innerText = Pro_Statue; //Pro_Statue
        document.getElementById('hiddenTNStatue').innerText = TN_Statue; //TN_Statue
        document.getElementById('hiddenProTitle').innerText = Pro_Title;
        document.getElementById('hiddenProNO').innerText = Pro_NO;
        document.getElementById('hiddenProLeaderA').innerText = Pro_LeaderA;
        document.getElementById('hiddenProLeaderN').innerText = Pro_LeaderN;
        document.getElementById('hiddenProState').innerText = Pro_State;

        XMSJDGStore.on("load", function(store) {
            var
                recsxm,
                XM_Statue,
                recsxm = XMSJDGStore.getAt(0);
            Ext.each(recsxm, function(rec) {
                XM_Statue = rec.get("XMState");
            });
            document.getElementById('hiddenXMStatue').innerText = XM_Statue; //XM_Statue
        });
    },
    //授权
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
                    url: YZSoft.$url(me,'../StoreDataService/EventInfoData/TN_EventInfoData.ashx'),
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
    EndProjectClick:function(){
        var taskid = document.getElementById("hiddenTaskID").innerText;
        YZSoft.BPM.src.ux.FormManager.openPostWindow("设计院-管理手册-结束项目流程", {
            title: "结束项目流程",
            dlgModel: 'Dialog', //Tab,Window,Dialog
            width: 1000,
            params: { taskid: taskid },
            height: 600,
            listeners: {
                submit: function(name, result) {
                    /*me.store.reload({ loadMask: false });*/
                    me.templateStore.reload();
                }
            }
        });
    }
});