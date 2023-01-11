const mongoose=require('mongoose');
let userSchema=new mongoose.Schema({
	_id:mongoose.Schema.Types.ObjectId,
	Frist_Name:String,
	Last_Name:String,
	Unique_ID:String,
	Stu_Age:String,
	Email_ID:String,
	Phone_No:String,
	HSLC_Marks:String,
	Gender:String,
	Stream:String,
	Subject_1:String,
	Subject_2:String,
	Subject_3:String,
	Subject_4:String,
	Subject_5:String,
	Elective:String,
	Image_Link:String,
	Image_ID:String,
	Year:String
},{collection:'registration'});
module.exports=mongoose.model('registration',userSchema);