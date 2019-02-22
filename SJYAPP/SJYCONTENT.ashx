<%@ WebHandler Language="C#" Class="BPMApp.SJYCONTENTModuleTree" %>

using System;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;
using BPM.Client;
using System.Data;
namespace BPMApp
{
    public class SJYCONTENTModuleTree: YZServiceHandler
    {
        public object GetModuleTree(HttpContext context)
        {

            object[] modules = new object[] {
              new {
                    text = Resources.YZStrings.Module_Cat_Post,
                    expanded = true,
                    children = new object[]{
                        
                        new {
                            id = "Drafts",
                            text = Resources.YZStrings.Module_Drafts,
                            xclass = "YZSoft.BPM.Drafts.Panel"
                        },
                        new {
                            id = "FormTemplates",
                            text = Resources.YZStrings.Module_FormTemplates,
                            xclass = "YZSoft.BPM.FormTemplates.Panel"
                        }
                    }
                },
  		new {
                    text = Resources.YZStrings.Module_Cat_MyTasks,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "Worklist",
                            text = Resources.YZStrings.Module_Worklist,
                            xclass = "YZSoft.BPM.Worklist.Panel"
                        },
                        new {
                            id = "ShareTask",
                            text = Resources.YZStrings.All_ShareTask,
                            xclass = "YZSoft.BPM.ShareTask.Panel"
                        }
                    }
                },
		 new {
                    text = Resources.YZStrings.Module_Cat_HistoryTasks,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "MyRequests",
                            text = Resources.YZStrings.Module_MyRequests,
                            xclass = "YZSoft.BPM.HistoryTask.MyRequestsPanel"
                        },
                        new {
                            id = "DelegationRequests",
                            text = Resources.YZStrings.Module_DelegationRequests,
                            xclass = "YZSoft.BPM.HistoryTask.DelegationRequestPanel"
                        },
                        new {
                            id = "MyProcessed",
                            text = Resources.YZStrings.Module_MyProcessed,
                            xclass = "YZSoft.BPM.HistoryTask.MyProcessedPanel"
                        },
			new {
                            id = "AllAccessable",
                            text = Resources.YZStrings.Module_AllAccessable,
                            xclass = "YZSoft.BPM.HistoryTask.AllAccessablePanel"
                        },
                    }
                },
                  new {
                    text = "合同管理",
                    expanded = true,
                    children = new object[]{                   
                        new {
                            text="项目合同(包含外托合同)",
                            tabs=new object[]{
                              new{
                                id = "MainContract",
                               text = "项目合同(包含外托合同)",
                               modulePerm = new YZModulePermision("e1092c73-a67f-4a5a-a9c2-0005f5392399", YZModuleDeniedBehavior.Hide),
                               xclass = "sjy.egineering.Panel.MainContract"
                              },
                              new {
                              id = "WTContract11",
                              text = "外托合同小专业合作",
                              modulePerm = new YZModulePermision("e1092c73-a67f-4a5a-a9c2-0005f5392399", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.egineering.Panel.WTContractSToMainContract"
                              }
                            }   
                        },
                        new {
                            id = "OtherContract",
                            text = "其他经济合同",
                            modulePerm = new YZModulePermision("e1092c73-a67f-4a5a-a9c2-0005f5392399", YZModuleDeniedBehavior.Hide),
                            xclass = "sjy.economic.Panel.OtherContract"
                        },
   	       new {
                            text = "外托合同(岩土所)",
                            tabs=new object[]{
                              new{
                               id = "WTContract1",
                               text="外托合同小专业合作",
                               modulePerm = new YZModulePermision("e1092c73-a67f-4a5a-a9c2-0005f5392399", YZModuleDeniedBehavior.Hide),
                               xclass = "sjy.egineering.Panel.WTContractS"
                              },
                              new {
                              id = "WTContract2",
                              text = "外托合同大于100万",
                              modulePerm = new YZModulePermision("e1092c73-a67f-4a5a-a9c2-0005f5392399", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.egineering.Panel.WTContractLD"
                              },
                              new {
                              id = "WTContract3",
                              text = "外托合同小于100万",
                              modulePerm = new YZModulePermision("e1092c73-a67f-4a5a-a9c2-0005f5392399", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.egineering.Panel.WTContractLX"
                              }
                            }   
                        },  
 	       new {
                            text = "项目管理手册",
                            tabs=new object[]{
                              new{
                               id="glsc",
                               text="管理手册",
                               modulePerm = new YZModulePermision("e1092c73-a67f-4a5a-a9c2-0005f5392399", YZModuleDeniedBehavior.Hide),
                               xclass = "sjy.glsc.Panel.ManagementManual"
                              },
                              new {
                              id = "jsjlyb",
                              text = "设计文件校审记录表(快速流程)",
                              modulePerm = new YZModulePermision("e1092c73-a67f-4a5a-a9c2-0005f5392399", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.glsc.Panel.ModifyNormalSchedule"
                              },
                              new {
                              id = "jsjl",
                              text = "设计文件校审记录表",
                              modulePerm = new YZModulePermision("e1092c73-a67f-4a5a-a9c2-0005f5392399", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.glsc.Panel.ModifySchedule"
                              },
                              new {
                              id = "sjbg",
                              text = "设计变更通知单",
                              modulePerm = new YZModulePermision("e1092c73-a67f-4a5a-a9c2-0005f5392399", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.glsc.Panel.DesChangeNotice"
                              },
                              new {
                              id = "grsjhz",
                              text = "个人汇总",
                              modulePerm = new YZModulePermision("e1092c73-a67f-4a5a-a9c2-0005f5392399", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.glsc.Panel.PersonalSummary"
                              },
                              new {
                              id = "sjhz",
                              text = "汇总",
                              modulePerm = new YZModulePermision("fa0e2d24-54e3-48c3-9b0e-4cf72c06467e", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.glsc.Panel.Summary"
                              },
                              new {
                              id = "grcpdj",
                              text = "个人成品登记表",
                              modulePerm = new YZModulePermision("e1092c73-a67f-4a5a-a9c2-0005f5392399", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.glsc.Panel.ProductRegistrationPersonal"
                              },
                              new {
                              id = "cpdjhz",
                              text = "成品登记表汇总",
                              modulePerm = new YZModulePermision("fa0e2d24-54e3-48c3-9b0e-4cf72c06467e", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.glsc.Panel.ProductRegistrationSummary"
                              },
                             new {
                              id = "cyk",
                              text = "成员库",
                              modulePerm = new YZModulePermision("fa0e2d24-54e3-48c3-9b0e-4cf72c06467e", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.glsc.Panel.MemberLibrary"
                              },
                            } 
                        },                
                        
                    }
                },
               
                    new { 
                    text = "公文流转",
                    expanded = true,
                    children= new object[]{    
                        new {
                            id = "receive",
                            text = "收文",
                            modulePerm = new YZModulePermision("c3c5374c-3b24-4e3e-b78b-cf8bf880f6ff", YZModuleDeniedBehavior.Hide),
                            xclass = "sjy.archives.Panel.getXZDocument"
                        },
                        new {
                            id = "send",
                            text = "发文",
                            modulePerm = new YZModulePermision("c3c5374c-3b24-4e3e-b78b-cf8bf880f6ff", YZModuleDeniedBehavior.Hide),
                            xclass = "sjy.archives.Panel.sendXZDocument"
                        }
                    }
                },
                new { 
                    text = "日常办公",
                    expanded = true,
                    children= new object[]{    
                        new {
                            text = "固定资产",
                            tabs=new object[]{
                              new {
                              id = "keep",
                              text = "固定资产保管",
                              modulePerm = new YZModulePermision("cd63c1c9-dd7b-4766-9a03-3c75596c24e1", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.FixedAssets.Keeping.Panel.Keeping"
                              },
                              new{
                               id="manage",
                               text="固定资产管理",
                               modulePerm = new YZModulePermision("281da586-a032-49ae-b822-4cf2d8979dcf", YZModuleDeniedBehavior.Hide),
                               xclass = "sjy.FixedAssets.Manage.Panel.Manage"
                              },
                              new {
                              id = "apply",
                              text = "固定资产采购申请",
                              modulePerm = new YZModulePermision("cd63c1c9-dd7b-4766-9a03-3c75596c24e1", YZModuleDeniedBehavior.Hide),
                              xclass = "sjy.FixedAssets.PurchaseApply.Panel.PurchaseApply"
                              }
                            } 
                        },
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}
