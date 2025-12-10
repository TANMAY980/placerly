
const mongoose=require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const{Schema,model}=mongoose;

const subScriptionSchema=new Schema({
    name:{type:String,required:true,index:true},
    details:{type:String,required:true},
    charges:{type:Number,required:true},
    inclusions:{type:String,required:true},
    duration:{type:String,required:true},
    status:{type:String,enum:["active","inactive"],default:"active"},
    addedby:{type:Schema.Types.ObjectId,ref:"user"},
    updatedInfo:[{
        updatedfield:[{type:String,default:""}],
        updatedby:{type:Schema.Types.ObjectId,ref:"user"},
        updatedAt:{type:Date,default:Date.now},
    }],
    users:[{type:Schema.Types.ObjectId,ref:"user"}],
    isDeleted:{type:Boolean,default:false},
},{timestamps:true,versionKey:false});

subScriptionSchema.plugin(mongooseAggregatePaginate);

const subScriptionmodel=model("subscription",subScriptionSchema);
module.exports=subScriptionmodel;