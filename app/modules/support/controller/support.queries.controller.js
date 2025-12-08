const queriesRepository=require('../repository/support.queries.repository');
const mongoose =require('mongoose');

class supportquery{

    async list(req,res){
        try {
            const [total,active,inactive,pending,processing,resolved,low,high,medium]=await Promise.all([
               queriesRepository.getCountByParam({isDeleted:false}),
               queriesRepository.getCountByParam({isDelted:false,status:"active"}),
               queriesRepository.getCountByParam({isDeleted:false,status:"inactive"}),
               queriesRepository.getCountByParam({isDelted:false,progressstatus:"pending"}),
               queriesRepository.getCountByParam({isDelted:false,progressstatus:"processing"}),
               queriesRepository.getCountByParam({isDelted:false,progressstatus:"resolved"}),
               queriesRepository.getCountByParam({isDelted:false,priority:"low"}),
               queriesRepository.getCountByParam({isDelted:false,priority:"medium"}),
               queriesRepository.getCountByParam({isDelted:false,priority:"high"}),

            ]);
            res.render("support/views/list.ejs",{
                page_name:"Query Support List",
                page_title:"Query Support",
                stats:{total,inactive,active,pending,processing,resolved,low,high,medium},
                user:req.user
            })
        } catch (error) {
            console.log(error);
            req.flash("error", error.message);
            return res.redirect(generateUrl("admin.dashboard.access")); 
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
    
          let datas = await queriesRepository.getAll(req);
    
          let data = {
            recordsTotal: datas.totalDocs || 0,
            recordsFiltered: datas.totalDocs || 0,
            data: datas.docs || [],
          };
          return res.status(200).json({
            status: 200,
            data: data,
            message: `Data fetched successfully.`,
          });
        } catch (error) {
          console.error("Error in Blog Controller:", e.message);
          return res
            .status(500)
            .json({ status: 500, data: [], message: e.message });
        }
    };

    async getSupportDetailsById(req,res){
      try{
        const data=await queriesRepository.getdetailsById({_id:new mongoose.Types.ObjectId(req.params.id)});
        if (!data) {
        req.flash("error", "Blog details not found");
        return res.redirect("admin.queries.access");
      }
      res.render("support/views/details",{
        page_title:"Query Details",
        page_name:"Query Details",
        response:data,
        user:req.user
      })
      }catch(error){
        req.flash("error", error.message);
        return res.redirect(generateUrl("admin.queries.access"));
      }
    };

    async changestatus(req,res){
      try{
        const{status}=req.body;
        if(!status) return res.status(400).json({status:false,message:"Invalid status value"})
        const supportId=req.params.id;
        const checkstatus=await queriesRepository.getById(supportId);
        if(!checkstatus) return res.status(400).json({status:false,message:"Failed To get Support"})
        const updatedFields=[];
        if(checkstatus && checkstatus!==status)updatedFields.push(`status:${status}`);

        const updateOps={
          $set:{status}
        };
        if(updatedFields.length){
          updateOps.$push={
            updatedInfo:{
                updatedfield:updatedFields,
                updatedby: req.user?req.user.id:null,
                updatedAt:new Date()
              }
          }
        };

        const statusdata=await queriesRepository.updateById(updateOps, new mongoose.Types.ObjectId(supportId));
        if(!statusdata) return res.status(400).json({status:false,message:"Failed To Change Qury status"});
        return res.status(200).json({status:true,message:"Queries Status changed Successfully"})
      }catch(error){
        return res.status(500).json({ status: false, message: error.message });
      }
    };

    async progressChange(req,res){
      try {
        const{progressstatus}=req.body;        
        if(!progressstatus)return res.status(400).json({status:false,message:" Progress Status value required "});
        const queryId=req.params.id;
        const checkProgressStatus=await queriesRepository.getById(queryId);
        if(!checkProgressStatus) return res.status(400).json({status:false,message:"Failed To get Support"});
        const updatedFields=[];
        if(checkProgressStatus && checkProgressStatus.progressstatus!==progressstatus) updatedFields.push(`progressstatus:${progressstatus}`);
        const updateOps={
          $set:{progressstatus},
        };
        if(progressstatus==="resolved"){
            updateOps.$set.resolvedby=req.user?req.user.id:null
            updateOps.$set.status="inactive"
        }; 
        if (updatedFields.length > 0) {
          {
            updateOps.$push={
              updatedInfo:{
                updatedfield:updatedFields,
                updatedby: req.user?req.user.id:null,
                updatedAt:new Date()
              }
            }
          }
        }
        const data=await queriesRepository.updateById(updateOps, new mongoose.Types.ObjectId(queryId));
        
        if(!data) return res.status(400).json({status:false,message:"Failed to change Query Progress Status "});
        return res.status(200).json({status:true,message:"Successfully Query Progress Status Changed"});
      } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
      }
    };

    async priorityChange(req,res){
      try {
        const{priority}=req.body;
        if(!priority) return res.status(400).json({status:false,message:"Failed toget priority value"});
        const queryId=req.params.id
        const checkpriority=await queriesRepository.getById(queryId);
        if(!checkpriority) return res.status(400).json({status:false,message:"Failed To get Support"});

        const updatedFields=[];
        if(checkpriority && checkpriority.priority!==priority) updatedFields.push(`priority:${priority}`);

        const updateOps={
          $set:{priority}
        };
        if(updatedFields.length){
          updateOps.$push={
              updatedInfo:{
                updatedfield:updatedFields,
                updatedby: req.user?req.user.id:null,
                updatedAt:new Date()
              }
          }
        };
        
        const data=await queriesRepository.updateById(updateOps, new mongoose.Types.ObjectId(queryId));
        if(!data) return res.status(400).json({status:false,message:"Failed To change priority status"});
        return res.status(200).json({status:true,message:"Successfully changed Priority Status"})
      } catch (error) {
        return res.status(500).json({status:false,message:error.message});
      }
    };

    

};
module.exports=new supportquery();