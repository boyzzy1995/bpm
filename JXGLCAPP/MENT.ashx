<%@ WebHandler Language="C#" Class="BPMApp.MentModuleTree" %>

using System;
using System.Web;
using System.Text;

namespace BPMApp
{
    public class MentModuleTree : YZServiceHandler
    {
        public object GetModuleTree(HttpContext context)
        {
            object[] modules = new object[] {
                new {
                    text = Resources.YZStrings.Module_Cat_MentMonitor,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "MentLog",
                            text = Resources.YZStrings.Module_AppLog,
                            xclass = "YZSoft.BPM.AppLog.Panel"
                        },
                        new {
                            id = "MentSearch",
                            text = Resources.YZStrings.Module_MentSearch,
                            xclass = "YZSoft.BPM.HistoryTask.AllAccessablePanel"
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_OrgChange,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "TaskHandover",
                            text = Resources.YZStrings.Module_TaskHandover,
                            xclass = "YZSoft.BPM.Maintenance.TaskHandoverSummaryPanel"
                        },
                        new {
                            id = "OrgRelationshipHandover",
                            text = Resources.YZStrings.Module_OrgRelationshipHandover,
                            xclass = "YZSoft.BPM.Maintenance.OrgRelationshipHandoverSummaryPanel"
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_TaskAdmin,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "TaskAdmin",
                            text = Resources.YZStrings.Module_TaskAdmin,
                            xclass = "YZSoft.BPM.Maintenance.TaskAdminPanel"
                        }
                    }
                },
                new {
                    text = Resources.YZStrings.Module_Cat_TaskRepair,
                    expanded = true,
                    children = new object[]{
                        new {
                            id = "ArchiveReActive",
                            text = Resources.YZStrings.Module_ArchiveReActive,
                            xclass = "YZSoft.BPM.Maintenance.ArchiveReactivePanel"
                        },
                        new {
                            id = "RecycleBin",
                            text = Resources.YZStrings.Module_RecycleBin,
                            xclass = "YZSoft.BPM.Maintenance.RecycleBinPanel"
                        },
                        new {
                            id = "TaskRepair",
                            text = Resources.YZStrings.Module_TaskRepair,
                            xclass = "YZSoft.BPM.Maintenance.TaskRepairPanel"
                        }
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}
