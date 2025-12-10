const mongoose=require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const {Schema,model}=mongoose;

const appointmentSchema=new Schema({
    name:{type:String,required:true,index:true},
    email:{type:String,required:true,index:true},
    phone:{type:String,required:true},
    serviceType:{type:String,required:true},
    message:{type:String,required:true},
    status:{type:String,enum:["active","inactive"],default:"active"},
    isDeleted:{type:Boolean,default:false},   
},{timestamps:true,versionKey:false});

appointmentSchema.plugin(mongooseAggregatePaginate);

const appointmentmodel=model("appointment",appointmentSchema)
module.exports=appointmentmodel;