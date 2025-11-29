const adminRepository=require('../repository/admin.repository');
const queryRepsitory=require('../../support/repository/support.queries.repository');

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
    
};

module.exports=new Admin();