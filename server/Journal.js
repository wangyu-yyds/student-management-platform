const fs = require('fs')
const path = require('path')
//
class StuManageLog{//
    constructor(){
        this.filePath = 'access.log';
        this.starms = process.uptime();
        this.endms;
    }

    GetEndTime()
    {
        return this.endms = process.uptime()
    }



    WriteErrLog(err) {
        let myDate = new Date();
        let time = myDate.toLocaleString( )+':'+myDate.getMilliseconds();//2022/2/18 下午12:51:58:931(精确到毫秒)
        let a = '[' + time + ']' + ' ' + err+'\r\n';
        fs.appendFile(path.join(__dirname, this.filePath), a  ,function(err){ 
            if(err) console.log('写文件操作失败');   
            else console.log('写文件操作成功');
        });
    }
    WriteErrLog11(responseTime,errAddress,errMessage,mytime,callback) {
        let time = mytime.toLocaleString( )+':'+mytime.getMilliseconds();//2022/2/18 下午12:51:58:931(精确到毫秒)
        let logMessage = '[' + time + ']' + ' ' + errMessage + ' ' + '[' + errAddress +  ' ' + '函数运行时间(毫秒)：' + responseTime + ']' + '\r\n';
        fs.appendFile(path.join(__dirname, this.filePath), logMessage  ,function(err){ 
            if(err) {
                console.log('写文件操作失败'); 
                callback(-1);
            }  
            else {
                console.log('写文件操作成功');
                callback(1);
            }
        });
    }
    //传的参数：为一个对象errLog{开始的计时，发生错误的计时，发生错误时间，函数文件名，err}   {startms,endms,endTime,fileName,err}
    //
    //
    Subtr(arg1,arg2){//计算时间（减法）
        var r1,r2,m,n;
        console.log(55,arg1,arg2)
        try {r1=arg1.toString().split( "." )[1].length} catch (e){r1=0}
        try {r2=arg2.toString().split( "." )[1].length} catch (e){r2=0}

        m=Math.pow(10,Math.max(r1,r2));
        console.log(111,r1,r2)
        console.log(222,m)
        n=(r1>=r2)?r1:r2;
        return ((arg1*m-arg2*m)/m).toFixed(n);
    }
    GetAddress(err,fileName,callback){
        const stack = err.stack;
        const stackArr = stack.split('\n');
        let callerLogIndex;
        let theFileName = fileName.toString();
        var promise1 = new Promise(function(resolve, reject){
            for (let i = 0; i < stackArr.length; i++) {
                if (stackArr[i].indexOf(theFileName) > 0 && i + 1 < stackArr.length) {
                    callerLogIndex = i ;
                    // console.log(111,callerLogIndex)
                    resolve(callerLogIndex)
                    break;
                }
                if(i ==stackArr.length-1){
                    resolve(i+1)
                }
            }
        });
        promise1           
            .then(function(data){  
                // console.log(222,data);   
                if (stackArr[data]!=null) {
                    const callerStackLine = stackArr[callerLogIndex];
                    let functionName = `${callerStackLine.substring(callerStackLine.indexOf('at')+3, callerStackLine.indexOf('(')-1)}`
                    let functionAddress = `${callerStackLine.substring(callerStackLine.lastIndexOf(path.sep) + 1, callerStackLine.lastIndexOf(':'))}`
                    let errstack ='errFunctionName:' + functionName + ' ' + 'errFunctionAddress:' + functionAddress;
                    callback(errstack)
                } else {
                    let errstackn= '[-]';
                    callback(errstackn)
                }                
            })     
    }

    RecordErrLog(errLog,callback){
        if(errLog==null||errLog==undefined){
            callback(-2);//参数错误
        }else{
            let endms = this.GetEndTime()
            let myDate = new Date();
            let stack = errLog.err.stack;
            const stackArr = stack.split('\n');
            // console.log(66,errLog.err)
            //1.计算时间 2.取错误地址 3.存
            var promise1 = new Promise((resolve, reject) =>{
                let responseTime = this.Subtr(endms,this.starms)//结束-开始
                console.log(5555,responseTime)
                resolve(responseTime);
            });
            var promise2 = new Promise((resolve, reject) =>{
                this.GetAddress(errLog.err,errLog.fileName, result => {//李帅--取错误地址
                    if(result!=null){
                        console.log('取错误地址');
                        resolve(result);
                    }
                    else{
                        callback(-1)
                    }
                });
            });
            Promise
                .all([promise1, promise2])
                .then((results) =>{
                    this.WriteErrLog11(results[0],results[1],stackArr[0],myDate, result => {//李帅--存
                        if(result!=null){
                            console.log('存');
                            callback(1)
                        }
                        else{
                            callback(-1)
                        }
                    });
                });
        }
    }
}

module.exports = {
    StuManageLog
}