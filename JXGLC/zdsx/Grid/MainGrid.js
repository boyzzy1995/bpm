Ext.define('JXGLC.zdsx.Grid.MainGrid', {
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
            title: '重大事项',
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
                    }, {
                        header: '项目名称',
                        dataIndex: 'Title',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '项目地点',
                        dataIndex: 'Place',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '项目概况',
                        dataIndex: 'Survey',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '联系人',
                        dataIndex: 'Contacts',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '电话',
                        dataIndex: 'Phone',
                        width: 150,
                        align: 'left'
                    }, {
                        header: '项目状态',
                        dataIndex: 'State',
                        width: 150,
                        align: 'left'
                    }

                ]
            },

        }
        Ext.apply(cfg, config);
        this.callParent([cfg]);
    },

});