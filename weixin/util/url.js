 const RootUrl = "https://api.pangmayi.cn",GATHER = {}
//const RootUrl = "http://localhost:8999",
	

const APILIST = {
	getopenid: '/getopenid',						//openid
	landing: '/landing',							//登录接口
	binding: '/binding',							//绑定接口
	unBinding: '/unBinding',						//解绑接口
	cancellation: '/cancellation',					//注销接口
	updateAvatar: './updateAvatar',					//更新头像接口
	getAvatar: './getAvatar',						//获取头像接口
	getcourselist: '/getcourselist',				//获取学生课程列表
	stuaddclass: '/stuaddclass',               		//学生添加班级接口
	getinformationlist: '/getinformationlist',		//获取通知列表
	getinformation: '/getinformation',         		//获取通知接口
	stuDeleteInform: '/stuDeleteInform',			//学生删除通知
	readInform: '/readInform',                  	//学生查看通知情况提交接口
	getmeanslist: '/getmeanslist',					//获取资料列表
	getmeansurl: '/getmeansurl',               		//获取资料接口
	recodeMeans: '/recodeMeans',               		//学生阅读资料情况提交接口
	gettasklist: '/gettasklist',					//获取测试列表
	gettask: '/gettask',                       		//获取试题接口
	submittest: '/submittest',                 		//提交试卷接口 
	gettaskdetails: '/gettaskdetails',				//获取错题详情接口
	getAllcourse:'/allCourse',						//获取老师课程
	createCourse:'/createCourse',					//老师创建课程
	getAllClass:'/allClass',						//老师获取课程下的所有班级
	createClass:'/createClass',						//老师创建班级
	classMember:'/classMember',						//老师获取班级成员
	checkTeacherCreateTask:'/checkTeacherCreateTask',//老师查创建了的作业
	classTask:'/classTask',							//获取某班级的作业
	classTaskCondition:'/classTaskCondition',		//获取作业完成详情
	classMeans:'/classMeans',						//获取班级的资料
	classMeansCondition:'/classMeansCondition',		//获取资料阅读详情
	checkTeacherCreateMeans:'/checkTeacherCreateMeans',	//老师查创建了的资料
	classInform:'/classInform',						//获取班级的通知
	checkTeacherCreateInform:'/checkTeacherCreateInform',//老师查创建了的通知
	teacherCreateInform:'/teacherCreateInform',		//老师创建通知
	classInformCondition:'/classInformCondition',	//获取班级通知详情
	classMissionGrade:'/classMissionGrade',			//老师查班级成员作业平均分、资料阅读平均分
	classScoringRules:'/classScoringRules',			//老师查班级成员综合成绩评分比例
	reviseClassMessage:'/reviseClassMessage',		//老师修改班级成员综合成绩评分比例
	classMemberPerformance:'/classMemberPerformance',//老师查班级成员缺勤，加分情况
	deletePublishTask:'/deletePublishTask',			//老师删除已发布的班级作业
	deletePublishMeans:'/deletePublishMeans',		//老师删除已发布的班级资料
	deletePublishInform:'/deletePublishInform',		//老师删除已发布的班级通知
	teacherCreateTask:'/teacherCreateTask',			//老师创建具体作业
	teacherPublishTask:'/teacherPublishTask',		//老师发布作业到班级
	deleteTask:'/deleteTask',						//老师删除已创建的作业
	teacherCheckTaskContent:'/teacherCheckTaskContent',//老师查具体作业内容
	deleteInform:'/deleteInform',					//老师删除已创建的通知
	CheckTeacherCreateclass:'/CheckTeacherCreateclass',//老师查找所有可以发布的班级
	deleteCourse:'/deleteCourse',					//老师删除已有课程
	deleteClass:'/deleteClass',						//老师删除班级
	classStuTaskGrade:'/classStuTaskGrade',			//老师查某学生作业成绩
	teacherPublishInform:'/teacherPublishInform'    ,//老师发布通知
	classMemberDelete:'/classMemberDelete',			//老师删除班级成员
	classCheckMemberBonus:'/classCheckMemberBonus', //老师查班级成员加分事件
	classCheckMemberAbsence:'/classCheckMemberAbsence',//老师查班级成员缺勤事件
	classDeleteMemberAbsence:'/classDeleteMemberAbsence',//老师删除班级成员缺勤事件
	classDeleteMemberBonus:'/classDeleteMemberBonus',	//老师删除班级成员加分事件
	classCreateMemberBonus:'/classCreateMemberBonus',//老师添加班级成员加分事件
	classCreateMemberAbsence:'/classCreateMemberAbsence',//老师添加班级成员缺勤事件
	classStuMeansRead:'/classStuMeansRead',			//老师查班级成员资料阅读情况
	stuStudyInformation:'/stuStudyInformation',		//老师查学生个人所有情况
	checkStuAchievementSql:'/checkStuAchievementSql',//老师查所有学生综合成绩（只查综合成绩）
	checkStuAchievement:'/checkStuAchievement',		//老师查所有学生综合成绩
	checkStuAchievementOne:'/checkStuAchievementOne',//老师查班级成员综合成绩 
	classMemberMove:'/classMemberMove',				//老师移动班级成员至另一个班级
	CheckCorrectRate:'/CheckCorrectRate',			//老师查找作业错误率
	reviseCourse:'/reviseCourse',					//老师修改课程信息
	specificCourse:'/specificCourse',				//老师获取某一个课程信息
}


const URL = function() {
	let api = {};
	for (let k in APILIST) {
		api[k] = RootUrl + APILIST[k];
	}
	return api;
}



module.exports = {
	GATHER: URL()
}
