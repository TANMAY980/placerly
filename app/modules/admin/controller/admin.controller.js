const adminRepository=require('../repository/admin.repository');

class Admin{
    async dashboard(req,res){
        try {
            res.render("admin/views/dashboard",{
                page_name:"Admin dashboard",
                page_title:"Admin dashboard"
            });
        } catch (error) {
            console.log(error);
            
        };
    };
};

module.exports=new Admin()