const mongoose=require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const {Schema,model}=mongoose;

const executorSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,index:true},
    phone:{type:String,required:true,index:true},
    userId:{type:Schema.Types.ObjectId,ref:"users"},
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false});

executorSchema.plugin(mongooseAggregatePaginate);
const executormodel=model("executor",executorSchema);
module.exports=executormodel;

