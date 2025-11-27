const queriesRepository=require('../repository/support.queries.repository');
const mongoose =require('mongoose');

class supportquery{

    async list(req,res){
        try {
            const [total,inactive,active,pending,processing,resolved,low,high,medium]=await Promise.all([
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
                stats:{total,inactive,active,pending,processing,resolved,low,high,medium}
            })
        } catch (error) {
            console.log(error);
            req.flash("error", error.message);
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
        const support=await queriesRepository.getdetailsById({_id:new mongoose.Types.ObjectId(req.params.id)});
        if (!support) {
        req.falsh("error", "Blog details not found");
        return res.redirect("admin.queries.access");
      }
      res.render("support/views/details",{
        page_title:"Query Details",
        page_name:"Query Details",
        response:data,
      })
      }catch(error){
        req.flash("error", error.message);
        res.redirect(namedRouter.urlFor("admin.queries.access"));
      }
    };

    async changestatus(req,res){
      try{
        const{status}=req.body;
        const queryId=req.params.id;

        const checkstatus=await queriesRepository.getById(queryId);
        const updatedFields=[];
        if(checkstatus && checkstatus!==status)updatedFields.push(`status:${status}`);

        const updateOps={
          $set:{status}
        };
        if(updatedFields.length){
          updateOps.$push={
            updateInfo:{
                updatedfield:updatedFields,
                updatedby: req.user?req.user._id:null,
                updatedAt:new Date()
              }
          }
        };

        const statusdata=await queriesRepository.updateById(updateOps, new mongoose.Types.ObjectId(queryId));
        if(!statusdata) return res.status(400).json({status:false,message:"Failed To Change Qury status"});
        return res.status(200).json({status:true,message:"Queries Status changed Successfully"})
      }catch(error){
        return res.status(500).json({ status: false, message: error.message });
      }
    };

    async priorityChange(req,res){
      try {
        const{priority}=req.body;
        const queryId=req.params.id
        const checkpriority=await queriesRepository.getById(queryId);

        const updatedFields=[];
        if(checkpriority && checkpriority.priority!==priroty)  updatedFields.push(`priority:${priority}`);

        const updateOps={
          $set:{priority}
        };
        if(updatedFields.length){
          updateOps.$push={
              updateInfo:{
                updatedfield:updatedFields,
                updatedby: req.user?req.user._id:null,
                updatedAt:new Date()
              }
          }
        };

        const data=await queriesRepository.updateById(updateOps, new mongoose.Types.ObjectId(queryId));
        if(!data) return res.status({status:false,message:"Failed To change priority status"});
        return res.status({status:true,message:"Successfully changed Priority Status"})
      } catch (error) {
        return res.status(500).jsno({status:false,message:error.message});
      }
    };

    async progressChange(req,res){
      try {
        const{progressstatus}=req.body;
        const queryId=req.params.id;
        const checkProgressStatus=await queriesRepository.getById(queryId);
        const updatedFields=[];
        if(checkProgressStatus && checkProgressStatus.progressstatus!==progressstatus) updatedFields.push(`progressstatus:${progressstatus}`)
        
        const updateOps={
          $set:{progressstatus},
        } 
        if (updatedFields.length > 0) {
          {
            updateOps.$push={
              updatedInfo:{
                updatedfield:updatedFields,
                updatedby: req.user?req.user._id:null,
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

};
module.exports=new supportquery();