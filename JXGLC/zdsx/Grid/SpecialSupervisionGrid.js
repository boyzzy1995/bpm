Ext.define('JXGLC.zdsx.Grid.SpecialSupervisionGrid', {
    //继承的panel
    extend: 'Ext.grid.Panel',
    requires: [
        'YZSoft.BPM.src.model.Draft',
        'YZSoft.BPM.src.ux.Render',
        'YZSoft.BPM.src.ux.FormManager',
        'YZSoft.src.ux.RecordSecurityManager',
    ],
    //具体处理
    constructor: function(config) {
        var me = this;
        var date = new Date;
        var year = date.getFullYear();
        var sortable = config.sortable !== false;
        //项目设计大纲Grid

        var cfg = {
            title: '专项监管',
            border: false,
            region: 'center',
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, {
                mode: 'MULTI'
            }),
            columns: {
                defaults: {},
                items: [{
                        xtype: 'rownumberer'
                    }, {
                        header: '项目编号',
                        dataIndex: 'No',
                        width: 150,
                        align: 'left'
                    },{
                        header: '检查时间',
                        dataIndex: 'Time',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '项目类型',
                        dataIndex: 'ProjectType',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '监管小组负责人',
                        dataIndex: 'CheckLeaderN',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '检查发现问题',
                        dataIndex: 'Problem',
                        width: 200,
                        align: 'left'
                    }, {
                        header: '流程状态',
                        text: 'State',
                        dataIndex: 'State',
                        width: 200,
                        align: 'left',
                        sortable: sortable,
                        renderer: YZSoft.BPM.src.ux.Render.renderTaskState,
                    }

                ]
            },

        }
        Ext.apply(cfg, config);
        this.callParent([cfg]);
    },

});