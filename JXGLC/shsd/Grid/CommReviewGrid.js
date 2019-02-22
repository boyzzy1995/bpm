Ext.define('JXGLC.shsd.Grid.CommReviewGrid', {
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
            title: '开工审查意见书',
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
                        header: '项目名称',
                        dataIndex: 'Title',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '建设单位',
                        dataIndex: 'BuiltUnit',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '施工单位',
                        dataIndex: 'BuiltUnit',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '时间',
                        dataIndex: 'Time',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '经办人',
                        dataIndex: 'Quotation',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '经办人',
                        dataIndex: 'OperatorName',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '分管院长',
                        dataIndex: 'OperatorAccount',
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