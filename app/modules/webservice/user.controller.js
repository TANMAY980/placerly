const uploadimage=require('../../config/cloudinary.config');
const userRepostiroy = require('../user/repository/user.repostiroy');

class User{
    async upload_Image(req,res){
        try {
            const userId=req.params.id
            if(!userId)return res.staus(400).json({status:false,message:"Missing userid"})
            if(!req.file) return res.status(400).json({status:false,message:"Image is missing"});
            const imageUrl=req.file.path;
            const user=await userRepostiroy.updateByField({userId,
                image:imageUrl
            })
            if(user){
                return res.status(200).json({status:true,message:"Successfully uploaded image"})
            }
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({status:false,message:error.message})
            
        }
    }
    
    async fetch_details(req,res){
        try {
            const userId=req.params.id;
            if(!userId)return res.status(400).json({status:false,message:"Failed to get user id"});
            const userData=await userRepostiroy.fetch_profile_details(userId);
            
            if(!userData) return res.status(400).json({status:false,message:"Unable to fetch profile details"});
            return res.status(200).json({status:true,message:"Profile details fetched successfully",data:userData})
        } catch (error) {
            console.log(error);
            return res.status(500).json({status:false,message:error.message})
        }
    }
}
module.exports=new User();