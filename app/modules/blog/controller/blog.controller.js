const blogRepository = require("../repository/blog.repository");
const mongoose = require("mongoose");
class Blog {
  
  async list(req, res) {
    try {
      const [total, active, inactive] = await Promise.all([
        blogRepository.getCountByParam({ isDeleted: false }),
        blogRepository.getCountByParam({ status: "active", isDeleted: false }),
        blogRepository.getCountByParam({status: "inactive",isDeleted: false}),
      ]);

      res.render("blog/views/list.ejs", {
        page_name: "Blog List",
        page_title: "Blog List",
        stats: { total, active, inactive },
      });
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

      let datas = await blogRepository.getAll(req);

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

  async BlogCreate(req, res) {
    try {
      const { name, title, description } = req.body;
      const imageUrls = (req.files || []).map((file) => file.path);
      const blog = { name, title, description, coverImage: imageUrls };

      const blogdata = await blogRepository.save(blog);

      if (!blogdata) {
        return res
          .status(400)
          .json({ status: false, message: "Failed to add blog" });
      }
      return res
        .status(200)
        .json({ status: true, message: "Blog Added Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, messaeg: error.message });
    }
  };

  async getBlogdetailsbyId(req, res) {
    try {
      const data = await blogRepository.getblogdetails({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
      if (!data) {
        req.falsh("error", "Blog details not found");
        return res.redirect("admin.blog.access");
      }
      res.render("blog/views/details", {
        page_name: "Blog-details",
        page_title: "Blog Details",
        response: data,
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect(namedRouter.urlFor("admin.blog.access"));
    }
  };

  async blogStatusChange(req, res) {
    try {
      const { status } = req.body;
      const blogdata = await blogRepository.updateById(
        { status: status },
        req.params.id
      );

      if (!blogdata) {
        return res
          .status(400)
          .json({ status: false, message: "Failed to update blog status" });
      }
      return res
        .status(200)
        .json({ status: true, message: "Successfully updated blog status" });
    } catch (error) {
      return res.status(500).json({ status: true, message: error.message });
    }
  };

  async BlogDeleteById(req, res) {
    try {
      const blogId = new mongoose.Types.ObjectId(req.params.id);
      const blogdata = await blogRepository.deleteById(blogId);
      if (!blogdata) return res.status(400).json({ status: false, message: "Failed to delete blog" });
      return res.status(200).json({ status: true, message: "Blog Deleted Successfully" });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  };

  async getBlogJsonDetails(req, res) {
    try {
      const blogdata = await blogRepository.getblogdetails({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
      if (!blogdata) {return res.status(400).json({ status: false, message: "Failed to fetch blog details" });
      }
      return res.status(200).json({status: true,message: "Blog Details Fetched successfully",data: blogdata,});
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  };

  async updateBlog(req, res) {
    try {
      const { name, title, description, status } = req.body;
      const blogId = req.params.id;
      const existingBlog = await blogRepository.getById(blogId);
      const updatedFields = [];
      if (name && name !== existingBlog.name) updatedFields.push("name");
      if (title && title !== existingBlog.title) updatedFields.push("title");
      if (description && description !== existingBlog.description)
        updatedFields.push("description");
      if (status && status !== existingBlog.status)
        updatedFields.push("status");

      const updateOps = {
        $set: { name, title, description, status },
      };

      if (updatedFields.length > 0) {
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

        blog.coverImage = Array.isArray(blog.coverImage)
          ? [...blog.coverImage, ...newImages]
          : newImages;
      }

      const updateblogdetails = await blogRepository.updateByField(updateOps, {
        _id: req.params.id,
      });

      if (!updateblogdetails) {
        return res.status(400).json({ status: false, message: "Failed to updated blog" });
      }
      return res.status(200).json({ status: true, message: "updated blog successfully" });
    } catch (error) {
      req.flash("error", error.message);
      return res.status(500).json({ status: false, message: error.message });
    }
  };
}
module.exports = new Blog();
