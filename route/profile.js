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
app.get('/profile',async(req,res)=>{
	if(req.session.form_no==="Form_1"){
		var userData=await User.find({Unique_ID:req.session.Form_1});
		res.render('profile',{
			Unique_ID:req.session.Form_1,
			sendData:[
				"",
				"",
				"",
				userData[0].Email_ID,
				userData[0].Phone_No
			],
			style1:[
				"none"
			]
		});
	}
	else if(req.session.form_no==="Form_2"){
		return res.redirect('/form2');
	}
	else if(req.session.form_no==="Form_3"){
		return res.redirect('/form3');
	}
	else if(req.session.mainpage){
		return res.redirect('/mainpage');
	}
	else
	{
		return res.redirect('/');
	}
});
app.post('/profile',encoded,async(req,res)=>{
	var sendData=[req.body.frist_name,req.body.last_name,req.body.age,req.body.email_id,req.body.phone_no,req.body.hslc,req.body.gender,req.body.stream,req.body.year];
	var check="false";
	var message="";
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
			message="Select Your Gender";
		}
		else{
			if(sendData[7]==="Select"){
				message="Select Your Stream ";
			}
			else{
				if(sendData[8]==="Select"){
					message="Select Your Year";
				}
				else{
					const studentData=new Registration({
						_id:new mongoose.Types.ObjectId,
						Frist_Name:sendData[0],
						Last_Name:sendData[1],
						Unique_ID:req.session.Form_1,
						Stu_Age:sendData[2],
						Email_ID:sendData[3],
						Phone_No:sendData[4],
						HSLC_Marks:sendData[5],
						Gender:sendData[6],
						Stream:sendData[7],
						Subject_1:"",
						Subject_2:"",
						Subject_3:"",
						Subject_4:"",
						Subject_5:"",
						Elective:"",
						Image_Link:"",
						Image_ID:"",
						Year:sendData[8]
					});
					const savaData=await studentData.save();
					const updateData=await User.updateOne({Unique_ID:req.session.Form_1},{$set:{Fillup:'Form2'}});
					req.session.form_no="Form_2";
					req.session.Form_2=req.session.Form_1;
					return res.redirect('/form2');
				}
			}
		}
	}
	else{
		message="Fill All Inputs !";
	}
	await res.render('profile',{
		Unique_ID:req.session.Form_1,
		style1:[
			"block",
			message
		],
		sendData

	});
});
module.exports=app;