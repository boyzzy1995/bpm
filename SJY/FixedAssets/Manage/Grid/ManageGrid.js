Ext.define('sjy.FixedAssets.Manage.Grid.ManageGrid', {
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
            title: '固定资产管理',
            border: false,
            region: 'center',
            selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SIMPLE' }),
            columns: {
                defaults: {},
                items: [
                 {
                    header: '资产编码',
                    dataIndex: 'AssetID',
                    width: 150,
                    align: 'left'
                }, {
                    header: '设备编号',
                    dataIndex: 'DeviceID',
                    width: 150,
                    align: 'left'
                }, {
                    header: '类别',
                    dataIndex: 'Type',
                    width: 150,
                    align: 'left'
                }, {
                    header: '部门名称',
                    dataIndex: 'Depart',
                    width: 150,
                    align: 'left'
                }, {
                    header: '设备名称',
                    dataIndex: 'DeviceName',
                    width: 150,
                    align: 'left'
                }, {
                    header: '型号规格',
                    dataIndex: 'Model',
                    width: 150,
                    align: 'left'
                }, {
                    header: '单位',
                    dataIndex: 'Unit',
                    width: 150,
                    align: 'left'
                }, {
                    header: '数量',
                    dataIndex: 'Unit',
                    width: 150,
                    align: 'Num'
                }, {
                    header: '单价',
                    dataIndex: 'UnitPrice',
                    width: 150,
                    align: 'Num'
                }, {
                    header: '金额',
                    dataIndex: 'Sum',
                    width: 150,
                    align: 'Num'
                }, {
                    header: '供货单位',
                    dataIndex: 'SupplyUnit',
                    width: 150,
                    align: 'Num'
                }, {
                    header: '购买日期',
                    dataIndex: 'BuyDate',
                    width: 150,
                    align: 'Num'
                }, {
                    header: '使用日期',
                    dataIndex: 'UseDate',
                    width: 150,
                    align: 'Num'
                }, {
                    header: '保管地点',
                    dataIndex: 'UsePlace',
                    width: 150,
                    align: 'Num'
                }, {
                    header: '保管人',
                    dataIndex: 'UserName',
                    width: 150,
                    align: 'Num'
                }, {
                    header: '备注',
                    dataIndex: 'Remark',
                    width: 150,
                    align: 'Num'
                }, {
                    header: '资产状况',
                    dataIndex: 'State',
                    width: 150,
                    align: 'Num'
                }, {
                    header: '保管人账号',
                    dataIndex: 'UseAccount',
                    width: 150,
                    hidden: true,
                    align: 'Num'
                }]
            },

        }
        Ext.apply(cfg, config);
        this.callParent([cfg]);
    },

});