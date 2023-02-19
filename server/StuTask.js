// 作者: 王宇
// 创建文件日期: 2022.1.17
// 描述: 学生端试题相关类
// 接口:   查询学生的试卷List接口: 输入学生的手机号码, 课程编号;
//         查询成功返回一个TaskList数组(其中包括了试卷的编号, 试卷的title, 成绩, 发布日期, 截止日期)
//         查询失败返回{code: -1}

//         查询试卷内容接口: 输入试卷编号;
//         查询成功返回一个QuestionList数组(其中包括了题目id, 问题内容, 作答后的答案, 题目类型, QuestionOptionList(选项序号, 选项id, 选项内容))
//         查询失败返回{code: -1}


//         学生提交试题接口: 输入:电话, 试卷编号, QuestionList数组;
//         后台进行判分, 将用户编号,班级编号,试卷编号和成绩更新到作业学习情况表中
//         提交成功返回{code: 0}
//         提交失败返回{code: -1}

const Base = require('./Base')
// 根据班级编号获取试卷编号的列表
const GetTaskArrSql = "SELECT classtask.`ctas_tasid` FROM classtask WHERE classtask.`ctas_claid` = ?"
// 判断学生是否有该试卷的作答记录, 没有就插入一条成绩为-1的记录
const CheckStudentTaskSql = "CALL CheckStudentTask(?, ?)"
const GetTaskListSql = "SELECT ctas_tasid  AS taskNum, tas_name AS title, tstu_condition AS grade, ctas_begintime AS startTime, ctas_endtime AS endTime FROM classtask LEFT JOIN task ON task.`tas_id` = classtask.`ctas_tasid` LEFT JOIN taskstudent ON taskstudent.`tstu_tasid` = classtask.`ctas_tasid`  WHERE tstu_stuid = (SELECT student.stu_id FROM student WHERE student.stu_phone = ?) AND ctas_claid = ? "

const getTaskNumSql = "SELECT question.`que_id` AS questionId, question.`que_name` AS fldName, question.`que_answer` AS fldAnswer, question.`que_type` AS questionType, que_index FROM question WHERE question.`que_tasid` = ? ORDER BY  FIELD(questionType,0,1,3,2),que_index "
const getOptionListSql = "SELECT optionlist.`opt_id` as optionID, optionlist.`opt_option` as fldOptionText,  optionlist.`opt_index` as fldOptionIndex FROM optionlist WHERE optionlist.`opt_queid` = ? ORDER BY optionlist.`opt_queid`, optionlist.`opt_index` ASC"

//获取题目的类型
const getquestionTypeSql = "SELECT que_type FROM question WHERE que_id = ?"
// 判断题目和答案是否对应
const checkAnswerSql = "SELECT EXISTS(SELECT *FROM question WHERE que_id = ? AND que_answer =?) AS result"
// 记录学生的错题信息(输入tel, questionid, userAnswer)
const recodeErrorQuestionSql = "CALL recodeErrorQuestino(?,?,?)"
// 记录学生作答成绩
const writeGradeSql = "replace INTO taskstudent(tstu_stuid, tstu_tasid, tstu_condition, tstu_time) VALUE((SELECT student.`stu_id` FROM student WHERE student.`stu_phone` = ?),?,?,?) "
// 通过手机号获取学生编号
const getStuidSql = "SELECT student.stu_id FROM student WHERE student.stu_phone = ?"
// 记录提交的答案
const recodeOptionSql = "REPLACE INTO answerrecord(ans_stuid, que_id, userAnswer, submitTime, correct) VALUE(?,?,?,?,?)"
class task extends Base.Base {
    constructor() {
        super()
    }

    //输入电话号和班级编号,输出该学生该班级的试卷列表
    async GetTaskList(message, callback) {
        let TaskidArr = []   //该数组用来存放读取到的试卷编号列表
        await this.GetTaskArr(message.classid).then((value) => {
            TaskidArr = value
        })
        // console.log('TaskidArr:', TaskidArr)
        for (let i = 0; i < TaskidArr.length; i++) {
            await this.CheckStudentTask(message.tel, TaskidArr[i])
        }
        this.QueryMysql(GetTaskListSql, [message.tel, message.classid], results => {
            callback(results)
        })
    }

    // 查询作业学习情况表中, 是否存在学生这一试卷的学习记录, 如果不同时 存在用户编号和试卷编号则添加记录
    // 参数: 学生手机号, 试卷编号
    CheckStudentTask(tel, taskid) {
        return new Promise((resolvel, reject) => {
            this.QueryMysql(CheckStudentTaskSql, [tel, taskid], result => {
                resolvel(result[0])
                // console.log('taskid:', result[0])
            })
        })
    }

    //通过班级编号查询出试卷编号列表
    GetTaskArr(classid) {
        return new Promise((resolve, reject) => {
            this.QueryMysql(GetTaskArrSql, [classid], dataArr => {
                let taskidArr = []
                dataArr.forEach(element => {
                    taskidArr.push(element.ctas_tasid)
                });
                resolve(taskidArr)
            })
        })
    }

    //给questions对象中添加QuestionOptionList的值
    //message: { taskid: '1' }
    addQuestionOptionList(message, callback) {
        const p1 = new Promise((resolve, reject) => {
            this.getquestionBody(message.taskid, question => {
                let questionBody = question
                if (questionBody.length == 0) {
                    callback(questionBody) //返回一个空数组, 即表示该试卷存在, 但是该试卷内不存在题目
                }
                resolve(questionBody)
            })
        })

        const p2 = new Promise((resolve, reject) => {
            let questionlist = [] //最终返回给服务器的数组
            //下面的questionBody中是taskid为n的题干信息列表(未添加选项信息的状态)
            p1.then(async (questionBody) => {
                var arr = [] //该数组用于存放题目id
                questionBody.forEach(element => {
                    element.fldAnswer = null
                    if (element.questionType == 3) {
                        element.questionType = 0
                    }
                    arr.push(element.questionId)  // 向arr数组中填充题目编号
                });
                let longer = 0  // 记录有几道题目的选项信息添加完成
                for (let j = 0; j < arr.length; j++) {
                    await this.getOptionList(arr[j], options => {
                        // console.log('0000000', arr.indexOf(arr[j]))
                        let index = arr.indexOf(arr[j])  //options应当添加到questionBody中的第index个元素
                        questionBody[index]["QuestionOptionList"] = options
                        longer++  //选项信息添加完毕则longer++
                        // console.log(arr[j], ': ', questionBody)
                        // console.log(j)
                        if (longer == arr.length) {
                            resolve(questionBody)
                        }
                    })
                }
            })
        })

        p2.then((value) => {
            // console.log(value)
            callback(value) //将value返回给main.js
        })
    }

    //message: 题号  
    //描述: 输入题号获取选项信息.
    getOptionList(message, callback) {
        let que_type // 存放题目的类型
        let judgementoptionlist = [{
            optionID: 0,
            fldOptionText: '正确',
            fldOptionIndex: 1
        },
        {
            optionID: 0,
            fldOptionText: '错误',
            fldOptionIndex: 2
        }]
        let tiankongoptionlist = [{
            "fldOptionText": null,
            "fldOptionIndex": 0
        }]
        const qType = this.getquestionType(message)
        qType.then((value) => {
            que_type = value[0].que_type
            if (que_type == 2) {
                callback(tiankongoptionlist)
                return
            }
            if (que_type == 3) {
                callback(judgementoptionlist)
                return
            }
            this.QueryMysql(getOptionListSql, [message], QuestionOptionList => {
                // console.log('options:', QuestionOptionList)
                callback(QuestionOptionList)
            })
        })
    }

    getquestionType(questionid) {
        return new Promise((resolve, reject) => {
            let questionType = 0
            this.QueryMysql(getquestionTypeSql, [questionid], data => {
                // console.log('getquestionType中的data:', data)
                resolve(data)
            })
        })
    }
    //taskid: 试卷编号 
    //描述: 输入试卷编号, 获取题干信息.
    getquestionBody(message, callback) {
        this.QueryMysql(getTaskNumSql, [message], question => {
            callback(question)
        })
    }

    // 描述: 判断的学生的答案是否正确
    // 输入: 题号, 学生答案
    // 返回值: { questionId:题号, userAnswer:学生答案, state:状态(正确/错误) }
    checkAnswer(questionId, userAnswer) {
        return new Promise((resolve, reject) => {
            let outcome = {} // 待返回的对象
            outcome.questionId = questionId
            outcome.userAnswer = userAnswer
            this.QueryMysql(checkAnswerSql, [questionId, userAnswer], data => {
                // console.log('111', data[0].result == 1)
                let state = (data[0].result == 1)
                if (state) {
                    outcome.state = true
                } else {
                    outcome.state = false
                }
                resolve(outcome)
            })
        }).then(value => {
            return value
        })
    }

    // 描述: 记录学生成绩信息
    // 输入: 学生手机号, 试卷编号, 成绩, 作答时间
    writeGrade(tel, taskid, score, finishtime, callback) {
        this.QueryMysql(writeGradeSql, [tel, taskid, score, finishtime], data => {
            callback(data)
        })
    }



    // 描述: 记录学生的错题信息
    // 输入: 用户手机号, 题目编号, 学生的错误答案
    // 输出: 成功插入则返回result:1,  插入记录失败则返回result:-1
    recodeErrorQuestion(tel, questionId, userAnswer) {
        return new Promise((resolve, reject) => {
            this.QueryMysql(recodeErrorQuestionSql, [tel, questionId, userAnswer], data => {
                resolve(data[0].result)
            })
        })
    }


    // 描述:判断学生得分
    // 并记录学生的答题情况
    // 输入: req.body 
    async appraiseGrade(message, callback) {
        const questionList = message.QuestionList   //试卷的作答情况
        for (const key in questionList) {
            // 删除questionList中的选项信息(因为选项是array, 浅拷贝无法得到真实数据,只能得到数据类型, 后面的代码中没有用到这一部分数据, 索性删除该属性)
            delete questionList[key].QuestionOptionList;
        }
        // console.log(JSON.stringify(questionList))  //可以看出确实丢弃了选项信息
        const stuTel = message.tel                              // 学生的电话号码
        let stuid = await this.getStuid(stuTel)                 // 学生编号
        const taskid = message.fldGuid                          // 试卷编号
        const submitTime = message.submitTime                   // 学生提交试题的时间
        const score = await this.getScore(stuid, questionList, submitTime)         // 学生提交上来的试卷的成绩
        // console.log("score:", score)                         
        this.writeGrade(stuTel, taskid, score, submitTime, result => {
            // console.log('result', result)
            if (result == 1) {
                callback(score)
            } else (
                callback(-1)
            )
        })
    }




    // getScore
    // 返回: score
    async getScore(stuid, QuestionList, submitTime) {
        return new Promise(async (resolve, reject) => {
            const questionList = QuestionList
            let rightCount = 0                                      // 学生回答正确题目的数量
            const questionCount = QuestionList.length               // 试卷的总题目数量
            for (let i = 0; i < questionList.length; i++) {
                // income变量用来装checkAnswer方法返回的对象
                let income = await this.checkAnswer(questionList[i].questionId, questionList[i].fldAnswer)
                // console.log("income:", income)
                let params = {}
                params.stuid = stuid
                params.que_id = income.questionId
                params.userAnswer = (JSON.stringify(income.userAnswer))
                params.correct = JSON.stringify(income.state)
                params.submitTime = submitTime
                this.QueryMysql(recodeOptionSql, [params.stuid, params.que_id, params.userAnswer, params.submitTime, params.correct], result => { })
                if (income.state) {
                    rightCount++
                }
            }
            let grade = (rightCount / questionCount) * 100
            grade = grade.toFixed(2)
            resolve(grade)
        }).then((grade) => {
            return grade
        })
    }

    getStuid(stuPhone) {
        return new Promise((resolve, reject) => {
            this.QueryMysql(getStuidSql, [stuPhone], result => {
                // console.log(result[0].stu_id)
                resolve(result[0].stu_id)
            })
        }).then((stu_id) => {
            // console.log('22222',stu_id)
            return stu_id
        })
    }

    // 以下代码为增加查看错题详情时新增。******************************************************
    // SQL语句也加在下面。******************************************************

    // message中包含两个参数: tel, taskid
    // 如果有该学生的作答详情, 则返回题干信息、选项信息以及学生的作答答案
    // 1.判断该学生对该试卷的答题状态是否为"-1", "-1"则表示学生未答题, 直接callback("学生未作答")
    // 2.如果学生作答了, 则调用GetDetails方法, 查询作答详情
    async GetDetails(message, callback) {
        let QuestionList   // 最终返回给客户端的对象数组
        const taskid = message.taskid
        const tel = message.tel
        const stuid = await this.getStuid(tel)
        //如果不存在有效成绩记录则返回0
        if (await this.panduanState(stuid, taskid) == 0) {
            console.log('不存在有效成绩记录!打印在(stutask.GetDetails方法中)')
            callback(0)
            return
        }
        // StemInform 中存放题干信息[questionId, fldName, fldAnswer, questionType,textAnalyse,videoAnalys]
        let StemInform = await this.GetStemInform(taskid)  // 获取到试卷编号为taskid的题干信息
        for (let i = 0; i < StemInform.length; i++) {
            StemInform[i]["userAnswer"] = null
            // 如果使用GetUserAnswer方法正常返回了值, 那么就用返回值覆盖StemInform[i]["userAnswer"]的初始值null
            if (await this.GetUserAnswer(stuid, StemInform[i].questionId)) {
                let userAnswer = await this.GetUserAnswer(stuid, StemInform[i].questionId)
                StemInform[i]["userAnswer"] = userAnswer
            }
        }
        QuestionList = await this.AddOptionList(StemInform)  // 此时的QuestionList中有:题干信息[questionId, fldName, fldAnswer, questionType,textAnalyse,videoAnalys], 选项信息
        callback(QuestionList)      //存在有效成绩则返回有效成绩的作答详情
    }


    // 判断学生是否提交过该试卷
    // 输入: stu_id(学生编号), taskid(试卷编号)
    // 输出: 存在有效成绩则返回1, 否则成绩则返回0
    panduanState(stu_id, taskid) {
        return new Promise((resolve, reject) => {
            const panduanStateSql = "SELECT  tstu_condition FROM taskstudent WHERE tstu_stuid = ? AND tstu_tasid = ?"
            this.QueryMysql(panduanStateSql, [stu_id, taskid], result => {
                // console.log("result:", result)
                resolve(result)
            })
        }).then((value) => {
            // console.log("value:", value[0].tstu_condition)
            if (value.length == 0 || value[0].tstu_condition == -1) { return 0 }  // 不存在该记录或记录存在但未作答 则返回0
            return 1  // 记录存在且有成绩则返回1
        })
    }




    // 该方法用于查询学生提交上来的userAnswer
    // 传入: 问题编号,学生编号
    // 返回: userAnswer
    GetUserAnswer(stuid, que_id) {
        return new Promise((resolve, reject) => {
            let GetUserAnswerSql = "SELECT userAnswer FROM answerrecord WHERE ans_stuid = ? AND que_id = ?"
            this.QueryMysql(GetUserAnswerSql, [stuid, que_id], userAnswer => {
                // console.log('userAnswer:', userAnswer)
                resolve(userAnswer)
            })
        }).then((value) => {
            if (value.length != 0) { return value[0].userAnswer }
            else {
                return false
            }
        })
    }



    // 该方法用于向题干信息中添加选项信息
    // 传入: 没有选项信息的 题干信息列表
    // 返回: 携带选项信息的题干信息列表
    AddOptionList(StemInform) {
        return new Promise(async (resolve, reject) => {
            let qidArr = await this.getquestionId(StemInform)  //qidArr是一个装有题目编号的列表
            let longer = 0  // 记录有几道题目的选项信息添加完成
            for (let j = 0; j < qidArr.length; j++) {
                await this.getOptionList(qidArr[j], options => {
                    let index = qidArr.indexOf(qidArr[j])  //options应当添加到StemInform中的第index个元素
                    StemInform[index]["QuestionOptionList"] = options
                    longer++  //选项信息添加完毕则longer++
                    if (longer == qidArr.length) {
                        resolve(StemInform)
                    }
                })
            }
        }).then((value) => {
            // console.log("value:", value)
            return value
        })
    }




    // 获取题目编号列表
    // 返回一个列表(其中装着题目编号)
    getquestionId(StemInform) {
        let arr = []   //该数组用于存放题目id
        StemInform.forEach(element => {
            if (element.questionType == 3) {
                element.questionType = 0
            }
            arr.push(element.questionId)  // 向arr数组中填充题目编号
        })
        return arr
    }


    // 获取题干信息
    // 输入试卷编号
    GetStemInform(taskid) {
        return new Promise((resolve, reject) => {
            // console.log('获取题干信息')
            const GetStemInformSql = "SELECT question.`que_id` AS questionId, question.`que_name` AS fldName, question.`que_answer` AS fldAnswer, question.`que_type` AS questionType, que_Analysis AS textAnalyse, que_MediaStorage AS videoAnalys, que_Image AS imagAnalys FROM question WHERE question.`que_tasid` = ? ORDER BY  FIELD(questionType,0,1,3,2),que_index"
            this.QueryMysql(GetStemInformSql, [taskid], results => {
                results = JSON.parse(JSON.stringify(results))
                // console.log("results", results)
                resolve(results)
            })
        }).then((value) => {
            // console.log("value",value)  //打印题干信息
            return value;
        })
    }


}


module.exports = { task }




