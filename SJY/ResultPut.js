Ext.define('sjy.egineering.Panel.ResultPut', {
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
		var sortable = config.sortable !== false;
		var taskid = config.taskid;

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
				url: YZSoft.$url(me, '../StoreDataService/EventInfoData/ProductSureList.ashx'),
				extraParams: {
					method: 'GetData',
					taskid
				},
				reader: {
					rootProperty: 'children'
				}
			},
		});
		
		//主表布局
		me.temlateGrid = Ext.create("Ext.grid.Panel", {
			title: '成果提交单',
			region: 'center',
			store: me.templateStore,
			border: false,
			selModel: Ext.create(YZSoft.selection.rowSelectionXClass, {mode:'MULTI'}),
			columns: {
				defaults: {},
				items: [{
					xtype: 'rownumberer'
				}, {
                    header: '外托合同编号',
                    dataIndex: 'WTContractID',
                    width: 150,
                    align: 'left'
                }, {
                    header: '成果提交时间',
                    dataIndex: 'subDate',
                    width: 150,
                    align: 'left'
                },{
                    header: '支付金额',
                    dataIndex: 'Quotation',
                    width: 150,
                    align: 'left'
                }]
			},
			bbar: Ext.create('Ext.toolbar.Paging', {
				store: me.templateStore,
				displayInfo: true
			}),
			listeners: {
				scope: me,
				rowdblclick: function(grid, record, item, rowIndex, e, eOpts) {
					this.Zhuanf("成果提价单", grid);
				},
			},
			tools: [{
				type: 'refresh',
				handler: function(event, toolEl, panel) {
					me.templateStore.reload();
				}
			}]
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
