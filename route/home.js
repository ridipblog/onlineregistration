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
require('../require/connection.js');
app.set('view engine','hbs');
app.get('/',(req,res)=>{
	if(req.session.form_no==="Form_1"){
		return res.redirect('/profile');
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
	else{
		res.render('index',{
			style1:[
				"none"
			]
		});
	}
});
app.post('/',encoded,async(req,res)=>{
	var user_name=req.body.user_name;
	var user_pass=req.body.user_pass;
	input1=[];
	message="";
	if(user_name===""){
		input1=[user_name,user_pass];
		message="Enter Student User Name";
	}
	else
	{
		if(user_pass===""){
			input1=[user_name,user_pass];
			message="Enter Student User Password";
		}
		else
		{
			try{
				const userData=await User.find({Unique_ID:user_name});
				if(userData.length===0){
					message="User Name Not Found !";
					input1=["",user_pass];
				}
				else
				{
					if(userData[0].Password===user_pass){
						if(userData[0].Fillup==="No"){
							req.session.Form_1=user_name;
							req.session.form_no="Form_1";
							return res.redirect('/profile');
						}
						else if(userData[0].Fillup==="Form2"){
							req.session.Form_2=user_name;
							req.session.form_no="Form_2";
							return res.redirect('/form2');
						}
						else if(userData[0].Fillup==="Form3"){
							req.session.Form_3=user_name;
							req.session.form_no="Form_3";
							return res.redirect('/form3');
						}
						else if(userData[0].Fillup==="Done"){
							req.session.mainpage=user_name;
							return res.redirect('/mainpage');
						}
					}
					else
					{
						message="User Password Not Mached !";
						input1=[user_name,""];
					}
				}
			}catch(err){
				console.log(err);
			}
		}
	}
	res.render('index',{
		style1:[
			"block",
			message
		],
		input1
	});
})
module.exports=app
