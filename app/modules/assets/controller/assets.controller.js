const mongoose = require('mongoose');
const assetRepository=require('../repository/assets.repository');

class Assets{

    async list(req,res){
        try {
            const[total,active,inactive,cashaccount,stockaccount]=await Promise.all([
                assetRepository.getCountByParam({isDeleted:false}),
                assetRepository.getCountByParam({status:"active",isDeleted:false}),
                assetRepository.getCountByParam({status:"inactive",isDeleted:false}),
                assetRepository.getCountByParam({accounttype:"cash",isDeleted:false}),
                assetRepository.getCountByParam({accounttype:"stock",isDeleted:false}),
                
            ]);
            res.render("assets/views/list",{
                page_name:"Assets List",
                page_title:"Assets manage list",
                stats:{total,active,inactive,cashaccount,stockaccount},
                user:req.user
            })
        } catch (error) {
            console.log(error);
            req.flash("error",error.message);
            return res.redirect(generateUrl('admin.dashboard.access'));  
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
    
          let datas = await assetRepository.getAll(req);
    
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

    async createAsset(req,res){
      try {
        const{ name,accounttype}=req.body;
        const userId=new mongoose.Types.ObjectId(req.user.id);
        if(!name ||!accounttype) return res.status(409).json({status:false,messaeg:"Name and account tpe required"});     
        const check=await assetRepository.getByField({name});
        
        if(check) {
          if(check.name===name && check.accounttype===accounttype && check.userId.toString()===userId.toString()){
            return res.status(409).json({status:false,message:"Asset account already exists"});
          }   
        }; 
        const plan={name,accounttype,userId};
        const assstdata=await assetRepository.save(plan);
        if(!assstdata) return res.status(400).json({status:false,message:"Failed To create Asset"});

        return res.status(201).json({Status:true,message:"Successfully created Asset"});
      } catch (error) {
        console.log(error);
        return res.status(500).json({status:false,message:error.message})
      };
    };

    async deleteAsset(req,res){
      try {
        const assetId=new mongoose.Types.ObjectId(req.params.id);
        if(!assetId) return res.status(400).json({status:false,message:"Failed to get Asset Id"});
        const assetdata=await assetRepository.deleteById(assetId);
        if(!assetdata) return res.status(400).json({status:false,message:"Failed to delete asset"});
        return res.status(200).json({status:true,message:"Successfully deleted Asset"});
      } catch (error) {
        return res.status(500).json({status:false,message:error.message})
      }
    };

    async updateAssetById(req,res){
      try {
        const{name,accounttype,status}=req.body
        if(!name || !accounttype || !status) return res.status(400).json({status:false,message:"Invalid Field"}); 
        const assetId=new mongoose.Types.ObjectId(req.params.id)
        const checkasset=await assetRepository.getById(assetId);

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
        const updateasset=await assetRepository.updateByField(updateOps,{_id:new mongoose.Types.ObjectId(req.params.id)});
        if(!updateasset) return res.status(400).json({status:false,message:"Failed to update asset details"});
        return res.status(200).json({status:true,message:"Successfully updated asset details"})
      } catch (error) {
        req.flash("error", error.message);
        return res.status(500).json({ status: false, message: error.message });
      }
    };

    async changeAssetstatus(req,res){
      try {
        const {status}=req.body;
        const assetId=new mongoose.Types.ObjectId(req.params.id)
        const checkstatus = await assetRepository.getById(assetId);
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

        const statusdata = await assetRepository.updateById(updateOps,new mongoose.Types.ObjectId(assetId));
        if (!statusdata)return res.status(400).json({ status: false, message: "Failed To Change Asset status" });
        return res.status(200).json({status: true,message: "Asset Status changed Successfully"});
      } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
      }
    };
    
    async getassetDetailsById(req, res) {
        try {
          const data = await assetRepository.getAssetDetailsById({_id: new mongoose.Types.ObjectId(req.params.id)});
          if (!data) {
            req.flash("error", "Asset details not found");
            return res.redirect(generateUrl('admin.dashboard.access'));  
          };        
          res.render("assets/views/details.ejs", {
            page_name: "Asset plan Details",
            page_title: "Asset plan details",
            response: data,
            user:req.user
          });
        } catch (error) {
          console.log(error);
          req.flash("error", error.message);
          return res.redirect(generateUrl('admin.dashboard.access'));  
        }
    };

    async getAssetdetailsById(req,res){
      try {
        const data=await assetRepository.getById({_id:new mongoose.Types.ObjectId(req.params.id)});
        if(!data) return res.status(400).json("Failed to fetch Details");
        return res.status(200).json({status:true,message:"Successfully fetched Asset details",data:data})
      } catch (error) {
        return res.status(500).json({status:false,message:error.messaeg});
      }
    }
};
module.exports=new Assets();