const mongoose=require('mongoose');
const {Schema,model}=mongoose;

const faqSchema=new Schema({
    question:{type:String,required:true,},
    answer:{type:String,required:true,default:""},
    updateby:[{type:Schema.Types.ObjectId,ref:"user"}],
},{timestamps:true,versionKey:false});

const faqmodel=model("faq",faqSchema);
module.exports=faqmodel;
