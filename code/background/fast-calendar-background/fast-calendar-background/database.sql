--******�����շ�������*******--

--*******�������ݿ�*******--
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'FastCalendar')  
DROP DATABASE FastCalendar
GO
CREATE DATABASE FastCalendar
GO


--*******ʹ�����ݿ�*******--
USE FastCalendar
GO

IF EXISTS(SELECT * FROM SYSOBJECTS WHERE name = 'UserLogin')
DROP TABLE UserLogin
GO
CREATE TABLE UserLogin
(
	id INT PRIMARY KEY IDENTITY(1, 1),
	UserName NVARCHAR(50) Not Null,--��½�˺�
	UserPassword NVARCHAR(50) Not Null--��½����
)
GO	

IF EXISTS(SELECT * FROM SYSOBJECTS WHERE name = 'Tip')
DROP TABLE Tip
GO
CREATE TABLE Tip
(
	id INT PRIMARY KEY IDENTITY(1, 1),
	userId INT FOREIGN KEY REFERENCES UserLogin(id),
	Title Text Not Null,--Tip����
	TipStatus INT Not Null,--״̬
	IsShow INT Not Null,--�Ƿ���ʾ
	IsDisable INT Not Null,--�Ƿ����
	TipDate DateTime Not Null,--��Ӧ����
)
GO	


IF EXISTS(SELECT * FROM SYSOBJECTS WHERE name = 'ToDoList')
DROP TABLE ToDoList
GO
CREATE TABLE ToDoList
(
	id INT PRIMARY KEY IDENTITY(1, 1),
	userId INT FOREIGN KEY REFERENCES UserLogin(id),
	Title Text Not Null,--ToDo����
	DoStatus INT Not Null,--״̬
	IsShow INT Not Null,--�Ƿ���ʾ
	IsDisable INT Not Null,--�Ƿ����
	DoDate DateTime Not Null,--��Ӧ����
)
GO	