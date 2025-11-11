const mongoose  = require('mongoose');
const userManagementRepostiory = require('../repository/user.management.repostiory');


class usermanagement{


    async list(req, res) {
        try {
            const [
                total,
                active,
                inactive,
                banned,
                subscribed,
                unsubscribed
            ] = await Promise.all([
                userManagementRepostiory.getCountByParam({ isDeleted: false }),
                userManagementRepostiory.getCountByParam({ status: 'active', isDeleted: false }),
                userManagementRepostiory.getCountByParam({ status: 'inactive', isDeleted: false }),
                userManagementRepostiory.getCountByParam({ status: 'banned', isDeleted: false }),
                userManagementRepostiory.getCountByParam({ subscribed: true, isDeleted: false }),
                userManagementRepostiory.getCountByParam({ subscribed: false, isDeleted: false }),
            ]);

            
            res.render('usermanagement/views/userlist.ejs', {
                page_name: 'user-management',
                page_title: 'User List',
                user: req.user,
                stats: { total, active, inactive,banned,subscribed,unsubscribed },
            });
        } catch (e) {
            console.log(e);
            req.flash("error", e.message);
        }
    };

    async getAll(req, res) {
        try {
            let start = parseInt(req.body.start) || 0;
            let length = parseInt(req.body.length) || 10;
            let currentPage = 1;

            if (start > 0) {
                currentPage = parseInt((start + length) / length);
            }
            req.body.page = currentPage;

            let datas = await userManagementRepostiory.getAll(req);

            let data = {
                recordsTotal: datas.totalDocs  || 0,
                recordsFiltered: datas.totalDocs  || 0,
                data: datas.docs || []
            };            
            return res.status(200).json({
                status: 200,
                data: data,
                message: `Data fetched successfully.`
            });
        } catch (e) {
            console.error("Error in User management Controller:", e.message);
            return res.status(500).json({ status: 500, data: [], message: e.message });
        }
    };

    async getUserdetailsbyId(req,res){
        try {
            const data=await userManagementRepostiory.getuserdetails({_id:new mongoose.Types.ObjectId(req.params.id)});
            if(!data){
                req.falsh("error","USER details not found");
                return res.redirect("admin.user.access")
            }
            res.render("usermanagement/views/details",{
                page_name:"user-details-management",
                page_title:"USER Details",
                response:data

            })
        } catch (error) {
            req.flash("error",error.message);
            res.redirect(namedRouter.urlFor("admin.user.access"))
        }
    };

    async userStatusChange(req,res){
        try {
            const {status}=req.body;
            const userdata=await userManagementRepostiory.updateById({status:status},req.params.id);
            
            if(!userdata){
                return res.status(400).json({status:false,message:"Failed to update user status"});
            };
            return res.status(200).json({status:true,message:"Successfully updated user status"});
        } catch (error) {
            return res.status(500).json({status:true,message:error.message});
        }
    };

    async changeSubscribeStatus(req,res){
        try {
            const {subscribed}=req.body;
            const userdata=await userManagementRepostiory.updateById({subscribed:Boolean(subscribed)},req.params.id);
            
            if(!userdata){
                return res.status(400).json({status:false,message:"Failed to update user subscription status"});
            };
            return res.status(200).json({status:true,message:"Successfully updated user subscription status"});
        } catch (error) {
            return res.status(500).json({status:false,message:error.message});
        };
    }

    async getUserJsonDetails(req,res){
        try {
             const data=await userManagementRepostiory.getuserdetails({_id:new mongoose.Types.ObjectId(req.params.id)});

            if (!data) {
            return res.status(404).json({ success: false, message: "User details not found" });
            };

            return res.json({ success: true, data });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    async editUser(req,res){
        try {
            const {firstName,lastName,contactNumber,status,is_verified,subscribed}=req.body;
            const id=req.params.id;
            const updatedetails=await userManagementRepostiory.updateByField(id,{firstName,lastName,contactNumber,status,is_verified,subscribed});
            if(updatedetails){
                return res.status(200).json({status:true,message:"updated record successfully"})
            }
        } catch (error) {
            req.flash("error",error.message);
            res.redirect(namedRouter.urlFor("admin.user.access"))
        }
    };

    async updateuser(req,res){
        try {
            const userdata=await userManagementRepostiory.updateById(req.body,req.params.id);
            if(!userdata) return res.status(400).json({status:false,message:"Failed to update user details"});

            return res.status(200).json({status:true,message:"User updated successfully"})
        } catch (error) {
            return res.status(500).json({status:false,message:error.message})
        }
    };

    async deleteUserById(req,res){
        try {
            const userId=new mongoose.Types.ObjectId(req.params.id);
            const data=await userManagementRepostiory.deleteById(userId);
            console.log(data);
            
            if(!data){
                return res.status(400).json({status:false,message:"something went wrong"})
            }
            return res.status(200).json({status:true,message:"Successfully deleted user"})
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    

};
module.exports=new usermanagement();