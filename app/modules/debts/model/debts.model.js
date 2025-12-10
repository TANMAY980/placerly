const mongoose=require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const {Schema,model}=mongoose;

const debtsSchema=new Schema({
    name:{type:String,enum:["American Express","Barclays","HSBC","Nationwide","Yorkshire Building Society","Skipton Building Society","Santander"]},
    accounttype:{type:String,enum:["credit Card","mortage"]},
    status:{type:String,enum:["active","inactive"],default:"active"},
    userId:{type:Schema.Types.ObjectId,ref:"user"},
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false});

debtsSchema.plugin(mongooseAggregatePaginate);
const debtstmodel=model("debt",debtsSchema);
module.exports=debtstmodel;

