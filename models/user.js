const mongoose=require('mongoose');
let userSchema=new mongoose.Schema({
	_id:mongoose.Schema.Types.ObjectId,
	Unique_ID:String,
	Phone_No:String,
	Email_ID:String,
	Password:String,
	Fillup:String,
},{collection: 'user'});
module.exports=mongoose.model('user',userSchema);