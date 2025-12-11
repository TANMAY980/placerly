const mongoose=require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const{Schema,model}=mongoose;

const orderSchema = new Schema({
    subsId: { type: Schema.Types.ObjectId, ref: "subscription" },
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    paymentId: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    boughtAt: { type: Date }
}, { timestamps: true, versionKey: false });

orderSchema.plugin(mongooseAggregatePaginate);
const ordermodel=model("order",orderSchema)
module.exports=ordermodel