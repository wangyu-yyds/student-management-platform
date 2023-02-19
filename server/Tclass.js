const Base = require('./Base')
//引入TclassMember模块


const checkClassSql =
    "SELECT * FROM class WHERE cla_couid=?;";//李帅---通过课程编号查班级表
const checkClassSignSql =
    "SELECT * FROM class WHERE cla_sign=?;";//李帅---班级码查重
const createClassSql =
    "INSERT INTO class(cla_name,cla_sign,cla_couid) VALUES(?,?,?);";//李帅---创建班级
const deletClassSql =
    "delete from class where cla_id=?;";//李帅---删除班级
const reviseClassNameSql =
    "UPDATE class SET cla_name=? WHERE cla_id=?;";//李帅---修改班级名
const reviseClassMessageSql =
    "UPDATE class SET cla_proportion=?,cla_absence=?,cla_bonus=? WHERE cla_id=?;";//李帅---修改班级名
const classMemberSql =
    "SELECT * FROM student WHERE stu_id in (SELECT cstu_stuid FROM classStudent WHERE cstu_claid=?);";//李帅---查班级所有成员
const classTaskSql =
    "SELECT * FROM task WHERE tas_id in (SELECT ctas_tasid FROM classTask WHERE ctas_claid=?);";//李帅---查班级所有作业
const classMeansSql =
    "SELECT * FROM means WHERE mea_id in (SELECT cmea_meaid FROM classMeans WHERE cmea_claid=?);";//李帅---查班级所有资料
const classInformSql =
    "SELECT * FROM inform WHERE inf_id in (SELECT cinf_infid FROM classInform WHERE cinf_claid=?);";//李帅---查班级所有通知
const classTaskConditionSql =//李帅---查班级具体作业完成情况
    "select stu_name,stu_no,tstu_condition \
    from student left join  taskStudent  \
    on  student.stu_id =taskStudent.tstu_stuid and tstu_tasid=? \
    WHERE student.stu_id in(select cstu_stuid from classStudent WHERE cstu_claid=?);";
const classMeansConditionSql =//李帅---查班级具体作业完成情况
    "select stu_name,stu_no,mstu_condition dition \
    from student left join  meansStudent  \
    on  student.stu_id =meansStudent.mstu_stuid and mstu_meaid=? \
    WHERE student.stu_id in(select cstu_stuid from classStudent WHERE cstu_claid=?);";
const classInformConditionSql =
    "SELECT * FROM inform WHERE inf_id=?;";//李帅---查班级具体通知信息
const classTaskQuantitySql =
    "SELECT COUNT(*) as classTasks FROM classTask WHERE ctas_claid=?;";//李帅---查班级作业总数
const classMeansQuantitySql =
    "SELECT COUNT(*) as classMeanss FROM classMeans WHERE cmea_claid=?;";//李帅---查班级资料总数
const classMissionGradeSql =
    "select a.stu_name,a.stu_no,a.taskGrade,b.meansGrade\
    FROM (select stu_name,stu_no,TRUNCATE(SUM(tstu_condition)/?, 1)as taskGrade\
    from student left join taskStudent\
    on student.stu_id =taskStudent.tstu_stuid and taskStudent.tstu_tasid in(select ctas_tasid from classTask WHERE ctas_claid=?)\
    GROUP BY stu_id,stu_name,stu_no HAVING stu_id in(select cstu_stuid from classStudent WHERE cstu_claid=?))as a,\
    (select stu_name ,stu_no,(TRUNCATE(COUNT(mstu_condition>0)/?, 1))*100 as meansGrade \
    from student left join meansStudent  \
    on student.stu_id =meansStudent.mstu_stuid and meansStudent.mstu_meaid in(select ctas_tasid from classTask WHERE ctas_claid=?)\
    GROUP BY stu_id,stu_name,stu_no HAVING stu_id in(select cstu_stuid from classStudent WHERE cstu_claid=?))as b \
    WHERE a.stu_no=b.stu_no;";//李帅---查班级成员作业平均分、资料阅读平均分
const classScoringRulesSql =
    "select cla_proportion,cla_absence,cla_bonus from class WHERE cla_id=?;";//李帅---综合成绩评分规则
const classMemberPerformanceSql =
    "select stu_name,stu_no,cstu_absence,cstu_bonus \
    from student inner join classStudent on student.stu_id =classStudent.cstu_stuid and classStudent.cstu_stuid \
    in(select cstu_stuid from classStudent WHERE cstu_claid=?);";//李帅---查班级成员缺勤，加分情况
const classMemberQuantitySql =
    "select count(*) as people from classStudent WHERE cstu_claid=?;";//李帅---查班级人数

class Tclass extends Base.Base {
    constructor() {
        super()
    }
    //函数
    CheckClass(message, callback) {//李帅--通过课程编号查班级表
        console.log('查班级表')
        this.QueryMysql(checkClassSql, [message],(results,fields)=>{
            results.forEach((currentValue, index, arr0) => {//遍历班级计算人数
                this.ClassMemberQuantity(currentValue.cla_id, result => {
                    arr0[index].cla_people=result[0].people
                    if(index==results.length-1){
                        callback(results);

                    }
                })
            })
            
        })
    }
    ClassMemberQuantity(classId, callback) {//李帅--查班级人数
        console.log('查班级人数');
        this.QueryMysql(classMemberQuantitySql, [parseInt(classId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    CheckClassSign(clasign, callback) {//李帅--班级码查重
        console.log('班级码查重');
        this.QueryMysql(checkClassSignSql, [clasign],(results,fields)=>{
            callback(results);// 空  班级码ok
        })
    }


    CreateClass(message, callback) {//李帅--创建班级
        console.log('创建班级');
        let i=1;//while循环参数
        let clasign;//班级码
        while (i){
            clasign = Math.floor((Math.random()*(1000000-100000)+100000))
            //查重
            i=this.CheckClassSign(clasign, result => {
                if (result == []) {// 空  班级码ok
                    return 0;
                }
                else
                    return 1;
            })
            }
        this.QueryMysql(createClassSql, [message.className,clasign,message.courseId],(results,fields)=>{
            callback(results);// 1 创建成功
        })
    }

    DeletClass(classId, callback) {//李帅--删除班级
        console.log('删除班级');
        this.QueryMysql(deletClassSql, [classId],(results,fields)=>{
            callback(results);//1 删除成功
        })
    }

    ReviseClassName(message, callback) {//李帅--修改班级名
        console.log('修改班级名');
        this.QueryMysql(reviseClassNameSql, [message.className,message.classId],(results,fields)=>{
            callback(results);
        })
    }

    ReviseClassMessage(message, callback) {//李帅--修改班级信息，成绩比例，缺勤一次扣的分数，加分一次加的分数
        console.log('修改班级成绩管理信息');
        this.QueryMysql(reviseClassMessageSql, [message.proportion,message.absence,message.bonus,message.classId],(results,fields)=>{
            callback(results);
        })
    }

    ClassMember(classId, callback) {//李帅--查班级所有成员
        console.log('查班级所有成员');
        this.QueryMysql(classMemberSql, [classId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassTask(classId, callback) {//李帅--查班级所有作业
        console.log('查班级所有作业');
        this.QueryMysql(classTaskSql, [classId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassMeans(classId, callback) {//李帅--查班级所有资料
        console.log('查班级所有资料');
        this.QueryMysql(classMeansSql, [classId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassInform(classId, callback) {//李帅--查班级所有通知
        console.log('查班级所有通知');
        this.QueryMysql(classInformSql, [classId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassTaskCondition(message, callback) {//李帅--查班级具体作业完成情况
        console.log('查班级具体作业完成情况');
        this.QueryMysql(classTaskConditionSql, [parseInt(message.taskId),parseInt(message.classId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassMeansCondition(message, callback) {//李帅--查班级具体资料阅读情况
        console.log('查班级具体资料阅读情况');
        this.QueryMysql(classMeansConditionSql, [parseInt(message.meansId),parseInt(message.classId)],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassInformCondition(informId, callback) {//李帅--查班级具体通知信息
        console.log('查班级具体通知信息');
        this.QueryMysql(classInformConditionSql, [informId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassTaskQuantity(classId, callback) {//李帅--查班级作业总数
        console.log('查班级作业总数');
        this.QueryMysql(classTaskQuantitySql, [classId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassMeansQuantity(classId, callback) {//李帅--查班级资料总数
        console.log('查班级资料总数');
        this.QueryMysql(classMeansQuantitySql, [classId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }

    ClassMissionGrade(classTasks,classMeanss,classId, callback) {//李帅--查班级成员作业平均分、资料阅读平均分
        console.log('查班级成员作业平均分、资料阅读平均分');
        this.QueryMysql(classMissionGradeSql, [classTasks,classId,classId,classMeanss,classId,classId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    
    ClassScoringRules(classId, callback) {//李帅--综合成绩评分规则
        console.log('综合成绩评分规则');
        this.QueryMysql(classScoringRulesSql, [classId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    ClassMemberPerformance(classId, callback) {//李帅--查班级成员缺勤，加分情况
        console.log('查班级成员缺勤，加分情况');
        this.QueryMysql(classMemberPerformanceSql, [classId],(results,fields)=>{
            console.log(results);
            callback(results);
        })
    }
    






}


module.exports = { Tclass }