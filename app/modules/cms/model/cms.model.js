const mongoose = require("mongoose");
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const {Schema,model } = mongoose;

const cmsSchema = new Schema(
  {
    title:{type:String,required: true,index:true},
    content:{type:String,required:true},
    bannerImage:[{ type:String,default: "" }],
    status:{type:String,enum:["active","inactive"],default: "active" },
    addedby:{type:Schema.Types.ObjectId,ref:"user"},
    updatedInfo: [
      {
        updatedfield: [{type:String,default:""}],
        updatedby:{type:Schema.Types.ObjectId,ref:"user" },
        updatedAt: {type:Date,default:Date.now()},
      },
    ],
    isDeleted:{type:Boolean,default:false},
  },{timestamps:true,versionKey:false});

cmsSchema.plugin(mongooseAggregatePaginate);
const cmsmodel = model("cms", cmsSchema);
module.exports=cmsmodel;
