Ext.define('sjy.glsc.Panel.PersonalSummary', {
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
        height: 600
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
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/SummaryTable/Summarypersonal_EventInfoData.ashx'),
                extraParams: {
                    method: 'GetData',
                    SearchYear: year,
                    Year: year,
                    Keyword: '',
                },
                reader: {
                    rootProperty: 'children'
                }
            },
        });

        //主表布局
        me.temlateGrid = Ext.create("Ext.grid.Panel", {
            title: '个人汇总信息',
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

        //开始时间
        me.ComboxstEdit = new Ext.form.ComboBox({
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
            value: ''
        });

        //结束时间
        me.ComboxendEdit = new Ext.form.ComboBox({
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
        //添加评分
        me.btnAddScore = Ext.create('YZSoft.src.menu.Item', {
           
            margin: 0,
            iconCls: 'yz-btn-add',
            text: '添加评分',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addScore();
            }
        });
        //添加市场部评分
        me.btnAddMarketScore = Ext.create('YZSoft.src.menu.Item', {
        
            iconCls: 'yz-btn-add',
            margin: 0,
            text: '添加市场部评分',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.addMartketScore();
            }
        });

        //更多操作
        me.btnMore = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-btn-more',
            padding: '3 15 3 15',
            text: '添加评分',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),
            menu: {
                items: [
                    me.btnAddScore,
                    '-',
                    me.btnAddMarketScore,
                ]
            },
            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {

            }
        });

        //查看评分
        me.btnCheckScore = Ext.create('YZSoft.src.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            text: '查看评分',
            store: me.templateStore,
            sm: me.temlateGrid.getSelectionModel(),

            updateStatus: function() {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(config, me.temlateGrid, this.perm, 1, -1));
            },
            handler: function() {
                me.checkScore();
            }
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

        //导航栏布局
        var cfg = {
            title: '',
            layout: 'border',
            border: false,
            tbar: [me.btnMore, me.btnCheckScore, me.btnExcelExport, "开始时间:", me.ComboxstEdit, "结束时间:", me.ComboxendEdit, '事件描述', me.Search, me.btnSearch3],
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
    onSearch3Click: function() {
        var me = this,
            store = me.templateStore,
            params = store.getProxy().getExtraParams(),
            st = me.ComboxstEdit.getValue();
        ed = me.ComboxendEdit.getValue();
        Keyword = me.Search.getValue();

        Ext.apply(params, {
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
    checkScore: function() {
        var me = this,
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            tid;

        if (recs.length == 0)
            return;
        Ext.each(recs, function(rec) {
            tid = rec.get("TaskID");
        });
        var view = YZSoft.ViewManager.addView(me, 'sjy.glsc.Panel.CheckPersonalSummaryScore', {
            title: '查看个人汇总评分',
            taskid: tid,
            closable: true
        });
    },
    //添加市场部评分
    addMartketScore: function() {
        var me = this,
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            tid;

        if (recs.length == 0)
            return;
        Ext.each(recs, function(rec) {
            tid = rec.get("TaskID");
        });
        var params = {
            Method: 'marketingPermit',
            taskid: tid
        };
        YZSoft.Ajax.request({
            url: YZSoft.$url(me, '../StoreDataService/EventInfoData/score/ScorePerson_EventInfoData.ashx'),
            method: 'POST',
            params: params,
            dataType: "json",
            waitMsg: {
                msg: '正在查询...',
                target: me.temlateGrid,
                autoClose: true
            },
            success: function(action) {
                if (action.result.addPermit) {
                    var win = new Ext.window.Window({
                        id: 'addScore',
                        title: "添加评分",
                        width: 245,
                        height: 200,
                        renderTo: Ext.getBody(),
                        draggable: true, //不允许拖拽
                        resizable: false, //不允许改变窗口大小
                        closable: true, //不显示关闭按钮
                        collapsible: false, //显示折叠按钮
                        modal: true,
                        bodyStyle: 'background:#fff; padding:10px;', // 设置样式
                        //Ext items(array) 配置子组件的配置项
                        items: [
                            new YZSoft.src.button.Button({
                                text: '规划质量评分',
                                padding: '3 15 3 15',
                                margin: '5 5',
                                focusable: false,
                                width: 200,
                                store: me.temlateGrid,
                                sm: me.temlateGrid.getSelectionModel(),

                                updateStatus: function() {
                                    this.setDisabled(action.result.stage.G);
                                },
                                handler: function() {
                                    win.close();
                                    me.addScoreForms("设计院/管理手册/规划质量评分表", "规划质量评分表", action.result.taskid, "G");
                                }
                            }),
                            new YZSoft.src.button.Button({
                                text: '可行性研究质量评分',
                                padding: '3 15 3 15',
                                margin: '5 5',
                                focusable: false,
                                store: me.temlateGrid,
                                width: 200,
                                sm: me.temlateGrid.getSelectionModel(),

                                updateStatus: function() {
                                    this.setDisabled(action.result.stage.C);
                                },
                                handler: function() {
                                    win.close();
                                    me.addScoreForms("设计院/管理手册/可行性研究质量评分表", "可行性研究质量评分表", action.result.taskid, "C");
                                }
                            }),
                            new YZSoft.src.button.Button({
                                text: '初步设计质量评分',
                                padding: '3 15 3 15',
                                margin: '5 5',
                                focusable: false,
                                width: 200,
                                store: me.temlateGrid,
                                sm: me.temlateGrid.getSelectionModel(),

                                updateStatus: function() {
                                    this.setDisabled(action.result.stage.K);
                                },
                                handler: function() {
                                    win.close();
                                    me.addScoreForms("设计院/管理手册/初步设计质量评分表", "初步设计质量评分表", action.result.taskid, "K");

                                }
                            }),
                            new YZSoft.src.button.Button({
                                text: '施工图设计质量评分',
                                padding: '3 15 3 15',
                                margin: '5 5',
                                focusable: false,
                                store: me.temlateGrid,
                                width: 200,
                                sm: me.temlateGrid.getSelectionModel(),

                                updateStatus: function() {
                                    this.setDisabled(action.result.stage.S);
                                },
                                handler: function() {
                                    win.close();
                                    me.addScoreForms("设计院/管理手册/施工图设计质量评分表", "施工图设计质量评分表", action.result.taskid, "S");
                                }
                            })
                        ],
                    }).show();
                } else {
                    var mbox = Ext.Msg.show({
                        title: '错误提示',
                        msg: '您非市场部人员，无法添加评分',
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
    //添加市场部评分输入框
    addScoreForms: function(url, title, taskid, stage) {
        var me = this;
        var form = new Ext.form.FormPanel({
            frame: false,
            border: 0,
            items: [{
                    width: 200,
                    xtype: 'textfield',
                    fieldLabel: '评分',
                    name: 'score',
                    readOnly: false,
                    labelWidth: 40
                },
                new YZSoft.src.button.Button({
                    text: '确定',
                    padding: '3 15 3 15',
                    margin: '5 5',
                    focusable: false,
                    width: 200,

                    handler: function() {

                        var score = form.getValues()["score"];
                        var params = {
                            taskid: taskid,
                            score: score,
                            stage: stage,
                            Method: 'addMarketingScore'
                        };
                        newWindow.close();
                        YZSoft.Ajax.request({
                            url: YZSoft.$url(me, '../StoreDataService/EventInfoData/score/ScorePerson_EventInfoData.ashx'),
                            method: 'POST',
                            params: params,
                            dataType: "json",
                            waitMsg: {
                                msg: '正在查询...',
                                target: me.temlateGrid,
                                autoClose: true
                            },
                            success: function(action) {
                                if (action.result.success) {

                                    var mbox = Ext.Msg.show({
                                        title: '提交成功',
                                        msg: '评分成功',
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
                                newWindow.show();
                            }
                        })
                    },
                })
            ],
        });
        var newWindow = new Ext.window.Window({
            id: 'addScore',
            title: "添加市场部评分",
            width: 250,
            height: 120,
            renderTo: Ext.getBody(),
            draggable: true, //不允许拖拽
            resizable: false, //不允许改变窗口大小
            closable: true, //不显示关闭按钮
            collapsible: false, //显示折叠按钮
            modal: true,
            bodyStyle: 'background:#fff; padding:10px;', // 设置样式
            //Ext items(array) 配置子组件的配置项
            items: form
        }).show();
    },


    //添加评分
    addScore: function() {
        var me = this,
            recs = me.temlateGrid.getSelectionModel().getSelection(),
            tid;

        if (recs.length == 0)
            return;
        Ext.each(recs, function(rec) {
            tid = rec.get("TaskID");
        });
        var params = {
            Method: 'isPermit',
            taskid: tid
        };
        YZSoft.Ajax.request({
            url: YZSoft.$url(me, '../StoreDataService/EventInfoData/score/ScorePerson_EventInfoData.ashx'),
            method: 'POST',
            params: params,
            dataType: "json",
            waitMsg: {
                msg: '正在查询...',
                target: me.temlateGrid,
                autoClose: true
            },
            success: function(action) {
                if (action.result.addPermit) {
                    var win = new Ext.window.Window({
                        id: 'addScore',
                        title: "添加评分",
                        width: 245,
                        height: 200,
                        renderTo: Ext.getBody(),
                        draggable: true, //不允许拖拽
                        resizable: false, //不允许改变窗口大小
                        closable: true, //不显示关闭按钮
                        collapsible: false, //显示折叠按钮
                        modal: true,
                        bodyStyle: 'background:#fff; padding:10px;', // 设置样式
                        //Ext items(array) 配置子组件的配置项
                        items: [
                            new YZSoft.src.button.Button({
                                text: '规划质量评分',
                                padding: '3 15 3 15',
                                margin: '5 5',
                                focusable: false,
                                width: 200,
                                store: me.temlateGrid,
                                sm: me.temlateGrid.getSelectionModel(),

                                updateStatus: function() {
                                    this.setDisabled(action.result.stage[0].permit);
                                },
                                handler: function() {
                                    win.close();
                                    me.choseMember("设计院/管理手册/规划质量评分表", "规划质量评分表", action.result.taskid, action.result.stage[0].role);
                                }
                            }),
                            new YZSoft.src.button.Button({
                                text: '可行性研究质量评分',
                                padding: '3 15 3 15',
                                margin: '5 5',
                                focusable: false,
                                store: me.temlateGrid,
                                width: 200,
                                sm: me.temlateGrid.getSelectionModel(),

                                updateStatus: function() {
                                    this.setDisabled(action.result.stage[1].permit);
                                },
                                handler: function() {
                                    win.close();
                                    me.choseMember("设计院/管理手册/可行性研究质量评分表", "可行性研究质量评分表", action.result.taskid, action.result.stage[1].role);
                                }
                            }),
                            new YZSoft.src.button.Button({
                                text: '初步设计质量评分',
                                padding: '3 15 3 15',
                                margin: '5 5',
                                focusable: false,
                                width: 200,
                                store: me.temlateGrid,
                                sm: me.temlateGrid.getSelectionModel(),

                                updateStatus: function() {
                                    this.setDisabled(action.result.stage[2].permit);
                                },
                                handler: function() {
                                    win.close();
                                    me.choseMember("设计院/管理手册/初步设计质量评分表", "初步设计质量评分表", action.result.taskid, action.result.stage[2].role);
                                }
                            }),
                            new YZSoft.src.button.Button({
                                text: '施工图设计质量评分',
                                padding: '3 15 3 15',
                                margin: '5 5',
                                focusable: false,
                                store: me.temlateGrid,
                                width: 200,
                                sm: me.temlateGrid.getSelectionModel(),

                                updateStatus: function() {
                                    this.setDisabled(action.result.stage[3].permit);
                                },
                                handler: function() {
                                    win.close();
                                    me.choseMember("设计院/管理手册/施工图设计质量评分表", "施工图设计质量评分表", action.result.taskid, action.result.stage[3].role);
                                }
                            })
                        ],
                    }).show();
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
    /*
     *选择人员
     */
    choseMember: function(url, title, taskid, member) {
        let me = this;
        var win = new Ext.window.Window({
            id: 'choseMember',
            title: "选择角色",
            width: 245,
            height: 160,
            renderTo: Ext.getBody(),
            draggable: true, //不允许拖拽
            resizable: false, //不允许改变窗口大小
            closable: true, //不显示关闭按钮
            collapsible: false, //显示折叠按钮
            modal: true,
            bodyStyle: 'background:#fff; padding:10px;', // 设置样式
            //Ext items(array) 配置子组件的配置项
            items: [
                new YZSoft.src.button.Button({
                    text: '校核人',
                    padding: '3 15 3 15',
                    margin: '5 5',
                    focusable: false,
                    width: 200,
                    store: me.temlateGrid,
                    sm: me.temlateGrid.getSelectionModel(),

                    updateStatus: function() {
                        var flag = true;
                        member.forEach(v => {
                            if (v === "校核人") {
                                flag = false;
                            }
                        })
                        this.setDisabled(flag);
                    },
                    handler: function() {
                        win.close();
                        me.addScoreForm(url, title, taskid, '校核人');
                    }
                }),
                new YZSoft.src.button.Button({
                    text: '审查人',
                    padding: '3 15 3 15',
                    margin: '5 5',
                    focusable: false,
                    store: me.temlateGrid,
                    width: 200,
                    sm: me.temlateGrid.getSelectionModel(),

                    updateStatus: function() {
                        var flag = true;
                        member.forEach(v => {
                            if (v === "审查人") {
                                flag = false;
                            }
                        })
                        this.setDisabled(flag);
                    },
                    handler: function() {
                        win.close();
                        me.addScoreForm(url, title, taskid, '审查人');
                    }
                }),
                new YZSoft.src.button.Button({
                    text: '核定人',
                    padding: '3 15 3 15',
                    margin: '5 5',
                    focusable: false,
                    width: 200,
                    store: me.temlateGrid,
                    sm: me.temlateGrid.getSelectionModel(),

                    updateStatus: function() {
                        var flag = true;
                        member.forEach(v => {
                            if (v === "核定人") {
                                flag = false;
                            }
                        })
                        this.setDisabled(flag);
                    },
                    handler: function() {
                        win.close();
                        me.addScoreForm(url, title, taskid, '核定人');
                    }
                })
            ],
        }).show();

    },
    //选择内容发起
    addScoreForm: function(url, title, taskid, role) {
        var me = this;
        YZSoft.BPM.src.ux.FormManager.openFormApplication(url, '', 'New', Ext.apply({
            sender: this,
            title: title,
            dlgModel: 'Dialog',
            params: {
                taskid,
                role
            },
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
    }
});