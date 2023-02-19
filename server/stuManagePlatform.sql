/*
 Source Server         : mysql-localhost-3306
 Source Server Type    : MySQL
 Source Server Version : 5.7.33
 Source Host           : localhost:3308
 Source Schema         : stuManagePlatform

 Date: 2021/09/30

Source Server         : mysql-localhost-3306
 Source Server Type    : MySQL
 Source Server Version : 8.0.27
 Source Host           : localhost:3308
 Source Schema         : stuManagePlatform

 Date: 2022/01/30
*/


CREATE DATABASE stuManagePlatform

USE stuManagePlatform


/*
*******************************************************************************
用户信息
*******************************************************************************
*/

CREATE TABLE IF NOT EXISTS Users(
	UsersId INT UNSIGNED AUTO_INCREMENT,/*primaryKey*/
	_account VARCHAR(20) NOT NULL,/*用户账号*/
	_password VARCHAR(20) NOT NULL,/*用户密码*/
	_type INT UNSIGNED NOT NULL,/*用户类别*/
	cardNumber VARCHAR(20) NOT NULL,/*用户卡号*/
	PRIMARY KEY (UsersId)
)




INSERT INTO Users(_account,_password,_type,cardNumber) VALUES('A111','111',0,'B201901');
INSERT INTO Users(_account,_password,_type,cardNumber) VALUES('B2019','2019',0,'B201904');
INSERT INTO Users(_account,_password,_type,cardNumber) VALUES('B222','222',1,'B201902');
INSERT INTO Users(_account,_password,_type,cardNumber) VALUES('B2021','2021',1,'B201903');



/***************校学生表******************/
CREATE TABLE studentMe(
stu_name varchar(50) NOT NULL comment '姓名',
stu_no char(12) NOT NULL comment '学号',
PRIMARY KEY (stu_no)
);

/***************学生表******************/
CREATE TABLE student(
stu_id int NOT NULL AUTO_INCREMENT comment '流水号（编号）',
stu_name varchar(50) NOT NULL comment '姓名/网名',
stu_no char(12) NOT NULL comment '学号/游客号',
stu_phone char(11) NOT NULL unique comment '电话',
PRIMARY KEY (stu_id)
);

/***************校老师表******************/
CREATE TABLE teacherMe(
tea_name varchar(50) NOT NULL comment '姓名',
tea_no char(12) NOT NULL comment '职工号',
PRIMARY KEY (tea_no)
);

/***************老师表******************/
CREATE TABLE teacher(
tea_id int NOT NULL AUTO_INCREMENT comment '流水号（编号）',
tea_name varchar(50) NOT NULL comment '姓名',
tea_no char(12) NOT NULL comment '职工号',
tea_phone char(11) unique NOT NULL comment '电话',
PRIMARY KEY (tea_id)
);

/***************课程表******************/
CREATE TABLE course(
cou_id int NOT NULL AUTO_INCREMENT comment '流水号（编号）', 
cou_name varchar(50) NOT NULL comment '课程名',
cou_teaid int NOT NULL comment '教师编号',

cou_synopsis varchar(1000) comment '课程简介',
cou_existtime varchar(20) NOT NULL comment '开课学期（2021-下）',
cou_picture varchar(100) comment '课程图片',
cou_school varchar(20) comment '所属学校',

PRIMARY KEY (cou_id),
FOREIGN KEY(cou_teaid) REFERENCES teacher(tea_id)
);

/***************班级表******************/
CREATE TABLE class(
cla_id int NOT NULL AUTO_INCREMENT comment '流水号（编号）',
cla_name varchar(50) NOT NULL comment '班级名',
cla_people char(4) DEFAULT '0' NOT NULL comment '人数',
cla_sign char(6) unique NOT NULL comment '班级码（6位数字）',

cla_proportion varchar(20) DEFAULT '80,20' NOT NULL comment '成绩比例（作业情况，资料阅读情况）',
cla_absence char(4) DEFAULT '5' NOT NULL comment '缺勤一次扣的分数（从总成绩中扣）',
cla_bonus char(4) DEFAULT '2' NOT NULL comment '加分一次加的分数',

cla_couid int NOT NULL comment '课程编号',
PRIMARY KEY (cla_id),
FOREIGN KEY(cla_couid) REFERENCES course(cou_id)ON DELETE CASCADE
);

/***************学生与班级关系表******************/
CREATE TABLE classStudent(	
cstu_stuid int NOT NULL comment '学生编号', 
cstu_claid int NOT NULL comment '班级编号', 

cstu_absence char(6) DEFAULT '0' NOT NULL comment '缺勤次数',
cstu_bonus char(6) DEFAULT '0' NOT NULL comment '加分次数', 

PRIMARY KEY (cstu_stuid,cstu_claid),
FOREIGN KEY(cstu_stuid) REFERENCES student(stu_id)ON DELETE CASCADE ,
FOREIGN KEY(cstu_claid) REFERENCES class(cla_id)
);

/***************作业表******************/
CREATE TABLE task(	
tas_id int NOT NULL AUTO_INCREMENT comment '流水号（编号）',
tas_name varchar(50) NOT NULL comment '作业名',
tas_teaid int NOT NULL comment '教师编号',
FOREIGN KEY(tas_teaid) REFERENCES teacher(tea_id),
PRIMARY KEY (tas_id)
);

/***************作业与班级关系表******************/
CREATE TABLE classTask(	
ctas_tasid int NOT NULL comment '作业编号', 
ctas_claid int NOT NULL comment '班级编号', 
ctas_begintime varchar(50) NOT NULL comment '作业发布日期',
ctas_endtime varchar(50) NOT NULL comment '作业截止日期',
PRIMARY KEY (ctas_tasid,ctas_claid),
FOREIGN KEY(ctas_tasid) REFERENCES task(tas_id),
FOREIGN KEY(ctas_claid) REFERENCES class(cla_id)
);

/***************资料表******************/
CREATE TABLE means(	
mea_id int NOT NULL AUTO_INCREMENT comment '流水号（编号）',
mea_name varchar(50) NOT NULL comment '资料名',
mea_url varchar(100) NOT NULL comment '资料地址', 
mea_teaid int NOT NULL comment '教师编号',
FOREIGN KEY(mea_teaid) REFERENCES teacher(tea_id),
PRIMARY KEY (mea_id)
);

/***************资料与班级关系表******************/
CREATE TABLE classMeans(	
cmea_meaid int NOT NULL comment '资料编号', 
cmea_claid int NOT NULL comment '班级编号', 
cmea_begintime varchar(50) NOT NULL comment '资料发布日期',
PRIMARY KEY (cmea_meaid,cmea_claid),
FOREIGN KEY(cmea_meaid) REFERENCES means(mea_id),
FOREIGN KEY(cmea_claid) REFERENCES class(cla_id)
);

/***************通知表******************/
CREATE TABLE inform(	
inf_id int NOT NULL AUTO_INCREMENT comment '流水号（编号）',
inf_name varchar(8) NOT NULL comment '通知名',
inf_author varchar(30) NOT NULL comment '作者',
inf_content varchar(2000) NOT NULL comment '内容', 
inf_teaid int NOT NULL comment '教师编号',
FOREIGN KEY(inf_teaid) REFERENCES teacher(tea_id),
PRIMARY KEY (inf_id)
);

/***************通知与班级关系表******************/
CREATE TABLE classInform(	
cinf_infid int NOT NULL comment '通知编号', 
cinf_claid int NOT NULL comment '班级编号', 
cinf_infortime varchar(50) NOT NULL comment '通知时间',
PRIMARY KEY (cinf_infid,cinf_claid),
FOREIGN KEY(cinf_infid) REFERENCES inform(inf_id),
FOREIGN KEY(cinf_claid) REFERENCES class(cla_id)
);

/***************作业学习情况表******************/
CREATE TABLE taskStudent(	
tstu_stuid int NOT NULL comment '用户编号（学生，游客）',  
tstu_tasid int NOT NULL comment '作业编号',
tstu_condition varchar(3) DEFAULT '-1' NOT NULL comment '情况（分数，默认为-1）',
tstu_time varchar(50) NOT NULL comment '最后一次提交时间',
PRIMARY KEY(tstu_stuid,tstu_tasid),
FOREIGN KEY(tstu_stuid) REFERENCES student(stu_id)ON DELETE CASCADE,
FOREIGN KEY(tstu_tasid) REFERENCES task(tas_id)
);

/***************资料学习情况表******************/
CREATE TABLE meansStudent(	
mstu_stuid int NOT NULL comment '用户编号（学生，游客）',  
mstu_meaid int NOT NULL comment '资料编号',
mstu_condition varchar(4) DEFAULT '0' NOT NULL comment '情况（阅读次数,默认为0）',
PRIMARY KEY(mstu_stuid,mstu_meaid),
FOREIGN KEY(mstu_stuid) REFERENCES student(stu_id)ON DELETE CASCADE,
FOREIGN KEY(mstu_meaid) REFERENCES means(mea_id)
);

/***************通知观看情况表******************/
CREATE TABLE informStudent(	
istu_stuid int NOT NULL comment '用户编号（学生，游客）',  
istu_infid int NOT NULL comment '通知编号',
istu_condition enum('-1','1') DEFAULT '-1' NOT NULL comment '情况（-1为未读、1为已读，默认为-1）',
PRIMARY KEY(istu_stuid,istu_infid),
FOREIGN KEY(istu_stuid) REFERENCES student(stu_id)ON DELETE CASCADE,
FOREIGN KEY(istu_infid) REFERENCES inform(inf_id)
);

/***************学生缺勤事件表******************/
CREATE TABLE studentAbsence(	
sabs_stuid int NOT NULL comment '用户编号（学生，游客）',  
sabs_claid int NOT NULL comment '班级编号',
sabs_time varchar(50) NOT NULL comment '添加时间(xxxx-xx-xx xx:xx:xx)',
PRIMARY KEY(sabs_stuid,sabs_claid,sabs_time),
FOREIGN KEY(sabs_stuid) REFERENCES student(stu_id)ON DELETE CASCADE,
FOREIGN KEY(sabs_claid) REFERENCES class(cla_id)ON DELETE CASCADE
);

/***************学生加分事件表******************/
CREATE TABLE studentBonus(	
sbon_stuid int NOT NULL comment '用户编号（学生，游客）',  
sbon_claid int NOT NULL comment '班级编号',
sbon_time varchar(50) NOT NULL comment '添加时间(xxxx-xx-xx xx:xx:xx)',
PRIMARY KEY(sbon_stuid,sbon_claid,sbon_time),
FOREIGN KEY(sbon_stuid) REFERENCES student(stu_id)ON DELETE CASCADE,
FOREIGN KEY(sbon_claid) REFERENCES class(cla_id)ON DELETE CASCADE
);




DROP TABLE Users



SELECT * FROM Users;








