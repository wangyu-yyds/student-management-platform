const Base = require('./Base')

// 根据班级编号查询资料编号列表
const GetMeansArrSql = "SELECT cmea_meaid FROM classmeans WHERE cmea_claid = ?"
// 判断是否存在学生对某资料的学习记录, 没有就插入一条阅读次数为0的记录
const CheckStudentMeansSql = "CALL checkstudentmeans(?, ?)"

const GetMeansListSql = "SELECT cmea_meaid AS meansid, cmea_begintime AS startDate, mea_name AS title, mstu_condition AS readCounter FROM classmeans LEFT JOIN meansstudent ON classmeans.`cmea_meaid` = meansstudent.`mstu_meaid` LEFT JOIN means ON means.`mea_id` = classmeans.`cmea_meaid` WHERE meansstudent.`mstu_stuid` = (SELECT student.`stu_id` FROM student WHERE student.`stu_phone` = ?) AND classmeans.`cmea_claid` = ?"
const GetMeansUrlSql = "SELECT means.`mea_name` AS meansName, means.`mea_url` AS URL, classmeans.`cmea_begintime` AS meansTime FROM means,classmeans WHERE means.`mea_id` = ? AND means.`mea_id` = classmeans.`cmea_meaid`"

const recodeMeansSql = "CALL recodeMeans((SELECT student.stu_id FROM student WHERE student.stu_phone = ?),?)"

class means extends Base.Base {
    constructor() {
        super()
    }

    // 输入: 电话号, 班级编号
    // 输出: meansList
    async GetMeansList(message, callback) {
        let MeansidArr = []  // 该数组中存放读取到的资料编号
        await this.GetMeansArr(message.classid).then((value) => {
            MeansidArr = value
        })
        for (let i = 0; i < MeansidArr.length; i++) {
            await this.CheckStudentMeans(message.tel, MeansidArr[i])
        }
        this.QueryMysql(GetMeansListSql, [message.tel, message.classid], results => {
            // console.log('results:\n', results)
            callback(results)
        })
    }

    // 输入班级编号
    // 输出该班级的所有资料编号(列表形式)
    GetMeansArr(classid) {
        return new Promise((resolve, reject) => {
            this.QueryMysql(GetMeansArrSql, [classid], dataArr => {
                let meansidArr = []
                dataArr.forEach(element => {
                    meansidArr.push(element.cmea_meaid)
                })
                resolve(meansidArr)
            })
        })
    }

    // 查询资料学习表中, 是否存在学生学习这一条资料的记录
    // 输入: 学生手机号, 资料编号
    CheckStudentMeans(tel, meansid) {
        return new Promise((resolve, reject) => {
            this.QueryMysql(CheckStudentMeansSql, [tel, meansid], result => {
                resolve(result[0])
            })
        })
    }















    // 输入: 资料编号
    // 输出: 资料名, meansURL
    GetMeansUrl(message, callback) {
        this.QueryMysql(GetMeansUrlSql, [message.meansid], results => {
            callback(results)
        })
    }


    // 描述: 记录学生阅读资料
    // 输入: 手机号, 资料编号
    readMeans(message, callback) {
        this.QueryMysql(recodeMeansSql, [message.tel, message.meansid], results => {
            callback(1)
        })
    }
}

module.exports = { means }


