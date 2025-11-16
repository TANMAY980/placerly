const cmsRepository=require('../repository/cms.repository');
const mongoose=require('mongoose');
class cms {
  async list(req,res) {
    try {
      const [total, active, inactive] = await Promise.all([
        cmsRepository.getCountByParam({ isDeleted: false }),
        cmsRepository.getCountByParam({ status: "active", isDeleted: false }),
        cmsRepository.getCountByParam({ status: "inactive", isDeleted: false }),
      ]);
      res.render("cms/views/list", {
        page_name: "Cms List",
        page_title: "Cms manage",
        stats: { total, active, inactive },
      });
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
    }
  };

  async getall(req,res) {
    try {
      let start = parseInt(req.body.start) || 0;
      let length = parseInt(req.body.length) || 10;
      let currentPage = 1;

      if (start > 0) {
        currentPage = parseInt((start + length) / length);
      }
      req.body.page = currentPage;

      let datas = await cmsRepository.getAll(req);

      let data = {
        recordsTotal: datas.totalDocs || 0,
        recordsFiltered: datas.totalDocs || 0,
        data: datas.docs || [],
      };
      return res.status(200).json({status: 200,data: data,message: `Data fetched successfully.`});
    } catch (error) {
      console.error("Error in Cms Controller:", error.message);
      return res.status(500).json({ status: 500, data: [], message: e.message });
    }
  };

  async cmsCreate(req, res) {
    try {
      const { title,content } = req.body;  
      const imageUrls = (req.files || []).map((file) => file.path);
      const cms = { title, content, bannerImage: imageUrls };
      const cmsdata = await cmsRepository.save(cms);

      if (!cmsdata) {
        return res.status(400).json({ status: false, message: "Failed to add cms" });
      }
      return res.status(200).json({ status: true, message: "Cms Added Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, messaeg: error.message });
    }
  };

  async cmsStatusChange(req, res) {
      try {
        const { status } = req.body;
        const cmsId=req.params.id;
        const checkexist=await cmsRepository.getById(cmsId);
        const updatedFields=[];
        if(checkexist && checkexist.status!==status)updatedFields.push(`status:${status}`);
        const updateOps={
          $set:{status}
        };
        if(updatedFields.length){
          updateOps.$push={
            updatedInfo:{
                updatedfield:updatedFields,
                updatedby: req.user?req.user._id:null,
                updatedAt:new Date()
            }
          }
        };
        
        const cmsdata = await cmsRepository.updateById(updateOps,{_id:new mongoose.Types.ObjectId(cmsId)});
        if (!cmsdata) return res.status(400).json({ status: false, message: "Failed to update cms status" });
        return res.status(200).json({ status: true, message: "Successfully updated cms status" });
      } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
      }
  };

  async getcmsDetailsById(req,res){
    try {
      const cmsdata=await cmsRepository.getcmsdetails({_id:new mongoose.Types.ObjectId(req.params.id)});
      if(!cmsdata) return res.status(400).json({status:false,message:"Failed To get cms details"});
      return res.status(200).json({status:true,message:"Successfully fetched cms data", data:cmsdata});
    } catch (error) {
      return res.status(500).json({status:false,message:error.message});
    }
  };

  async updateCmsDetailsById(req, res) {
    try {
      const {title, content, status } = req.body;
      const cmsId = req.params.id;
      const existingCms = await cmsRepository.getById(cmsId);
      const updatedFields = [];
      if (title && title !== existingCms.title) updatedFields.push(`title:${title}`);
      if (content && content !== existingCms.content)updatedFields.push(`content:${content}`);
      if (status && status !== existingCms.status)updatedFields.push(`status:${status}`);
      const updateOps = {
        $set: { title, content, status },
      };

      if (updatedFields.length) {
        updateOps.$push = {
          updatedInfo: {
            updatedfield: updatedFields,
            updatedby: req.user ? req.user._id : null,
            updatedAt: new Date(),
          },
        };
      }

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => file.path);

        existingCms.bannerImage = Array.isArray(existingCms.bannerImage)
          ? [...existingCms.bannerImage, ...newImages]
          : newImages;
      }

      const updatecmsdetails = await cmsRepository.updateByField(updateOps, {_id: req.params.id});

      if (!updatecmsdetails) {
        return res.status(400).json({ status: false, message: "Failed to updated Cms" });
      }
      return res.status(200).json({ status: true, message: "updated blog Cms successfully" });
    } catch (error) {
      req.flash("error", error.message);
      return res.status(500).json({ status: false, message: error.message });
    }
  };

  async getcmsDetailsPageById(req,res){
    try {
      const cmsdata=await cmsRepository.getcmsdetails({_id:new mongoose.Types.ObjectId(req.params.id)});
      if(!cmsdata){
        req.falsh("error", "Cms details not found");
        return res.redirect("admin.cms.access");
      };
      res.render("cms/views/details",{
        page_title:"Cms Details",
        page_name:"Cms Details",
        response:cmsdata
      });
      
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect(generateUrl("admin.cms.access"));
    }
  };

  async deletecms(req,res){
    try {
        const cmsId=new mongoose.Types.ObjectId(req.pararms.id);
        const cms=await cmsRepository.deleteById(cmsId);
        if(!cms) return res.status(400).json({status:false,message:"Failed To delete Cms"});
        return res.status(200).json({status:true,message:"Cms deleted successfully"});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message});
    }
  };


}
module.exports=new cms()