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
app.get('*',(req,res)=>{
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
		return res.render('error');
	}
});
module.exports=app;