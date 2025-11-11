const adminRepository=require('../repository/admin.repository');

class Admin{
    async admin_dashboard(req,res){
        try {
            res.render("admin/views/dashboard",{
                page_name:"admin dasboard",
                page_title:"Admin TITLE"
            });
        } catch (error) {
            console.log(error);
            
        }
    };
};

module.exports=new Admin()