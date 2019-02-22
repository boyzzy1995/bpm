Ext.define('sjy.glsc.Panel.Summary', {
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
        width: 700,
        height: 400
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
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/SummaryTable/Summary_EventInfoData.ashx'),
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
            title: '汇总信息',
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
                    dataIndex: 'Pro_No',
                    width: 80,
                    align: 'left'
                }, {
                    header: '项目名称',
                    dataIndex: 'Pro_Title',
                    width: 450,
                    align: 'left'
                }, {
                    header: '阶段',
                    dataIndex: 'stage',
                    width: 80,
                    align: 'left'
                }, {
                    header: '项目负责人',
                    dataIndex: 'ProLeader',
                    width: 120,
                    align: 'left'
                }, {
                    header: '任务下达时间',
                    dataIndex: 'LunchDate',
                    width: 100,
                    align: 'left'
                }, {
                    header: '事先讨论',
                    dataIndex: 'TN_DGTime',
                    width: 80,
                    align: 'left'
                }, {
                    header: '事中评审',
                    dataIndex: 'TN_ZJCGTime',
                    width: 80,
                    align: 'left'
                }, {
                    header: '成品送审',
                    dataIndex: 'TN_CHPTime',
                    width: 80,
                    align: 'left'
                }, {
                    header: '设计校核',
                    dataIndex: 'RecTime',
                    width: 80,
                    align: 'left'
                }, {
                    header: '分院审查',
                    dataIndex: 'SHAuditingName',
                    width: 80,
                    align: 'left'
                }, {
                    header: '审查时间',
                    dataIndex: 'SHAuditingDate',
                    width: 80,
                    align: 'left'
                }, {
                    header: '院审姓名',
                    dataIndex: 'SCAuditingName',
                    width: 80,
                    align: 'left'
                }, {
                    header: '院审时间',
                    dataIndex: 'SCAuditingDate',
                    width: 80,
                    align: 'left'
                }, {
                    header: '审定姓名',
                    dataIndex: 'HDAuditingName',
                    width: 80,
                    align: 'left'
                }, {
                    header: '审定时间',
                    dataIndex: 'HDAuditingDate',
                    width: 80,
                    align: 'left'
                }, {
                    header: '现场勘探业主沟通（分院）',
                    dataIndex: 'SceneTime',
                    width: 160,
                    align: 'left'
                }, {
                    header: '现场勘探业主沟通（院审总工）',
                    dataIndex: 'SceneTimeS',
                    width: 190,
                    align: 'left'
                }, {
                    header: '审查会或技术交底（分院）',
                    dataIndex: 'CheckMeetingTime',
                    width: 160,
                    align: 'left'
                }, {
                    header: '审查会或技术交底（院审总工）',
                    dataIndex: 'CheckMeetingTimeS',
                    width: 190,
                    align: 'left'
                }]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.templateStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
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
        //查看评分
        me.btnCheckScore = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            text: '查看评分',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(false);
            },
            handler: function() {
                me.checkScore();
            }
        });
        //设置权重
        me.btnSetWeight = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            text: '设置权重',
            handler: function() {
                me.setWeight();
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

        //导航栏'导出Excel'
        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.temlateGrid,
            templateExcel: YZSoft.$url(me, '院质量管理体系文件进度落实汇总表格模板.xls'), //导出模板，不设置则按缺省方式导出
            params: {},
            fileName: '院质量管理体系文件进度落实汇总表格模板',
            allowExportAll: true, //可选项，缺省使用YZSoft.EnvSetting.Excel.AllowExportAll中的设置，默认值false
            //maxExportPages: 10, //可选项，缺省使用YZSoft.EnvSetting.Excel.MaxExportPages中的设置，默认值100
            listeners: {
                beforeload: function(params) {

                }
            }
        });


        //部门
        me.ComboxDepartment = new Ext.form.ComboBox({

            store: new Ext.data.ArrayStore({
                fields: ['depart', 'id'],
                data: [
                    ['全部', '全部'],
                    ['设计一所', '000204'],
                    ['设计二所', '000207'],
                    ['规划所', '000208'],
                    ['岩土所', '000205']
                ] //[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
            }),
            displayField: 'depart',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            forceSelection: false,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: true,
            lastQuery: '',
            value: ''
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
        me.searchPanel = Ext.create('sjy.glsc.Panel.SummarySearchPanel', {
            hidden: config.collapseSearchPanel === true,
            region: 'north',
            disableTaskState: true,
            store: me.templateStore
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
            items: [me.XMSJDGGrid]
        });
        //导航栏布局
        var cfg = {
            title: '',
            layout: 'border',
            border: false,
            tbar: [me.btnCheckScore, me.btnSetWeight, me.btnExcelExport],
            items: [me.mainPanel, me.searchPanel],
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
    onSearch3Click: function() {
        var me = this,
            store = me.templateStore,
            params = store.getProxy().getExtraParams(),
            st = me.ComboxstEdit.getValue(),
            ed = me.ComboxendEdit.getValue(),
            part = me.ComboxDepartment.getValue(),
            Keyword = me.Search.getValue();

        Ext.apply(params, {

            depart: part,
            Kword: Keyword,
            beginYear: st,
            endYear: ed
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
    setWeight: function() {
        var me = this;
        var view = YZSoft.ViewManager.addView(me, 'sjy.glsc.Panel.SetWeight', {
            title: '设置权重',
            closable: true,
            grid: me.temlateGrid,
        });
    },
    checkScore: function() {
        var me = this,
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            tid;

        if (recs.length == 0)
            tid = '';
        else
            Ext.each(recs, function(rec) {
                tid = rec.get("TaskID");
            });
        var view = YZSoft.ViewManager.addView(me, 'sjy.glsc.Panel.CheckSummaryScore', {
            title: '查看汇总评分',
            taskid: tid,
            closable: true
        });
    }
});