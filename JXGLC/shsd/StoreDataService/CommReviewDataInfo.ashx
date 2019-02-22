<%@ WebHandler Language="C#" Class="CommReviewDataList" %>

using System;
using System.Web;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using BPM;
using BPM.Client;
using YZSoft.Web.DAL;
using Newtonsoft.Json.Linq;
//类名改掉，第一行也是，YZServiceHandler不动
public class CommReviewDataList : YZServiceHandler
{
    //数据库连接
    public string Conn = "Data Source=10.33.13.153;Initial Catalog=jxglc;Persist Security Info=True;User ID=sa;Password=xxzx101";
    public string Conn198 ="Data Source=10.33.13.198;Initial Catalog=bpmdb;Persist Security Info=True;User ID=sa;Password=xxzx101@qgj.cn";


    //获取数据列表(附带搜索)
    public JObject GetHistoryTasks(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        SqlServerProvider queryProvider = new SqlServerProvider();

        GridPageInfo gridPageInfo = new GridPageInfo(context);
        HistoryTaskType taskType = request.GetEnum<HistoryTaskType>("HistoryTaskType", HistoryTaskType.AllAccessable);
        string strTaskType = request.GetString("HistoryTaskType");

        //前台传过来的参数
        int year = request.GetString("byYear","1") == "0" ? -1 : request.GetInt32("Year");
        string searchYear = request.GetString("SearchYear", null);
        string keyword = request.GetString("Kword", null);

        //获得查询条件
        string filter = " 1=1  ";

        //年份过滤，时间字段 Time
        if (!string.IsNullOrEmpty(searchYear))
        {
            filter += " and YEAR(Time) = '" + searchYear.Substring(0,4) + "'";
        }
        //关键字过滤，项目名称字段 Pro_Title 
        if (!string.IsNullOrEmpty(keyword))
        {
            filter += " and [Title] LIKE N'%" + queryProvider.EncodeText(keyword) + "%' ";
        }
       

        //获得数据
        JObject rv = new JObject();

        string taskTableFilter;
        string stepTableFilter;
        using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
        {
            taskTableFilter = this.GetFilterStringHistoryTaskTaskTable(request, provider);
            stepTableFilter = this.GetFilterStringHistoryTaskStep(request, provider);
        }

        using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();

            int rowcount;
            BPMTaskCollection tasks = cn.GetHistoryTasks(year, taskType, taskTableFilter, stepTableFilter, request.GetSortString("TaskID DESC", null, "TaskID DESC"), gridPageInfo.Start, gridPageInfo.Limit, out rowcount);

            rv[YZJsonProperty.total] = rowcount;
            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;   
 
            foreach (BPMTask task in tasks)
            {
                JObject stateItem = new JObject();   
                //获取状态的方法较为特殊
                stateItem["State"] = YZJsonHelper.GetTaskStateJObject(cn, task.TaskState, task.TaskID);

                // 只需要 合同状态为“处理中”和“已批准”的合同
                if(Convert.ToString(stateItem["State"]["State"])=="approved" || Convert.ToString(stateItem["State"]["State"])=="running"){ 
                    //stepid
		    string stepid="";
		    using(SqlConnection stepConn = new SqlConnection())
		    {
			stepConn.ConnectionString = Conn198;
			stepConn.Open();
			string _sql = "select top 1 stepid from BPMInstProcSteps where taskid="+task.TaskID;
			 SqlCommand _cmd = new SqlCommand();
                         _cmd.Connection = stepConn;
                         _cmd.CommandType = CommandType.Text;
                         _cmd.CommandText = _sql;
			 YZReader  reader = new YZReader(_cmd.ExecuteReader());
                        if(reader.Read())
			{
			   stepid=reader.ReadInt32("stepid").ToString();
			}
		    }
                    
                    //根据每一条taskid查找对应的记录
                     using(SqlConnection sqlConn = new SqlConnection())
                     {
                         sqlConn.ConnectionString = Conn;
                         sqlConn.Open();
                         string _sql = "select * from OA_SHSD_ComRevOpetionBook where [TaskID] = '" + task.TaskID + "' and";
                         if(!string.IsNullOrEmpty(filter))
                           _sql+=filter;
                         SqlCommand _cmd = new SqlCommand();
                         _cmd.Connection = sqlConn;
                         _cmd.CommandType = CommandType.Text;
                         _cmd.CommandText = _sql;
                         YZReader  reader = new YZReader(_cmd.ExecuteReader());
                         if(reader.Read())
                         {
                            JObject item = new JObject();
                            children.Add(item); 
                            item["stepid"] = stepid;
                            item["TaskID"] = reader.ReadInt32("TaskID");
                            item["Title"] = reader.ReadString("Title");//项目名称
                            item["BuiltUnit"] = reader.ReadString("BuiltUnit");//建设单位
                            item["ConstUnit"] = reader.ReadString("ConstUnit");//施工单位
                            item["Time"] = reader.ReadDateTime("Time");//时间
                            item["OperatorName"] = reader.ReadString("OperatorName");//经办人
                            item["LeaderName"] = reader.ReadString("LeaderName");//分管院长
                            item["State"] = stateItem["State"];
                            item["CreateAt"] = task.CreateAt;
                         }
                     }
                }
            }
        }
        return rv;
    }

    //获取一条任务通知单数据，传入TaskId
    public JObject GetData(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        SqlServerProvider queryProvider = new SqlServerProvider();


        //前台传过来的参数
        string taskId = request.GetString("TaskId", null);

        //获得查询条件
        string filter = " (TN_Statue='已批准' or TN_Statue='流转中')  ";

        //taskId过滤， 字段 TaskID 
        if (!string.IsNullOrEmpty(taskId))
        {
            filter += " and [TaskID] = '" + queryProvider.EncodeText(taskId) + "' ";
        }
       
        if (!String.IsNullOrEmpty(filter))
            filter = " WHERE " + filter;

        //获得排序子句，按哪个字段排序
        string order = " TN_Date desc ";

        //获得Query，表名[BPM_TaskNotice]
        string query = @"
            WITH X AS(
                SELECT ROW_NUMBER() OVER(ORDER BY {0}) AS RowNum,* FROM BPM_TaskNotice {1}
            ),
            Y AS(
                SELECT count(*) AS TotalRows FROM X
            ),
            Z AS(
                SELECT Y.TotalRows,X.* FROM Y,X
            )
            SELECT * FROM Z WHERE RowNum BETWEEN {2} AND {3}
        ";

        query = String.Format(query, order, filter, request.RowNumStart, request.RowNumEnd);

        //执行查询
        JObject rv = new JObject();
        using (SqlConnection cn = new SqlConnection())
        {
            cn.ConnectionString = this.Conn;
            cn.Open();

            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn;
                cmd.CommandText = query;

                using (YZReader reader = new YZReader(cmd.ExecuteReader()))
                {
                    //将数据转化为Json集合
                    JArray children = new JArray();
                    rv["children"] = children;
                    int totalRows = 0;

                    while (reader.Read())
                    {
                        JObject item = new JObject();
                        children.Add(item);

                        if (totalRows == 0)
                            totalRows = reader.ReadInt32("TotalRows");

                        item["TaskID"] = reader.ReadInt32("TaskID");
                        item["Pro_Title"] = reader.ReadString("Pro_Title");
                        item["Pro_NO"] = reader.ReadString("Pro_NO");
                        item["Pro_LeaderA"] = reader.ReadString("Pro_LeaderA");
                        item["Pro_LeaderN"] = reader.ReadString("Pro_LeaderN");
                        item["Pro_Type"] = reader.ReadString("Pro_Type");
                        item["TN_Conector"] = reader.ReadString("TN_Conector");
                        item["TN_Phone"] = reader.ReadString("TN_Phone");
                        item["TN_CustRequire"] = reader.ReadString("TN_CustRequire");
                        item["TN_CheckerN"] = reader.ReadString("TN_CheckerN");
                        item["TN_CheckerA"] = reader.ReadString("TN_CheckerA");
                        item["TN_ExaminerN"] = reader.ReadString("TN_ExaminerN");
                        item["TN_ExaminerA"] = reader.ReadString("TN_ExaminerA");
                        item["TN_AuditedPeN"] = reader.ReadString("TN_AuditedPeN");
                        item["TN_AuditedPeA"] = reader.ReadString("TN_AuditedPeA");
                        item["MDepartName"] = reader.ReadString("MDepartName");
                        item["MDepartAccount"] = reader.ReadString("MDepartAccount");
                        item["XDepartName"] = reader.ReadString("XDepartName");
                        item["XDepartAccount"] = reader.ReadString("XDepartAccount");
                        item["TN_DGTime"] = reader.ReadDateTime("TN_DGTime");
                        item["TN_ZJCGTime"] = reader.ReadDateTime("TN_ZJCGTime");
                        item["TN_CHPTime"] = reader.ReadDateTime("TN_CHPTime");
                        item["TN_Remark"] = reader.ReadString("TN_Remark");
                        item["TN_Statue"] = reader.ReadString("TN_Statue");
                        item["Pro_Statue"] = reader.ReadString("Pro_Statue");
                        item["TN_AttachPath"] = reader.ReadString("TN_AttachPath");
                        item["TN_Date"] = reader.ReadDateTime("TN_Date");

                        //item["copyNum"] = reader.ReadInt32("copyNum");
                        //item["LaunchDate"] = reader.ReadDateTime("LaunchDate");
                        //item["Quotation"] = reader.ReadString("Quotation");
                    }

                    rv[YZJsonProperty.total] = totalRows;
                }
            }
        }


        return rv;
    }








        protected virtual string GetFilterStringHistoryTaskTaskTable(YZRequest request, IYZDbProvider provider)
        {
            string filter = null;

            string searchType = request.GetString("SearchType", null);
            string keyword = request.GetString("Keyword", null);

            string serialNumLike = null;
            string processNameLike = null;
            string ownerAccountLike = null;
            string agentAccountLike = null;
            string descriptionLike = null;
            string taskidEqu = null;
            if (!String.IsNullOrEmpty(keyword))
            {
                serialNumLike = String.Format("SerialNum LIKE(N'%{0}%')", provider.EncodeText(keyword));
                processNameLike = String.Format("ProcessName LIKE(N'%{0}%')", provider.EncodeText(keyword));
                ownerAccountLike = String.Format("OwnerAccount LIKE(N'%{0}%')", provider.EncodeText(keyword));
                agentAccountLike = String.Format("AgentAccount LIKE(N'%{0}%')", provider.EncodeText(keyword));
                descriptionLike = String.Format("Description LIKE(N'%{0}%')", provider.EncodeText(keyword));
                if (YZStringHelper.IsNumber(keyword))
                    taskidEqu = String.Format("TaskID={0}", keyword);
            }

            string statusFilter = request.GetString("StatusFilter", null);
            if (!String.IsNullOrEmpty(statusFilter))
            {
                if (statusFilter == "RecycleBin")
                    filter = provider.CombinCond(filter, "State='Deleted' OR State='Aborted'");
                else if (statusFilter == "Archived")
                    filter = provider.CombinCond(filter, "State='Approved' OR State='Rejected'");
                else if (statusFilter == "Running")
                    filter = provider.CombinCond(filter, "State='Running'");
            }

            string specProcessName = request.GetString("SpecProcessName", null);
            if (!String.IsNullOrEmpty(specProcessName))
            {
                string[] processNames = specProcessName.Split(',');
                string processNameFilter = null;
                foreach (string processName in processNames)
                {
                    if (String.IsNullOrEmpty(processName))
                        continue;

                    processNameFilter = provider.CombinCondOR(processNameFilter, String.Format("ProcessName=N'{0}'", provider.EncodeText(processName)));
                }

                filter = provider.CombinCond(filter, processNameFilter);
            }

            if (YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
                string processName = request.GetString("ProcessName", null);
                string postUserAccount = request.GetString("PostUserAccount", null);
                string periodType = request.GetString("PostDateType", "").ToLower();
                string taskStatus = request.GetString("TaskStatus",null);
                string taskId = request.GetString("TaskID",null);
                string serialNum = request.GetString("SerialNum",null);

                string keywordFilter = null;

                if (String.IsNullOrEmpty(specProcessName))
                {
                    if (!String.IsNullOrEmpty(processName))
                        filter = provider.CombinCond(filter, String.Format("ProcessName=N'{0}'", provider.EncodeText(processName)));
                    else
                        keywordFilter = provider.CombinCondOR(keywordFilter, processNameLike);
                }

                if (!String.IsNullOrEmpty(postUserAccount))
                {
                    filter = provider.CombinCond(filter, String.Format("OwnerAccount=N'{0}' OR AgentAccount=N'{0}'", provider.EncodeText(postUserAccount)));
                }
                else
                {
                    keywordFilter = provider.CombinCondOR(keywordFilter, ownerAccountLike);
                    keywordFilter = provider.CombinCondOR(keywordFilter, agentAccountLike);
                }

                DateTime date1 = DateTime.MinValue;
                DateTime date2 = DateTime.MaxValue;
                if (periodType != "all")
                {
                    date1 = request.GetDateTime("PostDate1", DateTime.MinValue);
                    date2 = request.GetDateTime("PostDate2", DateTime.MaxValue);
                }

                if (date1 != DateTime.MinValue)
                    filter = provider.CombinCond(filter, provider.GenPeriodCond("CreateAt", date1, date2));

                if (!String.IsNullOrEmpty(taskStatus) && !YZStringHelper.EquName(taskStatus, "all"))
                    filter = provider.CombinCond(filter, String.Format("State=N'{0}'", taskStatus));

                if (!String.IsNullOrEmpty(taskId) && YZStringHelper.IsNumber(taskId))
                    filter = provider.CombinCond(filter, String.Format("TaskID={0}", taskId));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, taskidEqu);

                if (!String.IsNullOrEmpty(serialNum))
                    filter = provider.CombinCond(filter, String.Format("SerialNum LIKE(N'{0}%')", provider.EncodeText(serialNum)));
                else
                    keywordFilter = provider.CombinCondOR(keywordFilter, serialNumLike);

                keywordFilter = provider.CombinCondOR(keywordFilter, descriptionLike);

                filter = provider.CombinCond(filter, keywordFilter);
            }

            if (YZStringHelper.EquName(searchType, "QuickSearch"))
            {
                string processName = request.GetString("ProcessName", null);
                string keywordFilter = null;

                if (String.IsNullOrEmpty(specProcessName))
                {
                    if (!String.IsNullOrEmpty(processName))
                        filter = provider.CombinCond(filter, String.Format("ProcessName=N'{0}'", provider.EncodeText(processName)));
                    else
                        keywordFilter = provider.CombinCondOR(keywordFilter, processNameLike);
                }

                keywordFilter = provider.CombinCondOR(keywordFilter, taskidEqu);
                keywordFilter = provider.CombinCondOR(keywordFilter, serialNumLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, ownerAccountLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, agentAccountLike);
                keywordFilter = provider.CombinCondOR(keywordFilter, descriptionLike);
                filter = provider.CombinCond(filter, keywordFilter);
            }

            return filter;
        }

        protected virtual string GetFilterStringHistoryTaskStep(YZRequest request, IYZDbProvider provider)
        {
            string filter = null;
            string searchType = request.GetString("SearchType", null);

            if (YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
                string taskStatus = request.GetString("TaskStatus", null);

                if (YZStringHelper.EquName(taskStatus, TaskState.Running.ToString()))
                {
                    string recipientUserAccount = request.GetString("RecipientUserAccount", null);
                    if (!String.IsNullOrEmpty(recipientUserAccount))
                        filter = provider.CombinCond(filter, String.Format("(FinishAt IS NULL AND (OwnerAccount=N'{0}' OR AgentAccount=N'{0}'))", provider.EncodeText(recipientUserAccount)));
                }
            }

            return filter;
        }
}