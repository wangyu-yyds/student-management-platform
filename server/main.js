const express = require('express')
//引入http
const httpServer = express()

//引入course模块
const courses = require('./Stucourse')
const stuCourse = new courses.course()
//引入task模块
const tasks = require('./Stutask')
const stuTask = new tasks.task()
//引入means模块
const meanss = require('./Stumeans')
const stumeans = new meanss.means()
//引入information模块
const informations = require('./Stuinformation')
const stuinform = new informations.information()


//引入User模块
const Users = require('./User')

//引入TclassMember模块
const TclassMember = require('./TclassMember')

//引入Teacher模块
const Teachers = require('./Teacher')

//引入Tcourse模块
const Tcourse = require('./Tcourse')


//引入Tclass模块
const Tclass = require('./Tclass')

//引入Trelease模块
const Trelease = require('./Trelease')

//创建User对象
const ReqUser = new Users.User()

//创建Teacher对象
const ReqTeacher = new Teachers.Teacher()

//创建Tcourse对象
const ReqTcourse = new Tcourse.Tcourse()

//创建Tclass对象
const ReqTclass = new Tclass.Tclass()

//创建TclassMember对象
const ReqTclassMember = new TclassMember.TclassMember()

//创建Trelease对象
const ReqTrelease = new Trelease.Trelease()

//引入morgan，uuid，fs，path模块
const morgan = require('morgan')
const uuid = require('node-uuid')
const fs = require('fs')
const path = require('path')
const req = require('express/lib/request')
const res = require('express/lib/response')

const {
    JSON
} = require('mysql/lib/protocol/constants/types')


//获得post请求参数,post发送的参数是在请求体中的,Express没有提供获取表单post请求体的api,我们需要使用到第三方包--cnpm install body-parser
const bodyParser = require('body-parser')
const {
    json
} = require('body-parser')
const {
    request
} = require('http')
//创建application/json 解析器
const jsonParser = bodyParser.json()


//配置POST请求用到的"格式解析"全局中间件
httpServer.use(express.urlencoded({
    extended: false
}))



httpServer.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8"); //非文本类，例如图片，视频，音频传输需要注释该行
    next();
})


/***************************************************************************************************************
 ****************************************************************************************************************
 ***************************************************ls***********************************************************
 ****************************************************************************************************************
 ****************************************************************************************************************
 */

//日志--李帅
//开始
morgan.token('time', function (req, res) {
    let myDate = new Date();
    let time = myDate.toLocaleString() + ':' + myDate.getMilliseconds(); //2022/2/18 下午12:51:58:931(精确到毫秒)
    return time;
});



var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
})


morgan.format('joke', '[:time] method=:method 请求url=:url 响应时间(毫秒)=:response-time')
// httpServer.use(morgan('joke'))

httpServer.use(morgan('joke', {
    stream: accessLogStream
}))
// httpServer.use(morgan(':method :url :response-time'))
//结束

//李帅
/******************************登录接口*******************************/
//请求方式：例http://127.0.0.1:8999/landing?_phone=17877778884&_vxname=1231
//功能：返回用户信息，如果用户不存在则新建一个游客账号并返回用户信息
//需要参数：电话，微信昵称
//返回值：返回姓名，学号，身份 code：-1失败，code：0成功，code：-4学号不存在
httpServer.get('/landing', (req, res) => {
    // console.log(req.query);
    var biao = 'student'; //标识查的是学生表
    ReqUser.CheckUser2(req.query, result => { //查学生表
        if (result == -1)
            res.send({
                code: -1
            });
        else if (result.length != 0) { //找到了
            _name = result[0].stu_name;
            _Sno = result[0].stu_no;
            if (_Sno.substring(0, 2) == 'YK') {
                _senfen = '游客'
            } else {
                _senfen = '学生'
            }
            res.send({
                code: 0,
                _name,
                _Sno,
                _senfen
            });
        } else if (result.length == 0) { //学生表未找到
            ReqUser.CheckTeacher(req.query, result => { //查老师表
                if (result == -1)
                    res.send({
                        code: -1
                    });
                else if (result.length != 0) { //找到了
                    _name = result[0].tea_name;
                    _Sno = result[0].tea_no;
                    _senfen = '老师'
                    res.send({
                        code: 0,
                        _name,
                        _Sno,
                        _senfen
                    });
                } else {
                    biao = 'teacher';

                    ReqUser.CreateYkUser(req.query, result => {
                        if (result == -1)
                            res.send({
                                code: -1
                            });
                        else if (result.length != 0) {
                            _Sno = result;
                            ReqUser.CheckYkId(_Sno, result => { //查游客编号
                                if (result.length != 0 && result != -1) {
                                    let id = result[0].stu_id;
                                    ReqUser.RecordYkPhone(id, req.query._phone, result => { //在游客电话关系表中记录（编号，电话）
                                        if (result == 1) { //存储成功
                                            _name = req.query._vxname;
                                            _senfen = '游客'
                                            res.send({
                                                code: 0,
                                                _name,
                                                _Sno,
                                                _senfen
                                            });
                                        } else {
                                            res.send({
                                                code: -1
                                            });
                                        }
                                    })
                                } else {
                                    res.send({
                                        code: -1
                                    });
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

//李帅
/******************************绑定接口*******************************/
//请求方式：post例http://127.0.0.1:8999/binding?_phone=17877778899&_identity=学生&_on=A11114445555&_name=李四
//功能：在学生/老师表中创建已绑用户
//需要参数：电话，身份，学号
//返回值：返回姓名，学号，身份 code：-1失败，code：0成功，code：-4学号不存在 code：-2学号已被绑定 code：-5姓名填写错误
httpServer.post('/binding',jsonParser, (req, res) => {
    const body = Object.assign({},req.body)
    console.log(body);
    if (body._phone == undefined || body._identity == undefined 
        || body._on == undefined) {
        res.send({ code: -2 ,err:"输入参数错误"});//输入参数错误
    }
    else{
         //判断绑定身份
        if(body._identity=='学生'){
            //查校学生表
            ReqUser.CheckStudentMe(body, result => {
                if (result == -1 || result.length == 0) {
                    if (result == -1)
                    res.send({ code: -1 });//查找失败
                    else{//未找到学生
                    res.send({ code: -4,err:"学号不存在"});//学号不存在
                    }
                }
                else if (result.length != 0) {//查找到学生
                    // if(result[0].stu_name!=body._name){//姓名填写错误
                    //     res.send({ code: -5,err:"姓名填写错误"});
                    // }
                    // else{
                        //在学生表中存数据
                        let _name = result[0].stu_name;//姓名
                        let _Sno = result[0].stu_no;//学号
                        let _senfen = body._identity;//身份
                        let _phone = body._phone;//电话
                        let Create = {
                            name:_name,
                            Sno:_Sno,
                            phone:_phone
                        };
                        ReqUser.CheckYkhao(_Sno, resultc => {//学号查重，用学号查学生表，看是否已被绑定
                            if (resultc == -1 ) {
                                res.send({ code: -1 });//操作失败，绑定失败
                            }
                            else if (resultc.length == 0) {//未被绑定
                                //更换姓名，学号
                                ReqUser.NewBindStu(Create, resultc => {
                                    if (resultc == 1 ) {//存入成功，绑定成功
                                        res.send({ code: 0, _name, _Sno,_senfen });
                                    }
                                    else {
                                        res.send({ code: -1 });//存入失败，绑定失败
                                    }
                                })
                            }
                            else if (resultc.length != 0) {//学号已被绑定
                               res.send({ code: -2,err:"学号已被绑定"});
                            }
                        })
                    // }
                }
            })
        }
        
        else if(body._identity=='老师'){
            //查校老师表
            ReqTeacher.CheckTeacherMe(body, result => {
                if (result == -1 || result.length == 0) {
                    if (result == -1)
                        res.send({ code: -1 });//查找失败
                    else{//未找到老师
                        res.send({ code: -4,err:"老师号不存在"});//不存在
                    }
                }
                else if (result.length != 0) {//查找到老师
                    // if(result[0].tea_name!=body._name){//姓名填写错误
                    //     res.send({ code: -5,err:"姓名填写错误"});
                    // }
                    // else{
                        //在老师表中存数据
                        _name = result[0].tea_name;//姓名
                        _Sno = result[0].tea_no;//老师号
                        _senfen = body._identity;//身份
                        _phone = body._phone;//电话
                        let Create = {
                            name:_name,
                            Sno:_Sno,
                            phone:_phone
                        };
                        ReqTeacher.CheckTeacherByNo(_Sno, resultc => {//老师号查重，用老师号查老师表，看是否已被绑定
                            if (resultc == -1 ) {
                                res.send({ code: -1 });//操作失败，绑定失败
                            }
                            else if (resultc.length == 0) {//未被绑定
                                ReqTeacher.CreateTeacherUser(Create, resultc => {//创建老师用户
                                    if (resultc == 1 ) {//创建成功
                                       //删除游客用户
                                       ReqUser.CancellationStu(_phone, resultc => {
                                            if (resultc == 1 ) {//删除成功
                                                res.send({ code: 0, _name, _Sno,_senfen });
                                            }
                                            else {
                                                res.send({ code: -1 });//删除失败
                                            }
                                        }) 
                                    }
                                    else {
                                        res.send({ code: -6 ,err:"老师用户创建失败"});//创建失败
                                    }
                                })
                            }
                            else if (resultc.length != 0) {//老师号已被绑定
                                res.send({ code: -2,err:"老师号已被绑定"});
                            }
                            
                        })
                }
            })
        }
    }
})


//李帅
/******************************注销接口*******************************/
//请求方式：例http://127.0.0.1:8999/cancellation?_phone=17877778884&_identity=学生
//功能：老师/学生注销
//需要参数：电话,身份
//返回值：返回老师创建的所有课程信息 , code：-1失败，code：0成功
httpServer.get('/cancellation', (req, res) => {
    console.log(req.query);
    if (req.query._phone == undefined || req.query._identity == undefined ) {
        res.send({ code: -2 ,err:"输入参数错误"});//输入参数错误
    }
    else{
        let phone = req.query._phone;
        let identity = req.query._identity
        if(identity=='老师'){
            ReqTeacher.CancellationTea(phone, resultc => {
                if (resultc == 1 ) {//删除成功
                    res.send({ code: 0 });
                }
                else {
                    res.send({ code: -1 });//删除失败
                }
            }) 
        }
        else{
            ReqUser.CancellationStu(phone, resultc => {
                if (resultc == 1 ) {//删除成功
                    res.send({ code: 0 });
                }
                else {
                    res.send({ code: -1 });//删除失败
                }
            }) 
        }
    }
})

//李帅
/******************************更新头像*******************************/
//请求方式：例http://127.0.0.1:8999/updateAvatar?phone=17877778884&identity=学生&avatarUrl=45464
//功能：更新头像
//需要参数：openid,身份,头像地址
//返回值：更新头像, code：-1失败，code：0成功，code: -3 输入身份错误
httpServer.get('/updateAvatar', (req, res) => {
    console.log(req.query);
    if (req.query.phone != undefined && req.query.identity != undefined 
        && req.query.avatarUrl != undefined ) {
        //判断身份
        if(req.query.identity=="老师"){
            ReqTeacher.UpdateAvatarTea(req.query.avatarUrl,req.query.phone, result => { //更新头像
                if (result == 1) {
                    res.send({
                        code: 0
                    });
                }
                else{
                    res.send({
                        code: -1
                    });
                }
            })
        }
        else if(req.query.identity=="学生"||req.query.identity=="游客"){
            ReqUser.UpdateAvatarStu(req.query.avatarUrl,req.query.phone, result => { //更新头像
                if (result == 1) {
                    res.send({
                        code: 0
                    });
                }
                else{
                    res.send({
                        code: -1
                    });
                }
            })
        }
        else{
            res.send({ code: -3 ,err:"输入身份错误"});//输入身份错误
        }
    }
    else{
        res.send({ code: -2 ,err:"输入参数错误"});//输入参数错误
    }
})

//李帅
/******************************获取头像*******************************/
//请求方式：例http://127.0.0.1:8999/getAvatar?phone=17877778884&identity=学生
//功能：查头像
//需要参数：openid,身份
//返回值：, code：-1失败，code：0成功 头像地址，code: -3 输入身份错误
httpServer.get('/getAvatar', (req, res) => {
    console.log(req.query);
    if (req.query.phone != undefined && req.query.identity != undefined ) {
        //判断身份
        if(req.query.identity=="老师"){
            ReqTeacher.GetAvatarTea(req.query.phone, result => { //查头像
                if (result == -1) //查找失败
                    res.send({
                        code: -1
                    });
                else if (result.length != 0 || result.length == 0) {
                    res.send({
                        code: 0,
                        result
                    });
                }
            })
        }
        else if(req.query.identity=="学生"||req.query.identity=="游客"){
            ReqUser.GetAvatarStu(req.query.phone, result => { //查头像
               if (result == -1) //查找失败
                    res.send({
                        code: -1
                    });
                else if (result.length != 0 || result.length == 0) {
                    res.send({
                        code: 0,
                        result
                    });
                }
            })
        }
        else{
            res.send({ code: -3 ,err:"输入身份错误"});//输入身份错误
        }
    }
    else{
        res.send({ code: -2 ,err:"输入参数错误"});//输入参数错误
    }
})


//李帅
/******************************老师请求所有课程接口*******************************/
//请求方式：例http://127.0.0.1:8999/allCourse?phone=17877778884
//功能：返回老师创建的所有课程信息
//需要参数：电话
//返回值：返回老师创建的所有课程信息 , code：-1失败，code：0成功
httpServer.get('/allCourse', (req, res) => {
    console.log(req.query);
    ReqTeacher.CheckTeacher(req.query, result => { //在教师表查老师编号
        if (result == -1 || result.length == 0) //查找失败，未找到
            res.send({
                code: -1
            });
        else if (result.length != 0) {
            ReqTcourse.CheckCourse(result[0].tea_id, result => { //老师编号查课程表
                if (result == -1) //查找失败
                    res.send({
                        code: -1
                    });
                else if (result.length != 0 || result.length == 0) {
                    res.send({
                        code: 0,
                        result
                    });
                }
            })
        }
    })
})

//李帅
/******************************老师请求某个课程接口*******************************/
//请求方式：例http://127.0.0.1:8999/specificCourse?courseId=1111
//功能：返回老师创建的某个课程信息
//需要参数：课程Id
//返回值：返回老师创建的某个课程信息 , code：-1失败，code：0成功,code：-2输入参数错误,code：-4无此课程
httpServer.get('/specificCourse', (req, res) => {
    console.log(req.query);
    if (req.query.courseId != undefined) {
        ReqTcourse.CheckSpecificCourse(req.query.courseId, result => { //查某个课程信息
            if (result == -1) //查找失败
                res.send({
                    code: -1
                });
            else if (result.length != 0) {
                res.send({
                    code: 0,
                    result
                });
            }
            else if(result.length == 0){
                res.send({
                    code: -4
                });
            }
        })
    }
    else{
        res.send({ code: -2 ,err:"输入参数错误"});//输入参数错误
    }
})
//李帅
/******************************老师创建课程接口*******************************/
//请求方式：post例http://127.0.0.1:8999/createCourse?phone=17877778884&coursename=课程1&existtime=2021-上&synopsis=&picture=&school=
//功能：创建课程
//需要参数：电话(非空),课程名(非空),结课时间(非空),课程简介,课程图片,所属学校
//返回值： code：-1失败，code：0成功
httpServer.post('/createCourse', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    ReqTeacher.CheckTeacher(body, result => { //从老师表中查编号，默认老师存在
        if (result == -1 || result.length == 0)
            res.send({
                code: -1
            });
        else if (result.length != 0) {
            let tea_id = result[0].tea_id
            ReqTcourse.CreateCourse(tea_id, body, result => { //将信息存入课程表中
                if (result == 1) {
                    res.send({
                        code: 0
                    });
                }
            })
        }
    })
})

//李帅
/******************************老师删除课程接口*******************************/
//请求方式：例http://127.0.0.1:8999/deleteCourse?courseId=22
//功能：删除课程（只删了课程，与课程有关的未删）
//需要参数：课程编号
//返回值： code：-1失败，code：0成功
httpServer.get('/deleteCourse', (req, res) => {
    console.log(req.query);
    ReqTcourse.DeleteCourse(req.query.courseId, result => { //删除课程
        if (result == 1) {
            res.send({
                code: 0
            }); //删除成功
        }
    })
})

//李帅
/******************************老师修改课程信息接口*******************************/
//请求方式：post例http://127.0.0.1:8999/reviseCourse?courseId=1&coursename=课程1
//&existtime=2021-上&synopsis=&picture=&school=
//功能：修改课程信息
//需要参数：课程编号,课程名(非空),结课时间(非空),课程简介,课程图片(TODO),所属学校
//返回值： code：-1失败，code：0成功
httpServer.post('/reviseCourse', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    ReqTcourse.ReviseCourse(body, result => { //修改课程信息
        if (result == 1) {
            res.send({
                code: 0
            }); //
        }
    })
})




//李帅
/******************************老师请求班级接口*******************************/
//请求方式：例http://127.0.0.1:8999/allClass?courseId=1
//功能：输出该课程所有班级
//需要参数：课程编号
//返回值：该课程所有班级信息 code：-1失败，code：0成功
httpServer.get('/allClass', (req, res) => {
    console.log(req.query);
    ReqTclass.CheckClass(parseInt(req.query.courseId), result => { //查班级表
        if (result == -1)
            res.send({
                code: -1
            });
        else if (result.length != 0 || result.length == 0) {
            res.send({
                code: 0,
                result
            });
        }
    })
})

//李帅
/******************************老师创建班级接口*******************************/
//请求方式：例http://127.0.0.1:8999/createClass?courseId=1&className=班级8
//功能：创建班级
//需要参数：课程编号,班级名
//返回值：code：0成功
httpServer.get('/createClass', (req, res) => {
    console.log(req.query);
    ReqTclass.CreateClass(req.query, result => { //创建班级
        if (result == 1) {
            res.send({
                code: 0
            }); //创建成功
        } else {
            res.send({
                code: -1
            }); //创建成功
        }
    })
})

//李帅
/******************************老师删除班级接口*******************************/
//请求方式：例http://127.0.0.1:8999/deleteClass?classId=9
//功能：删除班级
//需要参数：班级编号
//返回值： code：0成功
httpServer.get('/deleteClass', (req, res) => {
    console.log(req.query);
    ReqTclass.DeletClass(req.query.classId, result => { //删除班级
        if (result == 1) {
            res.send({
                code: 0
            }); //删除成功
        }
    })
})

//李帅
/******************************老师修改班级名接口*******************************/
//请求方式：例http://127.0.0.1:8999/reviseClassName?classId=1&className=班级8
//功能：修改班级名
//需要参数：班级编号，班级名
//返回值： code：0成功
httpServer.get('/reviseClassName', (req, res) => {
    console.log(req.query);
    ReqTclass.ReviseClassName(req.query, result => { //修改班级名
        if (result == 1) {
            res.send({
                code: 0
            }); //修改成功
        }
    })
})

//李帅
/******************************老师修改班级成绩管理信息*******************************/
//请求方式：例http://127.0.0.1:8999/reviseClassMessage?classId=1&proportion=70,30&absence=5&bonus=2
//功能：修改班级成绩管理信息
//需要参数：班级编号，成绩比例（proportion=80,20英文逗号），缺勤一次扣的分数，加分一次加的分数
//返回值： code：0成功
httpServer.get('/reviseClassMessage', (req, res) => {
    console.log(req.query);
    ReqTclass.ReviseClassMessage(req.query, result => { //修改班级成绩管理信息
        if (result == 1) {
            res.send({
                code: 0
            }); //修改成功
        }
    })
})

//李帅
/******************************老师查班级成员*******************************/
//请求方式：例http://127.0.0.1:8999/classMember?classId=1
//功能：查班级所有成员
//需要参数：班级编号
//返回值：班级所有成员  code：0成功
httpServer.get('/classMember', (req, res) => {
    console.log(req.query);
    ReqTclass.ClassMember(parseInt(req.query.classId), result => { //老师查班级成员
        res.send({
            code: 0,
            result
        }); //修改成功
    })
})

//李帅
/******************************老师查班级作业*******************************/
//请求方式：例http://127.0.0.1:8999/classTask?classId=1
//功能：查班级所有作业
//需要参数：班级编号
//返回值：班级所有作业  code：0成功
httpServer.get('/classTask', (req, res) => {
    console.log(req.query);
    ReqTclass.ClassTask(parseInt(req.query.classId), result => { //查班级所有作业
        res.send({
            code: 0,
            result
        });
    })
})

//李帅
/******************************老师查班级资料*******************************/
//请求方式：例http://127.0.0.1:8999/classMeans?classId=1
//功能：查班级所有资料
//需要参数：班级编号
//返回值：班级所有资料  code：-1失败，code：0成功
httpServer.get('/classMeans', (req, res) => {
    console.log(req.query);
    ReqTclass.ClassMeans(parseInt(req.query.classId), result => { //查班级所有资料
        res.send({
            code: 0,
            result
        });
    })
})

//李帅
/******************************老师查班级通知*******************************/
//请求方式：例http://127.0.0.1:8999/classInform?classId=1
//功能：查班级所有通知
//需要参数：班级编号
//返回值：班级所有通知 code：-1失败，code：0成功
httpServer.get('/classInform', (req, res) => {
    console.log(req.query);
    ReqTclass.ClassInform(parseInt(req.query.classId), result => { //查班级所有通知
        res.send({
            code: 0,
            result
        });
    })
})

//李帅
/******************************老师查班级具体作业完成情况*******************************/
//请求方式：例http://127.0.0.1:8999/classTaskCondition?taskId=1&classId=1
//功能：查具体作业情况
//需要参数：作业编号，班级编号
//返回值：姓名，学号，成绩（未提交返回空）  code：0成功  
httpServer.get('/classTaskCondition', (req, res) => {
    console.log(req.query); //parseInt(req.query)转int型
    ReqTclass.ClassTaskCondition(req.query, result => { //查班级具体作业完成情况
        res.send({
            code: 0,
            result
        });
    })
})

//李帅
/******************************老师查班级具体资料阅读情况*******************************/
//请求方式：例http://127.0.0.1:8999/classMeansCondition?classId=1&meansId=1
//功能：查班级具体资料阅读情况
//需要参数：班级编号,资料编号
//返回值：姓名，学号，阅读次数（未提交返回空）  code：0成功
httpServer.get('/classMeansCondition', (req, res) => {
    console.log(req.query);
    ReqTclass.ClassMeansCondition(req.query, result => { //查班级具体资料阅读情况
        res.send({
            code: 0,
            result
        });
    })
})
//李帅
/******************************老师查班级具体通知信息*******************************/
//请求方式：例http://127.0.0.1:8999/classInformCondition?informId=1
//功能：查班级具体通知信息
//需要参数：通知编号
//返回值：班级具体通知信息 code：0成功
httpServer.get('/classInformCondition', (req, res) => {
    console.log(req.query);
    ReqTclass.ClassInformCondition(parseInt(req.query.informId), result => { //查班级具体通知信息
        res.send({
            code: 0,
            result
        });
    })
})

//李帅
/******************************老师查班级成员作业平均分、资料阅读平均分*******************************/
//请求方式：例http://127.0.0.1:8999/classMissionGrade?classId=1(&studentId=1)
//功能：查班级成员作业平均分、资料阅读平均分
//需要参数：班级编号,(&studentId=1)(查单个成员情况时加上)
//返回值：姓名，学号，查班级成员作业平均分、资料阅读平均分 （一个都没做为空） code：0成功
httpServer.get('/classMissionGrade', (req, res) => {
    console.log(req.query);
    ReqTclass.ClassTaskQuantity(parseInt(req.query.classId), result => { //查班级作业总数
        let result1 = result;
        ReqTclass.ClassMeansQuantity(parseInt(req.query.classId), result => { //查班级资料总数
            let result2 = result;
            if (result != null && req.query.studentId == undefined) {
                ReqTclass.ClassMissionGrade(result1[0].classTasks, result2[0].classMeanss, parseInt(req.query.classId), result => { //查班级成员作业平均分、资料阅读平均分
                    if (result == -1 || result.length == 0)
                        res.send({
                            code: -1
                        });
                    else if (result.length != 0) {
                        if (result1[0].classTasks == 0) {
                            result.forEach((currentValue, index, arr) => {
                                result[index].taskGrade = 100
                            })
                        }
                        if (result1[0].classMeanss == 0) {
                            result.forEach((currentValue, index, arr) => {
                                result[index].meansGrade = 100
                            })
                        }
                        result.forEach((currentValue, index, arr) => {
                            if (result[index].taskGrade == null) {
                                result[index].taskGrade = 0
                            }
                        })
                        res.send({
                            code: 0,
                            result
                        });
                    }
                })
            } else {
                ReqTclassMember.ClassMissionGradeOne(result1, result2, parseInt(req.query.classId), parseInt(req.query.studentId), result => { //查班级某成员作业平均分、资料阅读平均分
                    if (result == -1 || result.length == 0)
                        res.send({
                            code: -1
                        });
                    else if (result.length != 0) {
                        if (result1[0].classTasks == 0 && result2[0].classMeanss == 0) {
                            result[0].taskGrade = 100
                            result[0].meansGrade = 100
                        } else if (result1[0].classTasks == 0 && result2[0].classMeanss != 0) {
                            result[0].taskGrade = 100
                        } else if (result1[0].classTasks != 0 && result2[0].classMeanss == 0) {
                            result[0].meansGrade = 100
                        } else if (result[0].taskGrade == null) {
                            result[0].taskGrade = 0
                            if (result2[0].classMeanss == 0) {
                                result[0].meansGrade = 100
                            }
                        }
                        res.send({
                            code: 0,
                            result
                        });
                    }
                })
            }
        })
    })
})

//李帅
/******************************老师查班级成员综合成绩评分规则*******************************/
//请求方式：例http://127.0.0.1:8999/classScoringRules?classId=1
//功能：查班级成员综合成绩评分规则
//需要参数：班级编号
//返回值：成绩比例，缺勤一次口的分数，加一次分的分数 code：0成功
httpServer.get('/classScoringRules', (req, res) => {
    console.log(req.query);
    ReqTclass.ClassScoringRules(parseInt(req.query.classId), result => { //查班级成员综合成绩评分规则
        if (result == -1 || result.length == 0)
            res.send({
                code: -1
            });
        else if (result.length != 0) {
            res.send({
                code: 0,
                result
            });
        }
    })
})

//李帅
/******************************老师查班级成员缺勤，加分情况*******************************/
//请求方式：例http://127.0.0.1:8999/classMemberPerformance?classId=1(&studentId=1)
//功能：查班级成员缺勤，加分情况
//需要参数：班级编号,(&studentId=1)(查单个成员情况时加上)
//返回值： code：0成功
httpServer.get('/classMemberPerformance', (req, res) => {
    console.log(req.query);
    if (req.query.studentId == undefined) {
        ReqTclass.ClassMemberPerformance(parseInt(req.query.classId), result => { //查班级成员缺勤，加分情况
            if (result == -1 || result.length == 0)
                res.send({
                    code: -1
                });
            else if (result.length != 0) {
                res.send({
                    code: 0,
                    result
                });
            }
        })
    } else {
        ReqTclassMember.ClassMemberPerformanceOne(req.query.studentId, req.query.classId, result => { //查班级某位成员缺勤，加分情况
            if (result == -1 || result.length == 0)
                res.send({
                    code: -1
                });
            else if (result.length != 0) {
                res.send({
                    code: 0,
                    result
                });
            }
        })
    }
})

//李帅
/******************************老师班级成员管理（移动）*******************************/
//请求方式：例http://127.0.0.1:8999/classMemberMove?classId=1&studentId=1&targetClassId=4
//功能：班级成员管理（移动）
//需要参数：班级编号,成员编号（学生编号）,目标班级编号（要填已有的）
//返回值： code：0成功 code：-1插入失败 
httpServer.get('/classMemberMove', (req, res) => {
    console.log(req.query);
    ReqTclassMember.ClassMemberMove(req.query, result => { //修改学生所属班级
        if (result == 1) {
            res.send({
                code: 0
            });
        }
    })
})

//李帅
/****************************** 老师班级成员管理（删除）*******************************/
//请求方式：例http://127.0.0.1:8999/classMemberDelete?classId=4&studentId=2
//功能：班级成员管理（删除）
//需要参数：班级编号,成员编号（学生编号）
//返回值： code：0成功(表中不存在也为0) result=1 
httpServer.get('/classMemberDelete', (req, res) => {
    console.log(req.query);
    ReqTclassMember.ClassMemberDelete(req.query, result => { //老师班级成员管理（删除）
        if (result == 1) {
            ReqTclassMember.ClassMemberAbsenceDelete(req.query, result => { //删除学生在班级中的缺勤事件
                if (result == 1) {
                    ReqTclassMember.ClassMemberBonusDelete(req.query, result => { //删除学生在班级中的加分事件
                        if (result == 1) {
                            res.send({
                                code: 0,
                                result
                            });
                        }
                    })
                }
            })
        }
    })
})

//李帅
/******************************老师查学生个人完成的作业数，观看的资料数 及 班级作业总数，班级资料总数*******************************/
//请求方式：例http://127.0.0.1:8999/classTaskQuantity?classId=1&studentId=1
//功能：查学生个人完成的作业数，观看的资料数 及 班级作业总数，班级资料总数
//需要参数：班级编号，学生编号
//返回值： code：0成功 + 学生个人完成的作业数，观看的资料数 及 班级作业总数，班级资料总数
httpServer.get('/classTaskQuantity', (req, res) => {
    console.log(req.query);
    let TaskQuantity = -1; //班级作业总数
    let MeansQuantity = -1; //班级资料总数
    let StuTaskQuantity = -1; //班级中学生完成的作业数
    let StuMeansQuantity = -1; //班级中学生观看的资料数
    ReqTclass.ClassTaskQuantity(parseInt(req.query.classId), result => { //查班级作业总数
        TaskQuantity = result[0].classTasks;
        ReqTclass.ClassMeansQuantity(parseInt(req.query.classId), result => { //查班级资料总数
            MeansQuantity = result[0].classMeanss;
            ReqTclassMember.ClassStuTaskQuantity(parseInt(req.query.classId), parseInt(req.query.studentId), result => { //查班级中学生完成的作业数
                StuTaskQuantity = result[0].StuClassTasks;
                ReqTclassMember.ClassStuMeansQuantity(parseInt(req.query.classId), parseInt(req.query.studentId), result => { //查班级中学生观看的资料数
                    StuMeansQuantity = result[0].StuClassMeanss;
                    if (TaskQuantity != -1 && MeansQuantity != -1 && StuTaskQuantity != -1 && StuMeansQuantity != -1) {
                        res.send({
                            code: 0,
                            TaskQuantity,
                            MeansQuantity,
                            StuTaskQuantity,
                            StuMeansQuantity
                        });
                    } else {
                        res.send({
                            code: -1
                        }); //出错
                    }
                })
            })
        })
    })
})


//李帅
/******************************老师查班级某学生作业成绩*******************************/
//请求方式：例http://127.0.0.1:8999/classStuTaskGrade?classId=1&studentId=1
//功能：查班级某学生作业成绩
//需要参数：班级编号,成员编号（学生编号）
//返回值： code：0成功(表中不存在也为0) 作业名，成绩 
httpServer.get('/classStuTaskGrade', (req, res) => {
    console.log(req.query);
    ReqTclassMember.ClassStuTaskGrade(req.query, result => { //查班级某学生作业成绩
        res.send({
            code: 0,
            result
        });
    })
})

//李帅
/******************************老师修改班级某学生作业成绩*******************************/
//请求方式：例http://127.0.0.1:8999/classStuTaskGradeRevise?taskId=1&studentId=1&grade=80
//功能：（post）修改班级某学生作业成绩
//需要参数：作业编号,成员编号（学生编号）,修改后的分数
//返回值： code：0成功(表中不存在也为0) 
httpServer.post('/classStuTaskGradeRevise', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    ReqTclassMember.ClassStuTaskGradeRevise(body, result => { //修改班级某学生作业成绩
        if (result == 1) {
            res.send({
                code: 0
            });
        }
    })
})

//李帅
/******************************老师查班级某学生资料阅读次数*******************************/
//请求方式：例http://127.0.0.1:8999/classStuMeansRead?classId=4&studentId=1
//功能：查班级某学生资料阅读次数
//需要参数：班级编号,成员编号（学生编号）
//返回值： code：0成功(表中不存在也为0) 资料名，阅读次数
httpServer.get('/classStuMeansRead', (req, res) => {
    console.log(req.query);
    ReqTclassMember.ClassStuMeansRead(req.query, result => { //查班级某学生资料阅读次数
        res.send({
            code: 0,
            result
        });
    })
})

//李帅
/******************************老师修改班级某学生资料阅读次数*******************************/
//请求方式：例http://127.0.0.1:8999/classStuMeansReadRevise?meansId=1&studentId=1&Read=20
//功能：修改班级某学生资料阅读次数
//需要参数：班级编号,成员编号（学生编号）,阅读次数
//返回值： code：0成功(表中不存在也为0) result=1 
httpServer.get('/classStuMeansReadRevise', (req, res) => {
    console.log(req.query);
    ReqTclassMember.ClassStuMeansReadRevise(req.query, result => { //修改班级某学生资料阅读次数
        if (result == 1) {
            res.send({
                code: 0
            });
        }
    })
})


//李帅
/******************************老师查班级成员缺勤事件*******************************/
//请求方式：例http://127.0.0.1:8999/classCheckMemberAbsence?classId=1&studentId=1
//功能：查班级成员缺勤事件
//需要参数：班级编号,成员编号（学生编号）
//返回值： code：0成功，事件添加时间，备注
httpServer.get('/classCheckMemberAbsence', (req, res) => {
    console.log(req.query);
    if (req.query.studentId == undefined || req.query.classId == undefined) {
        res.send({
            code: -2
        }); //输入参数错误
    } else {
        ReqTclassMember.ClassCheckMemberAbsence(req.query, result => { //查班级成员缺勤事件
            res.send({
                code: 0,
                result
            });
        })
    }
})

//李帅
/******************************老师查班级成员加分事件*******************************/
//请求方式：例http://127.0.0.1:8999/classCheckMemberBonus?classId=1&studentId=1
//功能：查班级成员加分事件
//需要参数：班级编号,成员编号（学生编号）
//返回值： code：0成功，事件添加时间，备注
httpServer.get('/classCheckMemberBonus', (req, res) => {
    console.log(req.query);
    if (req.query.studentId == undefined || req.query.classId == undefined) {
        res.send({
            code: -2
        }); //输入参数错误
    } else {
        ReqTclassMember.ClassCheckMemberBonus(req.query, result => { //查班级成员加分事件
            res.send({
                code: 0,
                result
            });
        })
    }

})

//李帅
/******************************老师删除班级成员缺勤事件*******************************/
//请求方式：post例http://127.0.0.1:8999/classDeleteMemberAbsence?classId=1&studentId=1&time=111
//功能：删除班级成员缺勤事件
//需要参数：班级编号,成员编号（学生编号），事件添加时间
//返回值： code：0成功(表中不存在也为0)  code：-1失败
httpServer.post('/classDeleteMemberAbsence', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.studentId == undefined ||
        body.classId == undefined ||
        body.time == undefined) {
        res.send({
            code: -2
        }); //输入参数错误
    } else {
        ReqTclassMember.ClassDeleteMemberAbsence(body, result => { //删除班级成员缺勤事件
            if (result == 1) {
                ReqTclassMember.ClassCheckMemberAbsenceQuantity(body, result => { //查班某级成员缺勤事件个数
                    if (result == -1) {
                        res.send({
                            code: -1
                        });
                    } else {
                        let result1 = result
                        ReqTclassMember.ClassReviseMemberAbsenceQuantitySql(result1[0].absenceQuantity, body, result => { //修改某级成员缺勤事件个数（学生班级关系表）
                            if (result == 1) {
                                res.send({
                                    code: 0
                                });
                            } else {
                                res.send({
                                    code: -1
                                });
                            }
                        })
                    }

                })
            } else {
                res.send({
                    code: -1
                });
            }
        })
    }
})

//李帅
/******************************老师删除班级成员加分事件*******************************/
//请求方式：post例http://127.0.0.1:8999/classDeleteMemberBonus?classId=1&studentId=1&time=111
//功能：删除班级成员加分事件
//需要参数：班级编号,成员编号（学生编号），事件添加时间
//返回值： code：0成功(表中不存在也为0) code：-1失败
httpServer.post('/classDeleteMemberBonus', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log();
    if (body.studentId == undefined ||
        body.classId == undefined ||
        body.time == undefined) {
        res.send({
            code: -2
        }); //输入参数错误
    } else {
        ReqTclassMember.ClassDeleteMemberBonus(body, result => { //删除班级成员加分事件
            if (result == 1) {
                ReqTclassMember.ClassCheckMemberBonusQuantity(body, result => { //查班某级成员加分事件个数
                    if (result == -1) {
                        res.send({
                            code: -1
                        });
                    } else {
                        let result1 = result
                        ReqTclassMember.ClassReviseMemberBonusQuantitySql(result1[0].bonusQuantity, body, result => { //修改班某级成员加分事件个数（学生班级关系表）
                            if (result == 1) {
                                res.send({
                                    code: 0
                                });
                            } else {
                                res.send({
                                    code: -1
                                });
                            }
                        })
                    }

                })
            } else {
                res.send({
                    code: -1
                });
            }
        })
    }
})

//李帅
/******************************老师添加班级成员加分事件*******************************/
//请求方式：post例http://127.0.0.1:8999/classCreateMemberBonus?classId=1&studentId=1&time=111&remarks=
//功能：添加班级成员加分事件
//需要参数：班级编号,成员编号（学生编号），事件添加时间,备注（可为空）
//返回值： code：0成功(表中不存在也为0) code：-1失败
httpServer.post('/classCreateMemberBonus', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.studentId == undefined ||
        body.classId == undefined ||
        body.time == undefined ||
        body.remarks == undefined) {
        res.send({
            code: -2
        }); //输入参数错误
    } else {
        ReqTclassMember.ClassCreateMemberBonus(body, result => { //添加班级成员加分事件
            if (result == 1) {
                ReqTclassMember.ClassCheckMemberBonusQuantity(body, result => { //查班某级成员加分事件个数
                    if (result == -1) {
                        res.send({
                            code: -1
                        });
                    } else {
                        let result1 = result
                        ReqTclassMember.ClassReviseMemberBonusQuantitySql(result1[0].bonusQuantity, body, result => { //修改班某级成员加分事件个数（学生班级关系表）
                            if (result == 1) {
                                ReqTclassMember.StuStudyAchievement(body.classId, body.studentId, result => { //计算学生综合成绩
                                    if (result == -1) {
                                        res.send({
                                            code: -1
                                        });
                                    } else {
                                        res.send({
                                            code: 0
                                        });
                                    }

                                })
                            } else {
                                res.send({
                                    code: -1
                                });
                            }
                        })
                    }

                })
            } else {
                res.send({
                    code: -1
                });
            }
        })
    }
})

//李帅
/******************************老师添加班级成员缺勤事件*******************************/
//请求方式：post例http://127.0.0.1:8999/classCreateMemberAbsence?classId=1&studentId=1&time=111&remarks=
//功能：添加班级成员缺勤事件
//需要参数：班级编号,成员编号（学生编号），事件添加时间,备注（可为空）
//返回值： code：0成功(表中不存在也为0) code：-1失败
httpServer.post('/classCreateMemberAbsence', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.studentId == undefined ||
        body.classId == undefined ||
        body.time == undefined ||
        body.remarks == undefined) {
        res.send({
            code: -2
        }); //输入参数错误
    } else {
        ReqTclassMember.ClassCreateMemberAbsence(body, result => { //添加班级成员缺勤事件
            if (result == 1) {
                ReqTclassMember.ClassCheckMemberAbsenceQuantity(body, result => { //查班某级成员缺勤事件个数
                    if (result == -1) {
                        res.send({
                            code: -1
                        });
                    } else {
                        let result1 = result
                        ReqTclassMember.ClassReviseMemberAbsenceQuantitySql(result1[0].absenceQuantity, body, result => { //修改某级成员缺勤事件个数（学生班级关系表）
                            if (result == 1) {
                                ReqTclassMember.StuStudyAchievement(body.classId, body.studentId, result => { //计算学生综合成绩
                                    if (result == -1) {
                                        res.send({
                                            code: -1
                                        });
                                    } else {
                                        res.send({
                                            code: 0
                                        });
                                    }

                                })
                            } else {
                                res.send({
                                    code: -1
                                });
                            }
                        })
                    }

                })
            } else {
                res.send({
                    code: -1
                });
            }
        })
    }
})

//李帅
/******************************老师查创建了的作业**************** ****/
//请求方式：例http://127.0.0.1:8999/checkTeacherCreateTask?phone=17877778883
//功能：老师查创建了的作业
//需要参数：老师电话
//返回值： code：0成功 作业编号，作业名，作业创建时间
httpServer.get('/checkTeacherCreateTask', (req, res) => {
    console.log(req.query);
    if (req.query.phone == undefined) {
        res.send({
            code: -2
        }); //输入参数错误
    } else {
        ReqTeacher.CheckTeacher(req.query, result => { //查老师id
            if (result != -1 && result != null) {
                let teacherId = result[0].tea_id;
                ReqTrelease.CheckTeacherCreateTask(teacherId, result => { //老师查创建了的作业
                    if (result == -1) {
                        res.send({
                            code: -1
                        });
                    } else {
                        res.send({
                            code: 0,
                            result
                        });
                    }
                })
            } else if (result != -1 && result == null) {
                res.send({
                    code: -3
                }); //电话不存在
            } else {
                res.send({
                    code: -1
                });
            }
        })
    }
})


//李帅
/******************************老师发布作业********************/
//请求方式：post例http://127.0.0.1:8999/teacherPublishTask?taskId=1&classId=4&taskBeginTime=2020-20-21 22:22:22&taskEndTime=2020-20-22 22:22:22
//功能：老师发布作业
//需要参数：作业编号，班级编号，作业发布日期,作业截止日期
//返回值： code：0成功 code: -1失败或作业已发布到该班
httpServer.post('/teacherPublishTask', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.taskId != undefined && body.classId != undefined && body.taskBeginTime != undefined &&
        body.taskEndTime != undefined) {
        ReqTrelease.TeacherPublishTask(body, result => { //老师发布作业
            if (result == -1) {
                res.send({
                    code: -1
                });
            } 
            else if(result == -11 ){//重复发布
                res.send({code: -11 });
            }else {
                res.send({
                    code: 0
                });
            }
        })

    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})



//李帅
/******************************老师删除发布某班级的作业********************/
//请求方式：post例http://127.0.0.1:8999/deletePublishTask?taskId=1&classId=4
//功能：删除发布某班级的作业
//需要参数：作业编号，班级编号
//返回值： code：0成功 code: -1失败
httpServer.post('/deletePublishTask', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.taskId != undefined && body.classId != undefined) {
        ReqTrelease.DeletePublishTask(body, result => { //删除发布某班级的作业
            if (result == -1) {
                res.send({
                    code: -1
                });
            } else {
                res.send({
                    code: 0
                });
            }
        })

    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师删除作业********************/
//请求方式：post例http://127.0.0.1:8999/deleteTask?taskId=3
//功能：删除作业
//需要参数：作业编号
//返回值： code：0成功 code: -1失败 code: -2输入参数错误
httpServer.post('/deleteTask', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.taskId != undefined) {
        ReqTrelease.DeleteTask(body, result => { //删除作业
            if (result == -1) {
                res.send({
                    code: -1
                });
            } else {
                res.send({
                    code: 0
                });
            }
        })

    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师查创建了的资料**************** ****/
//请求方式：例http://127.0.0.1:8999/checkTeacherCreateMeans?phone=17877778883(&meansId=1)
//功能：老师查创建了的资料
//需要参数：老师电话 （查具体资料时加上&meansId=1资料编号）
//返回值： code：0成功 资料编号，资料名，资料创建时间 （查具体资料：资料编号，资料名，资料地址，资料创建时间，教师编号）
httpServer.get('/checkTeacherCreateMeans', (req, res) => {
    console.log(req.query);
    if (req.query.phone != undefined && req.query.meansId == undefined) {
        ReqTeacher.CheckTeacher(req.query, result => { //查老师id
            if (result != -1 && result != null) {
                let teacherId = result[0].tea_id;
                ReqTrelease.CheckTeacherCreateMeans(teacherId, result => { //老师查创建了的资料
                    if (result == -1) {
                        res.send({
                            code: -1
                        });
                    } else {
                        res.send({
                            code: 0,
                            result
                        });
                    }
                })
            } else if (result != -1 && result == null) {
                res.send({
                    code: -3
                }); //电话不存在
            } else {
                res.send({
                    code: -1
                });
            }
        })
    } else if (req.query.phone != undefined && req.query.meansId != undefined) {
        ReqTeacher.CheckTeacher(req.query, result => { //查老师id
            if (result != -1 && result != null) {
                let teacherId = result[0].tea_id;
                ReqTrelease.CheckTeacherCreateMeansOne(teacherId, parseInt(req.query.meansId), result => {
                    //老师查具体资料
                    if (result == -1) {
                        res.send({
                            code: -1
                        });
                    } else {
                        res.send({
                            code: 0,
                            result
                        });
                    }
                })
            } else if (result != -1 && result == null) {
                res.send({
                    code: -3
                }); //电话不存在
            } else {
                res.send({
                    code: -1
                });
            }
        })
    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师创建资料**************** ****/
//请求方式：post例http://127.0.0.1:8999/teacherCreateMeans?meansName=经济&meansUrl=http://&meansTime=112&phone=17877778883
//功能：老师创建资料
//需要参数：资料名，资料地址，资料创建时间，教师电话
//返回值： code：0成功 
httpServer.post('/teacherCreateMeans', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.phone != undefined && body.meansName != undefined &&
        body.meansUrl != undefined && body.meansTime != undefined) {
        ReqTeacher.CheckTeacher(body, result => { //查老师id
            if (result != -1 && result != null) {
                let teacherId = result[0].tea_id;
                ReqTrelease.TeacherCreateMeans(body, teacherId, result => { //老师创建资料
                    if (result == 1) {
                        res.send({
                            code: 0
                        });
                    } else {
                        res.send({
                            code: -1
                        });
                    }
                })
            } else if (result != -1 && result == null) {
                res.send({
                    code: -3
                }); //电话不存在
            } else {
                res.send({
                    code: -1
                });
            }
        })
    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师发布资料********************/
//请求方式：post例http://127.0.0.1:8999/teacherPublishMeans?meansId=1&classId=4&meansBeginTime=2020-20-21 22:22:22
//功能：老师发布资料
//需要参数：资料编号，班级编号，资料发布日期
//返回值： code：0成功 code: -1失败或资料已发布到该班
httpServer.post('/teacherPublishMeans', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.meansId != undefined && body.classId != undefined && body.meansBeginTime != undefined) {
        ReqTrelease.TeacherPublishMeans(body, result => { //老师发布资料
            if (result == -1) {
                res.send({
                    code: -1
                });
            }
            else if(result == -11 ){//重复发布
                res.send({code: -11 });
            } else {
                res.send({
                    code: 0
                });
            }
        })

    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师删除发布某班级的资料********************/
//请求方式：post例http://127.0.0.1:8999/deletePublishMeans?meansId=1&classId=4
//功能：删除发布某班级的资料
//需要参数：资料编号，班级编号
//返回值： code：0成功 code: -1失败
httpServer.post('/deletePublishMeans', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.meansId != undefined && body.classId != undefined) {
        ReqTrelease.DeletePublishMeans(body, result => { //删除发布某班级的资料
            if (result == -1) {
                res.send({
                    code: -1
                });
            } else {
                res.send({
                    code: 0
                });
            }
        })

    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师删除资料********************/
//请求方式：post例http://127.0.0.1:8999/deleteMeans?meansId=1
//功能：删除资料
//需要参数：资料编号
//返回值： code：0成功 code: -1失败 code: -2输入参数错误
httpServer.post('/deleteMeans', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.meansId != undefined) {
        ReqTrelease.DeleteMeans(body, result => { //删除资料
            if (result == -1) {
                res.send({
                    code: -1
                });
            } else {
                res.send({
                    code: 0
                });
            }
        })

    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师查创建了的通知**************** ****/
//请求方式：例http://127.0.0.1:8999/checkTeacherCreateInform?phone=17877778883(&informId=1)
//功能：老师查创建了的通知
//需要参数：老师电话 （查具体通知时加上&meansId=1资料编号）
//返回值： code：0成功 code: -1失败 code: -2输入参数错误 code: -3电话不存在
//通知编号，通知名，通知创建时间 （查具体通知：通知编号，通知名，作者，内容，通知创建时间，教师编号）
httpServer.get('/checkTeacherCreateInform', (req, res) => {
    console.log(req.query);
    if (req.query.phone != undefined && req.query.informId == undefined) {
        ReqTeacher.CheckTeacher(req.query, result => { //查老师id
            if (result != -1 && result != null) {
                let teacherId = result[0].tea_id;
                ReqTrelease.CheckTeacherCreateInform(teacherId, result => { //老师查创建了的通知
                    if (result == -1) {
                        res.send({
                            code: -1
                        });
                    } else {
                        res.send({
                            code: 0,
                            result
                        });
                    }
                })
            } else if (result != -1 && result == null) {
                res.send({
                    code: -3
                }); //电话不存在
            } else {
                res.send({
                    code: -1
                });
            }
        })
    } else if (req.query.phone != undefined && req.query.informId != undefined) {
        ReqTeacher.CheckTeacher(req.query, result => { //查老师id
            if (result != -1 && result != null) {
                let teacherId = result[0].tea_id;
                ReqTrelease.CheckTeacherCreateInformOne(teacherId,
                    parseInt(req.query.informId), result => { //老师查具体通知
                        if (result == -1) {
                            res.send({
                                code: -1
                            });
                        } else {
                            res.send({
                                code: 0,
                                result
                            });
                        }
                    })
            } else if (result != -1 && result == null) {
                res.send({
                    code: -3
                }); //电话不存在
            } else {
                res.send({
                    code: -1
                });
            }
        })

    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师创建通知********************/
//请求方式：post例http://127.0.0.1:8999/teacherCreateInform?informName=阿斯顿&informAuthor=孙老师&informContent=速度dd&informTime=112&phone=17877778883
//功能：老师创建通知
//需要参数：通知名，作者，内容，通知创建时间，教师电话
//返回值： code：0成功 code：-2输入参数错误 code：-3电话不存在
httpServer.post('/teacherCreateInform', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.phone != undefined && body.informName != undefined &&
        body.informContent != undefined && body.informTime != undefined && body.informAuthor != undefined) {
        ReqTeacher.CheckTeacher(body, result => { //查老师id
            if (result != -1 && result != null) {
                let teacherId = result[0].tea_id;
                ReqTrelease.TeacherCreateInform(body, teacherId, result => { //老师创建通知
                    if (result == -1) {
                        res.send({
                            code: -1
                        });
                    } else {
                        res.send({
                            code: 0
                        });
                    }
                })
            } else if (result != -1 && result == null) {
                res.send({
                    code: -3
                }); //电话不存在
            } else {
                res.send({
                    code: -1
                });
            }
        })
    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师发布通知********************/
//请求方式：post例http://127.0.0.1:8999/teacherPublishInform?informId=1&classId=4&informBeginTime=2020-20-21 22:22:22
//功能：老师发布通知
//需要参数：通知编号，班级编号，通知发布日期
//返回值： code：0成功 code: -1失败或通知已发布到该班
httpServer.post('/teacherPublishInform', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.informId != undefined && body.classId != undefined &&
        body.informBeginTime != undefined) {
        ReqTrelease.TeacherPublishInform(body, result => { //老师发布通知
            if (result == -1) {
                res.send({
                    code: -1
                });
            }
            else if(result == -11 ){//重复发布
                res.send({code: -11 });
            } else {
                res.send({
                    code: 0
                });
            }
        })

    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师删除发布某班级的通知********************/
//请求方式：post例http://127.0.0.1:8999/deletePublishInform?informId=1&classId=4
//功能：删除发布某班级的通知
//需要参数：通知编号，班级编号
//返回值： code：0成功 code: -1失败
httpServer.post('/deletePublishInform', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.informId != undefined && body.classId != undefined) {
        ReqTrelease.DeletePublishInform(body, result => { //删除发布某班级的通知
            if (result == -1) {
                res.send({
                    code: -1
                });
            } else {
                res.send({
                    code: 0
                });
            }
        })

    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师删除通知********************/
//请求方式：post例http://127.0.0.1:8999/deleteInform?informId=1
//功能：删除通知
//需要参数：通知编号
//返回值： code：0成功 code: -1失败
httpServer.post('/deleteInform', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.informId != undefined) {
        ReqTrelease.DeleteInform(body, result => { //删除通知
            if (result == -1) {
                res.send({
                    code: -1
                });
            } else {
                res.send({
                    code: 0
                });
            }
        })

    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师创建具体作业********************/
//请求方式：post例http://127.0.0.1:8999/teacherCreateTask?
//phone=17877778883&textName=111&createTime=2021&choice=[]&choices=[]&judgment=[]&qAndA=[]
//功能：创建具体作业
//需要参数：老师电话,作业名,单选题数组,多选题数组,判断题数组,填空题数组
//返回值： code：0成功 code：-1失败 code：-2输入参数错误 code：-3电话不存在
httpServer.post('/teacherCreateTask', jsonParser, (req, res) => {
    const body = Object.assign({}, req.body)
    console.log(body);
    if (body.phone == undefined || body.textName == undefined ||
        body.choice == undefined || body.choices == undefined ||
        body.judgment == undefined || body.qAndA == undefined ||
        body.createTime == undefined) {
        res.send({
            code: -2
        }); //输入参数错误
    } else {

        ReqTeacher.CheckTeacher(req.body, result => { //
            if (result != -1 && result.length != 0) {
                //老师创建作业
                let teacherId = result[0].tea_id;

                ReqTrelease.CheckRepeatTask(teacherId,
                    req.body.textName, req.body.createTime, result => {
                        if (result.length == 0) { //存入四类题目内容
                            ReqTrelease.TeacherCreateTask(teacherId,
                                req.body.textName, req.body.createTime, result => {
                                    if (result == 1) { //存入四类题目内容
                                        ReqTrelease.CreateAllQuestion(req.body, teacherId, result => { //存储题目
                                            if (result == 1) {
                                                res.send({
                                                    code: 0
                                                });
                                            } else {
                                                res.send({
                                                    code: -1
                                                });
                                            }
                                        })
                                    } else {
                                        res.send({
                                            code: -1
                                        }); //创建失败
                                    }
                                })
                        } else {
                            res.send({
                                code: -5
                            }); //作业重复
                        }
                    })
            } else if (result != -1 && result.length == 0) {
                res.send({
                    code: -3
                }); //电话不存在
            } else {
                res.send({
                    code: -1
                });
            }
        })
    }
})


//李帅
/******************************老师查看具体作业********************/
//请求方式：例http://127.0.0.1:8999/teacherCheckTaskContent?taskId=1
//功能：老师查看具体作业
//需要参数：作业编号
//返回值： code：0成功 单选题数组,多选题数组,判断题数组,填空题数组 分别为result[0]  [1]  [2]  [3]
httpServer.get('/teacherCheckTaskContent', (req, res) => {
    console.log(req.query);
    if (req.query.taskId != undefined) {
        ReqTrelease.CheckTaskQuestion(req.query.taskId, result => { //查看具体作业的题目
            if (result == -1) {
                res.send({
                    code: -1
                }); //操作失败
            } else {
                console.log(result);
                let p = result //具体作业的题目
                ReqTrelease.CheckTaskOptionList(req.query.taskId, result => { //查看具体作业的选项
                    if (result == -1) {
                        res.send({
                            code: -1
                        }); //操作失败
                    } else {
                        console.log(result);
                        let o = result //具体作业的选项
                        ReqTrelease.TeacherCheckTaskContent(p, o, result => { //整理题目与选项
                            if (result == -1) {
                                res.send({
                                    code: -1
                                }); //操作失败
                            } else {
                                console.log(result[1]);
                                res.send({
                                    code: 0,
                                    result
                                });
                            }
                        })
                    }
                })
            }
        })

    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师查看老师创建的班级********************/
//请求方式：例http://127.0.0.1:8999/CheckTeacherCreateclass?phone=17877778883
//功能：删除发布某班级的通知
//需要参数：通知编号，班级编号
//返回值： code：0成功 code: -1失败
httpServer.get('/CheckTeacherCreateclass', (req, res) => {

    if (req.query.phone != undefined) {
        ReqTrelease.CheckTeacherCreateclass(req.query.phone, result => { //查看老师创建的班级
            if (result == -1) {
                res.send({
                    code: -1
                });
            } else {
                res.send({
                    code: 0,
                    result
                });
            }
        })
    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})


//李帅
/******************************老师查学生个人所有情况********************/
//请求方式：例http://127.0.0.1:8999/stuStudyInformation?classId=1&studentId=1
//功能：老师查学生个人所有情况
//需要参数：班级编号，学生编号
//返回值： code: 0 成功，result[0]:姓名，学号，综合成绩  result[1]:班级作业总数，班级资料总数，学生作业完成数，学生资料阅读篇数
//result[2]:姓名，学号，学生作业平均分，学生阅读平均分  result[3]:姓名，学号，缺席次数，加分次数
//code: -2 输入参数错误  code: -1 操作失败
httpServer.get('/stuStudyInformation', (req, res) => {

    if (req.query.classId != undefined && req.query.studentId != undefined) {
        ReqTclassMember.StuStudyInformation(req.query.classId, req.query.studentId, result => { //
            if (result == -1) {
                res.send({
                    code: -1
                });
            } else {
                res.send({
                    code: 0,
                    result
                });
            }
        })
    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})
//李帅
/******************************查班级所有学生综合成绩（只查综合成绩）********************/
//请求方式：例http://127.0.0.1:8999/checkStuAchievementOne?classId=1
//功能：查班级所有学生综合成绩（只查综合成绩）
//需要参数：班级编号
//返回值： code: 0 成功，姓名，学号，综合成绩 code: -2 输入参数错误  code: -1 操作失败
httpServer.get('/checkStuAchievementOne', (req, res) => {

    if (req.query.classId != undefined) {
        ReqTclassMember.CheckStuAchievementOne(req.query.classId, result => { //查班级所有学生综合成绩（只查综合成绩）
            if (result == -1) {
                res.send({
                    code: -1
                });
            } else {
                res.send({
                    code: 0,
                    result
                });
            }
        })
    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})
//李帅
/******************************查班级所有学生综合成绩(包括作业、阅读平均分)********************/
//请求方式：例http://127.0.0.1:8999/checkStuAchievement?classId=1
//功能：查班级所有学生综合成绩(包括作业、阅读平均分)
//需要参数：班级编号classId
//返回值： code 0 成功 ("name": "陆凯","no": "A21112223333","taskGrade": 90,"meansGrade": 0,"achievement": 63)
//姓名，学号，作业平均分，阅读平均分，综合成绩 code -2 参数错误  code -1 操作失败
httpServer.get('/checkStuAchievement', (req, res) => {

    if (req.query.classId != undefined) {
        ReqTclassMember.CheckStuAchievement(req.query.classId, result => { //查看老师创建的班级
            if (result == -1) {
                res.send({
                    code: -1
                });
            } else {
                res.send({
                    code: 0,
                    result
                });
            }
        })
    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

//李帅
/******************************老师查题目正确率********************/
//请求方式：例http://127.0.0.1:8999/CheckCorrectRate?taskId=1&classId=1
//功能：查题目正确率
//需要参数：作业编号，班级编号
//返回值：code -2 参数错误  code -1 操作失败 code 0 成功 result:
//作业类型"questionType": 0, 作业序号"questionIndex": 1, 未完成人数"uncomplete": 2,
//做错人数"workerr": 0, 正确率"accuracy": "33%"
httpServer.get('/CheckCorrectRate', (req, res) => {

    if (req.query.taskId != undefined && req.query.classId != undefined ) {
        ReqTrelease.CheckCorrectRate(req.query.taskId,req.query.classId, result => {//
            if (result == -1) {
                res.send({
                    code: -1
                });
            } else {
                res.send({
                    code: 0,
                    result
                });
            }
        })
    } else {
        res.send({
            code: -2
        }); //输入参数错误
    }
})

/***************************************************************************************************************
 ****************************************************************************************************************
 ***************************************************wy***********************************************************
 ****************************************************************************************************************
 ****************************************************************************************************************
 */


// 作者: 王宇
// getcourselist接口: 输入学生的手机号码[tel]
// 返回: 一个CourseList数组(其中包括了课程的编号,班级编号, 课程的名称, 授课教师)
httpServer.get('/getcourselist', (req, res) => {
    stuCourse.GetCourse(req.query, courseList => {
        console.log('getcourselist接口响应', new Date().toLocaleTimeString())
        if (courseList != -1) {
            res.send({
                code: 0,
                courseList
            })
        } else {
            res.send({
                code: -1
            })
        }
    })
})

// 作者: 王宇
// gettasklist接口: 输入 手机号[tel], 班级编号[classid]
// 返回: 一个TaskList数组(其中包括了试卷的编号, 试卷的title, 成绩, 发布日期, 截止日期)
// 修改表结构后需要修改
httpServer.get('/gettasklist', (req, res) => {
    console.log('gettasklist接口响应', new Date().toLocaleTimeString())
    stuTask.GetTaskList(req.query, taskList => {
        if (taskList != -1) {
            res.send({
                code: 0,
                taskList
            })
        } else {
            res.send({
                code: -1
            })
        }
    })
})

// 作者: 王宇
// getinformationlist接口: 输入 手机号[tel], 班级编号[classid]
// 返回: 一个InformList数组(其中包括了通知编号, 通知的title, 通知发布日期)
// 修改表结构后需要修改
httpServer.get('/getinformationlist', (req, res) => {
    console.log('getinformationlist接口响应')
    stuinform.GetInformationList(req.query, informationlist => {
        if (informationlist != -1) {
            res.send({
                code: 0,
                informationlist
            })
        } else {
            res.send({
                code: -1
            })
        }
    })
})

// 作者: 王宇
// getmeanslist接口: 输入 手机号[tel], 班级编号[classid]
// 返回: 一个meansList数组(其中包括了资料的编号, 资料的title, 阅读次数, 资料发布日期 )
// 表结构修改后需要修改
httpServer.get('/getmeanslist', (req, res) => {
    console.log('getmeanslist接口响应', new Date().toLocaleTimeString())
    stumeans.GetMeansList(req.query, meanslist => {
        if (meanslist != -1) {
            res.send({
                code: 0,
                meanslist
            })
        } else {
            res.send({
                code: -1
            })
        }
    })
})

// 作者: 王宇
// getinformation接口: 输入 通知编号[informid]
// 返回: 通知的具体内容
httpServer.get('/getinformation', (req, res) => {
    console.log('getinformation接口响应', new Date().toLocaleTimeString())
    stuinform.GetInformation(req.query, infor => {
        if (infor != -1) {
            res.send({
                code: 0,
                infor
            })
        } else {
            res.send({
                code: -1
            })
        }
    })
})

// 作者:王宇
// getmeansurl接口: 输入 资料编号[meansid]
// 返回: 资料名, 资料url
httpServer.get('/getmeansurl', (req, res) => {
    console.log('getmeansurl接口响应', new Date().toLocaleTimeString())
    stumeans.GetMeansUrl(req.query, meansurl => {
        if (meansurl != -1) {
            res.send({
                code: 0,
                meansurl
            })
        } else {
            res.send({
                code: -1
            })
        }
    })
})

// 作者: 王宇   
// gettask接口: 输入 试卷编号  输出: 带有选项信息的若干个题目信息
// 返回: 试题列表
httpServer.get('/gettask', (req, res) => {
    console.log('gettask接口响应', new Date().toLocaleTimeString())
    stuTask.addQuestionOptionList(req.query, data => {
        if (data != -1) {
            res.send({
                code: 0,
                data
            })
        } else {
            res.send({
                code: -1
            })
        }
    })
})

// 作者: 王宇
// 描述: 处理客户端提交的阅读资料请求
// 输入:  手机号[tel], 资料编号[meansid]
httpServer.post('/recodeMeans', jsonParser, (req, res) => {
    console.log('recodeMeans接口响应', new Date().toLocaleTimeString())
    stumeans.readMeans(req.body, async data => {
        if (data != -1) {
            let studentId = await stuTask.getStuid(req.body.tel)
            let classId = 1
            console.log('studentId;', studentId)
            res.send({code: 0})
            // ReqTclassMember.StuStudyAchievement(1, studentId, result => { //计算学生综合成绩
            //     if (result == -1) {
            //         res.send({
            //             code: -1
            //         });
            //     } else {
            //         res.send({
            //             code: 0
            //         })
            //     }

            // })

        } else {
            res.send({
                code: -1
            })
        }
    })
})

// 作者: 王宇
// 描述: 处理客户端提交的阅读通知请求
// 输入: 手机号[tel], 通知编号[informId]
httpServer.post('/readInform', jsonParser, (req, res) => {
    console.log('readInform接口响应', new Date().toLocaleTimeString())
    stuinform.readInformation(req.body, async data => {
        let studentId = await stuTask.getStuid(req.body.tel)
        let classId = 1
        if (data != -1) {
            res.send({
                code: 0
            })
            // ReqTclassMember.StuStudyAchievement(classId, studentId, result => { //计算学生综合成绩
            //     if (result == -1) {
            //         res.send({
            //             code: -1
            //         });
            //     } else {
            //         res.send({
            //             code: 0
            //         })
            //     }
            // })
        } else {
            res.send({
                code: -1
            })
        }
    })
})

// 描述: 学生删除通知操作
// 输入: 手机号[tel], 通知编号[informId]
httpServer.post('/stuDeleteInform', jsonParser, (req, res) => {
    console.log('stuDeleteInform接口响应', new Date().toLocaleTimeString())
    stuinform.deleteInformation(req.body, data => {
        if (data != -1) {
            res.send({
                code: 0
            })
        } else {
            res.send({
                code: -1
            })
        }
    })
})

// 作者: 王宇
// 描述: 处理客户端发起的"学生添加班级"请求
// 参数: 电话号, 班级码
// 返回值: 课程列表
httpServer.post('/stuaddclass', jsonParser, (req, res) => {
    console.log('stuaddclass接口响应', new Date().toLocaleTimeString())
    stuCourse.AddClass(req.body, data => {
        if(data == -1){
            res.send({
                code: -1,
                result: '失败'
            })
        }
        else{
            let obj = {code:0,result:'添加成功',data}
            console.log("发送给客户端的内容",obj)
            res.send(obj)
        }
    })
})

// 作者: 王宇
// 描述: 处理客户端发起的"提交试卷"请求: 给学生提交的试卷打分, 并将成绩录入数据库
// 参数: 电话号码, 试题相关信息(题目编号+)
// 返回值: 成绩
httpServer.post('/submittest', jsonParser, (req, res) => {
    console.log('submittest接口响应', new Date().toLocaleTimeString())
    const obj = Object.assign({}, req.body)
    // console.log(obj)
    stuTask.appraiseGrade(obj, data => {
        if (data != -1) {
            res.send({
                code: 0,
                grade: data
            })
        } else {
            res.send({
                code: -1
            })
        }
    })
})
// 重置通知状态接口（测试用）
// httpServer.get('/restartinform', (req, res) => {
//     stuinform.restartInform()
// })

// 作者:王宇
// 查看答题详情接口
// 需要的参数: tel, taskid
httpServer.get('/gettaskdetails', (req, res) => {
    console.log('gettaskdetails接口响应', new Date().toLocaleTimeString())
    stuTask.GetDetails(req.query, QuestionList => {
        if (QuestionList == 0) {
            res.send({
                code: -1,
                msg: '不存在有效成绩记录!'
            })
        } else {
            res.send({
                code: 0,
                QuestionList
            })
        }
    })
})




var myRequest = require("request");

// 作者:王宇
// 根据客户端发来的code, 向微信服务器请求openid
// 需要的参数: code
httpServer.get('/getopenid', (req, res) => {
    console.log('getopenid接口响应', new Date().toLocaleTimeString())
    let code = req.query.code
    let APPID = 'wx786886d4f4f0db4e'
    let APPSecret = 'c309a773a6346dd595f05d5a5c445193'
    console.log('客户端发来的code:', code)
    if (code == undefined) {
        res.send({
            code: -1
        })
    } else if (code != undefined) {
        let options = {
            url: "https://api.weixin.qq.com/sns/jscode2session",
            method: "POST",
            formData: {
                appid: APPID, //appid
                secret: APPSecret, //密钥，在小程序后台获取
                js_code: code, //用户code
                grant_type: "authorization_code",
            },
        };

        myRequest(options, (error, response, body) => {
            if (error) {
                //请求异常时，返回错误信息
                res.json({
                    status: "error"
                });
            } else {
                // console.log('body1:',body)
                let {openid} = eval("("+body+")")
                console.log('body2:',openid)
                res.end(openid)
            }
        });
    }
})

// 客户端获取oss签名
const MpUploadOssHelper = require("./uploadOssHelper.js");
httpServer.get('/getPostObjectParams', (req, res) => {
    console.log("getPostObjectParams接口被访问!", new Date().toLocaleTimeString());
    const mpHelper = new MpUploadOssHelper({
        accessKeyId: 'LTAI5tQTvWkonkAn1huBaJhE',
        accessKeySecret: 'coGpHrFgd0VqycA05F3Nxvm8ut6LDs',
        // 限制参数的生效时间，单位为小时，默认值为1。
        timeout: 1,
        // 限制上传文件大小，单位为MB，默认值为10。
        maxSize: 10,
    });

    // 生成参数。
    const params = mpHelper.createUploadParams();
    res.json(params);
})


// 保存学生的头像信息到数据库
httpServer.post('/sendAvatarUrl',(req,res)=>{
    console.log("sendAvatarUrl接口被访问!", new Date().toLocaleTimeString());
    stuinform.saveAvatarUrl(req.body, result=>{
        if(result == 1){
            console.log("头像保存成功!")
            res.send({code:0,result:"save success!"})
        }else{
            console.log("头像保存失败!")
            res.send({code:-1,result:"save fail!"})
        }
    })

})

// 向客户端发送学生的头像信息

function start() {
    httpServer.listen(8999, () => console.log("listen 8999"));
}
start(8999);