<%@ WebHandler Language="C#" Class="BPMApp.MainModuleTree" %>

using System;
using System.Web;
using System.Text;

namespace BPMApp
{
    public class MainModuleTree : YZServiceHandler
    {       
        public object GetModuleTree(HttpContext context)
        {           
            object[] modules = new object[]{
              
                 new {
                    id = "JXGLC",
                    title = "嘉兴管理处管理",
                    modulePerm = new YZModulePermision("63d8728b-5665-49e4-bbba-79347062aa38", YZModuleDeniedBehavior.Hide),
                    dataURL = this.ResolveUrl(context,"JXGLC.ashx"),
                    activeNode = "Worklist"
                },
                new {
                    id = "MENT",
                    title = Resources.YZStrings.Module_Ment,
                    modulePerm = new YZModulePermision("d2c8e9fc-0697-4345-86a4-160007fd7ec3", YZModuleDeniedBehavior.Hide),
                    dataURL = this.ResolveUrl(context,"MENT.ashx"),
                    activeNode = "TaskHandover"
                },
                
 
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}