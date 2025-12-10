const mongoose = require('mongoose');
const executorRepository=require('../repository/executor.repository');
const beneficiaryRepository=require('../repository/beneficiary.repository')

class Transition{

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


    async addExecutorDetails(req,res){
      try {
        const{name,email,phone}=req.body;  
        const userId=new mongoose.Types.ObjectId(req.user.id); 
        const check=await executorRepository.getByField({name});
        if(check) {
          if(check.name===name && check.email===email && check.phone===phone && check.userId.toString()===userId.toString()){
            return res.status(409).json({status:false,message:"Executor details already exists"});
          }   
        };  

        const plan={name,email,phone,userId};
        const executordata=await executorRepository.save(plan);

        if(!executordata) return res.status(400).json({status:false,message:"Failed To add executor Details"});

        return res.status(201).json({Status:true,message:"Successfully added executor details"});
      } catch (error) {
        console.log(error);
        return res.status(500).json({status:false,message:error.message})
      };
    };

    async deleteExecutor(req,res){
      try {
        const assetId=new mongoose.Types.ObjectId(req.params.id);
        if(!assetId) return res.status(400).json({status:false,message:"Failed to get Asset Id"});
        const assetdata=await debtsRepository.deleteById(assetId);
        if(!assetdata) return res.status(400).json({status:false,message:"Failed to delete asset"});
        return res.status(200).json({status:true,message:"Successfully deleted Asset"});
      } catch (error) {
        return res.status(500).json({status:false,message:error.message})
      }
    };

    async addBeneficirayDetails(req,res){
      try {
        const{name,email,phone}=req.body;  
        const userId=new mongoose.Types.ObjectId(req.user.id); 
        const check=await beneficiaryRepository.getByField({name});
        if(check) {
          if(check.name===name && check.email===email && check.phone===phone && check.userId.toString()===userId.toString()){
            return res.status(409).json({status:false,message:"Beneficary details already exists"});
          }   
        };  

        const plan={name,email,phone,userId};
        const executordata=await beneficiaryRepository.save(plan);

        if(!executordata) return res.status(400).json({status:false,message:"Failed To add beneficiary details"});

        return res.status(201).json({Status:true,message:"Successfully added executor details"});
      } catch (error) {
        console.log(error);
        return res.status(500).json({status:false,message:error.message})
      };
    };

    async deleteExecutor(req,res){
      try {
        const assetId=new mongoose.Types.ObjectId(req.params.id);
        if(!assetId) return res.status(400).json({status:false,message:"Failed to get Asset Id"});
        const assetdata=await debtsRepository.deleteById(assetId);
        if(!assetdata) return res.status(400).json({status:false,message:"Failed to delete asset"});
        return res.status(200).json({status:true,message:"Successfully deleted Asset"});
      } catch (error) {
        return res.status(500).json({status:false,message:error.message})
      }
    };


    
};
module.exports=new Transition();