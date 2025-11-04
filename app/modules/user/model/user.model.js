const mongoose=require('mongoose')
const {Schema,model}=mongoose
const userSchema=new Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true,index:true},
    contactNumber:{type:String,required:true,index:true},
    password:{type:String,required:true},
    previous_Password:[{type:String,default:''}],
    role:{type:String,enum:["admin","user"],default:"user"},
    image:{type:String,default:''},
    terms_conditon:{type:Boolean,required:true,default:false},
    is_verified:{type:Boolean,default:false},
    subscription:[{type:mongoose.Schema.Types.ObjectId,ref:"subscription"}],
    status:{type:String,enum:["block","unblock"],default:"unblock"}
},{timestamps:true,versionKey:false})
const usermodel=model("user",userSchema)
module.exports=usermodel