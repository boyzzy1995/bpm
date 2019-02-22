Ext.define('sjy.glsc.Panel.CheckScore', {
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
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/Report/RR_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetData',
                    FatherTaskId:taskid
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });
        
        //主表布局
        me.temlateGrid = Ext.create("Ext.grid.Panel", {
            title: '查看评分表',
            region: 'center',
            store: me.templateStore,
            border: false,
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, {mode:'MULTI'}),
            columns: {
                defaults: {},
                items: [{
                    xtype: 'rownumberer'
                }, {
                    header: '汇报时间',
                    dataIndex: 'ReportDate',
                    width: 100,
                    align: 'left'
                }, {
                    header: '汇报关键内容',
                    dataIndex: 'keyword',
                    width: 300,
                    align: 'left'
                },{
                    header: '登记人',
                    dataIndex: 'Recorder',
                    width: 100,
                    align: 'left'
                },{
                    header: '人员',
                    dataIndex: 'member',
                    width: 300,
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
            templateExcel: YZSoft.$url(me, '站局领导汇报登记表模板.xls'), //导出模板，不设置则按缺省方式导出
            params: {},
            fileName: '站局领导汇报登记表',
            allowExportAll: true, //可选项，缺省使用YZSoft.EnvSetting.Excel.AllowExportAll中的设置，默认值false
            //maxExportPages: 10, //可选项，缺省使用YZSoft.EnvSetting.Excel.MaxExportPages中的设置，默认值100
            listeners: {
                beforeload: function(params) {
                    
                }
            }
        });

        //开始时间
        /*me.ComboxstEdit = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                fields: ['year'],
                data: this.setYear() //[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
            }),
            displayField: 'year',
            typeAhead: true,
            mode: 'local',
            forceSelection: false,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: true,
            lastQuery: '',
            value: ''
        });*/
        me.ComboxstEdit=new Ext.form.DateField({

        selectOnFocus: true,

        allowBlank: true,

        value: '',

        format: 'Y-m-d ',/*Y-m-dH:i:s*/

        width: 120

    });

        //登记人
        me.Registrant = Ext.create('sjy.glsc.Panel.User', {
            
        });

        //结束时间
        /*me.ComboxendEdit = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                fields: ['year'],
                data: this.setYear() //[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
            }),
            displayField: 'year',
            typeAhead: true,
            mode: 'local',
            forceSelection: false,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: true,
            lastQuery: '',
            value: ''
        });*/
        me.ComboxendEdit=new Ext.form.DateField({

        selectOnFocus: true,

        allowBlank: true,

        value: '',

        format: 'Y-m-d ',/*Y-m-dH:i:s*/

        width: 120
});
        //部门
        me.ComboxDepartment = new Ext.form.ComboBox({
            
            store: new Ext.data.ArrayStore({
                fields: ['depart','id'],
                data: [
                    ['全部','全部'],
                    ['设计一所','000204'],
                    ['设计二所','000207'],
                    ['规划所','000208'],
                    ['岩土所','000205']
                ] //[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
            }),
            displayField: 'depart',
            valueField : 'id',
            typeAhead: true,
            mode: 'local',
            forceSelection: false,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: true,
            lastQuery: '',
            value: ''
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
                me.addNew(taskid);
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
                me.edit(taskid);
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
            tbar:[me.btnExcelExport,"开始时间:",me.ComboxstEdit,"结束时间",me.ComboxendEdit,"登记人:",me.Registrant,'事件描述', me.Search, me.btnSearch3],
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
    addNew: function(taskid) {
        var me = this;
        YZSoft.BPM.src.ux.FormManager.openFormApplication('设计院/管理手册/站局领导汇报登记表', '', 'New', Ext.apply({
            sender: this,
            title: '站局领导汇报登记表',
            dlgModel: 'Dialog',
            params: { taskid: taskid },
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
    edit: function(taskid) {
        var me = this;
        var sm = me.temlateGrid.getSelectionModel(),
            recs = sm.getSelection() || [];
        var TaskID;
        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function(rec) {
                TaskID=rec.get("TaskID");
        });
        var params = {
            Method: 'isEdit',
            taskid:taskid
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
                    YZSoft.BPM.src.ux.FormManager.openFormApplication('设计院/管理手册/站局领导汇报登记表', TaskID, 'edit', Ext.apply({
                        sender: me,
                        title: '站局领导汇报登记表',
                        dlgModel: 'Dialog',
                        height:500,
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
                } else {
                    var mbox = Ext.Msg.show({
                        title: '错误提示',
                        msg: '你没有编辑的权限',
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
                TaskID=rec.get("TaskID");
        });

        YZSoft.BPM.src.ux.FormManager.openFormApplication('设计院/管理手册/站局领导汇报登记表',TaskID, 'read', Ext.apply({
            sender: this,
            title: '站局领导汇报登记表',
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
            date = new Date,
        store = me.templateStore,
        params = store.getProxy().getExtraParams(),
        SearchYear = me.ComboxsjEdit.getValue();
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
});
