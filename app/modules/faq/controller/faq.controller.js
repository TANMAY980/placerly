const faqRepository = require("../repository/faq.repository");
const mongoose = require("mongoose");

class faq {

  async list(req, res) {
    try {
      const [total, active, inactive] = await Promise.all([
        faqRepository.getCountByParam({ isDeleted: false }),
        faqRepository.getCountByParam({ status: "active", isDeleted: false }),
        faqRepository.getCountByParam({ status: "inactive", isDeleted: false }),
      ]);
      res.render("faq/views/list.ejs", {
        page_name: "faq-list",
        page_title: "Faq list",
        stats: { total, active, inactive },
        user:req.user
      });
    } catch (error) {
      req.falsh("error", error.message);
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

      let datas = await faqRepository.getAll(req);

      let data = {
        recordsTotal: datas.totalDocs || 0,
        recordsFiltered: datas.totalDocs || 0,
        data: datas.docs || [],
      };
      return res.status(200).json({status: 200,data: data,message: `Data fetched successfully.`});
    } catch (error) {
      console.error("Error in Blog Controller:", e.message);
      return res.status(500).json({ status: 500, data: [], message: e.message });
    }
  };

  async createFaq(req, res) {
    try {
      const {question,answer} = req.body;
      const faq={question,answer,addedby:req.user.id};
      const faqdata=await faqRepository.save(faq);
      if (!faqdata) {
        return res.status(400).json({ status: false, message: "Failed to create Faq" });
      }
      return res.status(200).json({ status: true, message: "Faq created successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, message: "Faq created Successfully" });
    }
  };

  async getDetailsbyId(req,res){
    try {
      const data=await faqRepository.getFaqdetails({_id:new mongoose.Types.ObjectId(req.params.id)});
      if (!data) {
        req.flash("error", "Faq details not found");
        return res.redirect(generateUrl("admin.faq.access"));
      };
      res.render("faq/views/details",{
        page_title:"faq-management",
        page_name:"Faq details",
        response:data,
        user:req.user 
      });

    } catch (error) {
      req.flash("error", error.message);
      return res.redirect(generateUrl("admin.faq.access"));
    }
  };

  async getJsonDetails(req, res) {
    try {
      const faqdata = await faqRepository.getById({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
      if (!faqdata) {return res.status(400).json({ status: false, message: "Failed to retrieve faq details" });}
        return res.status(200).json({status: true,message: "Faq data fetched successfully",data: faqdata});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, message: error.message });
    }
  };

  async updateFaqdetails(req, res) {
    try {
      const { question, answer, status } = req.body;
      const faqId = req.params.id;
      
      const existingFaq = await faqRepository.getById(faqId);
      const updatedfields = [];
      if (question && question !== existingFaq.question)
        updatedfields.push("question");
      if (answer && answer !== existingFaq.answer) updatedfields.push("answer");
      if (status && status !== existingFaq.status) updatedfields.push("status");

      const updateOps = {
        $set: { question, answer, status },
      };
      if (updatedfields.length > 0) {
        updateOps.$push = {
          updatedInfo: {
            updatedfield: updatedfields,
            updatedby: req.user ? req.user.id : null,
            updatedAt: new Date(),
          },
        };
      };
      
      const updatefaq=await faqRepository.updateByField(updateOps,{
        _id:req.params.id
      });
      
      if(!updatefaq) return res.status(400).json({status:false,message:"Failed to update Faq"});
      return res.status(200).json({status:true,message:"Faq details updated successfully"})
    } catch (error) {
      return res.status(500).json({status:false,message:error.message})
    }
  };

  async changeFaqstatus(req,res){
    try {
      const {status}=req.body;
            const faqId=new mongoose.Types.ObjectId(req.params.id)
            const checkstatus = await faqRepository.getById(faqId);
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
            const statusdata = await faqRepository.updateById(updateOps,new mongoose.Types.ObjectId(faqId));
            if (!statusdata)return res.status(400).json({ status: false, message: "Failed To Change Faq status" });
              return res.status(200).json({status: true,message: "Faq Status changed Successfully"});
            } catch (error) {
              return res.status(500).json({ status: true, message: error.message });
            }
  };

  async faqDeletedbyId(req, res) {
    try {
      const faqId = new mongoose.Types.ObjectId(req.params.id);
      const faq = await faqRepository.deleteById(faqId);
      if (!faq) {
        return res.status(400).json({ status: false, message: "Failed to delete Faq" });
      }
      return res.status(200).json({ Status: true, message: "Faq Deleted successfully" });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  };
}
module.exports = new faq();
