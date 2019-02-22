Ext.define('sjy.FixedAssets.Manage.Panel.SearchPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.BPM.src.form.field.ProcessNameComboBox',
        'YZSoft.src.form.field.User',
        'YZSoft.src.form.field.PeriodPicker'
    ],
    height: 'auto',
    border: false,
    cls: 'yz-search-panel',
    bodyPadding: '4 5 4 5',

    constructor: function(config) {
        var me = this;
        var date = new Date;
        var year = date.getFullYear();
        var st = year + "-01-01T00:00:00";
        var et = (parseInt(year) + 1) + "-01-01T00:00:00";
        var sortable = config.sortable !== false;

        //开始时间
        me.ComboxstEdit = new Ext.form.ComboBox({
            fieldLabel: "开始时间:",
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
            fieldLabel: "结束时间:",
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
        //固定资产状况
        me.ComboxPosition = new Ext.form.ComboBox({
            fieldLabel: "资产使用状况:",
            store: new Ext.data.ArrayStore({
                fields: ['year'],
                data: [
                    ['全部'],
                    ['报废'],
                    ['在']
                ] //[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
            }),
            displayField: 'year',
            padding: '3 0 3 0',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: true,
            lastQuery: '',
            value: ''
        });
        //部门
        me.ComboxDepartment = new Ext.form.ComboBox({
            fieldLabel: "部门:",
            store: new Ext.data.ArrayStore({
                fields: ['year'],
                data: [
                    ['全部'],
                    ['领导'],
                    ['总师室'],
                    ['设计一院'],
                    ['设计二院'],
                    ['规划院'],
                    ['岩土所'],
                    ['市场部'],
                    ['办公室']
                ] //[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
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

        //人员显示框
        me.People = Ext.create('YZSoft.src.form.field.User', {
            fieldLabel: "人员:",
        });
        //关键字
        me.edtKeyword = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Keyword'),
            allowBlank: true
        });
        //搜索按钮
        me.btnSearch = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            text: RS.$('All_Search'),
            handler: function() {
                me.onSearchClick();
            }
        });
        //清空按钮
        me.btnClear = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: '0 0 0 5',
            text: RS.$('All_Reset'),
            handler: function() {
                me.onResetClick();
            }
        });

        var cfg = {
            border: false,
            defaults: {
                border: false,
                layout: { type: 'hbox' },
                defaults: {
                    margin: '1 0',
                    border: false,
                    layout: {
                        type: 'fit'
                    },
                    defaults: {
                        labelWidth: YZSoft.os.isMobile ? 80 : 100,
                        padding: '1 6 1 2'
                    }
                }
            },
            items: [{
                items: [{
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.ComboxstEdit]

                }, {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.ComboxendEdit]
                }, {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.ComboxPosition]
                }]
            }, {
                items: [{
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.ComboxDepartment]
                }, {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.People]
                },  {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.edtKeyword]
                },{
                    flex: 1,
                    minWidth: 100,
                    layout: {
                        type: 'hbox'
                    },
                    items: [me.btnSearch, me.btnClear]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onSearchClick: function() {
        var me = this,
            store = me.store,
            st = me.ComboxstEdit.getValue(),
            et = me.ComboxendEdit.getValue(),
            position = me.ComboxPosition.getValue(),
            department = me.ComboxDepartment.getValue(),
            people = me.People.getValue(),
            Keyword = me.edtKeyword.getValue(),
            params = me.store.getProxy().getExtraParams();
            if(st=='请选择')
                st = '';
            if(et=='请选择')
                et = '';
            if(position=='全部')
                position='';
            if(department=='全部')
                department='';
        Ext.apply(params, {
            method: 'GetData',
            Kword: Keyword,
            beginYear: st,
            endYear: et,
            depart: department,
            isBreak: position,
            account: people,
        });
        store.loadPage(1);
    },

    onResetClick: function() {
        var me = this,
            store = me.store,
            params = me.store.getProxy().getExtraParams();

        me.ComboxstEdit.setValue('');
        me.ComboxendEdit.setValue('');
        me.ComboxPosition.setValue('');
        me.ComboxDepartment.setValue('');
        me.People.setValue('');
        me.edtKeyword.setValue('');

        Ext.apply(params, {
            searchType: '',
            Year: '',
        });

        me.store.loadPage(1);
    },
    setYear: function() {
        //[['1', '第一季度'], ['2', '第二季度'], ['3', '第三季度'], ['4', '第四季度']]
        var sb = '[["请选择"],';
        
        var year = new Date().getFullYear();

        for (var i = 0; year - i > 2000; i++) {
            sb += '["' + (year - i) + '"],';
            
        }
        return eval('(' + sb.substr(0, sb.length - 1) + '])');
    }
});