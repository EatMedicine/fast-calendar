--******采用驼峰命名法*******--

--*******创建数据库*******--
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'FastCalendar')  
DROP DATABASE FastCalendar
GO
CREATE DATABASE FastCalendar
GO


--*******使用数据库*******--
USE FastCalendar
GO

IF EXISTS(SELECT * FROM SYSOBJECTS WHERE name = 'UserLogin')
DROP TABLE UserLogin
GO
CREATE TABLE UserLogin
(
	id INT PRIMARY KEY IDENTITY(1, 1),
	UserName NVARCHAR(50) Not Null,--登陆账号
	UserPassword NVARCHAR(50) Not Null--登陆密码
)
GO	

IF EXISTS(SELECT * FROM SYSOBJECTS WHERE name = 'Tip')
DROP TABLE Tip
GO
CREATE TABLE Tip
(
	id INT PRIMARY KEY IDENTITY(1, 1),
	Title Text Not Null,--Tip内容
	TipStatus INT Not Null,--状态
	IsShow INT Not Null,--是否显示
	IsDisable INT Not Null,--是否完成
	TipDate DateTime Not Null,--对应日期
)
GO	