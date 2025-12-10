const appointmentRepository=require('../repository/appointment.Repository');
const mongoose=require('mongoose');
const userRepository=require('../../user/repository/user.repostiroy');
class Appointment{

    async assignAppointment(req,res){
        try {
            const{name,email,phone,serviceType,message}=req.body;
            const userId=new mongoose.Types.ObjectId(req.user.id)
            if(!name||!email || !phone || !serviceType || !message){
                req.flash("error","Please enter all the required fields");
                return res.redirect(generateUrl('user.home'));
            };
            const checkuser=await userRepository.getByField({email});
            if(!checkuser){
                req.flash("error","Please create account using your email");
                return res.redirect(generateUrl('user.registraion.page'));
            }
            if(!checkuser.subscription|| checkuser.subscription.length === 0){
                req.flash("error","Please choose your subscription plan");
                return res.redirect(generateUrl('user.subscription.page'));
            };
            const data={name,email,phone,serviceType,message,userId}
            const saveappointment=await appointmentRepository.save(data);
            if(!saveappointment){
                req.flash("error","Failed to book an appointment");
            }
            req.flash('success',"Appointment booked successfully");

        } catch (error) {
            console.log(error);
            req.flash("error","Soemthing went wrong");
            return res.redirect(generateUrl('user.home'));
        }
    };
};
module.exports=new Appointment();