Ext.define('sjy.glsc.Grid.LeaderReportGrid', {
    //继承的panel
    extend: 'Ext.grid.Panel',
    requires: [
    'YZSoft.BPM.src.model.Draft',
    'YZSoft.BPM.src.ux.Render',
    'YZSoft.BPM.src.ux.FormManager',
    'YZSoft.src.ux.RecordSecurityManager',
    ],
    //具体处理
    constructor: function(config){
        var me = this;
        var date = new Date;
        var year = date.getFullYear();
        var sortable = config.sortable !== false;
        //项目设计大纲Grid
        
        var cfg = {
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
                    header: '汇报时间',
                    dataIndex: 'ReportDate',
                    width: 80,
                    align: 'left'
                }, {
                    header: '汇报关键内容',
                    dataIndex: 'keyword',
                    width: 300,
                    align: 'left'
                }, {
                    header: '登记人',
                    dataIndex: 'Recorder',
                    width: 80,
                    align: 'left'
                }, {
                    header: '人员',
                    dataIndex: 'member',
                    width: 300,
                    align: 'left'
                }, {
                    header: '流程状态',
                    dataIndex: 'state',
                    width: 200,
                    align: 'left',
                    sortable: sortable,
                    renderer: YZSoft.BPM.src.ux.Render.renderTaskState,
                }]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.LeaderReportStore,
                displayInfo: true
            }),
        }
        Ext.apply(cfg, config);
        this.callParent([cfg]);
    },
    
});