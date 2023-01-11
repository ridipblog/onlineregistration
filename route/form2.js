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
app.get('/form2',(req,res)=>{
	if((req.session.form_no==="Form_2")){
		res.render('form2',{
			Unique_ID:req.session.Form_2,
			style1:[
				"none"
			]
		})
	}
	else if(req.session.form_no==="Form_1"){
		return res.redirect('/profile');
	}
	else if(req.session.form_no==="Form_3"){
		return res.redirect('/form3')
	}
	else if(req.session.mainpage){
		return res.redirect('/mainpage');
	}
	else{
		return res.redirect('/');
	}
});
app.post('/form2',encoded,async(req,res)=>{
	var sendData=[req.body.frist_subject,req.body.second_subject,req.body.thrid_subject,req.body.fourth_subject,req.body.fivth_subject,req.body.elective_subject];
	var check="false";
	var message="";
	for(var i=0;i<sendData.length;i++){
		if(sendData[i]===""){
			check="false";
			break
		}
		else{
			check="true";
		}
	}
	if(check==="true"){
		const updateStudent=await Registration.updateMany({Unique_ID:req.session.Form_2},{$set:{
			Subject_1:sendData[0],
			Subject_2:sendData[1],
			Subject_3:sendData[2],
			Subject_4:sendData[3],
			Subject_5:sendData[4],
			Elective:sendData[5],
		}});
		const updateUser=await User.updateOne({Unique_ID:req.session.Form_2},{$set:{Fillup:'Form3'}});
		req.session.form_no="Form_3";
		req.session.Form_3=req.session.Form_2;
		return res.redirect('/form3');
	}
	else{
		message="Fill All Inputs !";
	}
	await res.render('form2',{
		Unique_ID:req.session.Form_2,
		style1:[
			"block",
			message
		],
		sendData
	});
});
module.exports=app;