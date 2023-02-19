// 作者: 王宇
// 创建文件日期: 2022.1.17
// 描述: 学生端课程相关类
// 功能:学生端需要用到的接口:
// 接口: 查询学生课程list接口: 输入学生的手机号
//                            请求成功: 返回一个CourseList数组(其中包括了其中包括了课程的编号, 班级编号, 课程的名称, 授课教师) 

const Base = require('./Base')

const GetCourseSql = "SELECT DISTINCT course.cou_id AS courseNum, classstudent.cstu_claid AS classNum, class.`cla_sign` AS classCode ,course.cou_name AS courseName, tea_name AS teacherName, course.`cou_existtime` AS startTime FROM classstudent LEFT JOIN class ON classstudent.`cstu_claid` = class.`cla_id` LEFT JOIN course ON class.`cla_couid` = course.`cou_id` LEFT JOIN teacher ON teacher.tea_id = course.cou_id WHERE  classstudent.`cstu_stuid` = (SELECT student.`stu_id` FROM student WHERE student.`stu_phone` = ?)"
const GetClassidSql = "CALL judgement(?)" //该'?'中放班级码
const StuAddClassSql = "CALL stuaddclass(?,?)" //第一个'?'中放学生电话号, 第二个'?'放班级编号

class course extends Base.Base {
    constructor() {
        super()
    }
    // 描述: 获取课程列表
    GetCourse(message, callback) {
        this.QueryMysql(GetCourseSql, [message.tel], results => {
            // console.log('results:\n', results)  打印SQL查询结果
            callback(results)
        })
    }

    // 描述: 学生加入班级
    AddClass(message, callback) {
        const p1 = new Promise((resolve, reject) => {
            this.GetClassid(message.sign, classid => {
                // console.log('在promise中的classid:', classid.classid)
                if (classid.classid != -1) {
                    resolve(classid.classid)
                } else {
                    reject(classid)
                }
            })
        }).then((value) => {
            // value(班级编号)
            this.StuAddClass(message.tel, value, async data => {
                // console.log('StuAddClass回调的data:', data)   
                //data.result==1 表示"学生加入班级"这一操作执行成功
                if (data.result == 1) {
                    // 返回学生加入的班级信息
                    let classInformation = await this.getClassInfor(value); //value是班级编号
                    console.log("classInformation",classInformation)
                    callback(classInformation)
                } else {
                    callback(-1)
                }
            })
        }, (err) => {
            callback(-1)
            console.log('Promist中的err:', err)
        })
    }


    // 描述: 返回班级的courseName,classNum, courseNum课程的基本信息
    // 输入: classid
    getClassInfor(classid) {
        return new Promise((resolve, reject) => {
            const getClassInforSql = "SELECT course.`cou_name` AS courseName, cla_name AS className, cla_id AS classNum, cla_couid AS courseNum FROM class LEFT JOIN course ON class.`cla_couid` = course.`cou_id` WHERE cla_id = ?"
            this.QueryMysql(getClassInforSql, [classid], classInformation => {
                console.log("学生加入班级的课程信息:", classInformation)
                resolve(classInformation)
            })
        }).then(classInformation=>{
            return classInformation
        })

    }

    // 描述: 输入班级码返回班级编号 
    GetClassid(message, callback) {
        this.QueryMysql(GetClassidSql, [message], data => {
            // console.log('回调函数中classid:\n', data[0][0])    检查是否得到了正确的班级编号
            callback(data[0][0])
        })
    }

    // 描述: 将学生添加到班级码对应的班级里去
    StuAddClass(tel, classid, callback) {
        console.log("StuAddClass中的tel,classid",tel,classid)
        this.QueryMysql(StuAddClassSql, [tel, classid], data => {
            console.log('StuAddClass方法中base返回:', data)
            // 下面的data[0][0].result的值来表示是否添加成功 ,data[0][0].result=1表示学生添加班级成功 否则表示学生添加班级失败
            // console.log('StuAddClass中data:', data[0][0])   
            
            if (data[0][0].result == 1) {
                callback(data[0][0])
            }
            if (data == -1) {
                callback({
                    result: -1
                })
            }
        })
    }

}

module.exports = {
    course
}