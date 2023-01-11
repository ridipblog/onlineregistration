// const express=require('express');
// const app=express();
// const upload=require('express-fileupload');
// const bodyParser=require('body-parser');
// const fs=require('fs');
// const path=require('path');
// const mongoose=require('mongoose');
// const env=require('dotenv');
// const busboy=require('busboy');
// env.config({path:'../require/config.env'});
// const User=require("../models/user");
// require('../require/connection.js');
// const encoded=bodyParser.urlencoded({extended:true});
// const {google}=require('googleapis');
// const GOOGLE_API_FOLDER_ID=process.env.GOOGLE_API_FOLDER_ID;
// app.set('view engine','hbs');
// app.use(upload());
// const auth=new google.auth.GoogleAuth({
// 	keyFile:'./require/googlekey.json',
// 	scopes:['https://www.googleapis.com/auth/drive']
// })
// const googleService=google.drive({
// 	version:'v3',
// 	auth
// })

// app.get('/test',async(req,res)=>{
// 	// const updateUser=await User.updateMany({Unique_ID:'12coder100'},{$set:{Password:'12coder1000pass',Fillup:'Form2'}});
// 	res.render('test');

// });
// app.post('/test',encoded,async(req,res)=>{
// 	if(req.files)
// 	{
// 		const file_name=req.body.user_name;
// 		await req.files.file.mv(req.files.file.name);
// 		await uploadFIle(req.files.file.name,file_name).then(data=>{
// 			getpublicURL(data.id).then(async url=>{
// 				link=url.webContentLink
// 				const saveData=new User({
// 					_id:new mongoose.Types.ObjectId,
// 					Unique_ID:link
// 				});
// 				const saveUser=await saveData.save();
// 				res.render('test');
// 			});
// 		});
// 	}
// 	else{
// 		console.log("Error");
// 	}
// })
// async function uploadFIle(filename,file_name)
// {
// 	try
// 	{
// 		const fileMetaData={
// 			'name':file_name+".jpg",
// 			'parents':[GOOGLE_API_FOLDER_ID]
// 		}
// 		const media={
// 			mimeType:'image/jpg',
// 			body:fs.createReadStream("./"+filename)
// 		}
// 		const response=await googleService.files.create({
// 			resource:fileMetaData,
// 			media:media,
// 			field:'id'
// 		});
// 		fs.unlink("./"+filename,(er)=>{});
// 		return response.data;
// 	}
// 	catch(err)
// 	{
// 		console.log("Upload file error ",err);
// 	}
// }
// async function getpublicURL(fileid)
// {
// 	try
// 	{
// 		const fileId=fileid;
// 		await googleService.permissions.create({
// 			fileId:fileId,
// 			requestBody:{
// 				role:'reader',
// 				type:'anyone'
// 			}
// 		})
// 		const result=await googleService.files.get({
// 			fileId:fileId,
// 			fields:['webContentLink']
// 		});
// 		return result.data;
// 	}
// 	catch(err)
// 	{
// 		console.log(err);
// 	}
// }
// module.exports=app;

const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const encoded=bodyParser.urlencoded({extended:true});
const port=process.env.PORT || 3000;
const fs=require('fs');
const path=require('path');
app.set('view engine','hbs');
app.get('/test',(req,res)=>{
	res.render('test');
})
app.post('/test',encoded,async(req,res)=>{
	console.log(req.files);
	res.redirect('/test');
})
module.exports=app;