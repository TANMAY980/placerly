const mongoose=require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const {Schema,model}=mongoose;

const debtsSchema=new Schema({
    name:{type:String,required:true,index:true},
    accounttype:{type:String,enum:["creditCard","mortage"]},
    status:{type:String,enum:["active","inactive"],default:"active"},
    addedby:{type:Schema.Types.ObjectId,ref:"user"},
    updatedInfo:[{
        updatedfield:[{type:String,default:""}],
        updatedby:{type:Schema.Types.ObjectId,ref:"user"},
        updatedAt:{type:Date,default:Date.now},
    }],
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false});

debtsSchema.plugin(mongooseAggregatePaginate);
const debtstmodel=model("debt",debtsSchema);
module.exports=debtstmodel;

