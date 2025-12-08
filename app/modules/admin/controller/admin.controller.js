const adminRepository=require('../repository/admin.repository');
const queryRepsitory=require('../../support/repository/support.queries.repository');
const sendmail=require("../../../helper/send.email");
const auth=require('../../../middleware/auth');
const mongoose= require('mongoose');

class Admin{

    async dashboard(req,res){
        try {
            const [user,queries]=await Promise.all([
                await adminRepository.getCountByParam({isDeleted:false,status:"active"}),
                await queryRepsitory.getCountByParam({isDeleted:false,status:"active"})
            ]);
            
            res.render("admin/views/dashboard",{
                page_name:"Admin dashboard",
                page_title:"Admin dashboard",
                stats:{user,queries},
                user:req.user
            });  
        } catch (error) {
            req.flash("error", error.message);
            return res.redirect(generateUrl("user.login.page"));  
        };
    };

    async updatepasswordPage(req,res){
        try {
            const userDetails=await adminRepository.userDetails({_id:new mongoose.Types.ObjectId(req.user.id)});
            if(!userDetails){
                req.flash("success","Failed To load User Details");
                return res.redirect(generateUrl("admin.dashboard.access"));
            };
            res.render("admin/views/updatepassword.ejs",{
                page_name:"Update Password ",
                page_title:"Update Password",
                user:req.user,
            });
        } catch (error) {
            console.log(error);
            req.flash("error","Something went Wrong")
            return res.redirect(generateUrl("admin.dashboard.access"));
        }
    };

    async getDetailsPage(req,res){
        try {
            const userDetails=await adminRepository.userDetails({_id:new mongoose.Types.ObjectId(req.user.id)});   
            if(!userDetails){
                req.flash("error","Failed To load User Details");
                return res.redirect(generateUrl("admin.dashboard.access"));
            };
            res.render("admin/views/details",{
                page_name:"Profile Details",
                page_title:"Profile details",
                response:userDetails,
                user:req.user,
            });
        } catch (error) {
            req.flash("error","something went wrong")
            return res.redirect(generateUrl("admin.dashboard.access"));
        }
    };

    async updatePassword(req,res){
        try {
            const{prevPassword,newPassword,confirmPassword}=req.body;
            if(!prevPassword ||!newPassword || !confirmPassword){
                return res.redirect(generateUrl("update.password.page"));
            };
            if(newPassword !== confirmPassword){
                req.flash("error","Enter new and confirm password same")
                return res.redirect(generateUrl("update.password.page"));
            }
            const checkuser=await adminRepository.getById({_id:req.user.id});
            
            if(!checkuser){
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return res.redirect(generateUrl("user.login.page"));
            };
            const checkpass=await auth.check_password(prevPassword,checkuser.password);
            if(!checkpass){
                req.flash("error","Please enter correct old password");
                return res.redirect(generateUrl("update.password.page"));
            };

            const hashpassword=await auth.encrypt_password(newPassword);
            if(!hashpassword){
                req.flash("error","something went wrong");
                return res.redirect(generateUrl("update.password.page"));
            };
            const savePassword=await adminRepository.updateById({password:hashpassword},new mongoose.Types.ObjectId(req.user.id));
            
            if(!savePassword){
                req.flash("error","Failed To update Password");
                return res.redirect(generateUrl("update.password.page"));
            };
            sendmail.updatePassword(req,res,checkuser);
            req.flash("success","Password updated successfully. Please login again.");
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.redirect(generateUrl("user.login.page"));
        } catch (error) {
            req.flash("error","Failed to update Password");
            return res.redirect(generateUrl("update.password.page"));
        }
    };

    async uploadImage(req,res){
        try {            
            if(!req.file){
                req.flash("error","Something went wrong");
                return res.redirect(generateUrl('profile.details.page'));
            }; 
            const image = req.file.path;
            const checkuser=await adminRepository.getByField({_id:new mongoose.Types.ObjectId(req.user.id)});
            if(!checkuser){
                req.flash("error","Something went wrong");
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return res.redirect(generateUrl("user.login.page")); 

            };
            const saveImage=await adminRepository.updateById({image:image},new mongoose.Types.ObjectId(req.user.id));
            if(!saveImage){
                req.flash("error","Failed to Upload Profile image");
                return res.redirect(generateUrl("user.login.page"));
            };
            req.flash("success","successfully uploaded Profile Image");
            return res.redirect(generateUrl('profile.details.page'));
        } catch (error) {
            req.flash("error","Failed To Upload Profile Image");
            return res.redirect(generateUrl('profile.details.page'));
        }
    };

    async deleteImage(req,res){
        try {
            const user=await adminRepository.getById({_id:new mongoose.Types.ObjectId(req.user.id)});
            
            if(!user || !user.image){
                req.flash("error","Profile Image not found");
                return res.redirect(generateUrl('profile.details.page'));
            }
            const image=null;
            const save=await adminRepository.updateById({image:image},new mongoose.Types.ObjectId(req.user.id));
            if(!save){
                req.flash("error","Profile Image not found");
                return res.redirect(generateUrl('profile.details.page'));
            }
            req.flash("error","Successfully deleted Profile image");
            return res.redirect(generateUrl('profile.details.page'));
        } catch (error) {
            req.flash("error",error.message);
            return res.redirect(generateUrl('profile.details.page'));
        }
    };

    async logout(req,res){
        try {
            req.flash("success","Logout successfully")
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.redirect(generateUrl("user.home"));
        } catch (error) {
            req.flash("error", error.message);
            return res.redirect(generateUrl("user.home"));
        }
    };
    
};

module.exports=new Admin();