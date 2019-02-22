Ext.define('sjy.glsc.Panel.MemberLibrary', {
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

        var gridDefaults = {
            hideHeaders: false,
            border: true,
            rowLines: true,
            bodyStyle: 'border-top:0;'
            //viewConfig: {
            //    stripeRows: false
            //}
        };



        me.storeJHR = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Draft',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/MemberLibrary/Library.ashx'),
                extraParams: {
                    method: 'getData',
                    type: 1
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    // this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {
                    var refs = me.getReferences();
                    refs.titlePanel.setTitle('成员库');
                }
            }
        });

        me.storeFYLD = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 10,
            model: 'YZSoft.BPM.src.model.Draft',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/EventInfoData/MemberLibrary/Library.ashx'),
                extraParams: {
                    method: 'getData',
                    type: 2
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function() {
                    // this.getProxy().getExtraParams().uid = me.user.Account;
                },
                load: function() {

                }
            }
        });

        me.gridJHR = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.storeJHR,
            border: false,
            region: 'center',
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, { mode: 'MULTI' }),
            columns: {
                drfaults: {},
                items: [
                    { xtype: 'rownumberer' },
                    { header: '姓名', dataIndex: 'name', width: 150, align: 'left', scope: me, renderer: me.renderText },
                    { header: '账号', dataIndex: 'account', width: 150, align: 'left', scope: me, renderer: me.renderText },
                    {
                        header: '操作',
                        align: 'center',
                        scope: me,
                        renderer: me.renderSN,
                        listeners: {
                            scope: me,
                            click: function(view, cell, recordIndex, cellIndex, e, record) {
                                let me = this;
                                let name = record.get('name');
                                let id = record.get('id');
                                me.delMember(name, id, me.gridJHR);
                            }
                        }
                    }
                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.storeJHR,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, index, e, eOpts) {

                }
            },
        }, gridDefaults));

        me.gridFYLD = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.storeFYLD,
            border: false,
            region: 'center',
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, { mode: 'MULTI' }),
            columns: {
                drfaults: {},
                items: [
                    { xtype: 'rownumberer' },
                    { header: '姓名', dataIndex: 'name', width: 150, align: 'left', scope: me, renderer: me.renderText },
                    { header: '账号', dataIndex: 'account', width: 150, align: 'left', scope: me, renderer: me.renderText },
                    {
                        header: '操作',
                        align: 'center',
                        scope: me,
                        renderer: me.renderSN,
                        listeners: {
                            scope: me,
                            click: function(view, cell, recordIndex, cellIndex, e, record) {
                                let me = this;
                                let name = record.get('name');
                                let id = record.get('id');
                                me.delMember(name, id, me.gridFYLD);
                            }
                        }
                    }
                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.storeFYLD,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                itemdblclick: function(grid, record, item, index, e, eOpts) {

                }
            },
        }, gridDefaults));

        var cfg = {
            // tbar: [me.btnSelUser, '->', me.btnRefresh],
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
                    width: 495,
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
                            title: '校核人',
                            items: [{
                                docked: 'right',
                                xtype: 'button',
                                text: ' 添加 ',
                                padding: '3 15 3 15',
                                handler: function() {
                                    me.addMember(me.gridJHR, 1);
                                }
                            }]
                        },
                        items: [
                            me.gridJHR
                        ]
                    }]
                }, {
                    items: [{
                        reference: 'myRequests',
                        header: {
                            title: '分院领导',
                            items: [{
                                docked: 'right',
                                xtype: 'button',
                                text: ' 添加 ',
                                padding: '3 15 3 15',
                                handler: function() {
                                    me.addMember(me.gridFYLD, 2);
                                }
                            }]
                        },
                        items: [
                            me.gridFYLD
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
            this.storeJHR.load(YZSoft.EnvSetting.storeFirstLoadMask);
            this.storeFYLD.load(YZSoft.EnvSetting.storeFirstLoadMask);
            // this.storeMyShareTasks.load({});
        } else {
            this.storeJHR.load(YZSoft.EnvSetting.storeFirstLoadMask);
            this.storeFYLD.load(YZSoft.EnvSetting.storeFirstLoadMask);
            // this.storeMyShareTasks.reload({ loadMask: false });
        }
    },
    renderText: function(value, p, record) {
        return Ext.String.format("<div style='height:20px;display:flex;align-items:center;'>{0}</div>", YZSoft.HttpUtility.htmlEncode(value));
    },

    renderSN: function(value, p, record) {
        return Ext.String.format("<input type='button' value='删除'/>", YZSoft.HttpUtility.htmlEncode(value));
    },

    onClickSN: function(view, cell, recordIndex, cellIndex, e, record) {
        let me = this;
        let name = record.get('name');
        let id = record.get('id');
        me.delMember(name, id);
    },

    delMember: function(name, id, grid) {
        let me = this;
        Ext.Msg.show({
            title: '删除确认',
            msg: '您确定要删除(' + name + ')吗？',
            buttons: Ext.Msg.OKCANCEL,
            defaultFocus: 'cancel',
            icon: Ext.MessageBox.INFO,

            fn: function(btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url(me, '../StoreDataService/EventInfoData/MemberLibrary/Library.ashx'),
                    method: 'POST',
                    params: {
                        method: 'delMember'
                    },
                    jsonData: {
                        id
                    },
                    waitMsg: {
                        msg: '请稍后',
                        target: grid
                    },
                    success: function(action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: '删除成功!',
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
            }
        });
    },
    addMember: function(grid, type) {
        let me = this;
        var params = {
            Method: 'addMember'
        };
        YZSoft.SelUsersDlg.show({
            fn: function(users) {
                if (users.length == 0)
                    return;
                Ext.each(users, function(user) {
                    account = user.Account;
                    name = user.DisplayName;

                });
                YZSoft.Ajax.request({
                    url: YZSoft.$url(me, '../StoreDataService/EventInfoData/MemberLibrary/Library.ashx'),
                    method: 'POST',
                    params: params,
                    jsonData: {
                        account: account,
                        name: name,
                        type
                    },
                    waitMsg: { msg: '请稍后', target: grid },
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
                                msg: "添加成功",
                                delay: 'x'
                            }
                        });
                    },
                    failure: function(action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems);
                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';
                        Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: "添加失败",
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                    }
                });
            }
        });
    }
});