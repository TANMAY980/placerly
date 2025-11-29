const jwt=require('jsonwebtoken');

class jsonwebtoken{

    AccessToken(user){
        try {
            const accesstoken=jwt.sign({
                id:user._id,
                name:user.firstName,
                email:user.email,
                role:user.role, 
            },process.env.JWT_ACCESS_TOKEN,{expiresIn:"7m"});
            return accesstoken;
        } catch (error) {
            console.log(error);
            return null;  
        }
    };

    RefreshToken(user){
        try {
            const refreshtoken=jwt.sign({
                id:user._id,
                name:user.firstName,
                email:user.email,
                role:user.role,
            },process.env.JWT_REFRESH_TOKEN,{expiresIn:"7d"});
            return refreshtoken;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
};
module.exports=new jsonwebtoken();