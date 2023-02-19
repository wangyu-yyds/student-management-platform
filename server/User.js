const Base = require('./Base')

const querySql =
    "SELECT * FROM Users WHERE _account=? AND _password=?;";
const searchStudentSql =
    "SELECT * FROM student WHERE stu_phone=?;";//李帅---登录，在学生表查电话
const sStudentMeSql =
    "SELECT * FROM studentMe WHERE stu_no=?;";//李帅---绑定，通过学号查校学生表
const searchTeacherSql =
    "SELECT * FROM teacher WHERE tea_phone=?;";//李帅---登录，在教师表查电话
const ykHaoSql =
    "SELECT * FROM student WHERE stu_no=?;";//李帅---学号/游客号查学生表
const createYkSql =
    "INSERT INTO student(stu_name,stu_no,stu_phone) VALUES(?,?,?);";//李帅---在学生表中创建用户
const ykIdSql =
    "SELECT stu_id FROM student WHERE stu_no=?;";//李帅---查游客ID
const recordYkPhoneSql =
    "INSERT INTO YKphone(YKp_YKid,YKp_phone) VALUES(?,?);";//李帅---记录创建游客时的电话（游客编号，电话）
const unbindStuSql =
    "UPDATE student SET stu_phone=-1 WHERE stu_phone=?;";//李帅---将学生表某条记录的电话置为-1
const bindStuSql =
    "UPDATE student SET stu_phone=? WHERE stu_no=?;";//李帅---将该学号记录的电话修改为绑定电话
const checkIdByYKphoneSql =
    "SELECT YKp_YKid FROM YKphone WHERE YKp_phone=?;";//李帅---用电话查游客电话关系表编号
const returnYKSql =
    "UPDATE student SET stu_phone=? WHERE stu_id=?;";//李帅---修改学生表的电话
const newUnbindStuSql =
    "UPDATE student SET stu_name=?,stu_no=? WHERE stu_phone=?;";//李帅---绑定学生身份
const cancellationStuSql =
    "delete from student where stu_phone=?;";//李帅---注销学生表用户（学生/游客）
const updateAvatarStuSql =
    "UPDATE student SET avatarUrl=? WHERE stu_phone=?;";//李帅---学生表更新头像
const getAvatarStuSql =
    "SELECT avatarUrl FROM student WHERE stu_phone=?;";//李帅---学生表查头像
        
class User extends Base.Base {
    constructor() {
        super()
    }
    CheckUser2(message,callback) {//李帅--查学生表
        console.log('在查学生表');
        this.QueryMysql(searchStudentSql, [message._phone],(results,fields)=>{
            callback(results);
        })
    }

    CheckStudentMe(message,callback) {//李帅--查校学生表
        console.log('在查校学生表');
        this.QueryMysql(sStudentMeSql, [message._on],(results,fields)=>{
            callback(results);
        })
    }

    CheckTeacher(message,callback) {//李帅--查教师表
        console.log('在查教师表');
        this.QueryMysql(searchTeacherSql, [message._phone],(results,fields)=>{
            callback(results);
        })
    }

    CheckYkhao(YKno, callback) {//李帅--游客号/学号查学生表
        console.log('游客号/学号查学生表');
        this.QueryMysql(ykHaoSql, [YKno],(results,fields)=>{
            callback(results);
        })
    }


    CreateYkUser(message, callback) {//李帅--创建游客用户
        console.log('创建游客用户');
        let i=1;//while循环参数
        let YKno;//游客号
        var yk = 'YK'
        while (i){
            YKno = yk.concat(Math.floor((Math.random()*10000000000+1)))
            //查重
            i=this.CheckYkhao(YKno, result => {
                if (result == -1 )
                   callback(-1);
                else if (result.length == 0) {//没有该用户，以游客形式创建用户
                    return 0;
                }
                else
                    return 1;
                
            })
            }                 
             //创建游客用户
        this.QueryMysql(createYkSql, [message._vxname,YKno,message._phone],(results,fields)=>{
            callback(YKno);
        })
    }

    CreateStudenUser(message, callback) {//李帅--创建学生用户
        console.log('创建用户');
        this.QueryMysql(createYkSql, [message._name1,message._Sno1,message._phone1],(results,fields)=>{
            callback(results);
        })
    }

    CheckYkId(YKno, callback) {//李帅--查游客ID
        console.log('查游客ID');
        this.QueryMysql(ykIdSql, [YKno],(results,fields)=>{
            callback(results);
        })
    }

    RecordYkPhone(YKId,phone, callback) {//李帅--记录创建游客时的电话
        console.log('记录创建游客时的电话');
        this.QueryMysql(recordYkPhoneSql, [YKId,phone],(results,fields)=>{
            callback(results);
        })
    }
    UnbindStu(phone, callback) {//李帅--将学生表某条记录的电话置为-1
        console.log('将学生表某条记录的电话置为-1');
        this.QueryMysql(unbindStuSql, [phone],(results,fields)=>{
            callback(results);
        })
    }
    BindStu(phone,Sno, callback) {//李帅--将该学号记录的电话修改为绑定电话
        console.log('将该学号记录的电话修改为绑定电话');
        this.QueryMysql(bindStuSql, [phone,Sno],(results,fields)=>{
            callback(results);
        })
    }
    CheckIdByYKphone(phone, callback) {//李帅--用电话查游客电话关系表编号
        console.log('用电话查游客电话关系表编号');
        this.QueryMysql(checkIdByYKphoneSql, [phone],(results,fields)=>{
            callback(results);
        })
    }
    ReturnYK(phone, callback) {//李帅--重回游客
        console.log('重回游客');
        this.CheckIdByYKphone(phone, result => {//重回游客
            //将该学号记录的电话修改为绑定电话
            if (result == -1 ){
                callback(-1);
            }
            else if (result.length != 0) {//找到了，修改电话为-1
                let YKId = result[0].YKp_YKid;
                this.QueryMysql(returnYKSql, [phone,YKId],(results,fields)=>{
                    callback(results);
                })
            }
            else if (result.length == 0) {//未找到
                callback(-1);
            }
        })
    }
    NewBindStu(message, callback) {//李帅--绑定学生身份
        console.log('绑定学生身份');
        this.QueryMysql(newUnbindStuSql, [message.name,message.Sno,message.phone],(results,fields)=>{
            callback(results);
        })
    }
    CancellationStu(phone, callback) {//李帅--注销学生表用户（学生/游客）
        console.log('注销学生表用户（学生/游客）');
        this.QueryMysql(cancellationStuSql, [phone],(results,fields)=>{
            callback(results);
        })
    }
    UpdateAvatarStu(avatarUrl,phone, callback) {//李帅--学生表更新头像
        console.log('学生表更新头像');
        this.QueryMysql(updateAvatarStuSql, [avatarUrl,phone],(results,fields)=>{
            callback(results);
        })
    }
    GetAvatarStu(phone, callback) {//李帅--学生表查头像
        console.log('学生表查头像');
        this.QueryMysql(getAvatarStuSql, [phone],(results,fields)=>{
            callback(results);
        })
    }
}


module.exports = { User }