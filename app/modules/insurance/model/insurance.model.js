const mongoose=require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const {Schema,model}=mongoose;

const insuranceSchema=new Schema({
    name:{type:String,enum:["Aviva","Royal London","Legal & General","Scottish Widows","Liverpool Victoria","Zurich","Vitality","Admiral","Direct Line","Halifax","Hastings Direct","Liverpool Victoria","Swinton Insurance"]},
    accounttype:{type:String,enum:["Life insurance","Home insurance"]},
    status:{type:String,enum:["active","inactive"],default:"active"},
    userId:{type:Schema.Types.ObjectId,ref:"users"},
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false});

insuranceSchema.plugin(mongooseAggregatePaginate);
const insurancemodel=model("insurance",insuranceSchema);
module.exports=insurancemodel;

