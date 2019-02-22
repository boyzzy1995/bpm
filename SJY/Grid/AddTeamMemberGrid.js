Ext.define('sjy.glsc.Grid.AddTeamMemberGrid', {
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
        //增加项目组成员Grid
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
                    header: '项目名称',
                    dataIndex: 'Pro_Title',
                    width: 450,
                    align: 'left'
                }, {
                    header: '项目编号',
                    dataIndex: 'Pro_No',
                    width: 150,
                    align: 'left'
                },{
                    header: '新增设计人',
                    dataIndex: 'DesignName',
                    width: 150,
                    align: 'left'
                },{
                    header: '新增校核人',
                    dataIndex: 'CheckerName',
                    width: 150,
                    align: 'left'
                },{
                    header: '流程发起时间',
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
                store: me.AddTeamMemberStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    me.Zhuanf("增加项目组成员", grid);
                },
                itemclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    
                }
            },
            tools: [{
                type: 'refresh',
                handler: function(event, toolEl, panel) {
                    me.AddTeamMemberStore.reload();
                }
            }]
           
        }
        Ext.apply(cfg, config);
        this.callParent([cfg]);
    },
    
});