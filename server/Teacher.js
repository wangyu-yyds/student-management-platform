const Base = require('./Base')

const searchTeacherSql =
    "SELECT * FROM teacher WHERE tea_phone=?;";//李帅--通过电话查教师表
const searchTeacherMeSql =
    "SELECT * FROM teacherMe WHERE tea_no=?;";//李帅---绑定，通过教师号查 校教师表
const creatTeacherSql =
    "INSERT INTO teacher(tea_name,tea_no,tea_phone) VALUES(?,?,?);";//李帅---在教师表中创建用户
const checkTeacherByNoSql =
    "SELECT * FROM teacher WHERE tea_no=?;";//李帅--通过教师号查老师表
const BindTeaSql =
    "UPDATE teacher SET tea_phone=? WHERE tea_no=?;";//李帅--将该教师号记录的电话修改为绑定电话
const UnbindTeaSql =
    "UPDATE teacher SET tea_phone=-1 WHERE tea_phone=?;";//李帅---将老师表某条记录的电话置为-1
const cancellationTeaSql =
    "delete from teacher where tea_phone=?;";//李帅---注销老师表用户
const updateAvatarTeaSql =
    "UPDATE teacher SET tea_avatarUrl=? WHERE tea_phone=?;";//李帅---老师表更新头像
const getAvatarTeaSql =
    "SELECT tea_avatarUrl FROM teacher WHERE tea_phone=?;";//李帅---老师表查头像
    

class Teacher extends Base.Base {
    constructor() {
        super()
    }
    //函数
   
    CheckTeacher(message,callback) {//查教师表
        console.log('在查教师表');
        this.QueryMysql(searchTeacherSql,[message.phone],(results,fields)=>{
            // console.log(1111111,results);
            callback(results);
        })
    }

    CheckTeacherMe(message,callback) {//李帅--查校教师表
        console.log('在查校教师表');
        this.QueryMysql(searchTeacherMeSql,[message._on],(results,fields)=>{
            // console.log(1111111,results);
            callback(results);
        })
    }

    CreateTeacherUser(message, callback) {//李帅--创建教师用户
        console.log('创建教师用户')
        this.QueryMysql(creatTeacherSql,[message.name,message.Sno,message.phone],(results,fields)=>{
            // console.log(1111111,results);
            callback(results);
        })
    }

    CheckTeacherByNo(No, callback) {//李帅--教师号查老师表
        console.log('教师号查老师表');
        this.QueryMysql(checkTeacherByNoSql, [No],(results,fields)=>{
            callback(results);
        })
    }
    BindTea(phone,No, callback) {//李帅--将该教师号记录的电话修改为绑定电话
        console.log('将该教师号记录的电话修改为绑定电话');
        this.QueryMysql(BindTeaSql, [phone,No],(results,fields)=>{
            callback(results);
        })
    }
    UnbindTea(phone, callback) {//李帅--将老师表某条记录的电话置为-1
        console.log('将老师表某条记录的电话置为-1');
        this.QueryMysql(UnbindTeaSql, [phone],(results,fields)=>{
            callback(results);
        })
    }
    CancellationTea(phone, callback) {//李帅--注销老师表用户
        console.log('注销老师表用户');
        this.QueryMysql(cancellationTeaSql, [phone],(results,fields)=>{
            callback(results);
        })
    }
    UpdateAvatarTea(avatarUrl,phone, callback) {//李帅--老师表更新头像
        console.log('老师表更新头像');
        this.QueryMysql(updateAvatarTeaSql, [avatarUrl,phone],(results,fields)=>{
            callback(results);
        })
    }
    GetAvatarTea(phone, callback) {//李帅--老师表查头像
        console.log('老师表查头像');
        this.QueryMysql(getAvatarTeaSql, [phone],(results,fields)=>{
            callback(results);
        })
    }

}


module.exports = { Teacher }