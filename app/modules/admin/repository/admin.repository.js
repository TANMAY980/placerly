const baseRepository=require('../../../helper/baseRepository');
const usermodel=require('../../user/model/user.model');

class adminRepository extends baseRepository{
    constructor(){
        super(usermodel)
    };

    async userDetails(filter){
        try {
           const data= await usermodel.aggregate([
            {
                $match:filter,
            },
            {
                $lookup:{
                    from:"subscriptions",
                    localField:"subscription",
                    foreignField:"_id",
                    as:"subscription"
                }
            },
            {
                $project:{
                    firstName:1,
                    lastName:1,
                    email:1,
                    contactNumber:1,
                    is_verified:1,
                    image:1,
                    status:1,
                    subscription:1,
                    createdAt:1
                }
            },
           ])     
           return data.length?data[0]:null 
        } catch (error) {
            throw error
        }
    };

};
module.exports=new adminRepository();
