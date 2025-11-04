const mongoose=require('mongoose');
const baseRepository=require('../../../helper/baseRepository');
const usermodel=require('../model/user.model')

class userRepository extends baseRepository{
    constructor(){
       super(usermodel) 
    }
    async fetch_profile_details(data){
        try {
            const user_data=await usermodel.aggregate([
                {
                    $match:{_id:new mongoose.Types.ObjectId(data)}
                },
                {
                    $project:{
                        _id:0,
                        firstName:1,
                        lastName:1,
                        email:1,
                        contactNumber:1,
                        image:1,
                        subscription:1
                    }
                }
            ])
            return user_data;
            
        } catch (error) {
            throw error;
        }
    }
}
module.exports=new userRepository()