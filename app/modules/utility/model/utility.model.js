const mongoose=require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const {Schema,model}=mongoose;

const utilitySchema=new Schema({
    name:{type:String,enum:["British Gas","Centrica","EDF Energy","National Grid","Octopus Energy","Scottish Power","Shell","SSE","Affinity Water","Scottish Water","Severn Trent Water","South West Water","South East Water","Southern Water","Thames Water","Yorkshire Water"]},
    accounttype:{type:String,enum:["Energy","Water"]},
    status:{type:String,enum:["active","inactive"],default:"active"},
    userId:{type:Schema.Types.ObjectId,ref:"users"},
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false});

utilitySchema.plugin(mongooseAggregatePaginate);
const utilitymodel=model("utility",utilitySchema);
module.exports=utilitymodel;

