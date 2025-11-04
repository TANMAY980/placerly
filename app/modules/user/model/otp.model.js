const mongoose=require('mongoose');
const{Schema,model}=mongoose
const otpSchema=new Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    otp:{type:String,required:true},
    createdAt:{type:Date,default:Date.now,expires:"5m"}
},{timestamps:true,versionKey:false})
const otpmodel=model("otp",otpSchema);
module.exports=otpmodel