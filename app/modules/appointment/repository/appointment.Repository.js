const appointmentmodel=require('../model/appointment.model');
const baseRepository=require('../../../helper/baseRepository');

class appointmentRepository extends baseRepository{
    constructor(){
        super(appointmentmodel)
    };
};
module.exports=new appointmentRepository();