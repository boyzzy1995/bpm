Ext.define('sjy.glsc.Panel.MemberLibrary', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.BPM.src.model.Draft',
        'YZSoft.BPM.src.ux.Render',
        'YZSoft.BPM.src.ux.FormManager',
        'YZSoft.src.ux.RecordSecurityManager'
    ],
    dlgCfg: {
        dlgModel: 'Dialog', //Tab,Window,Dialog
        width: 700,
        height: 400
    },
    stepdefer: 2000,
    constructor: function(config) {
        var me = this;
        var date = new Date;
        var year = date.getFullYear();
        //调试时显示模块的权限
        me.templateStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            sorters: {},
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
            }
        });
        //表格内容
        me.temlateGrid = Ext.create('Ext.grid.Panel', {
            title: '汇总信息',
            region: 'center',
            store: me.templateStore,
            border: false,
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, { mode: 'MULTI' }),
            columns: {
                defaults: {},
                items: [
                    { xtype: 'rownumberer' },
                    { header: '合计', dataIndex: 'Pro_NO', width: 150, align: 'left' },
                    { header: '操作', align: 'center',scope: me, renderer: me.renderSN, listeners: { scope: me, click: me.onClickSN } }
                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.templateStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {

                },
                itemclick: function(grid, record, item, rowIndex, e, eOpts) {

                }
            },
            tools: [{
                type: 'refresh',
                handler: function(event, toolEl, panel) {
                    me.templateStore.reload();
                }
            }]
        });

        me.GridPanel = Ext.create('Ext.panel.Panel', {
            border: false,
            layout: 'border',
            bodyCls: 'yz-docked-noborder-top',
            items: [me.temlateGrid],
        });

        me.mainPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            border: false,
            activeItem: 0,
            layout: 'card',
            items: [me.temlateGrid]
        });

        //导航栏布局
        var cfg = {
            title: '',
            layout: 'border',
            border: false,
            // tbar: [],
            items: [me.mainPanel] //添加gridPanel作为背景色
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function(times, year) {
        this.templateStore.load({ loadMask: true });
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
    renderSN: function(value, p, record) {
        // return Ext.String.format("<a href='#'>{0}</a>", YZSoft.HttpUtility.htmlEncode(value));
        return Ext.String.format("<input type='button' value='删除'/>", YZSoft.HttpUtility.htmlEncode(value));
    },

    onClickSN: function(view, cell, recordIndex, cellIndex, e, record) {
        console.log(record);
        
        console.log(recordIndex);
        if (e.getTarget().tagName == 'A')
            this.openForm(record);
    },
});