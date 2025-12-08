const userRepository=require('../repository/user.repostiroy');
const supportRepository=require('../../support/repository/support.queries.repository');
const auth=require('../../../middleware/auth');
const token=require('../../../helper/generate.Tokens');
const sendmail=require('../../../helper/send.email');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');

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
            if(!user) return res.redirect(generateUrl("user.registraion.page"));

            const checkPassword=await auth.check_password(password,user.password);
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
                return res.redirect(generateUrl("user.home"));
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

    async user_home_page(req, res) {
  try {
    if(req.user){
        res.render("user/views/home", {
      Page_name: "Placerly",
      Page_title: "Placerly",
      user: req.user || null 
    });
    }else{
        res.render("user/views/home", {
      Page_name: "Placerly",
      Page_title: "Placerly",
    });
    }
    
    } catch (error) {
    console.log(error);
    return res.redirect(generateUrl("user.login.page"));
  }
    };

    async dashboard(req,res){
        try {
            res.render("user/views/dashboard",{
                page_name:"Dashboard",
                page_title:"Dashboard",
                user:req.user
            });
        } catch (error) {
            req.flash("error","Failed To get dashboard");
            return res.redirect(generateUrl('user.home'));
        }
    };

    async supportPage(req,res){
        try {
            res.render('user/views/support',{
                page_title:"Support",
                page_name:"Support",
                user:req.user
            });
        } catch (error) {
            req.flash("error","Something went wrong");
            return res.redirect(generateUrl("user.home"));
        }
    };

    async addSupport(req,res){
        try {
            const{userId,name,email,phone,queries}=req.body
            if(!userId || !name || !phone || !email || !queries){
                req.flash('error',"Required all field");
                return res.redirect(generateUrl('user.support.page'));
            };
            const checkuser=await userRepository.getByField({email});
            if(!checkuser){
                req.flash("error","Something went wrong");
                return res.redirect(generateUrl('user.support.page'))
            };
            const support={userId,name,email,phone,queries}
            const savesupport=await supportRepository.save(support);
            if(!savesupport){
                req.flash("error","Failed to submit query");
                return res.redirect(generateUrl('user.support.page'));
            };
            req.flash("success","Successfully submited your query");
            await sendmail.supportemail(checkuser);
            return res.redirect(generateUrl('user.support.page'));
        } catch (error) {
            console.log(error);
            return res.redirect(generateUrl('user.support.page'));
        }
    };


    async updatepasswordPage(req,res){
            try {
                const userDetails=await userRepository.userDetails({_id:new mongoose.Types.ObjectId(req.user.id)});
                if(!userDetails){
                    req.flash("success","Failed To load User Details");
                    return res.redirect(generateUrl("user.home"));
                };
                res.render("user/views/updatepassword.ejs",{
                    page_name:"Update Password ",
                    page_title:"Update Password",
                    user:req.user,
                });
            } catch (error) {
                console.log(error);
                req.flash("error","Something went Wrong")
                return res.redirect(generateUrl("user.home"));
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

    async forgotPassowrdPage(req,res){
        try {
            res.render('user/views/forgotpassword',{
                page_title:"Forgot password",
                page_name:"Forgot password"
            })
        } catch (error) {
            req.flash('error',"something went wrong");
            return res.render(generateUrl('user.home'))
        }
    };

    async forgotPassword(req,res){
        try {
            const {email}=req.body;
            if(!email){
                req.flash("error","Email is required");
                return res.redirect(generateUrl('user.forgotpassword.page')) 
            };
            const checkuser=await userRepository.getByField({email});
            if(!checkuser){
                req.flash('error',"Please Register");
                return res.redirect(generateUrl('user.registraion.page'));
            };
            const secret=checkuser._id + process.env.JWT_SECRET_KEY;
            const token=jwt.sign({userid:checkuser._id,email:checkuser.email},secret,{expiresIn:'5m'});
            const user={checkuser}
            if(!token){
                req.flash("error","something went wrong");
                return res.redirect(generateUrl('user.forgotpassword.page'))
            }
            const resetlink=`${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/resetpassword/${checkuser._id}/${token}`;
                        
            const sendemail= await sendmail.resetpassword(checkuser,resetlink);
            if(!sendemail){
                req.flash("error","Failed to send reset link")
                return res.redirect(generateUrl('user.forgotpassword.page'))
            }
            req.flash("success","Successfully send Reset Password link")
            return res.redirect(generateUrl("user.login.page"))
        } catch (error) {
          req.flash("error",error.message);
          return res.redirect(generateUrl('user.forgotpassword.page'))  
        }
    };

    async resetPasswordPage(req,res){
        try {
            const {id,token}=req.params
            const checkuser=await userRepository.getByField({_id:new mongoose.Types.ObjectId(id)})
            if(!checkuser){
                req.flash("error","Failed to load reset password page");
                return res.render(generateUrl('user.login'))
            };
            res.render('user/views/resetpassword',{
                page_name:"reset password",
                page_title:"reset password",
                id,
                token
            });
        } catch (error) {
            req.flash("error","Failed to load reset password page");
            return res.render(generateUrl('user.login'))
        }
    };

    async resetPassword(req,res){
        try {
            const{password,confirmPassword}=req.body;
            if(!password || !confirmPassword){
                req.flash("error","Password & confirm required");
                return res.redirect(generateUrl('user.reset.password'))
            };
            if(password !== confirmPassword){
                req.flash("error","password & confirm password didn't matched");
                return res.redirect(generateUrl('user.reset.password'))
            };
            const checkuser=await userRepository.getById({_id:new mongoose.Types.ObjectId(req.params.id)});
            if(!checkuser){
                req.flash("error","something went wrong");
                return res.redirect(generateUrl('user.registraion.page'));
            };
            const newsecret=checkuser._id+process.env.JWT_SECRET_KEY;
            const result=jwt.verify(req.params.token,newsecret);
            if(!result){
                req.flash('error',"something went wrong");
                return res.redirect(generateUrl('user.forgotpassword.page'))
            };
            const encryptpass=await auth.encrypt_password(password);
            if(!encryptpass){
                req.flash("error","Failed to save Password");
                return res.redirect(generateUrl('user.reset.password'))
            };
            const savepassword=await userRepository.updateById({password:encryptpass},new mongoose.Types.ObjectId(req.params.id));
            if(!savepassword){
                req.flash("error","Failed To Reset Password");
                return res.redirect(generateUrl('user.forgotpassword.page'))
            }
            req.flash("success","Successfully Reset Password");
            return res.redirect(generateUrl('user.login.page'));
        } catch (error) {
            req.flash("error","Failed To Reset Password");
            return res.redirect(generateUrl('user.forgotpassword.page'));
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
}
module.exports=new User()