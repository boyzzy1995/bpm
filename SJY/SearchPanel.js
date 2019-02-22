Ext.define('sjy.glsc.Panel.SearchPanel', {
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

        //年份查找
        me.ComboxTimeEdit = new Ext.form.ComboBox({
            fieldLabel: "年份查找:",
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

        //部门
        me.ComboxDepartment = new Ext.form.ComboBox({
            fieldLabel: "部门:",
            data:[],
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
        
        //重要性
        me.ComboxImportant = new Ext.form.ComboBox({
            fieldLabel: "重要性:",
            store: new Ext.data.ArrayStore({
                fields: ['year'],
                data: [
                    ['全部'],
                    ['重要'],
                    ['一般']
                ]
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

        //项目状态
        me.ComboxState = new Ext.form.ComboBox({
            fieldLabel: "项目状态:",
            store: new Ext.data.ArrayStore({
                fields: ['year'],
                data: [
                    ['全部'],
                    ['进行中'],
                    ['已结束']
                ]
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
        
        //项目负责人
        me.Leader = Ext.create('YZSoft.src.form.field.User', {
            fieldLabel: "第一项目负责人:",
        });
        
        //主审查人
        me.Examiner = Ext.create('YZSoft.src.form.field.User', {
            fieldLabel: "主审查人:",
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
                    items: [me.ComboxTimeEdit]

                }, {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.ComboxDepartment]
                }, {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.ComboxImportant]
                }, {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: []
                }]
            }, {
                items: [{
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.Examiner]
                }, {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.Leader]
                },  {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.ComboxState]
                },{
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: []
                }]
            }, {
                items: [{
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.edtKeyword]
                },{
                    flex: 1,
                    layout: {
                        type: 'hbox'
                    },
                    items: [me.btnSearch, me.btnClear]
                },{
                    flex: 2,
                    maxWidth: 320,
                    minWidth: 180,
                    items: []
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onSearchClick: function() {
        var me = this,
            store = me.store,
            time = me.ComboxTimeEdit.getValue(),
            department = me.ComboxDepartment.getValue(),
            leader = me.Leader.getValue(),
            examiner = me.Examiner.getValue(),
            keyword=me.edtKeyword.getValue(),
            important=me.ComboxImportant.getValue(),
            state=me.ComboxState.getValue(),
            params = me.store.getProxy().getExtraParams();
            
            if(time=='请选择')
                time = '';
            if(department=='全部')
                department='';
            if(important=='全部')
                important='';  
            if(state=='全部')
                state=''; 
        Ext.apply(params, {
            SearchType: 'QuickSearch',
            SearchBy: 'Deadline',
            SearchYear: time,
            department:department,
            leader:leader,
            examiner:examiner,
            Kword:keyword,
            important:important,
            state:state
        });
        store.loadPage(1);
    },

    onResetClick: function() {
        var me = this,
            store = me.store,
            params = me.store.getProxy().getExtraParams();

        me.ComboxTimeEdit.setValue('');
        me.ComboxDepartment.setValue('');
        me.Leader.setValue('');
        me.Examiner.setValue('');
        me.edtKeyword.setValue('');
        me.ComboxImportant.setValue('');

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