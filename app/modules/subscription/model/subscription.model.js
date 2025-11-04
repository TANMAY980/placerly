
const mongoose=require('mongoose')
const{Schema,model}=mongoose

const subScriptionSchema=new Schema({
    planName:{type:String,required:true,index:true},
    details:{type:String,required:true},
    charges:{type:Number,required:true},
    Inclusions:{type:Strinfg,required:true},
    duration:{type:String,required:true},
},{timestamps:true,versionKey:false});
const subScriptionmodel=model("subscription",subScriptionSchema);
module.exports=subScriptionmodel