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
                    text = "会议管理",
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "Meeting",
                            text = "外部会议",
                            modulePerm = new YZModulePermision("63d8728b-5665-49e4-bbba-79347062aa38", YZModuleDeniedBehavior.Hide),
                            xclass = "JXGLC.Meeting.Panel.Meeting"
                        },     
                    }
                }, 
                 new {
                    text = "项目管理",
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "Start",
                            text = "涉河涉堤",
                            modulePerm = new YZModulePermision("63d8728b-5665-49e4-bbba-79347062aa38", YZModuleDeniedBehavior.Hide),
                            xclass = "JXGLC.shsd.Panel.CommReview"
                        },
                       new {
                            id = "Second",
                            text = "重大事项",
                            modulePerm = new YZModulePermision("63d8728b-5665-49e4-bbba-79347062aa38", YZModuleDeniedBehavior.Hide),
                            xclass = "JXGLC.zdsx.Panel.MajorMatters"
                        },
                    }
                },    
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}
