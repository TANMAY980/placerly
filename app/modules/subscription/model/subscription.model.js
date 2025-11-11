
const mongoose=require('mongoose');
const{Schema,model}=mongoose;

const subScriptionSchema=new Schema({
    planName:{type:String,required:true,index:true},
    details:{type:String,required:true,default:""},
    charges:{type:Number,required:true},
    Inclusions:{type:String,required:true},
    duration:{type:String,required:true},
    status:{type:String,enum:["active","inactive"],default:"active"},
    isDeleted:{type:Boolean,default:false},
    addby:[{type:Schema.Types.ObjectId,ref:"user"}],
    updatedby:[{type:Schema.Types.ObjectId,ref:"user"}]
},{timestamps:true,versionKey:false});

const subScriptionmodel=model("subscription",subScriptionSchema);
module.exports=subScriptionmodel;