const mongoose=require("mongoose");
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const {Schema,model}=mongoose;

const blogSchema=new Schema({
    name:{type:String,required:true,index:true},
    title:{type:String,required:true,index:true},
    coverImage:[{type:String,required:true,default:""}],
    description:{type:String,required:true,default:""},
    status:{type:String,enum:["active","inactive"],default:"active"},
    updatedInfo:[{
        updatedfield:[{type:String,default:""}],
        updatedby:{type:Schema.Types.ObjectId,ref:"user"},
        updatedAt:{type:Date,default:Date.now}
    }],
    addedby:[{type:Schema.Types.ObjectId,ref:"user"}],
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false});

blogSchema.plugin(mongooseAggregatePaginate);
const blogmodel=model("blog",blogSchema);

module.exports=blogmodel;