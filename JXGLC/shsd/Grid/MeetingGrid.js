Ext.define('JXGLC.shsd.Grid.MeetingGrid', {
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
            title: '会议情况记录表',
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
                        header: '编号',
                        dataIndex: 'Number',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '项目名称',
                        dataIndex: 'Title',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '许可文号',
                        dataIndex: 'License',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '检查发现问题',
                        dataIndex: 'CheckProblem',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '日期',
                        dataIndex: 'Time',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '流程发起时间',
                        dataIndex: 'CreateAt',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '流程状态',
                        text: 'State',
                        dataIndex: 'State',
                        width: 150,
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