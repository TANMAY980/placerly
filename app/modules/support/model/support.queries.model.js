const mongoose=require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const{Schema,model}=mongoose;

const supportSchema=new Schema({
    userId:{type:Schema.Types.ObjectId,ref:"user"},
    name:{type:String,required:true},
    email:{type:String,required:true,index:true},
    phone:{type:String,required:true,index:true},
    queries:{type:String,required:true},
    progressstatus:{type:String,enum:["pending","processing","resolved"],default:"pending"},
    status:{type:String,enum:["active","inactive"],default:"active"},
    priority:{type:String,enum:["low","medium","high"],default:"medium"},
    resolvedby:{type:Schema.Types.ObjectId,ref:"user"}, 
    updatedInfo:[{
        updatedfield:[{type:String,default:""}],
        updatedby:{type:Schema.Types.ObjectId,ref:"user"},
        updatedAt:{type:Date,default:Date.now}
    }],
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false});

supportSchema.plugin(mongooseAggregatePaginate);
const supportmodel=model("support",supportSchema);

module.exports=supportmodel;