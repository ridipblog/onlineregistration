const express=require('express');
const app=express();
const path=require('path');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const bodyParser=require('body-parser');
app.use(cookieParser());
app.use(session({secret:"cookieSecret",resave:true,saveUninitialized:true,cookie:{secure:true}}));
const encoded=bodyParser.urlencoded({extended:true});
app.use('/public',express.static('public'));
app.set('view engine','hbs');
app.get('/logout',(req,res)=>{
	if(req.session){
		req.session.destroy();
		res.redirect('/');
	}
	else{
		res.redirect('/');
	}
})
module.exports=app;