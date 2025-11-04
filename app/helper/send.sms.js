const twilio=require('twilio')(process.env.TWILIO_SID,process.env.TWILIO_AUTH_TOKEN)
class Sms{
    async sendRegisterSms(req,res,user){
        try {
            
            const message=await twilio.messages.create({
                body:`dear ${user.email} your registration is successfull `,
                from: process.env.TWILIO_NUMBER,
                to:user.contactNumber
            
            })
            return true
        } catch (error) {
            console.log(error);
            
        }
    }
}
module.exports=new Sms()