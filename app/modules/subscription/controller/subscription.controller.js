const mongoose = require('mongoose');
const subscriptionRepository=require('../repository/subscription.repository');

class subscription{

    async list(req,res){
        try {
            const[total,active,inactive]=await Promise.all([
                subscriptionRepository.getCountByParam({isDeleted:false}),
                subscriptionRepository.getCountByParam({status:"active",isDeleted:false}),
                subscriptionRepository.getCountByParam({status:"inactive",isDeleted:false})
            ]);
            res.render("subscription/views/list",{
                page_name:"Subscription Plan List",
                page_title:"Subscription plan manage",
                stats:{total,active,inactive},
                user:req.user
            })
        } catch (error) {
            console.log(error);
            req.flash("error",error.message)  
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
    
          let datas = await subscriptionRepository.getAll(req);
    
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

    async createSubsPlan(req,res){
      try {
        const{ name,charges,inclusions,details,duration}=req.body;
        const check=await subscriptionRepository.getByField({name});
        if(check) return res.status(409).json({status:false,messaeg:"Subscription plan already exists"});

        const plan={name,charges:Number(charges),inclusions,details,duration,addedby:req.user.id};
        const subsdata=await subscriptionRepository.save(plan);

        if(!subsdata) return res.status(400).json({status:false,message:"Failed To create Subscription Plan"});

        return res.status(201).json({Status:true,message:"Successfully created Subscription Plan"});
      } catch (error) {
        console.log(error);
        return res.status(500).json({status:false,message:error.message})
      };
    };

    async deleteSubsPlan(req,res){
      try {
        const subsId=new mongoose.Types.ObjectId(req.params.id);
        if(!subsId) return res.status(400).json({status:false,message:"Failed to get Subscription Id"});
        const subsdata=await subscriptionRepository.deleteById(subsId);
        if(!subsdata) return res.status(400).json({status:false,message:"Failed to delete Subscription"});
        return res.status(200).json({status:true,message:"Successfully deleted Subscription"});
      } catch (error) {
        return res.status(500).json({status:false,message:error.message})
      }
    };

    async updateSubsById(req,res){
      try {
        const{name,charges,inclusions,details,duration,status}=req.body
         
        const subsId=new mongoose.Types.ObjectId(req.params.id)
        const checksubs=await subscriptionRepository.getById(subsId);

        const updatedFields=[]
        if(name && checksubs.name!==name) updatedFields.push(`name:${name}`);
        if(charges && checksubs.charges!==charges) updatedFields.push(`charges:${charges}`);
        if(inclusions && checksubs.inclusions!==inclusions) updatedFields.push(`inclusions:${inclusions}`);
        if(details && checksubs.details!==details) updatedFields.push(`details:${details}`);
        if(duration && checksubs.duration!==duration) updatedFields.push(`duration:${duration}`);
        if(status && checksubs.status!==status) updatedFields.push(`status:${status}`);

        const updateOps={
          $set:{name,charges,inclusions,details,duration,status}
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
        const updatesubs=await subscriptionRepository.updateByField(updateOps,{_id:new mongoose.Types.ObjectId(req.params.id)});
        if(!updatesubs) return res.status(400).json({status:false,message:"Failed to update subscription details"});
        return res.status(200).json({status:true,message:"Successfully updated Subscription details"})
      } catch (error) {
        req.flash("error", error.message);
        return res.status(500).json({ status: false, message: error.message });
      }
    };

    async changeSubstatus(req,res){
      try {
        const {status}=req.body;
        const subsId=new mongoose.Types.ObjectId(req.params.id)
        const checkstatus = await subscriptionRepository.getById(subsId);
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

        const statusdata = await subscriptionRepository.updateById(updateOps,new mongoose.Types.ObjectId(subsId));
        if (!statusdata)return res.status(400).json({ status: false, message: "Failed To Change Subscription status" });
        return res.status(200).json({status: true,message: "Subscription Status changed Successfully"});
      } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
      }
    };
    
    async getSubscriptionDetailsById(req, res) {
        try {
          const data = await subscriptionRepository.getSubscriptionDetailsById({_id: new mongoose.Types.ObjectId(req.params.id)});
          if (!data) {
            req.flash("error", "Subscription details not found");
            return res.redirect("admin.subcription.access");
          };        
          res.render("subscription/views/details.ejs", {
            page_name: "Subscription plan Details",
            page_title: "Subscription plan details",
            response: data,
            user:req.user
          });
        } catch (error) {
          console.log(error);
          req.flash("error", error.message);
          res.redirect(generateUrl("admin.subscription.access"));
        }
    };

    async getSubsbdetailsById(req,res){
      try {
        const data=await subscriptionRepository.getById({_id:new mongoose.Types.ObjectId(req.params.id)});
        if(!data) return res.status(400).json("Failed to fetch Details");
        return res.status(200).json({status:true,message:"Successfully fetched subscription details",data:data})
      } catch (error) {
        return res.status(500).json({status:false,message:error.messaeg});
      }
    }
};
module.exports=new subscription();