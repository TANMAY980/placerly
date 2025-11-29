const jwt=require('jsonwebtoken');
const userRepository=require('../modules/user/repository/user.repostiroy');
const generateaccessToken=require('../helper/generate.Tokens');

class renewToken{
    
    async generateToken(req,res){
        try {
            const refreshToken = req.cookies && req.cookies.refreshToken;
            if (!refreshToken) {
                return false;
            };
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

            const user = await userRepository.getByField({_id:decoded.id});

            if (!user) return false;

           const accessToken=generateaccessToken.AccessToken(user);

           res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000
            });

        return accessToken;

        } catch (error) {
            console.log(error);
            return null
            
        }
    };
};

module.exports=new renewToken();