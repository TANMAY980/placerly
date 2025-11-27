const adminRepository=require('../repository/admin.repository');
class Admin{
    async dashboard(req,res){
        try {
            res.render("admin/views/dashboard",{
                page_name:"Admin dashboard",
                page_title:"Admin dashboard",
                user:req.user
            });  
        } catch (error) {
            req.flash("error", error.message);
            return res.redirect(generateUrl("user.login.page"));  
        };
    };
    
};

module.exports=new Admin();