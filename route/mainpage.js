const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const path=require('path');
const fs=require('fs');
const session=require('express-session');
const cookieParser=require('cookie-parser');
app.use(cookieParser());
app.use(session({secret:"cookieSecret",resave:true,saveUninitialized:true,cookie:{secure:true}}));
app.use('/public',express.static('public'));
const mongoose=require('mongoose');
const env=require('dotenv');
env.config({path:'../require/config.env'});
const Registration=require('../models/registration');
require('../require/connection.js');
app.get('/mainpage',async(req,res)=>{
	if(req.session.mainpage){
		const studentData=await Registration.find({Unique_ID:req.session.mainpage});
		var studentInformation=[];
		studentInformation[0]=studentData[0].Frist_Name;
		studentInformation[1]=studentData[0].Last_Name;
		studentInformation[2]=studentData[0].Stu_Age;
		studentInformation[3]=studentData[0].Email_ID;
		studentInformation[4]=studentData[0].Phone_No;
		studentInformation[5]=studentData[0].HSLC_Marks;
		studentInformation[6]=studentData[0].Gender;
		studentInformation[7]=studentData[0].Stream;
		studentInformation[8]=studentData[0].Year;
		var studentSubject=[];
		studentSubject[0]=studentData[0].Subject_1;
		studentSubject[1]=studentData[0].Subject_2;
		studentSubject[2]=studentData[0].Subject_3;
		studentSubject[3]=studentData[0].Subject_4;
		studentSubject[4]=studentData[0].Subject_5;
		studentSubject[5]=studentData[0].Elective;
		res.render('mainpage',{
			Unique_ID:studentData[0].Unique_ID,
			link:studentData[0].Image_Link,
			studentInformation,
			studentSubject
		});
	}
	else if(req.session.form_no==="Form_1"){
		return res.redirect('/profile');
	}
	else if(req.session.form_no==="Form_2"){
		return res.redirect('/form2');
	}
	else if(req.session.form_no==="Form_3"){
		return res.redirect('/form3');
	}
	else{
		return res.redirect('/');
	}
});
module.exports=app;