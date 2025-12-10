const mongoose = require('mongoose');
const utilityRepository=require('../repository/utility.repository');

class Utility{

    async list(req,res){
        try {
            const[total,active,inactive,creditcardaccount,mortageccount]=await Promise.all([
                debtsRepository.getCountByParam({isDeleted:false}),
                debtsRepository.getCountByParam({status:"active",isDeleted:false}),
                debtsRepository.getCountByParam({status:"inactive",isDeleted:false}),
                debtsRepository.getCountByParam({accounttype:"creditCard",isDeleted:false}),
                debtsRepository.getCountByParam({accounttype:"mortage",isDeleted:false}),
                
            ]);
            res.render("debts/views/list",{
                page_name:"Debts List",
                page_title:"Debts manage list",
                stats:{total,active,inactive,creditcardaccount,mortageccount},
                user:req.user
            })
        } catch (error) {
            console.log(error);
            req.flash("error",error.message);
            return res.redirect(generateUrl('admin.debts.access'));  
        }
    };

    async addUtilityAcoount(req,res){
      try {
        const{name,accounttype}=req.body;  
        const userId=new mongoose.Types.ObjectId(req.user.id); 
        const check=await utilityRepository.getByField({name});
        if(check) {
          if(check.name===name && check.accounttype===accounttype && check.userId.toString()===userId.toString()){
            return res.status(409).json({status:false,message:"Utility account already exists"});
          }   
        };  

        const plan={name,accounttype,userId};
        const debtdata=await utilityRepository.save(plan);

        if(!debtdata) return res.status(400).json({status:false,message:"Failed add utility account"});

        return res.status(201).json({Status:true,message:"Successfully added utility account"});
      } catch (error) {
        console.log(error);
        return res.status(500).json({status:false,message:error.message})
      };
    };

    async deleteAsset(req,res){
      try {
        const assetId=new mongoose.Types.ObjectId(req.params.id);
        if(!assetId) return res.status(400).json({status:false,message:"Failed to get Asset Id"});
        const assetdata=await utilityRepository.deleteById(assetId);
        if(!assetdata) return res.status(400).json({status:false,message:"Failed to delete asset"});
        return res.status(200).json({status:true,message:"Successfully deleted Asset"});
      } catch (error) {
        return res.status(500).json({status:false,message:error.message})
      }
    };
  

    
};
module.exports=new Utility();