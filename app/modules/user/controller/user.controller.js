
class User{
    
    async user_login_page(req,res){
        try {
            res.render("user/views/login",{
                Page_name:"user login",
                Page_title:"USER LOGIN"
            })
        } catch (error) {
            console.log(error);
            return res.redirect("/")   
        }
    }
    async error_page(req,res){
        try {
            res.render("user/views/error",{
            Page_name:"404 error page",
            Page_title:"404 ERROR PAGE"
        })
        } catch (error) {
            console.log(error);

        }
    }
    async user_home_page(req,res){
        try {
            res.render("user/views/home",{
                Page_name:"home page",
                Page_title:"Home"

            })
        } catch (error) {
            console.log(error);
            return res.redirect("")
        }
    }
}
module.exports=new User()