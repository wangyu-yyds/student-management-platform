var mysql = require('mysql');
const mqtt = require('mqtt')

// var Journal = require('./Journal');

class Base {
    constructor() {
        this.dataBaseConfig = {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: 'ad123',
            database: 'stuManagePlatform'
        };
        // this.dataBaseConfig = {
        //     host: 'localhost',
        //     port: '3306',
        //     user: 'root',
        //     password: 'ad123',
        //     database: 'stuManagePlatform'
        // };
        //emqx 的配置数据
        const host = 'localhost'
        const port = '8084'
        this.topic = 'student' //默认订阅主题
        this.topicArr = []  //主题列表
        this.topicArr.push(this.topic)
        this.connectUrl = `wss://${host}:${port}`
        this.mqttConfig = {
            username: 'user',
            clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
            clean: true,
            connectTimeout: 4000,
            password: 'public',
            reconnectPeriod: 1000,
        }
        this.client = mqtt.connect(this.connectUrl, this.mqttConfig)
        this.client.on('connect', () => {
            this.client.subscribe(this.topicArr, () => {
                // console.log(`订阅 ${this.topic} 主题成功`)
            })
        })
    }
    QueryMysql(sql, params, callback) {
        //创建连接
        let connection = mysql.createConnection(this.dataBaseConfig);
        connection.connect((err) => {
            try {
                if (err) {
                    callback(-1);
                    throw err;
                }
            } catch (err) {
                console.log(sql + " 语句，数据库连接失败");
                return
            }
        })

        connection.query(sql, params, (err, results, fields) => {
            try {
                if (err) {
                    // console.log('callback:', -1) 
                    if(err.message.indexOf("Duplicate entry") != -1){
                        console.log( "主键重复" ) 
                        callback(-11) 
                        connection.end()
                        throw err
                    }else{
                        callback(-1)   //错误返回-1 
                        connection.end()
                        throw err
                    }
                }
            } catch (err) {
                console.log(sql + " 语句执行失败!   " + err.message)
                return
            }
            try {
                //results 以行为单位返回数据
                //fields 以列为单位，返回字段属性的信息
                if (fields != undefined) {
                    let finalResults = JSON.parse(JSON.stringify(results));
                    let finalFields = JSON.parse(JSON.stringify(fields));
                    //得到查询结果后断开数据库连接
                    connection.end((err) => {
                        try {
                            if (err) {
                                callback(-1)
                                throw err;
                            }
                        } catch (err) {
                            console.log(sql, " 语句，数据库关闭失败");
                            return
                        }
                    })
                    //函数存在则执行返回操作
                    callback && callback(finalResults, finalFields);
                } else {
                    //断开连接
                    connection.end((err) => {
                        try {
                            if (err) {
                                callback(-1)
                                throw err;
                            }
                        } catch (err) {
                            console.log(sql, " 语句，数据库关闭失败");
                            return
                        }
                    })
                    callback && callback(1, 1) // 无返回型sql操作成功
                }
            } catch (err) {
                // Journal.write(err);
                console.log("解析数据失败,Catch:" + err.message)
            }

        })
    }


    // 基于emqx封装的一些方法

    // client订阅theme主题
    Subscribe(theme) {
        this.topicArr.push(theme)  //将theme主题添加到主题
        try {
            this.client.on('connect', () => {
                try {
                    this.client.subscribe(theme, () => {
                        console.log(`订阅 ${theme} 主题成功`)
                    })
                } catch (error) {
                    console.log('订阅主题时client.subscribe()出错了!')
                    return
                }
            })
        } catch (error) {
            console.log('订阅主题时client.on()出错了!')
            return
        }
    }

    /* 描述: 当publishMessage方法只传入一个参数时, 默认向this.topic主题发送message消息
     *       当publishMessage方法传入两个参数时, 默认将第一个参数当成主题, 第二个参数当成待发送的消息
     *       通过流程控制语句(Switch语句)实现方法的重载(或者叫伪重载)      
     */
    PublishMessage() {
        switch (arguments.length) {
            case 1:
                let message = arguments[0]
                this.client.publish(this.topic, message, { qos: 2, retain: false }, (error) => {
                    if (error) {
                        console.error('publishMessage时出错了:', error)
                        return
                    }
                })
            case 2:
                let theme = arguments[0]
                let msg = arguments[1]
                this.client.publish(theme, msg, { qos: 2, retain: false }, (error) => {
                    if (error) {
                        console.error('publishMessage时出错了:', error)
                        return
                    }
                })
        }
    }

    // 开启 client接收消息theme主题的消息
    // 输入: client, theme
    // 输出: 最新发给theme主题的消息
    ReceivedMessage(callback) {
        this.client.on('message', (theme, payload) => {
            // const msgstr = `接收到了来自 '${theme}' 主题的消息: ${payload.toString()}`  
            // console.log(msgstr)             //调试时使用的提示信息
            callback(theme, payload.toString())
        })
    }
    // 断开该客户端的连接
    Disconnect() {
        this.client.end(() => {
            console.log('断开连接')
        })
    }

}


module.exports = { Base }