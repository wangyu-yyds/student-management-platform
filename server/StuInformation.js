const Base = require('./Base')
// 通过班级编号查询通知编号们
const GetInformArrSql = "SELECT classinform.`cinf_infid` FROM classinform WHERE classinform.`cinf_claid` = ?"
// 通过学生手机号,通知编号, 查询是否存在学生学习的记录, 若不存在, 则插入一条数据进去
const CheckStudentInformSql = "CALL CheckStudentInform(?, ?)"
// 根据学生的电话号码和班级编号获取通知列表
const GetInformationListSql = "SELECT inform.`inf_id` AS informNum, inf_name AS title, inf_author AS author, inf_content AS content, cinf_infortime AS startDate, istu_condition AS state, informstudent.`istu_delestate` AS delestate FROM classinform LEFT JOIN informstudent ON classinform.`cinf_infid` = informstudent.`istu_infid` LEFT JOIN inform ON inform.`inf_id` = classinform.`cinf_infid`  WHERE  informstudent.istu_stuid = (SELECT student.`stu_id` FROM student WHERE student.`stu_phone` = ?) AND  classinform.`cinf_claid` = ?"

const GetInformationSql = "SELECT inform.`inf_name` AS informTitle, inform.`inf_author` AS author, inform.`inf_content` AS informContent, classinform.`cinf_infortime` AS startTime FROM inform,classinform  WHERE classinform.`cinf_infid` = inform.`inf_id` AND inform.`inf_id` = ?"

const readInformationSql = "UPDATE informstudent SET informstudent.`istu_condition` = '1' WHERE informstudent.`istu_stuid` =(SELECT student.`stu_id` FROM student WHERE student.`stu_phone` = ?)  AND informstudent.`istu_infid` = ?"

const deleteInformSql = "UPDATE informstudent SET istu_delestate = 1 WHERE istu_stuid =(SELECT student.`stu_id` FROM student WHERE student.`stu_phone` = ?) AND istu_infid =?"

class information extends Base.Base {
    constructor() {
        super()
    }
    // 输入: 电话号, 班级号
    // 输出: informationLisit
    async GetInformationList(message, callback) {
        let informIdArr = []   //该数组用来存放根据班级编号读取到的通知编号
        await this.GetInformArr(message.classid).then((value) => {
            informIdArr = value
        })
        for (let i = 0; i < informIdArr.length; i++) {
            await this.CheckStudentInform(message.tel, informIdArr[i])  //完成学生通知查看记录表的记录初始化
        }
        this.QueryMysql(GetInformationListSql, [message.tel, message.classid], results => {
            callback(results)
        })
    }
    // 输入: 电话号码, 通知编号
    // 输出: 操作状态
    // 描述: 查看学生对于该通知的学习记录是否存在, 不存在则插入一条未读记录 
    CheckStudentInform(tel, informid) {
        return new Promise((resolvel, reject) => {
            this.QueryMysql(CheckStudentInformSql, [tel, informid], result => {
                resolvel(result[0])
            })
        })
    }

    // 输入: 班级编号
    // 输出: 通知编号列表
    // 描述: 通过班级编号查到属于该班级的所有通知
    GetInformArr(classid) {
        return new Promise((resolvel, reject) => {
            this.QueryMysql(GetInformArrSql, [classid], dataArr => {
                let informIdArr = []
                dataArr.forEach(element => {
                    informIdArr.push(element.cinf_infid)
                });
                // console.log(informIdArr)
                resolvel(informIdArr)
            })
        })
    }

    // 输入: 通知编号
    // 输出: 通知有关信息
    GetInformation(message, callback) {
        this.QueryMysql(GetInformationSql, [message.informid], results => {
            callback(results)
        })
    }

    //输入: 手机号,通知编号
    //输出: 成功输出1, 失败输出0
    readInformation(message, callback) {
        try {
            this.QueryMysql(readInformationSql, [message.tel, message.informId], results => {
                callback(1)
            })
        } catch {
            callback(0)
        }
    }

    // 输入: 手机号, 通知编号
    // 输出: 成功返回1, 失败返回0
    deleteInformation(message, callback) {
        console.log(message.tel, '88888', message.informId)
        try {
            this.QueryMysql(deleteInformSql, [message.tel, message.informId], results => {
                callback(1)
            })
        } catch {
            callback(0)
        }
    }

    // 传入: tel, avatarUrl
    // 成功返回1, 失败返回0
    saveAvatarUrl(message, callback){
        const saveAvatarUrlSql = "UPDATE student SET avatarUrl = ? WHERE stu_phone = ?"
        this.QueryMysql(saveAvatarUrlSql,[message.tel, message.avatarUrl],result=>{
            console.log(result)
            callback()
        })
    }
}

module.exports = { information }