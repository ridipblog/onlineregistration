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
});
app.get('/update_image',async(req,res)=>{
	if(req.session.mainpage){
		var studentData=await Registration.find({Unique_ID:req.session.mainpage});
		res.render('update_image',{
			Unique_ID:req.session.mainpage,
			link:studentData[0].Image_Link,
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
	else if(req.session.mainpage){
		return res.redirect('/mainpage');
	}
	else{
		return res.redirect('/');
	}
})
app.post('/update_image',encoded,async(req,res)=>{
	var message="";
	var link="";
	const studentData=await Registration.find({Unique_ID:req.session.mainpage});
	link=studentData[0].Image_Link;
	var image_id=studentData[0].Image_ID;
	if(req.files){
		await req.files.file.mv(req.files.file.name);
		await deleteFile(image_id);
		await uploadFIle(req.files.file.name,req.session.mainpage).then(data=>{
			getpublicURL(data.id).then(async url=>{
				link=url.webContentLink;
				const studentData=await Registration.updateMany({Unique_ID:req.session.mainpage},{$set:
					{Image_Link:link,
					Image_ID:data.id}
				});
				message="Image Updated Successfully !"
			});
		});
	}
	else{
		message="Select A Profile Image !";
	}
	res.render('update_image',{
		Unique_ID:req.session.mainpage,
		link:link,
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

async function deleteFile(link){
	try{
		const response=await googleService.files.delete({fileId:link})
	}
	catch(err){
		console.log("Error");
	}
}
module.exports=app;