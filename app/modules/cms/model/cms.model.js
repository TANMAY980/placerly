const mongoose=require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const{Schema,model}=mongoose;

const cmsSchema=new Schema({
    about:[{
        title: { type: String, required: true },
        subtitle: { type: String },
        description: { type: String, required: true },
        image: { type: String },
        updatedAt: { type: Date, default: Date.now }
    }],
    legal:[{
        title:{ type: String, required: true },
        slug: { type: String, unique: true },
        content: { type: String, required: true }, 
        updatedAt: { type: Date, default: Date.now }
    }],
    banner:[{
        title: { type: String, required: true },
        subtitle: { type: String },
        image: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    updatedby:[{type:Schema.Types.ObjectId,ref:"user"}]

},{timestamps:true,versionKey:false});

cmsSchema.plugin(mongooseAggregatePaginate);

const cmsmodel=model('cms',cmsSchema);
module.exports= cmsmodel;
