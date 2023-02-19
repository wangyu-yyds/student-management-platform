const Base = require('./Base')

const checkTeacherCreateTaskSql =
    "select * from task WHERE tas_teaid=?;";//李帅---老师查创建了的作业
const checkRepeatTaskSql =
    "select * from task WHERE tas_teaid=? and tas_name=? and tas_time=? ;";//李帅---老师查作业（是否重复）
const checkTeacherCreateMeansSql =
    "select mea_id,mea_name,mea_time from means WHERE mea_teaid=?;";//李帅---老师查创建了的资料
const checkTeacherCreateInformSql =
    "select inf_id,inf_name,inf_time from inform WHERE inf_teaid=?;";//李帅---老师查创建了的通知
const checkTeacherCreateMeansOneSql =
    "select * from means WHERE mea_teaid=? and mea_id=?;";//李帅---老师查具体资料
const checkTeacherCreateInformOneSql =
    "select * from inform WHERE inf_teaid=? and inf_id=?;";//李帅---老师查具体通知
const teacherCreateMeansSql =
    "INSERT INTO means(mea_name,mea_url,mea_time,mea_teaid) VALUES(?,?,?,?);";//李帅---老师创建资料
const teacherCreateInformSql =
    "INSERT INTO inform(inf_name,inf_author,inf_content,inf_time,inf_teaid) VALUES(?,?,?,?,?);";//李帅---老师创建通知
const teacherCreateTaskSql =
    "INSERT INTO task(tas_teaid,tas_name,tas_time) VALUES(?,?,?);";//李帅---老师创建作业
const teacherPublishMeansSql =
    "INSERT INTO classMeans(cmea_meaid,cmea_claid,cmea_begintime) VALUES(?,?,?);";//李帅---老师发布资料
const teacherPublishInformSql =
    "INSERT INTO classInform(cinf_infid,cinf_claid,cinf_infortime) VALUES(?,?,?);";//李帅---老师发布通知
const teacherPublishTaskSql =
    "INSERT INTO classTask(ctas_tasid,ctas_claid,ctas_begintime,ctas_endtime) VALUES(?,?,?,?);";//李帅---老师发布作业
const deletePublishTaskSql =
    "delete from classTask where ctas_tasid=? and ctas_claid=?;";//李帅---删除发布某班级的作业
const deletePublishInformSql =
    "delete from classInform where cinf_infid=? and cinf_claid=?;";//李帅---删除发布某班级的通知
const deletePublishMeansSql =
    "delete from classMeans where cmea_meaid=? and cmea_claid=?;";//李帅---删除发布某班级的资料
const deleteInformSql =
    "delete from inform where inf_id=?;";//李帅---删除通知
const deleteMeansSql =
    "delete from means where mea_id=?;";//李帅---删除资料
const deleteTaskSql =
    "delete from task where tas_id=?;";//李帅---删除作业
const createQuestionSql =
    "CALL returnQueid(?,?,?,?,?,?,\
    (SELECT tas_id FROM task WHERE tas_name=? and tas_teaid=? and tas_time=?));";//李帅---存储题目 
const createOptionListSql =
    "INSERT INTO optionList(opt_option,opt_queid,opt_index) VALUES(?,?,?);";//李帅---存储选项 
const checkTaskQuestionSql =
    "SELECT * FROM question WHERE que_tasid=? ORDER BY que_index ASC;";//李帅---查看具体作业的题目 
const checkTaskOptionListSql =
    "SELECT * FROM optionList WHERE opt_queid in (SELECT que_id FROM question WHERE que_tasid=?) ORDER BY opt_index ASC;";//李帅---查看具体作业的选项 
const checkTeacherCreateclassSql =
    "SELECT * FROM class WHERE cla_couid in \
    (SELECT cou_id FROM course WHERE cou_teaid=(SELECT tea_id FROM teacher WHERE tea_phone=?));";//李帅---查看老师创建的班级 
const checkSequentialTaskQuestionSql =//李帅---查看具体作业的题目（已排序） 
    "SELECT * FROM question WHERE que_tasid=? ORDER BY FIELD(que_type,0,1,3,2) ASC ,que_index ASC;";
const checkClassPeopleSql =
    "SELECT COUNT(*) as people FROM classStudent WHERE cstu_claid=?";//李帅---查看班级人数 
const checkStuWorkRecordSql =//李帅---查学生做题记录
    "SELECT correct FROM answerrecord WHERE que_id=? and ans_stuid in (SELECT cstu_stuid FROM classStudent WHERE cstu_claid=?);";
   
    


class Trelease extends Base.Base {
    constructor() {
        super()
    }
    //函数
    CheckTeacherCreateTask(teacherId, callback) {//李帅--老师查创建了的作业
        console.log('老师查创建了的作业');
        this.QueryMysql(checkTeacherCreateTaskSql, [teacherId],(results,fields)=>{
            callback(results);
        })
    }

    CheckRepeatTask(teacherId,textName,createTime, callback) {//李帅--老师查作业（是否重复）
        console.log('老师查作业（是否重复）');
        this.QueryMysql(checkRepeatTaskSql, [teacherId,textName,createTime],(results,fields)=>{
            callback(results);
        })
    }

    CheckTeacherCreateMeans(teacherId, callback) {//李帅--老师查创建了的资料
        console.log('老师查创建了的资料');
        this.QueryMysql(checkTeacherCreateMeansSql, [teacherId],(results,fields)=>{
            callback(results);
        })
    }

    CheckTeacherCreateInform(teacherId, callback) {//李帅--老师查创建了的通知
        console.log('老师查创建了的通知');
        this.QueryMysql(checkTeacherCreateInformSql, [teacherId],(results,fields)=>{
            callback(results);
        })
    }
    CheckTeacherCreateMeansOne(teacherId,meansId, callback) {//李帅--老师查具体资料
        console.log('老师查具体资料');
        this.QueryMysql(checkTeacherCreateMeansOneSql, [teacherId,meansId],(results,fields)=>{
            callback(results);
        })
    }
    CheckTeacherCreateInformOne(teacherId,meansId, callback) {//李帅--老师查具体通知
        console.log('老师查具体通知');
        this.QueryMysql(checkTeacherCreateInformOneSql, [teacherId,meansId],(results,fields)=>{
            callback(results);
        })
    }
    TeacherCreateMeans(message,teacherId,callback) {//李帅--老师创建具体资料
        console.log('老师查具体资料');
        this.QueryMysql(teacherCreateMeansSql, [message.meansName,message.meansUrl,message.meansTime,teacherId],(results,fields)=>{
            callback(results);
        })
    }
    TeacherCreateInform(message,teacherId,callback) {//李帅--老师创建具体通知
        console.log('老师查具体通知');
        this.QueryMysql(teacherCreateInformSql, [message.informName,message.informAuthor,message.informContent,message.informTime,teacherId],(results,fields)=>{
            callback(results);
        })
    }
    TeacherPublishTask(message,callback) {//李帅--老师发布作业
        console.log('老师发布作业');
        this.QueryMysql(teacherPublishTaskSql, [parseInt(message.taskId),parseInt(message.classId),message.taskBeginTime,message.taskEndTime],(results,fields)=>{
            callback(results);
        })
    }
    TeacherPublishMeans(message,callback) {//李帅--老师发布资料
        console.log('老师发布资料');
        this.QueryMysql(teacherPublishMeansSql, [parseInt(message.meansId),parseInt(message.classId),message.meansBeginTime],(results,fields)=>{
            
            callback(results);
        })
    }
    TeacherPublishInform(message,callback) {//李帅--老师发布通知
        console.log('老师发布通知');
        this.QueryMysql(teacherPublishInformSql, [parseInt(message.informId),parseInt(message.classId),message.informBeginTime],(results,fields)=>{
           
            callback(results);
        })
    }
    DeletePublishInform(message,callback) {//李帅--删除发布某班级的通知
        console.log('删除发布某班级的通知');
        this.QueryMysql(deletePublishInformSql, [parseInt(message.informId),parseInt(message.classId)],(results,fields)=>{
            
            callback(results);
        })
    }
    DeletePublishTask(message,callback) {//李帅--删除发布某班级的作业
        console.log('删除发布某班级的作业');
        this.QueryMysql(deletePublishTaskSql, [parseInt(message.taskId),parseInt(message.classId)],(results,fields)=>{
           
            callback(results);
        })
    }
    DeletePublishMeans(message,callback) {//李帅--删除发布某班级的资料
        console.log('删除发布某班级的资料');
        this.QueryMysql(deletePublishMeansSql, [parseInt(message.meansId),parseInt(message.classId)],(results,fields)=>{
            
            callback(results);
        })
    }
    DeleteInform(message,callback) {//李帅--删除通知
        console.log('删除通知');
        this.QueryMysql(deleteInformSql, [parseInt(message.informId)],(results,fields)=>{
            
            callback(results);
        })
    }
    DeleteMeans(message,callback) {//李帅--删除资料
        console.log('删除资料');
        this.QueryMysql(deleteMeansSql, [parseInt(message.meansId)],(results,fields)=>{
            
            callback(results);
        })
    }
    DeleteTask(message,callback) {//李帅--删除作业
        console.log('删除作业');
        this.QueryMysql(deleteTaskSql, [parseInt(message.taskId)],(results,fields)=>{
            
            callback(results);
        })
    }
    
    TeacherCreateTask(teacherId,textName,createTime,callback) {//李帅--创建作业
        console.log('创建作业');
        this.QueryMysql(teacherCreateTaskSql, [teacherId,textName,createTime],
            (results,fields)=>{
            callback(results);
        })
    }

    CreateQuestion(problem,rightChoice,questionType,problemAnalysis,MediaStorage,queindex,textName,
        teacherId,createTime,callback) {//李帅--存储题目
        console.log('存储题目');

        this.QueryMysql(createQuestionSql, [problem,rightChoice,questionType,problemAnalysis,MediaStorage,
            parseInt(queindex),textName,teacherId,createTime],
            (results,fields)=>{
            if(results[0][0]!=undefined){
                
                callback(results[0][0]);
            }
            else{
                console.log(results);
                callback(results);
            }
            
        })
    }
    CreateOptionList(choice,choiceQueid,index,callback) {//李帅--存储选项
        console.log('存储选项');
        this.QueryMysql(createOptionListSql, [choice,choiceQueid,parseInt(index)],
            (results,fields)=>{
            console.log(11,results)
            callback(results);
        })
    }
    
     CreateAllChoice(message,teacherId,choice,callback) {//李帅--存储整个单选题数组的题目
        console.log('存储整个单选题数组的题目');

        let choiceQueIndex;
        let choiceQueid;
        let choiceQueli=0;
        console.log(choice.length)
        if(choice.length!=0){
            choice.forEach((currentValue, index, arr0) => {//遍历单选题目
                choiceQueIndex = index+1;//题目序号
                arr0[index].forEach((currentValue, index, arr) => {
                    if(index == 0){//存题目内容及基本信息
                        let rightChoice =  String(currentValue.rightChoice).replace(/(^\[*)|(\]*$)/g, "");
                        let problemAnalysis = currentValue.problemAnalysis;//currentValue.problemAnalysis
                        let MediaStorage1 = currentValue.MediaStorage[0];//currentValue.MediaStorage
                        let MediaStorage2 = currentValue.MediaStorage[1];//currentValue.MediaStorage

                        var promise1 = new Promise((resolve, reject) =>{
                            //李帅--将题目解析图片和视频地址组合成字符串
                            this.HandleMediaStorage(MediaStorage1,MediaStorage2, result => {
                                if(result.length != 0 || result.length == 0){
                                    //console.log('组合成字符串完成');
                                    resolve(result);
                                }
                                else{
                                    callback(-1)
                                }
                            });
                        });
                        promise1.then((resolve, reject) =>{
                            
                            //题目解析图片和视频
                            this.CreateQuestion(currentValue.problem,rightChoice,
                                String(currentValue.questionType),problemAnalysis,resolve,
                                choiceQueIndex,message.textName,
                                teacherId,message.createTime, result => {//存储题目
                                if(result.length!=0 && result!=-1){
                                    choiceQueid =  result.Queid
                                    arr0[index].forEach((currentValue, index, arr) => {
                                        if(index > 0){
                                            if(choiceQueid!=-1){
                                                this.CreateOptionList(currentValue.choice,choiceQueid,
                                                    index, result => {//存选项
                                                    if(result==1){
                                                        if(index+1==arr.length){
                                                                console.log('单选存储成功');
                                                                choiceQueli++;
                                                                if(choiceQueli == choice.length){
                                                                    console.log('单选存储完成')
                                                                    callback(1)
                                                                }
                                                        }
                                                    }
                                                    else{
                                                        callback(-1)
        
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                                else{
                                    callback(-1)
                                }
                            })
                        })
                    }
                });
            });
        }
        else{
            callback(1)
        }  
    }
    CreateAllChoices(message,teacherId,choices,callback) {//李帅--存储整个多选题数组的题目
        console.log('存储整个多选题数组的题目');

        let choicesQueIndex;
        let choicesQueid;
        let choicesQueli=0;
        if(choices.length!=0){
            choices.forEach((currentValue, index, arr0) => {//遍历多选题目
                choicesQueIndex = index+1;//题目序号
                arr0[index].forEach((currentValue, index, arr) => {
                    if(index == 0){//存题目内容及基本信息
                        let rightChoice =  String(currentValue.rightChoice).replace(/(^\[*)|(\]*$)/g, "");
                        let problemAnalysis = currentValue.problemAnalysis;//currentValue.problemAnalysis
                        let MediaStorage1 = currentValue.MediaStorage[0];//currentValue.MediaStorage
                        let MediaStorage2 = currentValue.MediaStorage[1];//currentValue.MediaStorage

                        var promise1 = new Promise((resolve, reject) =>{
                            //李帅--将题目解析图片和视频地址组合成字符串
                            this.HandleMediaStorage(MediaStorage1,MediaStorage2, result => {
                                if(result.length != 0 || result.length == 0){
                                    //console.log('组合成字符串完成');
                                    resolve(result);
                                }
                                else{
                                    callback(-1)
                                }
                            });
                        });
                        promise1.then((resolve, reject) =>{

                            this.CreateQuestion(currentValue.problem,rightChoice,
                                String(currentValue.questionType),problemAnalysis,resolve,
                                choicesQueIndex,message.textName,
                                teacherId,message.createTime, result => {//存储题目
                                if(result.length!=0 && result!=-1){
                                    choicesQueid =  result.Queid
                                    arr0[index].forEach((currentValue, index, arr) => {
                                        if(index > 0){
                                            if(choicesQueid!=-1){
                                                this.CreateOptionList(currentValue.choice,choicesQueid,
                                                    index, result => {//存选项
                                                    if(result==1){
                                                        if(index+1==arr.length){
                                                            console.log(6,choicesQueli,choices.length)
                                                                console.log('多选题存储成功');
                                                                choicesQueli++;
                                                                if(choicesQueli == choices.length){
                                                                    console.log('多选题存储完成')
                                                                    callback(1)
                                                                }
                                                        }
                                                    }
                                                    else{
                                                        callback(-1)
        
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                                else{
                                    callback(-1)
                                }
                            })

                        })
                    }
                });
            });
        }
        else{
            callback(1)
        }  
    }
    CreateAllJudgment(message,teacherId,judgment,callback) {//李帅--存储整个判断题数组的题目
        console.log('存储整个判断题数组的题目');
        let judgmentQueIndex;
        let judgmentQueid;
        if(judgment.length!=0){
            judgment.forEach((currentValue, index, arr0) => {//遍历判断题题目
                judgmentQueIndex = index+1;//题目序号
                // console.log(queIndex);
                arr0[index].forEach((currentValue, index, arr) => {
                    //遍历题目选项（index == 0时为题目基本信息）
                    if(index == 0){//存题目内容及基本信息
                        let rightChoice =  String(currentValue.rightChoice).replace(/(^\[*)|(\]*$)/g, "");
                        let problemAnalysis = currentValue.problemAnalysis;//currentValue.problemAnalysis
                        let MediaStorage1 = currentValue.MediaStorage[0];//currentValue.MediaStorage
                        let MediaStorage2 = currentValue.MediaStorage[1];//currentValue.MediaStorage

                        var promise1 = new Promise((resolve, reject) =>{
                            //李帅--将题目解析图片和视频地址组合成字符串
                            this.HandleMediaStorage(MediaStorage1,MediaStorage2, result => {
                                if(result.length != 0 || result.length == 0){
                                    //console.log('组合成字符串完成');
                                    resolve(result);
                                }
                                else{
                                    callback(-1)
                                }
                            });
                        });
                        promise1.then((resolve, reject) =>{
                            this.CreateQuestion(currentValue.problem,rightChoice,
                                String(currentValue.questionType),problemAnalysis,resolve,
                                judgmentQueIndex,message.textName,
                                teacherId,message.createTime, result => {//存储题目
                                if(result.length!=0 && result!=-1){
                                    judgmentQueid =  result.Queid
                                    // console.log(judgmentQueid);
                                    callback(1)
                                }
                                else{
                                    callback(-1)
                                }
                            })
                        })
                    }
                });
            });
        }
        else{
            callback(1)
        }  
    }
    CreateAllQAndA(message,teacherId,qAndA,callback) {//李帅--存储整个填空题数组的题目
        console.log('存储整个填空题数组的题目');

        let qAndAQueIndex;
        let qAndAQueid;
        if(qAndA.length!=0){
            qAndA.forEach((currentValue, index, arr0) => {//遍历填空题目
                qAndAQueIndex = index+1;//题目序号
                // console.log(queIndex);
                arr0[index].forEach((currentValue, index, arr) => {
                    //遍历题目选项（index == 0时为题目基本信息）
                    if(index == 0){//存题目内容及基本信息
                        let rightChoice =  currentValue.rightChoice;
                        let MediaStorage1 = currentValue.MediaStorage[0];//currentValue.MediaStorage
                        let MediaStorage2 = currentValue.MediaStorage[1];//currentValue.MediaStorage

                        var promise1 = new Promise((resolve, reject) =>{
                            //李帅--将题目解析图片和视频地址组合成字符串
                            this.HandleMediaStorage(MediaStorage1,MediaStorage2, result => {
                                if(result.length != 0 || result.length == 0){
                                    //console.log('组合成字符串完成');
                                    resolve(result);
                                }
                                else{
                                    callback(-1)
                                }
                            });
                        });

                        promise1.then((resolve, reject) =>{
                            this.CreateQuestion(currentValue.problem,rightChoice,
                                String(currentValue.questionType),currentValue.problemAnalysis,resolve,
                                qAndAQueIndex,message.textName,
                                teacherId,message.createTime, result => {//存储题目
                                if(result.length!=0 && result!=-1){
                                    qAndAQueid =  result.Queid
                                    callback(1)
                                }
                                else{
                                    callback(-1)
                                }
                            })
                        })
                    }
                });
            });
        }
        else{
            callback(1)
        }  
    }
    
    CreateAllQuestion(message,teacherId,callback) {//李帅--存储所有题目与选项
        console.log('存储所有题目与选项');
        let choice = JSON.parse(message.choice);
        let choices = JSON.parse(message.choices);
        let judgment = JSON.parse(message.judgment);
        let qAndA = JSON.parse(message.qAndA);
        console.log(choice,choices,judgment,qAndA);

        var promise1 = new Promise((resolve, reject) =>{
            
            this.CreateAllChoice(message,teacherId,choice, result => {//存储整个单选题数组的题目
                if(result==1){
                    console.log('异步1完成');
                    resolve(1);
                }
                else{
                    callback(-1)
                }
            });
        });
        var promise2 = new Promise((resolve, reject) =>{
            this.CreateAllChoices(message,teacherId,choices, result => {//李帅--存储整个多选题数组的题目
                if(result==1){
                    console.log('异步2完成');
                    resolve(1);
                }
                else{
                    callback(-1)
                }
            });
        });
        var promise3 = new Promise((resolve, reject) =>{
            this.CreateAllJudgment(message,teacherId,judgment, result => {//李帅--存储整个判断题数组的题目
                if(result==1){
                    console.log('异步3完成');
                    resolve(1);
                }
                else{
                    callback(-1)
                }
            });
        });
        var promise4 = new Promise((resolve, reject) =>{
            this.CreateAllQAndA(message,teacherId,qAndA, result => {//李帅--存储整个填空题数组的题目
                if(result==1){
                    console.log('异步4完成');
                    resolve(1);
                }
                else{
                    callback(-1)
                }
            });
        });
        Promise
        .all([promise1, promise2, promise3, promise4])
        .then((results) =>{
            console.log(results);
            console.log(1222);
            callback(1)
        });
    }

    TeacherCheckTaskContent(allQuestion,allOptionList,callback) {//李帅--整理题目与选项
        console.log('整理题目与选项');
        let choice =new Array();
        let choices =new Array();
        let judgment =new Array();
        let qAndA =new Array();
        let choiceIndex = 0;
        let choicesIndex = 0;
        let judgmentIndex = 0;
        let qAndAIndex = 0;
        let all =new Array();
       
        let i=0 ;//判断题目存储是否完成
        allQuestion.forEach((currentValue, index, arr) => {
            console.log(currentValue)
            if(currentValue.que_type=='0'){//选择题
                let a = {//选择题基本信息
				}
                let que_answer =  currentValue.que_answer.split(',')
                let answer = new Array();
                que_answer.forEach((currentValue, index, arr0) => {
                    answer[index] = parseInt(currentValue)
                })
                
                let que_Med = new Array();
                que_Med = currentValue.que_MediaStorage.split('$.$')
                
                que_Med[0] = que_Med[0].split('$,$')
                que_Med[1] = que_Med[1].split('$,$')

                a.problem = currentValue.que_name;
                a.questionType = parseInt(currentValue.que_type);
                a.rightChoice = answer;
                a.problemAnalysis = currentValue.que_Analysis;
                a.MediaStorage = que_Med;

                let queId = currentValue.que_id;
                choice[choiceIndex] = new Array();
                choice[choiceIndex].push(a);
                allOptionList.forEach((currentValue, index, arr) => {
                    if(currentValue.opt_queid==queId ){//选择题选项
                        let b = {
                        }
                        b.choice = currentValue.opt_option;
                        console.log(currentValue.opt_option)
                        choice[choiceIndex].push(b);
                    }
                })
                choiceIndex++
            }
            if(currentValue.que_type=='1'){//多选题
                let a = {//多选题基本信息
				}
                let que_answer =  currentValue.que_answer.split(',')
                let answer = new Array();
                que_answer.forEach((currentValue, index, arr0) => {
                    answer[index] = parseInt(currentValue)
                })
                let que_Med = new Array();
                que_Med = currentValue.que_MediaStorage.split('$.$')
                
                que_Med[0] = que_Med[0].split('$,$')
                que_Med[1] = que_Med[1].split('$,$')

                a.problem = currentValue.que_name;
                a.questionType = parseInt(currentValue.que_type);
                a.rightChoice = answer;
                a.problemAnalysis = currentValue.que_Analysis;
                a.MediaStorage = que_Med;

                let queId = currentValue.que_id;
                choices[choicesIndex] = new Array();
                choices[choicesIndex].push(a);
                allOptionList.forEach((currentValue, index, arr) => {
                    if(currentValue.opt_queid==queId ){//多选题选项
                        let b = {
                        }
                        b.choice = currentValue.opt_option;
                        console.log(currentValue.opt_option)
                        choices[choicesIndex].push(b);
                    }
                })
                choicesIndex++

            }
            if(currentValue.que_type=='2'){//填空题
                let a = {//填空题
				}
                let que_Med = new Array();
                que_Med = currentValue.que_MediaStorage.split('$.$')
                
                que_Med[0] = que_Med[0].split('$,$')
                que_Med[1] = que_Med[1].split('$,$')

                a.problem = currentValue.que_name;
                a.questionType = parseInt(currentValue.que_type);
                a.rightChoice = currentValue.que_answer;
                a.problemAnalysis = currentValue.que_Analysis;
                a.MediaStorage = que_Med;

                qAndA[qAndAIndex] = new Array();
                qAndA[qAndAIndex].push(a);
                qAndAIndex++
            }
            if(currentValue.que_type=='3'){//判断题
                let a = {//判断题
				}
                let que_answer =  currentValue.que_answer.split(',')
                let answer = new Array();
                que_answer.forEach((currentValue, index, arr0) => {
                    answer[index] = parseInt(currentValue)
                })
                let que_Med = new Array();
                que_Med = currentValue.que_MediaStorage.split('$.$')
                
                que_Med[0] = que_Med[0].split('$,$')
                que_Med[1] = que_Med[1].split('$,$')

                a.problem = currentValue.que_name;
                a.questionType = parseInt(currentValue.que_type);
                a.rightChoice = answer;
                a.problemAnalysis = currentValue.que_Analysis;
                a.MediaStorage = que_Med;

                judgment[judgmentIndex] = new Array();
                judgment[judgmentIndex].push(a);
                judgmentIndex++
            }
            

            i++
        })
        if(i == allQuestion.length){
            console.log(2222)
            all.push(choice)
            all.push(choices)
            all.push(qAndA)
            all.push(judgment)
            callback(all)
        }
    }
    CheckTaskQuestion(taskId,callback) {//李帅--查看具体作业的题目
        console.log('查看具体作业的题目');
        this.QueryMysql(checkTaskQuestionSql, [parseInt(taskId)],
            (results,fields)=>{
            callback(results);
        })
    }
    CheckTaskOptionList(taskId,callback) {//李帅--查看具体作业的选项
        console.log('查看具体作业的选项');
        this.QueryMysql(checkTaskOptionListSql, [parseInt(taskId)],
            (results,fields)=>{
            callback(results);
        })
    }

    CheckTeacherCreateclass(phone,callback) {//李帅--查看老师创建的班级
        console.log('查看老师创建的班级');
        this.QueryMysql(checkTeacherCreateclassSql, [phone],
            (results,fields)=>{
            callback(results);
        })
    }
    CheckSequentialTaskQuestion(taskId,callback) {//李帅--查看具体作业的题目（已排序）
        console.log('查看具体作业的题目（已排序）');
        this.QueryMysql(checkSequentialTaskQuestionSql, [parseInt(taskId)],
            (results,fields)=>{
            callback(results);
        })
    }
    CheckCorrectRate(taskId,classId,callback) {//李帅--查看某作业所有题目的正确率
        console.log('查看某作业所有题目的正确率');
        //题目类型，序号，未作人数，做错人数，正确率
        //1.查看具体作业的题目
        //2.遍历所有题目
        //3.根据题目编号，班级编号查做了的学生记录
        //4.遍历学生记录，记录做了的总人数，做错的人数，
        //5.查班级总人数
        classId=parseInt(classId)
        taskId=parseInt(taskId)
        this.QueryMysql(checkClassPeopleSql, [classId],
            (results,fields)=>{
            let people = results[0].people;
            this.CheckSequentialTaskQuestion(taskId, result => {//李帅--查看具体作业的题目（已排序）
                if(result!=-1){
                    let question =new Array(result.length);
                    let i=0;
                    result.forEach((currentValue, index, arr) => {
                        //李帅--根据班级编号,题目编号查做了的学生记录
                        this.CheckStuWorkRecord(classId,currentValue.que_id, record => {
                            if(record!=-1){//计算
                                let a = {//
                                }
                                a.questionType = parseInt(currentValue.que_type);
                                a.questionIndex = parseInt(currentValue.que_index);
                                a.uncomplete = parseInt(people)-record.complete;
                                a.workerr = record.workerr;
                                a.accuracy = ((record.complete-record.workerr)/parseInt(people))*100
                                a.accuracy=parseInt(a.accuracy.toFixed(0))+'%'
                                question[index]=a;
                                
                            }
                            else{
                                callback(-1)
                            }
                            i++
                            if(i==result.length){
                                callback(question);
                            }

                        })
                    })
                }
                else{
                    callback(-1)
                }
            });
        })
    }
    CheckStuWorkRecord(classId,questionid,callback) {//李帅--根据班级编号,题目编号查做了的学生记录
        console.log('根据班级编号,题目编号查做了的学生记录');
        this.QueryMysql(checkStuWorkRecordSql, [questionid,classId],
            (results,fields)=>{
                var promise1 = new Promise((resolve, reject) =>{
                    let a={
                        complete :0,//完成人数
                        workerr :0//做错人数
                    };
                    results.forEach((currentValue, index, arr) => { 
                        a.complete++
                        if(currentValue.correct=="false"){
                            a.workerr++;
                        }
                    })
                    if(a.complete == results.length){
                        resolve(a);
                    }
                });
                promise1
                .then((results) =>{
                    callback(results)
                });
        })
    }
    HandleMediaStorage(Med1,Med2,callback){
        let Med1zfc;
        let Med2zfc;
        
        var promise1 = new Promise((resolve, reject) =>{//李帅--将题目解析图片组合成字符串
            if(Med1.length==0){
                resolve(null);
            }
            else{
                Med1.forEach((currentValue, index, arr) => {
                    if(index==0){
                        Med1zfc = currentValue
                        if(index==arr.length-1){
                        resolve(Med1zfc);
                        }
                    }
                    else{
                        Med1zfc = Med1zfc +"$,$"+ currentValue
                        if(index==arr.length-1){
                            resolve(Med1zfc);
                        }
                    }
                })
            }
        });
        var promise2 = new Promise((resolve, reject) =>{//李帅--将题目视频地址组合成字符串
            console.log(14444,Med2);
            if(Med2.length==0){
                resolve(null);
            }
            else{
                Med2.forEach((currentValue, index, arr) => {
                    if(index==0){
                        Med2zfc = currentValue
                        console.log(1122,Med2zfc);
                        if(index==arr.length-1){
                        resolve(Med2zfc);
                        console.log(1122222);
                        }
                    }
                    else{
                        Med2zfc = Med2zfc +"$,$"+ currentValue
                        if(index==arr.length-1){
                            resolve(Med2zfc);
                            console.log(1122222333);
                        }
                    }
                    
                })
            }
        });
        Promise
        .all([promise1, promise2])
        .then((results) =>{
            let MediaStorage = results[0]+"$.$"+results[1]
            callback(MediaStorage)
        });

    }
    CheckMediaStorage(Med,callback){
        
    }

}


module.exports = { Trelease }