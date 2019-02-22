Ext.define('sjy.glsc.Panel.SummarySearchPanel', {
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

        //部门
        me.ComboxDepartment = new Ext.form.ComboBox({
            fieldLabel: "部门:",
            data: [],
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

        //排序
        me.ComboxOrder = new Ext.form.ComboBox({
            // fieldLabel: "项目状态:",
            store: new Ext.data.ArrayStore({
                fields: ['order'],
                data: [
                    ['升序'],
                    ['降序']
                ]
            }),
            displayField: 'order',
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

        me.CheckBoxList = [];

        me.radioGroup = Ext.create('Ext.form.RadioGroup', {
            id: 'radioGroup',
            xtype: 'radiogroup',
            fieldLabel: "排序方式",
            name: 'fxkGroup',
            width: 800,
            columns: 4, // 在上面定义的宽度上展示3列
            items: [{
                boxLabel: '项目编号:升序',
                name: 'xmbh',
                inputValue: "pidUp",
                listeners: {
                    change: function(el, checked) {
                        var CheckBoxList = me.CheckBoxList;
                        if (checked) {
                            CheckBoxList.push(el.inputValue);
                        } else {
                            var index = CheckBoxList.indexOf(el.inputValue);
                            if (index > -1) {
                                CheckBoxList.splice(index, 1);
                            }
                        }
                        me.CheckBoxList = CheckBoxList;
                    }
                }
            }, {   
                boxLabel: '项目编号:降序',
                name: 'xmbh',
                inputValue: "pidDown",
                listeners: {
                    change: function(el, checked) {
                        var CheckBoxList = me.CheckBoxList;
                        if (checked) {
                            CheckBoxList.push(el.inputValue);
                        } else {
                            var index = CheckBoxList.indexOf(el.inputValue);
                            if (index > -1) {
                                CheckBoxList.splice(index, 1);
                            }
                        }
                        me.CheckBoxList = CheckBoxList;
                    }
                }
            },{
                boxLabel: '阶段:升序',
                name: 'jd',
                inputValue: "stageUp",
                listeners: {
                    change: function(el, checked) {
                        var CheckBoxList = me.CheckBoxList;
                        if (checked) {
                            CheckBoxList.push(el.inputValue);
                        } else {
                            var index = CheckBoxList.indexOf(el.inputValue);
                            if (index > -1) {
                                CheckBoxList.splice(index, 1);
                            }
                        }
                        me.CheckBoxList = CheckBoxList;
                    }
                }
            }, {   
                boxLabel: '阶段:降序',
                name: 'jd',
                inputValue: "stageDown",
                listeners: {
                    change: function(el, checked) {
                        var CheckBoxList = me.CheckBoxList;
                        if (checked) {
                            CheckBoxList.push(el.inputValue);
                        } else {
                            var index = CheckBoxList.indexOf(el.inputValue);
                            if (index > -1) {
                                CheckBoxList.splice(index, 1);
                            }
                        }
                        me.CheckBoxList = CheckBoxList;
                    }
                }
            },{
                boxLabel: '项目负责人:升序',
                name: 'xmfzr',
                inputValue: "leaderUp",
                listeners: {
                    change: function(el, checked) {
                        var CheckBoxList = me.CheckBoxList;
                        if (checked) {
                            CheckBoxList.push(el.inputValue);
                        } else {
                            var index = CheckBoxList.indexOf(el.inputValue);
                            if (index > -1) {
                                CheckBoxList.splice(index, 1);
                            }
                        }
                        me.CheckBoxList = CheckBoxList;
                    }
                }
            }, {   
                boxLabel: '项目负责人:降序',
                name: 'xmfzr',
                inputValue: "leaderDown",
                listeners: {
                    change: function(el, checked) {
                        var CheckBoxList = me.CheckBoxList;
                        if (checked) {
                            CheckBoxList.push(el.inputValue);
                        } else {
                            var index = CheckBoxList.indexOf(el.inputValue);
                            if (index > -1) {
                                CheckBoxList.splice(index, 1);
                            }
                        }
                        me.CheckBoxList = CheckBoxList;
                    }
                }
            },{
                boxLabel: '任务下达时间:升序',
                name: 'rwxdsj',
                inputValue: "projectdateUp",
                listeners: {
                    change: function(el, checked) {
                        var CheckBoxList = me.CheckBoxList;
                        if (checked) {
                            CheckBoxList.push(el.inputValue);
                        } else {
                            var index = CheckBoxList.indexOf(el.inputValue);
                            if (index > -1) {
                                CheckBoxList.splice(index, 1);
                            }
                        }
                        me.CheckBoxList = CheckBoxList;
                    }
                }
            }, {   
                boxLabel: '任务下达时间:降序',
                name: 'rwxdsj',
                inputValue: "projectdateDown",
                listeners: {
                    change: function(el, checked) {
                        var CheckBoxList = me.CheckBoxList;
                        if (checked) {
                            CheckBoxList.push(el.inputValue);
                        } else {
                            var index = CheckBoxList.indexOf(el.inputValue);
                            if (index > -1) {
                                CheckBoxList.splice(index, 1);
                            }
                        }
                        me.CheckBoxList = CheckBoxList;
                    }
                }
             },//{
            //     boxLabel: '事先讨论时间:升序',
            //     name: 'sxtlsj',
            //     inputValue: "beforedateUp",
            //     listeners: {
            //         change: function(el, checked) {
            //             var CheckBoxList = me.CheckBoxList;
            //             if (checked) {
            //                 CheckBoxList.push(el.inputValue);
            //             } else {
            //                 var index = CheckBoxList.indexOf(el.inputValue);
            //                 if (index > -1) {
            //                     CheckBoxList.splice(index, 1);
            //                 }
            //             }
            //             me.CheckBoxList = CheckBoxList;
            //         }
            //     }
            // }, {   
            //     boxLabel: '事先讨论时间:降序',
            //     name: 'sxtlsj',
            //     inputValue: "beforedateDown",
            //     listeners: {
            //         change: function(el, checked) {
            //             var CheckBoxList = me.CheckBoxList;
            //             if (checked) {
            //                 CheckBoxList.push(el.inputValue);
            //             } else {
            //                 var index = CheckBoxList.indexOf(el.inputValue);
            //                 if (index > -1) {
            //                     CheckBoxList.splice(index, 1);
            //                 }
            //             }
            //             me.CheckBoxList = CheckBoxList;
            //         }
            //     }
            // },{
            //     boxLabel: '事中评审:升序',
            //     name: 'szps',
            //     inputValue: "indateUp",
            //     listeners: {
            //         change: function(el, checked) {
            //             var CheckBoxList = me.CheckBoxList;
            //             if (checked) {
            //                 CheckBoxList.push(el.inputValue);
            //             } else {
            //                 var index = CheckBoxList.indexOf(el.inputValue);
            //                 if (index > -1) {
            //                     CheckBoxList.splice(index, 1);
            //                 }
            //             }
            //             me.CheckBoxList = CheckBoxList;
            //         }
            //     }
            // }, {   
            //     boxLabel: '事中评审:降序',
            //     name: 'szps',
            //     inputValue: "indateDown",
            //     listeners: {
            //         change: function(el, checked) {
            //             var CheckBoxList = me.CheckBoxList;
            //             if (checked) {
            //                 CheckBoxList.push(el.inputValue);
            //             } else {
            //                 var index = CheckBoxList.indexOf(el.inputValue);
            //                 if (index > -1) {
            //                     CheckBoxList.splice(index, 1);
            //                 }
            //             }
            //             me.CheckBoxList = CheckBoxList;
            //         }
            //     }
             //},
             {
                boxLabel: '成品送审:升序',
                name: 'cpss',
                inputValue: "productUp",
                listeners: {
                    change: function(el, checked) {
                        var CheckBoxList = me.CheckBoxList;
                        if (checked) {
                            CheckBoxList.push(el.inputValue);
                        } else {
                            var index = CheckBoxList.indexOf(el.inputValue);
                            if (index > -1) {
                                CheckBoxList.splice(index, 1);
                            }
                        }
                        me.CheckBoxList = CheckBoxList;
                    }
                }
            }, {   
                boxLabel: '成品送审:降序',
                name: 'cpss',
                inputValue: "productDown",
                listeners: {
                    change: function(el, checked) {
                        var CheckBoxList = me.CheckBoxList;
                        if (checked) {
                            CheckBoxList.push(el.inputValue);
                        } else {
                            var index = CheckBoxList.indexOf(el.inputValue);
                            if (index > -1) {
                                CheckBoxList.splice(index, 1);
                            }
                        }
                        me.CheckBoxList = CheckBoxList;
                    }
                }
            }]
        })

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
                    items: [me.ComboxDepartment]
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
                    items: [me.ComboxImportant]
                }, {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.Examiner]
                }, {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.Leader]
                }, {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [

                    ]
                }]
            }, {
                items: [{
                    flex: 4,
                    maxWidth: 600,
                    minWidth: 180,
                    items: [me.radioGroup]
                }]
            }, {
                items: [{
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.ComboxState]
                }, {
                    flex: 1,
                    maxWidth: 320,
                    minWidth: 180,
                    items: [me.edtKeyword]
                }, {
                    flex: 1,
                    layout: {
                        type: 'hbox'
                    },
                    items: [me.btnSearch, me.btnClear]
                }, {
                    flex: 1,
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
            st = me.ComboxstEdit.getValue(),
            ed = me.ComboxendEdit.getValue(),
            department = me.ComboxDepartment.getValue(),
            leader = me.Leader.getValue(),
            examiner = me.Examiner.getValue(),
            keyword = me.edtKeyword.getValue(),
            important = me.ComboxImportant.getValue(),
            state = me.ComboxState.getValue(),
            params = me.store.getProxy().getExtraParams(),
            order = me.CheckBoxList.join('#');

        if (department == '全部')
            department = '';
        if (important == '全部')
            important = '';
        if (state == '全部')
            state = '';

        console.log(order);
        console.log(me.CheckBoxList);
        Ext.apply(params, {
            SearchType: 'QuickSearch',
            SearchBy: 'Deadline',
            startTime: st,
            endTime: ed,
            department: department,
            leader: leader,
            examiner: examiner,
            Kword: keyword,
            important: important,
            state: state,
            order

        });
        store.loadPage(1);
    },

    onResetClick: function() {
        var me = this,
            store = me.store,
            params = me.store.getProxy().getExtraParams();

        me.ComboxendEdit.setValue('');
        me.ComboxstEdit.setValue('');
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