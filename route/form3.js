const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const path=require('path');
const fs=require('fs');
const cookieParser=require('cookie-parser');
const session=require('express-session');
app.use(cookieParser());
app.use(session({secret:"cookieSecret",resave:true,saveUninitialized:true,cookie:{secure:true}}));
app.use('/public',express.static('public'));
const mongoose=require('mongoose');
const env=require('dotenv');
env.config({path:'../require/config.env'});
const User=require("../models/user");
const Registration=require('../models/registration');
require('../require/connection.js');
const encoded=bodyParser.urlencoded({extended:true});
const {google}=require('googleapis');
const GOOGLE_API_FOLDER_ID=process.env.GOOGLE_API_FOLDER_ID;
app.set('view engine','hbs');
const auth=new google.auth.GoogleAuth({
	keyFile:'./require/googlekey.json',
	scopes:['https://www.googleapis.com/auth/drive']
})
const googleService=google.drive({
	version:'v3',
	auth
})

app.get('/form3',(req,res)=>{
	if(req.session.form_no==="Form_3"){
		res.render('form3',{
			Unique_ID:req.session.Form_3,
			style1:[
				"none"
			]
		})
	}
	else if(req.session.form_no==="Form_1"){
		return res.redirect('/profile');
	}
	else if(req.session.form_no==="Form_2"){
		return res.redirect('/form2');
	}
	else if(req.session.mainpage){
		return res.redirect('/mainpage');
	}
	else{
		return res.redirect('/');
	}
});
app.post('/form3',encoded,async(req,res)=>{
	if(req.files){
		await req.files.file.mv(req.files.file.name);
		await uploadFIle(req.files.file.name,req.session.Form_3).then(data=>{
			getpublicURL(data.id).then(async url=>{
				link=url.webContentLink
				const studentData=await Registration.updateMany({Unique_ID:req.session.Form_3},{$set:
					{Image_Link:link,
					Image_ID:data.id}
				});
				const updateUser=await User.updateOne({Unique_ID:req.session.Form_3},{$set:{
					Fillup:"Done"
				}});
			});
		});
		return res.redirect('/logout');
	}
	else{
		message="Select Student Profile Image";
	}
	res.render('form3',{
		Unique_ID:req.session.Form_3,
		style1:[
			"block",
			message
		]
	});
});

async function uploadFIle(filename,file_name)
{
	try
	{
		const fileMetaData={
			'name':file_name+".jpg",
			'parents':[GOOGLE_API_FOLDER_ID]
		}
		const media={
			mimeType:'image/jpg',
			body:fs.createReadStream("./"+filename)
		}
		const response=await googleService.files.create({
			resource:fileMetaData,
			media:media,
			field:'id'
		});
		fs.unlink("./"+filename,(er)=>{});
		return response.data;
	}
	catch(err)
	{
		console.log("Upload file error ",err);
	}
}
async function getpublicURL(fileid)
{
	try
	{
		const fileId=fileid;
		await googleService.permissions.create({
			fileId:fileId,
			requestBody:{
				role:'reader',
				type:'anyone'
			}
		})
		const result=await googleService.files.get({
			fileId:fileId,
			fields:['webContentLink']
		});
		return result.data;
	}
	catch(err)
	{
		console.log(err);
	}
}
module.exports=app;