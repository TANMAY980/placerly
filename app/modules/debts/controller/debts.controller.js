const mongoose = require('mongoose');
const debtsRepository=require('../repository/debts.repository');

class Assets{

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

    async getall(req, res) {
        try {
          let start = parseInt(req.body.start) || 0;
          let length = parseInt(req.body.length) || 10;
          let currentPage = 1;
    
          if (start > 0) {
            currentPage = parseInt((start + length) / length);
          }
          req.body.page = currentPage;
    
          let datas = await debtsRepository.getAll(req);
    
          let data = {
            recordsTotal: datas.totalDocs || 0,
            recordsFiltered: datas.totalDocs || 0,
            data: datas.docs || [],
          };
          return res.status(200).json({status: 200,data: data,message: `Data fetched successfully.`});
        } catch (error) {
          console.error("Error in Blog Controller:", error.message);
          return res.status(500).json({ status: 500, data: [], message: e.message });
        }
    };

    async addDebtAcoount(req,res){
      try {
        const{name,accounttype}=req.body;  
        const userId=new mongoose.Types.ObjectId(req.user.id); 
        const check=await debtsRepository.getByField({name});
        if(check) {
          if(check.name===name && check.accounttype===accounttype && check.userId.toString()===userId.toString()){
            return res.status(409).json({status:false,message:"Debt account already exists"});
          }   
        };  

        const plan={name,accounttype,userId};
        const debtdata=await debtsRepository.save(plan);

        if(!debtdata) return res.status(400).json({status:false,message:"Failed To create Debt account"});

        return res.status(201).json({Status:true,message:"Successfully created Debt account"});
      } catch (error) {
        console.log(error);
        return res.status(500).json({status:false,message:error.message})
      };
    };

    async deleteAsset(req,res){
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

    async updateDebtById(req,res){
      try {
        const{name,accounttype,status}=req.body
        if(!name || !accounttype || !status) return res.status(400).json({status:false,message:"Invalid Field"}); 
        const debtId=new mongoose.Types.ObjectId(req.params.id)
        const checkasset=await debtsRepository.getById(debtId);

        const updatedFields=[]
        if(name && checkasset.name!==name) updatedFields.push(`name:${name}`);
        if(accounttype && checkasset.accounttype!==accounttype) updatedFields.push(`accounttype:${accounttype}`);
        if(status && checkasset.status!==status) updatedFields.push(`status:${status}`);

        const updateOps={
          $set:{name,accounttype,status}
        };
        if(updatedFields.length){
          updateOps.$push={
            updatedInfo: {
            updatedfield: updatedFields,
            updatedby: req.user ? req.user.id : null,
            updatedAt: new Date()
          }
          }
        }
        const updatedebt=await debtsRepository.updateByField(updateOps,{_id:new mongoose.Types.ObjectId(req.params.id)});
        if(!updatedebt) return res.status(400).json({status:false,message:"Failed to update debt details"});
        return res.status(200).json({status:true,message:"Successfully updated debt details"})
      } catch (error) {
        req.flash("error", error.message);
        return res.status(500).json({ status: false, message: error.message });
      }
    };

    async changeDebtstatus(req,res){
      try {
        const {status}=req.body;
        const debtId=new mongoose.Types.ObjectId(req.params.id)
        const checkstatus = await debtsRepository.getById(debtId);
        const updatedFields = [];
        if (checkstatus && checkstatus !== checkstatus.status) updatedFields.push(`status:${status}`);

        const updateOps = {
          $set: { status },
        };
        if (updatedFields) {
          updateOps.$push = {
            updatedInfo: {
              updatedfield: updatedFields,
              updatedby: req.user ? req.user.id : null,
              updatedAt: new Date(),
            },
          };
        }

        const statusdata = await debtsRepository.updateById(updateOps,new mongoose.Types.ObjectId(assetId));
        if (!statusdata)return res.status(400).json({ status: false, message: "Failed To Change debt status" });
        return res.status(200).json({status: true,message: "debt Status changed Successfully"});
      } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
      }
    };
    
    async getdebtDetailsById(req, res) {
        try {
          const data = await debtsRepository.getDebtDetailsById({_id: new mongoose.Types.ObjectId(req.params.id)});
          if (!data) {
            req.flash("error", "Debt details not found");
            return res.redirect(generateUrl('admin.debt.access'));  
          };        
          res.render("debts/views/details.ejs", {
            page_name: "Debt Details",
            page_title: "Debt  details",
            response: data,
            user:req.user
          });
        } catch (error) {
          console.log(error);
          req.flash("error", error.message);
          return res.redirect(generateUrl('admin.debt.access'));  
        }
    };

    async getDebtsdetailsById(req,res){
      try {
        const data=await debtsRepository.getById({_id:new mongoose.Types.ObjectId(req.params.id)});
        if(!data) return res.status(400).json("Failed to fetch Details");
        return res.status(200).json({status:true,message:"Successfully fetched Debt details",data:data})
      } catch (error) {
        return res.status(500).json({status:false,message:error.messaeg});
      }
    }
};
module.exports=new Assets();