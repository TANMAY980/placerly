const mongoose=require('mongoose');
const mongooseAggregatePaginate=require('mongoose-aggregate-paginate-v2');
const {Schema,model}=mongoose;

const faqSchema=new Schema({
    question:{type:String,required:true},
    answer:{type:String,required:true,default:""},
    status:{type:String,enum:["active","inactive"],default:"active"},
    addedby:{type:Schema.Types.ObjectId,ref:"user",default:null},
    updatedInfo:[{
        updatedfield:[{type:String,default:""}],
        updateby:{type:Schema.Types.ObjectId,ref:"user"},
        updatedAt:{type:Date,defualt:Date.now},
    }],
    isDeleted:{type:Boolean,default:false}
    
},{timestamps:true,versionKey:false});

faqSchema.plugin(mongooseAggregatePaginate);

const faqmodel=model("faq",faqSchema);
module.exports=faqmodel;
