const Razorpay =require('razorpay')
const PaymentModel=require('../model/payment.model');
const crypto=require('crypto')


class Payment{
    async checkout(req,res){
        try {
            var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_API_SECRET })
            const options={
                amount: Number(req.body.amount * 100),
                currency: "INR"
            }
            const order=await instance.orders.create(options)
            if(!order) return res.status(200).json({status:false,message:"failed to create order"})
            return res.status(200).json({status:true,message:"order created successfully",order});
        } catch (error) {
            console.log(error);
            return res.status(500).json({status:false,messaeg:error.message});
        }
    }

    async paymentVerification(req,res){
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =req.body
            const body = razorpay_order_id + "|" + razorpay_payment_id
            const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET).update(body.toString()).digest("hex");
            const isAuthentic = expectedSignature === razorpay_signature; 
            if (isAuthentic){
                await PaymentModel.create({
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                });
            res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`);
            } else {
                return res.status(400).json({success: false});
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({success: false}); 
        }
    }
}

module.exports=new Payment();