Ext.define('sjy.glsc.Panel.DesChangeNotice', {
	//继承的panel
	extend: 'Ext.panel.Panel',
	requires: [
	'YZSoft.BPM.src.model.Draft',
	'YZSoft.BPM.src.ux.Render',
	'YZSoft.BPM.src.ux.FormManager',
	'YZSoft.src.ux.RecordSecurityManager',
	'YZSoft.BPM.TaskOperation.Manager',
	'YZSoft.BPM.src.model.HistoryTask',
	'YZSoft.BPM.src.grid.HistoryTaskGrid',
	'Ext.data.JsonStore',
	'YZSoft.BPM.src.model.Worklist',
	'YZSoft.src.button.Button',
	'YZSoft.src.menu.Item',
	'YZSoft.BPM.src.form.field.ProcessNameComboBox',
	'YZSoft.BPM.src.panel.TaskSearchPanel',
	'Ext.button.Button',
	'Ext.grid.Panel',
	'Ext.toolbar.Paging',
	'YZSoft.src.sts',
	'YZSoft.src.button.PanelExpandButton',
	],
	dlgCfg: {
		dlgModel: 'Dialog', //Tab,Window,Dialog
		width: 700,
		height: 400
	},
	stepdefer: 2000,
	//具体处理
	constructor: function(config) {
		var me = this;
		var date = new Date;
		var year = date.getFullYear();
		var sortable = config.sortable !== false;
		//Store
		//
		//

		//主表Store
		me.templateStore = Ext.create('Ext.data.JsonStore', {
			remoteSort: true,
			model: 'YZSoft.BPM.src.model.Draft',
			// model: 'Ext.data.Model',
			sorters: {
				/*property: 'LaunchDate',
				direction: 'DESC'*/
			},
			proxy: {
				type: 'ajax',
				url: YZSoft.$url(me, '../StoreDataService/EventInfoData/DCN_EventInfoData.ashx'),
				extraParams: {
					method: 'GetHistoryTasks',
					HistoryTaskType: 'AllAccessable',
					SearchYear: year,
					Kword: '',
					SpecProcessName: '',
					byYear: '1',
					Year: year,
					SearchType: 'AdvancedSearch',
					ProcessName: '设计院-管理手册-设计变更通知单流程',
					PostUserAccount: '',
					PostDateType: 'period',
					TaskStatus: 'all',
					RecipientUserAccount: '',
					Keyword: '',
					TaskID: '',
					SerialNum: '',
				},
				reader: {
					rootProperty: 'children'
				}
			},
		});
		
		//主表布局
		me.temlateGrid = Ext.create("Ext.grid.Panel", {
			title: '设计变更通知单',
			region: 'center',
			store: me.templateStore,
			border: false,
			selModel: Ext.create(YZSoft.selection.rowSelectionXClass, {mode:'MULTI'}),
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
                    header: '编号',
                    dataIndex: 'DCN_No',
                    width: 150,
                    align: 'left'
                },{
                    header: '建设单位',
                    dataIndex: 'DCN_BuiltCompnay',
                    width: 150,
                    align: 'left'
                },{
                    header: '工程部位',
                    dataIndex: 'DCN_EngineeringSite',
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
				store: me.templateStore,
				displayInfo: true
			}),
			listeners: {
				scope: me,
				rowdblclick: function(grid, record, item, rowIndex, e, eOpts) {
					this.Zhuanf("设计变更通知单", grid);
				},
			},
			tools: [{
				type: 'refresh',
				handler: function(event, toolEl, panel) {
					me.templateStore.reload();
				}
			}]
		});

		//主表按钮
		//
		//
		//
        //导航栏"年份查找日历框"
		me.sttDate = Ext.create('YZSoft.src.form.field.DayField', {
			margin: '0 30 0 0',
			value: new Date(new Date() - (new Date().getDate() - 1) * 24 * 60 * 60 * 1000)
		});
		//开始时间
        me.ComboxstEdit = new Ext.form.ComboBox({
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
            value: ''
        });

        //结束时间
        me.ComboxendEdit = new Ext.form.ComboBox({
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
            value: ''
        });
        //状态
        me.ComboxState = new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                fields: ['key', 'value'],
                data: [
                    ["全部", " "],
                    ["流转中", "Running"],
                    ["已批准", "Approved"]
                ] //[['2012'], ['2011'], ['2010'], ['2009'], ['2008'], ['2007']]
            }),
            displayField: 'key',
            valueField: 'value',
            typeAhead: true,
            mode: 'local',
            forceSelection: false,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: true,
            lastQuery: '',
            value: '',
            emptyText: '请选择',
            blankText: '请选择'
        });
		//导航栏"搜索框"
		me.Search = Ext.create('YZSoft.src.form.field.Search', {
			store: me.templateStore,
			width: 160
		});
		//导航栏'搜索'按钮
		me.btnSearch3 = Ext.create('Ext.button.Button', {
			padding: '3 15 3 15',
			margin: 0,
			focusable: false,
			text: RS.$('All_Search'),
			handler: function() {
				me.onSearch3Click();
			}
		});
		 //导航栏'导出Excel'
        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.temlateGrid,
            // templateExcel: YZSoft.$url(me, '任务通知单模板.xls'), //导出模板，不设置则按缺省方式导出
            params: {},
            fileName: '设计变更通知单',
            allowExportAll: true, //可选项，缺省使用YZSoft.EnvSetting.Excel.AllowExportAll中的设置，默认值false
            //maxExportPages: 10, //可选项，缺省使用YZSoft.EnvSetting.Excel.MaxExportPages中的设置，默认值100
            listeners: {
                beforeload: function(params) {
                    params.ReportDate = new Date()
                }
            }
        });

        //项目负责人
        me.Leader = Ext.create('YZSoft.src.form.field.User', {
            
        });
		//头部按钮布局
		me.temlatePanel = Ext.create('Ext.panel.Panel', {
			border: false,
			layout: 'border',
			bodyCls: 'yz-docked-noborder-top',
			
			items: [me.temlateGrid]
		});
		//主表
		me.mainPanel = Ext.create('Ext.panel.Panel', {
			region: 'center',
			border: false,
			activeItem: 0,
			layout: 'card',
			items: [me.temlatePanel]
		});
		//项目设计大纲Panel
		me.OtherPanel = new Ext.TabPanel({
			region: 'south',
			height: 300,
			border: false,
			activeItem: 0,
			activeTab: 0,
			bodyCls: 'yz-docked-noborder-top',
			enableTabScroll: true,
			layout: 'border',
			split: {
				cls: 'yz-spliter',
				size: 5,
				collapseOnDblClick: false,
				collapsible: true
			},
			items: [me.XMSJDGGrid]
		});
		//导航栏布局
		var cfg = {
			title: '',
			layout: 'border',
			border: false,
			tbar: ["开始时间:", me.ComboxstEdit, "结束时间:", me.ComboxendEdit, "状态", me.ComboxState,"项目负责人:",me.Leader,'事件描述', me.Search, me.btnSearch3,me.btnExcelExport],
			items: [me.mainPanel],
		};
		Ext.apply(cfg, config);
		me.callParent([cfg]);

	},
	
	onActivate: function(times) {

		if (times == 0) {
			this.templateStore.load(YZSoft.EnvSetting.storeFirstLoadMask);
		} else {
			this.templateStore.reload({
				loadMask: false
			});
		}
	},
    onSearch3Click: function() {
		var me = this,
		store = me.templateStore,
		params = store.getProxy().getExtraParams(),
		st = me.ComboxstEdit.getValue(),
        ed = me.ComboxendEdit.getValue(),
		Keyword = me.Search.getValue(),
		leader=me.Leader.getValue(),
		State = me.ComboxState.getValue();
		Ext.apply(params, {
			SearchType: 'QuickSearch',
			SearchBy: 'Deadline',
			Keyword: '',
			beginYear: st,
            endYear: ed,
            leader,
			SearchWord: Keyword,
			state: State
		});
		me.templateStore.loadPage(1);
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
		/*alert(paramsStr);*/
		//var result = Ext.util.JSON.decode(obj.responseText);
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
	Zhuanf: function(title, grid) {
		var tid,
		me = this,
		recs = grid.getSelectionModel().getSelection(),
		ids = [];

		if (recs.length == 0)
			return;

		Ext.each(recs, function(rec) {
			ids.push(rec.get("TaskID"));
			tid = rec.get("TaskID");
		});
		YZSoft.BPM.src.ux.FormManager.openTaskForRead(tid, Ext.apply({}, {
			sender: this,
			title: title
		}));
		grid.getStore().reload();
	},
});
