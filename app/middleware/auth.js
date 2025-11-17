const bcrypt=require('bcryptjs');
const userRepository=require('../modules/user/repository/user.repostiroy')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');



class authentication{
    async encrypt_password(password){
        try {
            const salt=10;
            const encrypt=await bcrypt.hash(password,salt)
            return encrypt || false;
        } catch (error) {
           console.log(error);
        }
    };

    async check_password(password,hashedPassword){
        try {
            const checkpassword=await bcrypt.compare(password,hashedPassword);
            return checkpassword
        } catch (error) {
            console.log(error);
            
        }
    };
    
    async jwtauth(){
        try {
            const opts={
                jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey:process.env.JWT_SECRET_KEY,
            }
            passport.use(new JwtStrategy(opts,async(jwt_payload,done)=>{
                try {
                    const user=await userRepository.getById(jwt_payload.id);
                    if(user) return done(null,user);
                    else return done(null,false);
                } catch (error) {
                    return done(err, false);
                }
                
            }));
        } catch (error) {
            console.log(error);   
        }
    };

    async user_authenticate(req,res,next){
        try {
            passport.authenticate("jwt",{session:false},(err,user)=>{
                if(err || !user){
                    return res.status(401).json({message:"Unauthorized"});
                }
                req.user=user;
                next()
            })(req,res,next)
        } catch (error) {
            console.log(error);
            return res.status(500).json({status:false,message:error.message})
        }
    };

    async isUser(req,res,next){
        try {
        if (!req.user) {
            return res.status(401).json({
            status: false,
            message: "Unauthorized. No user found.",
            });
        }

        if (req.user.role === "user") {
            return next();
        }

        return res.status(403).json({
            status: false,
            message: "Access denied. Users only routes",
        });
        } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
        }
    };

    async isAdmin(req, res, next) {
        try {
        if (!req.user) {
            return res.status(401).json({
            status: false,
            message: "Unauthorized. No user found.",
            });
        }

        if (req.user.role === "admin") {
            return next();
        }

        return res.status(403).json({
            status: false,
            message: "Access denied. Admin only routes",
        });
        } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
        }
    };

}
module.exports=new authentication()