
Ext.define('YZSoft.BPM.Maintenance.TaskHandoverSummaryPanel', {
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

    constructor: function (config) {
        var me = this;

        me.user = userInfo;

        me.btnSelUser = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e624',
            text: RS.$('All_SelUser'),
            handler: function () {
                YZSoft.SelUserDlg.show({
                    fn: function (user) {
                        me.user = user;

                        me.storeMyRequests.load();
                        me.storeMyTasks.load();
                        me.storeMyShareTasks.load();
                    }
                });
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function () {
                me.storeMyRequests.load({});
                me.storeMyTasks.load({});
                me.storeMyShareTasks.load({});
            }
        });

        var gridDefaults = {
            hideHeaders: false,
            border: true,
            rowLines: true,
            bodyStyle: 'border-top:0;'
            //viewConfig: {
            //    stripeRows: false
            //}
        };

        me.storeMyRequests = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskList.ashx'),
                extraParams: {
                    method: 'GetHandoverRequests'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function () {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function () {
                    var refs = me.getReferences();
                    refs.titlePanel.setTitle(Ext.String.format(RS.$('Ment_Title'), me.user.DisplayName || me.user.Account));
                    refs.myRequests.setTitle(Ext.String.format('{0}<span style="color:red">({1})</span>', RS.$('All_RunningRequests'), this.getTotalCount()));
                }
            }
        });

        me.storeMyTasks = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Worklist',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskList.ashx'),
                extraParams: {
                    method: 'GetWorkListOfUser'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function () {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function () {
                    var refs = me.getReferences();
                    refs.myTasks.setTitle(Ext.String.format('{0}<span style="color:red">({1})</span>', RS.$('All_WorkList'), this.getTotalCount()));
                }
            }
        });

        me.storeMyShareTasks = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Worklist',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskList.ashx'),
                extraParams: {
                    method: 'GetShareTasksOfUser'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function () {
                    this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function () {
                    var refs = me.getReferences();
                    refs.myShareTasks.setTitle(Ext.String.format('{0}<span style="color:red">({1})</span>', RS.$('All_ShareTask'), this.getTotalCount()));
                }
            }
        });

        me.gridMyRequests = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.storeMyRequests,
            columns: {
                drfaults: {
                },
                items: [
                    { text: RS.$('All_SN'), width: 130, dataIndex: 'SerialNum', scope: me, renderer: me.renderSN, listeners: { scope: me, click: me.onClickSN} },
                    { text: RS.$('All_ProcessName'), width: 140, dataIndex: 'ProcessName', align: 'center' },
                    { text: RS.$('All_PostAt'), width: 100, dataIndex: 'CreateAt', align: 'center',renderer: YZSoft.Render.renderDateYMD },
                    { text: RS.$('All_Status'), dataIndex: 'State', flex: 1, align: 'center', sortable: true, renderer: YZSoft.BPM.src.ux.Render.renderTaskStateNoWrap }
                ]
            },
            viewConfig: {
                getRowClass: function (record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function (grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));

        me.gridMyTasks = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.storeMyTasks,
            columns: {
                drfaults: {
                },
                items: [
                    { text: RS.$('All_SN'), dataIndex: 'SerialNum', width: 130, align: 'left', sortable: true, scope: me, renderer: me.renderSN, listeners: { scope: me, click: me.onClickSN} },
                    { text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', flex: 1, align: 'left', sortable: true, renderer: YZSoft.Render.renderString },
                    { text: RS.$('All_Version'), hidden: true, dataIndex: 'ProcessVersion', width: 80, align: 'center', sortable: true, renderer: YZSoft.Render.renderString },
                    { text: RS.$('All_Owner'), dataIndex: 'OwnerAccount', width: 100, align: 'center', sortable: true, renderer: YZSoft.BPM.src.ux.Render.renderTaskOwner },
                    { text: RS.$('All_PostAt'), hidden: true, dataIndex: 'CreateAt', width: 130, align: 'center', sortable: true },
                    { text: RS.$('All_CurStep'), dataIndex: 'NodeName', width: 100, align: 'center', sortable: true, renderer: YZSoft.Render.renderString },
                    { text: RS.$('All_Status'), hidden: true, dataIndex: 'State', width: 100, align: 'center', sortable: true, renderer: YZSoft.BPM.src.ux.Render.renderTaskState },
                    { text: RS.$('All_TaskDesc'), hidden: true, dataIndex: 'Description', align: 'left', sortable: true, flex: 1, tdCls: 'yz-wrap', shrinkWrap: true }
                ]
            },
            viewConfig: {
                getRowClass: function (record) {
                    return YZSoft.BPM.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                itemdblclick: function (grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));

        me.gridMyShareTasks = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.storeMyShareTasks,
            columns: {
                drfaults: {
                },
                items: [
                    { text: RS.$('All_SN'), dataIndex: 'SerialNum', width: 130, align: 'left', sortable: true, scope: me, renderer: me.renderSN, listeners: { scope: me, click: me.onClickSN} },
                    { text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', flex: 1, align: 'left', sortable: true, renderer: YZSoft.Render.renderString },
                    { text: RS.$('All_Version'), hidden: true, dataIndex: 'ProcessVersion', width: 80, align: 'center', sortable: true, renderer: YZSoft.Render.renderString },
                    { text: RS.$('All_Owner'), dataIndex: 'OwnerAccount', width: 100, align: 'center', sortable: true, renderer: YZSoft.BPM.src.ux.Render.renderTaskOwner },
                    { text: RS.$('All_PostAt'), hidden: true, dataIndex: 'CreateAt', width: 130, align: 'center', sortable: true },
                    { text: RS.$('All_CurStep'), dataIndex: 'NodeName', width: 100, align: 'center', sortable: true, renderer: YZSoft.Render.renderString },
                    { text: RS.$('All_Status'), hidden: true, dataIndex: 'State', width: 100, align: 'center', sortable: true, renderer: YZSoft.BPM.src.ux.Render.renderTaskState },
                    { text: RS.$('All_TaskDesc'), hidden: true, dataIndex: 'Description', align: 'left', sortable: true, flex: 1, tdCls: 'yz-wrap', shrinkWrap: true }
                ]
            },
            viewConfig: {
                getRowClass: function (record) {
                    return 'yz-task-row yz-task-row-running';
                }
            },
            listeners: {
                itemdblclick: function (grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        }, gridDefaults));

        var cfg = {
            tbar: [me.btnSelUser, '->', me.btnRefresh],
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
                width: 600
            }, {
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'begin'
                },
                defaults: {
                    xtype: 'panel',
                    border: false,
                    width: 600,
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
                        reference: 'myRequests',
                        header: {
                            title: '',
                            items: [{
                                docked: 'right',
                                xtype: 'button',
                                text: RS.$('Ment_Handover'),
                                handler: function () {
                                    YZSoft.ViewManager.addView(me, 'YZSoft.BPM.Maintenance.HandoverRequestsPanel', {
                                        title: Ext.String.format('{0} - {1}', RS.$('All_RunningRequests'), me.user.DisplayName || me.user.Account),
                                        id: Ext.String.format('handover_requests_{0}', YZSoft.util.hex.encode(me.user.Account)),
                                        uid: me.user.Account
                                    });
                                }
                            }]
                        },
                        items: [
                            me.gridMyRequests
                        ]
                    }, {
                        reference: 'myShareTasks',
                        header: {
                            title: '',
                            items: [{
                                docked: 'right',
                                xtype: 'button',
                                text: RS.$('Ment_Handover'),
                                handler: function () {
                                    YZSoft.ViewManager.addView(me, 'YZSoft.BPM.Maintenance.HandoverShareTaskPanel', {
                                        title: Ext.String.format('{0} - {1}', RS.$('All_ShareTask'), me.user.DisplayName || me.user.Account),
                                        id: Ext.String.format('handover_sharetask_{0}', YZSoft.util.hex.encode(me.user.Account)),
                                        uid: me.user.Account
                                    });
                                }
                            }]
                        },
                        items: [
                            me.gridMyShareTasks
                        ]
                    }]
                }, {
                    items: [{
                        reference: 'myTasks',
                        header: {
                            title: '',
                            items: [{
                                docked: 'right',
                                xtype: 'button',
                                text: RS.$('Ment_Handover'),
                                handler: function () {
                                    YZSoft.ViewManager.addView(me, 'YZSoft.BPM.Maintenance.HandoverWorklistPanel', {
                                        title: Ext.String.format('{0} - {1}',RS.$('All_WorkList'), me.user.DisplayName || me.user.Account),
                                        id: Ext.String.format('handover_worklist_{0}', YZSoft.util.hex.encode(me.user.Account)),
                                        uid: me.user.Account,
                                        collapseSearchPanel: true
                                    });
                                }
                            }]
                        },
                        items: [
                            me.gridMyTasks
                        ]
                    }]
                }]
            }]
        };


        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function (times) {
        if (times == 0) {
            this.storeMyRequests.load({});
            this.storeMyTasks.load({});
            this.storeMyShareTasks.load({});
        }
        else {
            this.storeMyRequests.reload({ loadMask: false });
            this.storeMyTasks.reload({ loadMask: false });
            this.storeMyShareTasks.reload({ loadMask: false });
        }
    },

    renderSN: function (value, p, record) {
        return Ext.String.format("<a href='#'>{0}</a>", YZSoft.HttpUtility.htmlEncode(value));
    },

    onClickSN: function (view, cell, recordIndex, cellIndex, e, record) {
        if (e.getTarget().tagName == 'A')
            this.openForm(record);
    },

    openForm: function (record, config) {
        YZSoft.BPM.src.ux.FormManager.openTaskForRead(record.data.TaskID, Ext.apply(config || {}, {
            sender: this,
            title: Ext.String.format('{0}-{1}', record.data.ProcessName, record.data.SerialNum)
        }));
    }
});
