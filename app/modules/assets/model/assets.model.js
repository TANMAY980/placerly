const mongoose=require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const {Schema,model}=mongoose;

const assetSchema=new Schema({
    name:{type:String,enum:["Barclays","Lloyds","Marcus","Natwest","HSBC","Monzo","Starling","Revoult","Vanguard","Moneyfarm","AJ Bell","Freetrade","Nutmeg","Wealthify","Hargreaves Lansdown","Interactive Investor"]},
    accounttype:{type:String,enum:["cash","stock"]},
    status:{type:String,enum:["active","inactive"],default:"active"},
    userId:{type:Schema.Types.ObjectId,ref:"users"},
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false});

assetSchema.plugin(mongooseAggregatePaginate);
const assetmodel=model("asset",assetSchema);
module.exports=assetmodel;

