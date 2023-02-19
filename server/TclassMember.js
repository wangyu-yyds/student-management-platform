const Base = require('./Base')

//引入Tclass模块
const Tclass = require('./Tclass')
//创建Tclass对象
const ReqTclass = new Tclass.Tclass()

const classMemberDeleteSql =
    "delete from classStudent where cstu_claid=? and cstu_stuid=?;";//李帅---老师班级成员管理（删除）
const classMemberAbsenceDeleteSql =
    "delete from studentAbsence where sabs_stuid=? and sabs_claid=?;";//李帅---删除学生在班级中的缺勤事件
const ClassMemberBonusDeleteSql =
    "delete from studentBonus where sbon_stuid=? and sbon_claid=?;";//李帅---删除学生在班级中的加分事件
const classMemberMessageSql =
    "SELECT * FROM classStudent WHERE cstu_claid=? and cstu_stuid=?;";//李帅---查成员在学生班级关系表中的数据
const classMemberMoveSql =
    "UPDATE classStudent SET cstu_claid=? WHERE cstu_claid=? and cstu_stuid=?;";//李帅---查成员在学生班级关系表中的数据
const classStuTaskQuantitySql =
    "SELECT COUNT(*)as StuClassTasks FROM taskStudent WHERE tstu_stuid=? and tstu_condition !=-1 and tstu_tasid in (\
        SELECT ctas_claid FROM classTask WHERE ctas_claid=?);";//李帅---查班级中学生完成的作业数
const classStuMeansQuantitySql =
    "SELECT COUNT(*)as StuClassMeanss FROM meansStudent WHERE mstu_stuid=? and mstu_meaid in (\
        SELECT cmea_meaid FROM classMeans WHERE cmea_claid=?);";//李帅---查班级中学生观看的资料数
const classStuTaskGradeSql =
    "select tas_name,tstu_condition,tstu_time from task left join  taskStudent  \
    on task.tas_id = taskStudent.tstu_tasid WHERE tstu_stuid=? and task.tas_id in(\
    SELECT ctas_tasid FROM classTask WHERE ctas_claid=?);";//李帅---查班级某学生作业成绩
const classStuTaskGradeReviseSql =
    "UPDATE taskStudent SET tstu_condition = ? WHERE tstu_tasid=? and tstu_stuid=?;";//李帅---查班级某学生作业成绩
const classStuMeansReadSql =
    "select mea_name,mstu_condition \
    from means left join  meansStudent on  means.mea_id = meansStudent.mstu_meaid \
    WHERE mstu_stuid=? and means.mea_id \
    in(SELECT cmea_meaid FROM classMeans WHERE cmea_claid=?);";//李帅---查班级某学生作业成绩
const classStuMeansReadReviseSql =
    "UPDATE meansStudent SET mstu_condition = ? WHERE mstu_meaid=? and mstu_stuid=?;";//李帅---修改班级某学生资料阅读次数
const classMemberPerformanceOneSql =
    "select stu_name,stu_no,cstu_absence,cstu_bonus \
    from student inner join classStudent on student.stu_id =classStudent.cstu_stuid and classStudent.cstu_stuid=? and classStudent.cstu_claid=?;";//李帅---查班级成员缺勤，加分情况
const classMissionGradeOneSql =
    "select a.stu_name,a.stu_no,a.taskGrade,b.meansGrade\
    FROM (select stu_name,stu_no,TRUNCATE(SUM(tstu_condition)/?, 1)as taskGrade\
    from student left join taskStudent\
    on student.stu_id =taskStudent.tstu_stuid and taskStudent.tstu_condition !=-1 and  taskStudent.tstu_tasid in(select ctas_tasid from classTask WHERE ctas_claid=?)\
    GROUP BY stu_id,stu_name,stu_no HAVING stu_id = ?)as a,\
    (select stu_name ,stu_no,(TRUNCATE(COUNT(mstu_condition>0)/?, 1))*100 as meansGrade \
    from student left join meansStudent  \
    on student.stu_id =meansStudent.mstu_stuid and meansStudent.mstu_meaid in(select ctas_tasid from classTask WHERE ctas_claid=?)\
    GROUP BY stu_id,stu_name,stu_no HAVING stu_id = ?)as b \
    WHERE a.stu_no=b.stu_no;";//李帅---查班级成员作业平均分、资料阅读平均分
const classCheckMemberAbsenceSql =
    "select sabs_time,sabs_remarks from studentAbsence WHERE sabs_claid=? and sabs_stuid=?;";//李帅---查班级某成员缺勤事件
const classCheckMemberBonusSql =
    "select sbon_time,sbon_remarks from studentBonus WHERE sbon_claid=? and sbon_stuid=?;";//李帅---查班级某成员加分事件
const classCheckMemberAbsenceQuantitySql =
    "select count(*) as absenceQuantity from studentAbsence WHERE sabs_claid=? and sabs_stuid=?;";//李帅---查班某级成员缺勤事件个数
const classCheckMemberBonusQuantitySql =
    "select count(*) as bonusQuantity from studentBonus WHERE sbon_claid=? and sbon_stuid=?;";//李帅---查班某级成员加分事件个数
const classReviseMemberAbsenceQuantitySql =
    "UPDATE classStudent SET cstu_absence = ? WHERE cstu_claid=? and cstu_stuid=?;";//李帅---修改某级成员缺勤事件个数（学生班级关系表）
const classReviseMemberBonusQuantitySql =
    "UPDATE classStudent SET cstu_bonus = ? WHERE cstu_claid=? and cstu_stuid=?;";//李帅---修改班某级成员加分事件个数（学生班级关系表）
const classDeleteMemberAbsenceSql =
    "delete from studentAbsence where sabs_claid=? and sabs_stuid=? and sabs_time=?;";//李帅---删除班级成员缺勤事件
const classDeleteMemberBonusSql =
    "delete from studentBonus where sbon_claid=? and sbon_stuid=? and sbon_time=?;";//李帅---删除班级成员加分事件
const classCreateMemberBonusSql =
    "INSERT INTO studentBonus(sbon_claid,sbon_stuid,sbon_time,sbon_remarks) VALUES(?,?,?,?);";//李帅---添加班级成员加分事件
const classCreateMemberAbsenceSql =
    "INSERT INTO studentAbsence(sabs_claid,sabs_stuid,sabs_time,sabs_remarks) VALUES(?,?,?,?);";//李帅---添加班级成员缺勤事件
const achievementCheckDuplicateSql =
    "select * from achievement WHERE ach_claid=? and ach_stuid=?;";//李帅---学生综合成绩表查重
const saveStuResultsISql =
    "INSERT INTO achievement(ach_claid,ach_stuid,ach_achievement) VALUES(?,?,?);";//李帅---保存学生综合成绩(插入)
const saveStuResultsUSql =
    "UPDATE achievement SET ach_achievement = ? WHERE ach_claid=? and ach_stuid=?;";//李帅---保存学生综合成绩(更新)
const checkStuAchievementSql =
    "select stu_name,stu_no,ach_achievement from student left join achievement  \
    on student.stu_id =achievement.ach_stuid  WHERE student.stu_id in(\
    select cstu_stuid from classstudent WHERE cstu_claid=?);";//李帅---查综合成绩
const classMemberQuantitySql =
    "select count(*) from classStudent WHERE cstu_claid=?;";//李帅---查班级人数


class TclassMember extends Base.Base {
    constructor() {
        super()
    }
    //函数
    
    ClassMemberDelete(message, callback) {//李帅--老师班级成员管理（删除）
        console.log('老师班级成员管理（删除）');
        this.QueryMysql(classMemberDeleteSql, [parseInt(message.classId),parseInt(message.studentId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassMemberAbsenceDelete(message, callback) {//李帅--删除学生在班级中的缺勤事件
        console.log('删除学生在班级中的缺勤事件');
        this.QueryMysql(classMemberAbsenceDeleteSql, [parseInt(message.classId),parseInt(message.studentId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassMemberBonusDelete(message, callback) {//李帅--删除学生在班级中的加分事件
        console.log('删除学生在班级中的加分事件');
        this.QueryMysql(ClassMemberBonusDeleteSql, [parseInt(message.classId),parseInt(message.studentId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    // ClassMemberMessage(message, callback) {//李帅--查成员在学生班级关系表中的数据
    //     console.log('查成员在学生班级关系表中的数据');
    //     this.QueryMysql(classMemberMessageSql, [parseInt(message.classId),parseInt(message.studentId)],(results,fields)=>{
    //         console.log(results);
    //         callback(results);
    //     })
    // }


    ClassMemberMove(message, callback) {//李帅--修改学生所属班级
        console.log('修改学生所属班级');
        this.QueryMysql(classMemberMoveSql, [parseInt(message.targetClassId),parseInt(message.classId),parseInt(message.studentId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassStuTaskQuantity(classId,studentId, callback) {//李帅--查班级中学生完成的作业数
        console.log('查班级中学生完成的作业数');
        this.QueryMysql(classStuTaskQuantitySql, [classId,studentId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassStuMeansQuantity(classId,studentId, callback) {//李帅--查班级中学生观看的资料数
        console.log('查班级中学生观看的资料数');
        this.QueryMysql(classStuMeansQuantitySql, [classId,studentId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassStuTaskGrade(message, callback) {//李帅--查班级某学生作业成绩
        console.log('查班级某学生作业成绩');
        this.QueryMysql(classStuTaskGradeSql, [parseInt(message.studentId),parseInt(message.classId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassStuTaskGradeRevise(message, callback) {//李帅--修改班级某学生作业成绩
        console.log('修改班级某学生作业成绩');
        this.QueryMysql(classStuTaskGradeReviseSql, [parseInt(message.grade),parseInt(message.taskId),parseInt(message.studentId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassStuMeansRead(message, callback) {//李帅--查班级某学生资料阅读次数
        console.log('查班级某学生资料阅读次数');
        this.QueryMysql(classStuMeansReadSql, [parseInt(message.studentId),parseInt(message.classId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassStuMeansReadRevise(message, callback) {//李帅--修改班级某学生资料阅读次数
        console.log('修改班级某学生资料阅读次数');
        this.QueryMysql(classStuMeansReadReviseSql, [parseInt(message.Read),parseInt(message.meansId),parseInt(message.studentId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassMemberPerformanceOne(studentId,classId, callback) {//李帅--查班级某位成员缺勤，加分情况
        console.log('查班级某位成员缺勤，加分情况');
        this.QueryMysql(classMemberPerformanceOneSql, [parseInt(studentId),parseInt(classId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassMissionGradeOne(message1,message2,classId,studentId, callback) {//李帅--查班级某成员作业平均分、资料阅读平均分
        console.log('查班级某成员作业平均分、资料阅读平均分');
        this.QueryMysql(classMissionGradeOneSql, [message1[0].classTasks,classId,studentId,message2[0].classMeanss,classId,studentId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassCheckMemberAbsence(message, callback) {//李帅--查班级成员缺勤事件
        console.log('查班级成员缺勤事件');
        this.QueryMysql(classCheckMemberAbsenceSql, [parseInt(message.classId),parseInt(message.studentId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassCheckMemberBonus(message, callback) {//李帅--查班级成员加分事件
        console.log('查班级成员加分事件');
        this.QueryMysql(classCheckMemberBonusSql, [parseInt(message.classId),parseInt(message.studentId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassDeleteMemberAbsence(message, callback) {//李帅--删除班级成员缺勤事件
        console.log('删除班级成员缺勤事件');
        this.QueryMysql(classDeleteMemberAbsenceSql, [parseInt(message.classId),parseInt(message.studentId),message.time],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassDeleteMemberBonus(message, callback) {//李帅--删除班级成员加分事件
        console.log('删除班级成员加分事件');
        this.QueryMysql(classDeleteMemberBonusSql, [parseInt(message.classId),parseInt(message.studentId),message.time],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassCreateMemberBonus(message, callback) {//李帅--添加班级成员加分事件
        console.log('添加班级成员加分事件');
        this.QueryMysql(classCreateMemberBonusSql, [parseInt(message.classId),parseInt(message.studentId),message.time,message.remarks],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassCreateMemberAbsence(message, callback) {//李帅--添加班级成员缺勤事件
        console.log('添加班级成员缺勤事件');
        this.QueryMysql(classCreateMemberAbsenceSql, [parseInt(message.classId),parseInt(message.studentId),message.time,message.remarks],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassCheckMemberAbsenceQuantity(message, callback) {//李帅--查班某级成员缺勤事件个数
        console.log('查班某级成员缺勤事件个数');
        this.QueryMysql(classCheckMemberAbsenceQuantitySql, [parseInt(message.classId),parseInt(message.studentId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassCheckMemberBonusQuantity(message, callback) {//李帅--查班某级成员加分事件个数
        console.log('查班某级成员加分事件个数');
        this.QueryMysql(classCheckMemberBonusQuantitySql, [parseInt(message.classId),parseInt(message.studentId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassReviseMemberAbsenceQuantitySql(absenceQuantity,message, callback) {//李帅--修改某级成员缺勤事件个数（学生班级关系表）
        console.log('修改某级成员缺勤事件个数（学生班级关系表）');
        this.QueryMysql(classReviseMemberAbsenceQuantitySql, [absenceQuantity,parseInt(message.classId),parseInt(message.studentId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassReviseMemberBonusQuantitySql(BonusQuantity,message, callback) {//李帅--修改班某级成员加分事件个数（学生班级关系表）
        console.log('修改班某级成员加分事件个数（学生班级关系表）');
        this.QueryMysql(classReviseMemberBonusQuantitySql, [BonusQuantity,parseInt(message.classId),parseInt(message.studentId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    StuStudyAchievement(classId,studentId,callback) {//李帅--学生综合成绩计算
        console.log('学生综合成绩计算');
        var promise1 = new Promise((resolve, reject) =>{//查作业，阅读成绩
            ReqTclass.ClassTaskQuantity(parseInt(classId), result => {//查班级作业总数
                let result1 = result;
                ReqTclass.ClassMeansQuantity(parseInt(classId), result => {//查班级资料总数
                    let result2 = result;
                    this.ClassMissionGradeOne(result1, result2, parseInt(classId), parseInt(studentId), result => {//查班级某成员作业平均分、资料阅读平均分
                        if (result == -1 || result.length == 0)
                             callback(-1)
                         else if (result.length != 0) {
                             if(result1[0].classTasks==0 && result2[0].classMeanss==0){
                                 result[0].taskGrade=0
                                 result[0].meansGrade=0
                             }
                             else if(result1[0].classTasks==0 && result2[0].classMeanss!=0){
                                 result[0].taskGrade=0
                             }
                             else if(result1[0].classTasks!=0 && result2[0].classMeanss==0){
                                 result[0].meansGrade=0
                             }
                            //  else if(result[0].taskGrade==null){
                            //     result[0].taskGrade=0
                            //     if(result2[0].classMeanss==0){
                            //         result[0].meansGrade=100
                            //     }
                            //  }
                             console.log('查成绩异步1完成');
                             resolve(result);
                         }
                     })
                    
                })
            })
        });
        var promise2 = new Promise((resolve, reject) =>{//查比例及分数计算规则
            ReqTclass.ClassScoringRules(parseInt(classId), result => {//查班级成员综合成绩评分规则
                if (result == -1 || result.length == 0)
                    callback(-1)
                else if (result.length != 0) {
                    resolve(result);
                    console.log('异步2完成');
                }
            })
        });
        var promise3 = new Promise((resolve, reject) =>{//查加分，扣分情况
            this.ClassMemberPerformanceOne(studentId,classId, result => {//查班级某位成员缺勤，加分情况
                if (result == -1 || result.length == 0)
                    callback(-1)
                else if (result.length != 0) {
                    resolve(result);
                    console.log('异步3完成');
                }
            })
        });
        Promise
        .all([promise1, promise2, promise3])
        .then((results) =>{
            console.log(results);
            //计算（作业成绩*比例+阅读成绩*比例-+成员缺勤、加分成绩(次数*分数)）
            let proportion =  results[1][0].cla_proportion.split(',')
            let taskproportion = parseInt(proportion[0])
            let meansproportion = parseInt(proportion[1])
            let achievement = (results[0][0].taskGrade*taskproportion)/100 + (results[0][0].meansGrade*meansproportion)/100
            - parseInt(results[2][0].cstu_absence)*parseInt(results[1][0].cla_absence) 
            + parseInt(results[2][0].cstu_bonus)*parseInt(results[1][0].cla_bonus)
            if(achievement>100){
                achievement=100
            }
            if(achievement<0){
                achievement=0
            }
            //存成绩
            this.SaveStuResults(classId,studentId,achievement, result => {
                if (result == 1) {//存储成功
                    callback(1)
                }
                else{
                    callback(-1)
                }
            })
        });
    }
    AchievementCheckDuplicate(classId,studentId,callback){
        console.log('学生综合成绩表查重');
        this.QueryMysql(achievementCheckDuplicateSql, [classId,studentId],(results,fields)=>{
            console.log(results);
            callback(results);//空为ok，
        })
    }
    SaveStuResults(classId,studentId,achievement,callback){
        console.log('保存学生综合成绩');
        this.AchievementCheckDuplicate(classId,studentId, result => {
            if (result != -1 && result.length == 0) {//未存，插入
                console.log('插入');
                this.QueryMysql(saveStuResultsISql, [classId,studentId,achievement],(results,fields)=>{
                    callback(results);
                }) 
            }
            else if (result != -1 && result.length != 0){//表中已存，更新
                console.log('更新');
                this.QueryMysql(saveStuResultsUSql, [achievement,classId,studentId],(results,fields)=>{
                    callback(results);
                }) 
            }
            else{
                callback(-1);
            }
        })
    
    }
    CheckStuAchievement(classId,callback){
        console.log('查班级所有学生综合成绩');
        var promise1 = new Promise((resolve, reject) =>{//查作业，阅读成绩
            ReqTclass.ClassTaskQuantity(parseInt(classId), result => {//查班级作业总数
                let result1 = result;
                ReqTclass.ClassMeansQuantity(parseInt(classId), result => {//查班级资料总数
                    let result2 = result;
                    ReqTclass.ClassMissionGrade(result1[0].classTasks, result2[0].classMeanss, parseInt(classId), result => {//查班级成员作业平均分、资料阅读平均分
                        if (result == -1 )
                            res.send({ code: -1 });
                        else if (result.length != 0) {
                            if(result1[0].classTasks==0){
                                result.forEach((currentValue, index, arr) => {
                                    result[index].taskGrade=100
                                })
                            }
                            if(result1[0].classMeanss==0){
                                result.forEach((currentValue, index, arr) => {
                                    result[index].meansGrade=100
                                })
                            }
                            result.forEach((currentValue, index, arr) => {
                                if(result[index].taskGrade==null){
                                    result[index].taskGrade=0
                                }
                            })
                            console.log('查成绩异步1完成');
                             resolve(result);
                        }
                    })
                })
            })
        });
        var promise2 = new Promise((resolve, reject) =>{//查综合成绩
            this.QueryMysql(checkStuAchievementSql, [classId],(result,fields)=>{
                console.log(result);
                resolve(result);//
            })
        })
        Promise
        .all([promise1, promise2])
        .then((results) =>{
            let all =new Array();
            let Value1=0;//results[0]的值
            results[0].forEach((currentValue, index, arr0) => {
                Value1=currentValue
                results[1].forEach((currentValue, index, arr0) => {
                    if(Value1.stu_no==currentValue.stu_no){
                        let a={}//定义一个对象存单个学生情况
                        a.name=Value1.stu_name
                        a.no=Value1.stu_no
                        a.taskGrade=Value1.taskGrade
                        a.meansGrade=Value1.meansGrade
                        a.achievement=currentValue.ach_achievement
                        all.push(a)
                    }
                }) 
            }) 
            callback(all);
        })
    }
    StuStudyInformation(classId,studentId,callback) {//李帅--学生个人所有情况
        console.log('学生个人所有情况');
        var promise1 = new Promise((resolve, reject) =>{
            this.QueryMysql(checkStuAchievementSql, [classId],(result,fields)=>{
                console.log(result);
                resolve(result);//
            })
        });
        var promise2 = new Promise((resolve, reject) =>{
            let a =new Array();//存储所有信息
            let TaskQuantity = -1;//班级作业总数
            let MeansQuantity = -1;//班级资料总数
            let StuTaskQuantity = -1;//班级中学生完成的作业数
            let StuMeansQuantity = -1;//班级中学生观看的资料数
            ReqTclass.ClassTaskQuantity(parseInt(classId), result => {//查班级作业总数
                TaskQuantity = result[0].classTasks;
                a.push(result[0])
                ReqTclass.ClassMeansQuantity(parseInt(classId), result => {//查班级资料总数
                    MeansQuantity = result[0].classMeanss;
                    a.push(result[0])
                    this.ClassStuTaskQuantity(parseInt(classId), parseInt(studentId), result => {//查班级中学生完成的作业数
                        StuTaskQuantity = result[0].StuClassTasks;
                        a.push(result[0])
                        this.ClassStuMeansQuantity(parseInt(classId), parseInt(studentId), result => {//查班级中学生观看的资料数
                            StuMeansQuantity = result[0].StuClassMeanss;
                            a.push(result[0])
                            if (TaskQuantity != -1 && MeansQuantity != -1 && StuTaskQuantity != -1 && StuMeansQuantity != -1) {
                                resolve(a);
                                console.log('异步2完成');
                            }
                            else {
                                callback(-1);//出错
                            }
                        })
                    })
                })
            })
        });
        var promise3 = new Promise((resolve, reject) =>{
            ReqTclass.ClassTaskQuantity(parseInt(classId), result => {//查班级作业总数
                let result1 = result;
                ReqTclass.ClassMeansQuantity(parseInt(classId), result => {//查班级资料总数
                    let result2 = result;
                    this.ClassMissionGradeOne(result1, result2, parseInt(classId), parseInt(studentId), result => {//查班级某成员作业平均分、资料阅读平均分
                        if (result == -1)
                             callback(-1)
                         else if (result.length != 0) {
                             if(result1[0].classTasks==0 && result2[0].classMeanss==0){
                                 result[0].taskGrade=0
                                 result[0].meansGrade=0
                             }
                             else if(result1[0].classTasks==0 && result2[0].classMeanss!=0){
                                 result[0].taskGrade=0
                             }
                             else if(result1[0].classTasks!=0 && result2[0].classMeanss==0){
                                 result[0].meansGrade=0
                             }
                            //  else if(result[0].taskGrade==null){
                            //     result[0].taskGrade=0
                            //     if(result2[0].classMeanss==0){
                            //         result[0].meansGrade=100
                            //     }
                            // }
                             console.log('异步3完成');
                             resolve(result);
                         }
                     })
                    
                })
            })
        });
        var promise4 = new Promise((resolve, reject) =>{//查加分，扣分情况
            this.ClassMemberPerformanceOne(studentId,classId, result => {//查班级某位成员缺勤，加分情况
                if (result == -1)
                    callback(-1)
                else if (result.length != 0) {
                    resolve(result);
                    console.log('异步4完成');
                }
            })
        });

        Promise
        .all([promise1, promise2, promise3,promise4])
        .then((results) =>{
            console.log(results);
            callback(results)
        });
    }
    CheckStuAchievementOne(classId,callback){
        console.log('查班级所有学生综合成绩');
        this.QueryMysql(checkStuAchievementSql, [classId],(result,fields)=>{
            console.log(result);
            callback(result)
        })
    }
   


}


module.exports = { TclassMember }