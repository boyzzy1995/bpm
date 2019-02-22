Ext.define('sjy.glsc.Grid.CheckDetailGrid', {
    //继承的panel
    extend: 'Ext.grid.Panel',
    requires: [
        'YZSoft.BPM.src.model.Draft',
        'YZSoft.BPM.src.ux.Render',
        'YZSoft.BPM.src.ux.FormManager',
        'YZSoft.src.ux.RecordSecurityManager',
    ],
    //
    constructor: function(config) {
        var me = this;
        var date = new Date;
        var year = date.getFullYear();
        var sortable = config.sortable !== false;
        //查看修改进度Grid
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
                },{
                    header: '阶段',
                    dataIndex: 'PR_Stage',
                    width: 150,
                    align: 'left'
                }, {
                    header: '大纲最后一次讨论时间',
                    dataIndex: 'PR_DGTime',
                    width: 150,
                    align: 'left'
                },  {
                    header: '中间成果汇报评审时间',
                    dataIndex: 'PR_ZJCGTime',
                    width: 150,
                    align: 'left'
                }, {
                    header: '成品送审时间',
                    dataIndex: 'PR_CHPTime',
                    width: 150,
                    align: 'left'
                }, {
                    header: '现场勘探业主沟通时间-分院',
                    dataIndex: 'PR_SceneTime',
                    width: 190,
                    align: 'left'
                }, {
                    header: '现场勘探业主沟通时间-院总工',
                    dataIndex: 'PR_SceneTimeS',
                    width: 190,
                    align: 'left'
                }, {
                    header: '审查会或技术交底时间-分院',
                    dataIndex: 'PR_CheckMeetingTime',
                    width: 190,
                    align: 'left'
                },{
                    header: '审查会或技术交底时间-院总工',
                    dataIndex: 'PR_CheckMeetingTimeS',
                    width: 190,
                    align: 'left'
                },{
                    header: '申请人',
                    dataIndex: 'PR_ApplyName',
                    width: 150,
                    align: 'left'
                },{
                    header: '申请时间',
                    dataIndex: 'PR_Time',
                    width: 150,
                    align: 'left'
                },{
                    header: '发起时间',
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
                }]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.CheckDeatilStore,
                displayInfo: true
            }),
            tools: [{
                type: 'refresh',
                handler: function(event, toolEl, panel) {
                    me.CahierStore.reload();
                }
            }]

        }
        Ext.apply(cfg, config);
        this.callParent([cfg]);
    },

});