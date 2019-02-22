Ext.define('sjy.glsc.Panel.CheckPersonalSummaryScore', {
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
        width: 860,
        height: 500
    },
    stepdefer: 2000,
    //具体处理
    constructor: function(config) {
        var me = this;
        var date = new Date;
        var year = date.getFullYear();
        var sortable = config.sortable !== false;
        var taskid = config.taskid;
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
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/score/ScorePerson_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetData',
                    taskid: taskid
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });

        //主表布局
        me.temlateGrid = Ext.create("Ext.grid.Panel", {
            title: '个人汇总查看评分表',
            region: 'center',
            store: me.templateStore,
            border: false,
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, { mode: 'MULTI' }),
            columns: {
                defaults: {},
                items: [{
                    xtype: 'rownumberer'
                }, {
                    header: '阶段',
                    dataIndex: 'stage',
                    width: 300,
                    align: 'left'
                }, {
                    header: '市场部评分',
                    dataIndex: 'score_m',
                    width: 100,
                    align: 'left'
                }, {
                    header: '市场部评分人',
                    dataIndex: 'score_mname',
                    width: 100,
                    align: 'left'
                },{
                    header: '校核评分',
                    dataIndex: 'jh',
                    width: 100,
                    align: 'left'
                },{
                    header: '校核人',
                    dataIndex: 'score_jname',
                    width: 100,
                    align: 'left'
                }, {
                    header: '主审核评分',
                    dataIndex: 'sc',
                    width: 100,
                    align: 'left'
                }, {
                    header: '主审核人',
                    dataIndex: 'score_sname',
                    width: 100,
                    align: 'left'
                }, {
                    header: '核定评分',
                    dataIndex: 'hd',
                    width: 100,
                    align: 'left'
                }, {
                    header: '核定人',
                    dataIndex: 'score_hname',
                    width: 100,
                    align: 'left'
                },{
                    header: '平均分',
                    dataIndex: 'general',
                    width: 100,
                    align: 'left'
                },{
                    header: '结论',
                    dataIndex: 'conclusion',
                    width: 100,
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
});