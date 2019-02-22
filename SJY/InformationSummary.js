Ext.define('sjy.egineering.Panel.InformationSummary', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.BPM.src.model.Draft',
        'YZSoft.BPM.src.ux.Render',
        'YZSoft.BPM.src.ux.FormManager',
        'YZSoft.src.ux.RecordSecurityManager'
    ],
    dlgCfg: {
        dlgModel: 'Dialog', //Tab,Window,Dialog
        width: 700,
        height: 400
    },
    stepdefer: 2000,
    constructor: function(config) {
        var me = this;
        var date = new Date;
        var year = date.getFullYear();
        //调试时显示模块的权限
        me.templateStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.BPM.src.model.Draft',
            sorters: {},
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/ContractMessage.ashx'),
                extraParams: {
                    method: 'GetData',
                    year: year
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });
        //表格内容
        me.temlateGrid = Ext.create('Ext.grid.Panel', {
            title: '汇总信息',
            region: 'center',
            store: me.templateStore,
            border: false,
            selModel: Ext.create(YZSoft.selection.rowSelectionXClass, { mode: 'MULTI' }),
            columns: {
                defaults: {},
                items: [
                    { xtype: 'rownumberer' },
                    { header: '合计', dataIndex: 'main_count', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 'main_Quotation', width: 150, align: 'left' },
                    { header: '未完成', dataIndex: 's_no_count', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 's_no_Quotation', width: 150, align: 'left' },
                    { header: '已完成', dataIndex: 's_y_count', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 's_y_Quotation', width: 150, align: 'left' },
                    { header: '总计', dataIndex: 's_a_count', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 's_a_Quotation', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 'm_no_count', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 'm_no_Quotation', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 'm_y_count', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 'm_y_Quotation', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 'm_a_Quotation', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 'l_no_count', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 'l_no_Quotation', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 'l_y_count', width: 150, align: 'left' },
                    { header: '总金额', dataIndex: 'l_y_Quotation', width: 150, align: 'left' }
                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.templateStore,
                displayInfo: true
            }),
            listeners: {
                scope: me,
                rowdblclick: function(grid, record, tr, rowIndex, e, eOpts) {
                    this.Zhuanf(record);
                },
                itemclick: function(grid, record, item, rowIndex, e, eOpts) {

                },
            },
            tools: [{
                type: 'refresh',
                handler: function(event, toolEl, panel) {
                    me.templateStore.reload();
                }
            }]
        });
        //导航栏"年份查找日历框"
        me.sttDate = Ext.create('YZSoft.src.form.field.DayField', {
            margin: '0 30 0 0',
            value: new Date(new Date() - (new Date().getDate() - 1) * 24 * 60 * 60 * 1000)
        });

        //下拉列表框
        me.ComboxsjEdit = new Ext.form.ComboBox({
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
            value: new Date().getFullYear()
        });

        //导航栏'搜索'按钮
        me.btnSearch2 = Ext.create('Ext.button.Button', {
            padding: '3 15 3 15',
            margin: 0,
            focusable: false,
            text: '更新报表',
            handler: function() {
                me.onSearch2Click();
            }
        });

        //导航栏'导出Excel'
        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.temlateGrid,
            templateExcel: YZSoft.$url(me, '项目合同信息汇总.xls'), //导出模板，不设置则按缺省方式导出
            params: {},
            fileName: '项目合同信息汇总',
            allowExportAll: true,
            listeners: {
                beforeload: function(params) {
                    var record = me.templateStore.getAt(0);
                     params.ReportDate = record.get("year");
                }
            }
        });
        me.GridPanel= Ext.create('Ext.panel.Panel', {
            border: false,
            layout: 'border',
            bodyCls: 'yz-docked-noborder-top',
            items:[me.temlateGrid],
        });
        me.Panel = Ext.create('Ext.panel.Panel', {
            border: false,
            layout: 'border',
            bodyCls: 'yz-docked-noborder-top',
            id: "MainPanel",
            bodyStyle: 'background:#FFF;padding:20px;',
            html:   "<style>.mytable td{height:30px;border:1px solid #999999;}.mytable{border:1px solid #999999;}</style>"+
                    "<table class='mytable' cellpadding='0' cellspacing='0'>" +
                    "<thead><h1 style='color:#999'>年度 主合同</h1></thead>" +
                    "<tr>" +
                    "<td width=100 align=center><font>数量</font></td>" +
                    "<td width=200 align=center><font>总金额</font></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=200 align=center><font></font></td>" +
                    "</tr>" +
                    "</table>" +
                    "<table class='mytable' cellpadding='0' cellspacing='0'>" +
                    "<thead><h1 style='color:#999'>年度 外托合同</h1></thead>" +
                    "<tr>" +
                    "<td rowspan='2' width=200 align=center><font>类型</font></td>" +
                    "<td colspan='3' width=200 align=center><font>数量</font></td>" +
                    "<td colspan='3' width=200 align=center><font>金额(单位:元)</font></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td width=100 align=center><font>未完成</font></td>" +
                    "<td width=100 align=center><font>已完成</font></td>" +
                    "<td width=100 align=center><font>总计</font></td>" +
                    "<td width=100 align=center><font>未完成</font></td>" +
                    "<td width=100 align=center><font>已完成</font></td>" +
                    "<td width=100 align=center><font>总计</font></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td width=100 align=center><font>小专业合作</font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td width=100 align=center><font>大项目合作(大于100万)</font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td width=100 align=center><font>大项目合作(小于100万)</font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td width=100 align=center><font>总计</font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "<td width=100 align=center><font></font></td>" +
                    "</tr>" +
                    "</table>"
        });
        me.mainPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            border: false,
            activeItem: 0,
            layout: 'card',
            items:[me.GridPanel]
        });

        //导航栏布局
        var cfg = {
            title: '',
            layout: 'border',
            border: false,
            tbar: ["年份查找：", me.ComboxsjEdit, me.btnSearch2,me.btnExcelExport],
            items: [me.mainPanel,me.Panel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onSearch2Click: function() {
        var me = this,
            store = me.templateStore,
            params = store.getProxy().getExtraParams(),
            st = me.ComboxsjEdit.getValue();
        Ext.apply(params, {
            method: 'GetData',
            year:st
        });
        me.onActivate(1,st);
        store.loadPage(1);
    },
    onActivate: function(times,year) {
        let main_count,
            main_Quotation,
            me = this;
       
        if(year==null){
           var date = new Date;
           year = date.getFullYear();
        }
        YZSoft.Ajax.request({
            url: YZSoft.$url(me, '../StoreDataService/ContractMessage.ashx'),
            method: 'POST',
            params: {
                method: 'getMainContractMessage',
                year:year
            },
            dataType: "json",
            success: function(action) {
                var json = JSON.parse(action.responseText);
                main_count = json.main_count;
                main_Quotation = json.main_Quotation;
                me.getFull(main_count, main_Quotation,year);
            },
            failure: function(action) {
                var mbox = Ext.Msg.show({
                    title: '错误提示',
                    msg: YZSoft.HttpUtility.htmlEncode(action.result.errorMessage, true),
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        });
        me.templateStore.load({ loadMask: true });
        me.GridPanel.hide();
    },

    ///////////////////////同步加载//////////////////////////////////////

    ajaxSyncCall: function(urlStr, paramsStr) {
        var obj;
        var value;
        if (window.ActiveXObject) {
            obj = new ActiveXObject('Microsoft.XMLHTTP');
        } else if (window.XMLHttpRequest) {
            obj = new XMLHttpRequest();
        }
        obj.open('POST', urlStr, false);
        obj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        obj.send(paramsStr);
        return obj.responseText;
    },
    setYear: function() {
        //[['1', '第一季度'], ['2', '第二季度'], ['3', '第三季度'], ['4', '第四季度']]
        var sb = '[';

        var year = new Date().getFullYear();

        for (var i = 0; year - i > 2000; i++) {
            sb += '["' + (year - i) + '"],';
        }
        return eval('(' + sb.substr(0, sb.length - 1) + '])');
    },
    getFull: function(mainCount, manQuotation,year) {
        let me = this;
        YZSoft.Ajax.request({
            url: YZSoft.$url(me, '../StoreDataService/ContractMessage.ashx'),
            method: 'POST',
            params: {
                method: 'getWTContractMessage',
                year:year
            },
            dataType: "json",
            success: function(action) {
                var json = JSON.parse(action.responseText).wt;
                var l_wt = json.l_wt;
                var s_wt = json.s_wt;
                var m_wt = json.m_wt;
                var sum = json.sum;
                Ext.getCmp('MainPanel').body.update(
                    "<style>.mytable td{height:30px;border:1px solid #999999;}.mytable{border:1px solid #999999;}</style>"+
                    "<table class='mytable' cellpadding='0' cellspacing='0'>" +
                    "<thead><h1 style='color:#999'>"+year+"年度 主合同</h1></thead>" +
                    "<tr>" +
                    "<td width=100 align=center><font>数量</font></td>" +
                    "<td width=200 align=center><font>总金额</font></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td width=100 align=center><font>" + mainCount + "</font></td>" +
                    "<td width=200 align=center><font>" + manQuotation + "</font></td>" +
                    "</tr>" +
                    "</table>" +
                    "<table class='mytable' cellpadding='0' cellspacing='0'>" +
                    "<thead><h1 style='color:#999'>"+year+"年度 外托合同</h1></thead>" +
                    "<tr>" +
                    "<td rowspan='2' width=200 align=center><font>类型</font></td>" +
                    "<td colspan='3' width=200 align=center><font>数量</font></td>" +
                    "<td colspan='3' width=200 align=center><font>金额(单位:元)</font></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td width=100 align=center><font>未完成</font></td>" +
                    "<td width=100 align=center><font>已完成</font></td>" +
                    "<td width=100 align=center><font>总计</font></td>" +
                    "<td width=100 align=center><font>未完成</font></td>" +
                    "<td width=100 align=center><font>已完成</font></td>" +
                    "<td width=100 align=center><font>总计</font></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td width=100 align=center><font>小专业合作</font></td>" +
                    "<td width=100 align=center><font>" + s_wt.no_count + "</font></td>" +
                    "<td width=100 align=center><font>" + s_wt.y_count + "</font></td>" +
                    "<td width=100 align=center><font>" + s_wt.a_count + "</font></td>" +
                    "<td width=100 align=center><font>" + s_wt.no_Quotation + "</font></td>" +
                    "<td width=100 align=center><font>" + s_wt.y_Quotation + "</font></td>" +
                    "<td width=100 align=center><font>" + s_wt.a_Quotation + "</font></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td width=100 align=center><font>大项目合作(大于100万)</font></td>" +
                    "<td width=100 align=center><font>" + l_wt.no_count + "</font></td>" +
                    "<td width=100 align=center><font>" + l_wt.y_count + "</font></td>" +
                    "<td width=100 align=center><font>" + l_wt.a_count + "</font></td>" +
                    "<td width=100 align=center><font>" + l_wt.no_Quotation + "</font></td>" +
                    "<td width=100 align=center><font>" + l_wt.y_Quotation + "</font></td>" +
                    "<td width=100 align=center><font>" + l_wt.a_Quotation + "</font></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td width=100 align=center><font>大项目合作(小于100万)</font></td>" +
                    "<td width=100 align=center><font>" + m_wt.no_count + "</font></td>" +
                    "<td width=100 align=center><font>" + m_wt.y_count + "</font></td>" +
                    "<td width=100 align=center><font>" + m_wt.a_count + "</font></td>" +
                    "<td width=100 align=center><font>" + m_wt.no_Quotation + "</font></td>" +
                    "<td width=100 align=center><font>" + m_wt.y_Quotation + "</font></td>" +
                    "<td width=100 align=center><font>" + m_wt.a_Quotation + "</font></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td width=100 align=center><font>总计</font></td>" +
                    "<td width=100 align=center><font>" + sum.no_count + "</font></td>" +
                    "<td width=100 align=center><font>" + sum.y_count + "</font></td>" +
                    "<td width=100 align=center><font>" + sum.a_count + "</font></td>" +
                    "<td width=100 align=center><font>" + sum.no_Quotation  + "</font></td>" +
                    "<td width=100 align=center><font>" + sum.y_Quotation + "</font></td>" +
                    "<td width=100 align=center><font>" + sum.a_Quotation  + "</font></td>" +
                    "</tr>" +
                    "</table>"
                );
            },
            failure: function(action) {
                var mbox = Ext.Msg.show({
                    title: '错误提示',
                    msg: YZSoft.HttpUtility.htmlEncode(action.result.errorMessage, true),
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        });
    }
});