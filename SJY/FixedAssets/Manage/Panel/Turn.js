Ext.define('sjy.FixedAssets.Manage.Panel.Turn', {
    extend: 'Ext.form.Panel',
    requires: [
        'YZSoft.src.form.field.Headshot',
        'YZSoft.src.form.field.Sign',
        'YZSoft.src.form.field.User',
        'Ext.data.JsonStore',
    ],
    border: false,
    bodyPadding: '30px',
    referenceHolder: true,
    autoScroll: true,
    bodyStyle: 'background-color:#f5f5f5',

    constructor: function(config) {
        var me = this;
        //导航栏'提交按钮'按钮
        me.btnSubmit = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '提交',
            handler: function() {
                me.Submit();
            }
        });
        var cmps = {
            baseInfo: {
                xtype: 'fieldset',
                ui: 'yz-field-title',
                title: '',

                minHeight: 223,
                defaults: {
                    xtype: 'textfield',
                    anchor: '100%',
                    labelWidth: 90,
                },
                items: [{
                    fieldLabel: '资产编号',
                    name: 'assetID',
                    readOnly: true
                }, {
                    fieldLabel: '设备名称',
                    name: 'devicename',
                    readOnly: true
                }, {
                    xtype: "YZUserField",
                    fieldLabel: "人员选择",
                    name: 'userAccount',
                    readOnly: false,
                    onBrowserClick: function() {
                        var me = this;

                        YZSoft.SelUserDlg.show({
                            fn: function(user) {
                                if (user == null)
                                    return;

                                me.onSelect(user);
                            }
                        });
                    },
                    onSelect: function(user) {
                        this.setValue(user.DisplayName + "(" + user.Account + ")");
                        this.fireEvent('select', user);
                    }
                }, {
                    xtype: "combo",
                    fieldLabel: "使用地点",
                    name: 'useplace',
                    readOnly: false,
                    store: ['设计院', '岩土所']
                }, {
                    xtype: "combo",
                    fieldLabel: "使用部门",
                    name: 'depart',
                    readOnly: false,

                    store: ['领导', '总师室', '设计一院', '设计二院', '规划院', '岩土所', '市场部', '办公室'],
                }, {
                    xtype: "textareafield",
                    fieldLabel: "原因",
                    name: 'reason',

                    readOnly: false,
                }]
            },
        };

        var userBaseInfo = {
            border: false,
            layout: {
                type: 'anchor'
            },
            items: [{
                border: false,
                layout: {
                    type: 'hbox'
                },
                defaults: {
                    xtype: 'panel',
                    border: false,
                    layout: 'anchor',
                    defaults: {
                        border: false,
                        layout: 'anchor'
                    }
                },
                items: [{
                    width: 335,
                    items: [cmps.baseInfo]
                }]
            }, {
                border: false,
                items: [me.btnSubmit]
            }]
        };

        var cfg = {
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'begin'
            },
            defaults: {
                xtype: 'panel',
                border: false,
                bodyStyle: 'background-color:transparent',
                defaults: {
                    xtype: 'panel',
                    border: false,
                    ui: 'yzplain',
                    layout: 'anchor',
                    padding: '20px',
                    margin: '0 30px 30px 0'
                }
            },
            items: [{
                width: 700,
                items: [{
                    padding: '20px 20px 30px 20px',
                    reference: 'userInfoPanel',
                    title: '更换保管人',
                    reference: 'userInfoPanel',
                    items: [userBaseInfo]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function(times) {
        /*this.pnlChangePassword.Reset();*/
    },
    afterRender: function() {
        this.load();
        this.callParent(arguments);
    },
    onSearch3Click: function(config) {
        var me = this;
        var year = me.ComboxsjEdit.getValue();
        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('../StoreDataService/MainContract_EventInfoData.ashx'),
            params: {
                method: 'GetCollection',
                SearchYear: year
            },
            success: function(action) {
                me.fill(action.result);
            }
        }, config));
    },
    fill: function(data) {
        var me = this;
        /*ref = me.getReferences(),*/
        /*account = data.user.Account,
        userName = data.user.DisplayName || account;*/
        /*ref.userInfoPanel.setTitle(Ext.String.format(RS.$('All_Title_UserInfo'), userName));*/
        /*ref.headshot.setValue(account);*/
        /*ref.sign.setValue(account);*/
        /*me.pnlChangePassword.Reset();*/
        me.getForm().setValues(data);
        /*Ext.each(me.getForm().getFields().items, function (field) {
            field.setDisabled(field.name && Ext.Array.contains(data.setting.Fields, field.name));
        });*/
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
    jgNull: function() {
       /* var me=this;
        Ext.each(me.getForm().getFields().items, function(field) {
            alert(field.value);
            if (field.value ==""){
                var mbox = Ext.Msg.show({
                    title: '提交出错',
                    msg: field.fieldLabel+"不能为空!",
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.WARNING,
                    fn: function(btn, text) {
                        if (btn != 'ok')
                            return;
                    }
                });
                return;
            }
        });*/
    },
    load: function(config) {
        var me = this;
        var AssetID;
        var grid = me.grid;
        var recs = grid.getSelectionModel().getSelection();
        Ext.each(recs, function(rec) {
            AssetID = rec.get("AssetID");
        });

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url(me, '../StoreDataService/Manage_EvenDateInfo.ashx'),
            params: {
                method: 'getUserInformation',
                assetID: AssetID
            },
            success: function(action) {
                me.fill(action.result);
            }
        }, config));
    },
    Submit: function(config) {
        var me = this;
        var postForm = me.getForm();
        this.jgNull();
        postForm.submit({
            waitMsg: '正在提交数据',
            waitTitle: '提示',
            url: YZSoft.$url(me, '../StoreDataService/Manage_EvenDateInfo.ashx'),
            params: {
                method: 'ChangeUser',
            },
            success: function(form, action) {
                var feedback = action.result.success;
                if (feedback) {
                    var mbox = Ext.Msg.show({
                        title: '提交成功',
                        msg: '更换保管人成功',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING,
                        fn: function(btn, text) {
                            if (btn != 'ok')
                                return;
                            else {
                                me.close();
                            }
                        }
                    });
                } else {
                    var mbox = Ext.Msg.show({
                        title: '提交出错',
                        msg: '请与管理员联系',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING,
                        fn: function(btn, text) {
                            if (btn != 'ok')
                                return;
                        }
                    });
                }
            },
            failure: function(form, action) {
                var mbox = Ext.Msg.show({
                    title: RS.$('All_MsgTitle_Error'),
                    msg: action.result.errorMessage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        })
    }
});