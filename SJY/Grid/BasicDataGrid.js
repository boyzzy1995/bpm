Ext.define('sjy.glsc.Grid.BasicDataGrid', {
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
        //基础资料附件表Grid
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
                    header: '上传内容',
                    dataIndex: 'BDA_Content',
                    width: 450,
                    align: 'left'
                }, {
                    header: '上传人',
                    dataIndex: 'UploadMember',
                    width: 150,
                    align: 'left'
                },{
                    header: '上传时间',
                    dataIndex: 'UploadTime',
                    width: 150,
                    align: 'left'
                },{
                    header: '当前阶段任务发起时间',
                    dataIndex: 'CreateAt',
                    width: 150,
                    align: 'left'
                },{
                    header: '流程状态',
                    text: 'State',
                    dataIndex: 'State',
                    width: 150,
                    align: 'left',
                    sortable: sortable, 
                    renderer: YZSoft.BPM.src.ux.Render.renderTaskState,
                }]
            },

                bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.BasicDataStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("基础资料附件表流程", grid);
                },
                itemclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    
                }
            },
            tools: [{
                type: 'refresh',
                handler: function(event, toolEl, panel) {
                    me.BasicDataStore.reload();
                }
            }]
           
        }
        Ext.apply(cfg, config);
        this.callParent([cfg]);
    },
    
});