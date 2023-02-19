const Base = require('./Base')

const checkCourseSql =
    "SELECT * FROM course WHERE cou_teaid=?;";//李帅---通过老师编号查课程表
const creatCourseSql =
    "INSERT INTO course(cou_name,cou_teaid,cou_synopsis,cou_existtime,cou_picture,cou_school) VALUES(?,?,?,?,?,?);";//李帅---在课程表中创建课程
const deleteCourseSql =
    "delete from course where cou_id=?;";//李帅---在课程表中删除课程
const reviseCourseSql =//李帅---在课程表中修改课程信息
    "UPDATE course SET cou_name=?,cou_synopsis=?,cou_existtime=?,cou_picture=?,cou_school=? WHERE cou_id=?;";
const checkSpecificCourseSql =//李帅---通过课程编号查课程表
    "SELECT * FROM course WHERE cou_id=?;";
    

class Tcourse extends Base.Base {
    constructor() {
        super()
    }
    //函数
    getTime(){//获取时间
        let time = new Date();
        let timetime = time.getHours() + ":" + time.getMinutes() ;
        let datetime = time.getFullYear() + "-" + time.getMonth()+1 + "-" + time.getDate();
        let alltime = datetime + " " +timetime;
        console.log(alltime);
        return alltime;
    }


    CheckCourse(message, callback) {//李帅--通过老师编号查课程表
        console.log('查课程表')
        this.QueryMysql(checkCourseSql,[message],(results,fields)=>{
            //console.log(1111111,results);
            callback(results);
        })
    }

    CheckSpecificCourse(courseId, callback) {//李帅--通过课程编号查课程表
        console.log('查某个课程信息')
        this.QueryMysql(checkSpecificCourseSql,[parseInt(courseId)],(results,fields)=>{
            //console.log(1111111,results);
            callback(results);
        })
    }

    DeleteCourse(couid, callback) {//李帅--删除课程(用级联)
        console.log('删除课程')
        this.QueryMysql(deleteCourseSql, [parseInt(couid)],(results,fields)=>{
            callback(results);//1删除成功
        })
    }
    CreateCourse(teaid,message, callback) {//李帅--创建课程
        console.log('创建课程')
        this.QueryMysql(creatCourseSql, [message.coursename,teaid,message.synopsis,message.existtime,message.picture,message.school],(results,fields)=>{
            // console.log(1111111,results);
            callback(results);
        })
    }
    ReviseCourse(message, callback) {//李帅--修改课程信息
        console.log('修改课程信息')
        this.QueryMysql(reviseCourseSql, [message.coursename,message.synopsis,message.existtime,message.picture,message.school,message.courseId],(results,fields)=>{
            // console.log(1111111,results);
            callback(results);
        })
    }
    





}


module.exports = { Tcourse }