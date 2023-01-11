const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const bodyParser=require('body-parser');
app.use(cookieParser());
app.use(session({secret:"cookieSecret",resave:true,saveUninitialized:true,cookie:{secure:true}}));
const encoded=bodyParser.urlencoded({extended:true});
app.use('/public',express.static('public'));
const env=require('dotenv');
env.config({path:'../require/config.env'});
const User=require('../models/user');
const Registration=require('../models/registration');
require('../require/connection.js');
app.set('view engine','hbs');
app.get('/update',async(req,res)=>{
	if(req.session.mainpage){
		var studentData=await Registration.find({Unique_ID:req.session.mainpage});
		var sendData=[];
		sendData[0]=studentData[0].Frist_Name;
		sendData[1]=studentData[0].Last_Name;
		sendData[2]=studentData[0].Stu_Age;
		sendData[3]=studentData[0].Email_ID;
		sendData[4]=studentData[0].Phone_No;
		sendData[5]=studentData[0].HSLC_Marks;
		sendData[6]=studentData[0].Gender;
		sendData[7]=studentData[0].Stream;
		sendData[8]=studentData[0].Year;
		res.render('update',{
			Unique_ID:req.session.mainpage,
			link:studentData[0].Image_Link,
			sendData,
			style1:[
				"none"
			]
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
app.post("/update",encoded,async(req,res)=>{
	var sendData=[req.body.frist_name,req.body.last_name,req.body.age,req.body.email_id,req.body.phone_no,req.body.hslc,req.body.gender,req.body.stream,req.body.year];
	var check="false";
	var message="";
	var studentImage="";
	for(var i=0;i<sendData.length;i++){
		if(sendData[i]===""){
			check="false";
			break;
		}
		else{
			check="true";
		}
	}
	if(check==="true"){
		if(sendData[6]==="Select"){
			message="Select Your Gender !";
		}
		else{
			if(sendData[7]==="Select"){
				message="Select Your Stream !";
			}
			else{
				if(sendData[8]==="Select"){
					message="Select Your Year !";
				}
				else
				{
					const studentData=await Registration.updateMany({Unique_ID:req.session.mainpage},{$set:
						{Frist_Name:sendData[0],
						Last_Name:sendData[1],
						Stu_Age:sendData[2],
						Email_ID:sendData[3],
						Phone_No:sendData[4],
						HSLC_Marks:sendData[5],
						Gender:sendData[6],
						Stream:sendData[7],
						Year:sendData[8]}});
					message="Student Information Updated !";
					studentImage=await Registration.find({Unique_ID:req.session.mainpage});
				}
			}
		}
	}
	else{
		message="Fill All Inputs !"
	}
	await res.render('update',{
		Unique_ID:req.session.mainpage,
		link:studentImage[0].Image_Link,
		style1:[
			"block",
			message
		],
		sendData
	});
});
module.exports=app;