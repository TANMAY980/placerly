const userRepository=require('../repository/user.repostiroy');
const comparepassword=require('../../../middleware/auth');
const token=require('../../../helper/generate.Tokens');
const sendmail=require('../../../helper/send.email');
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
    };

    async registraionPage(req,res){
        try {
            res.render("user/views/registration",{
                page_name:"Registration page",
                page_title:"Registraion page"
            })
        } catch (error) {
            console.log(error);
            req.flash("error",error.message);
            return res.redirect(generateUrl("user.home"));
        }
    }

    async login(req,res){
        try {
            const {email,password}=req.body;
            
            if(!email || !password) return res.redirect(generateUrl("user.login.page"));

            const user=await userRepository.getByField({email});
            if(!user) return res.redirect(generateUrl("user.register.page"));

            const checkPassword=await comparepassword.check_password(password,user.password);
            if(!checkPassword) return res.redirect(generateUrl("user.login.page"));

            if(!user.is_verified){
                const otp=await sendmail.Sendotp(req,res,user)
                    if(!otp){
                        return res.redirect(generateUrl("user.login.page"));
                    }
                    return res.status(200).json({status:true,message:"successfully send otp in your registered email please verify your email and login again"})
            };

            if(user.status==="inactive") {
                await sendmail.SendInactiveEmail(email);
                return res.redirect(generateUrl("user.login.page"));
            };
            
            const accessToken=token.AccessToken(user);
            const refreshToken=token.RefreshToken(user)
            
            if(!accessToken || !refreshToken){
                return res.redirect(generateUrl("user.login.page"));
            };

            user.refreshToken=refreshToken;
            const savedUser=await user.save();
            if(!savedUser) return res.redirect(generateUrl("user.login.page"));

            //for session

            // await new Promise((resolve, reject) => {
            //     req.session.regenerate((err) => {
            //     if (err) return reject(err);
            //         resolve();
            //     });
            // });

            // req.session.user = {
            //     id: user._id,
            //     email: user.email,
            //     role: user.role
            // };

            // await new Promise((resolve) => req.session.save(resolve));


            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            if (user.role === "admin") {
                req.flash("success", "Login successfull");
                return res.redirect(generateUrl("admin.dashboard.access"));
            } else {
                req.flash("success", "Login successfull");
                return res.redirect(generateUrl("user.login.page"));
            };
        
        } catch (error) {
            console.log(error);
            req.flash("error", error.message);        
            return res.redirect(generateUrl("user.login.page"));;
        }
    };

    async error_page(req,res){
        try {
            res.render("user/views/error",{
            Page_name:"404 error page",
            Page_title:"404 ERROR PAGE"
        })
        } catch (error) {
            console.log(error);

        }
    };

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
    };
}
module.exports=new User()