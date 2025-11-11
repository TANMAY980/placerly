const mongoose=require('mongoose');
const{Schema,model}=mongoose;

const supportSchema=new Schema({
    userId:{type:Schema.Types.ObjectId,ref:"user"},
    title:{type:String,required:true,default:""},
    description:{type:String,required:true},
    status:{type:String,enum:["pending","active","resolved"],default:"pending"},
    resolvedby:[{type:Schema.Types.ObjectId,ref:"user"}],
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false});

const supportmodel=model("support",supportSchema);
module.exports=supportmodel;