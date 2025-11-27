const jwt=require('jsonwebtoken');
const usermodel=require('../modules/user/model/user.model');
const generateaccessToken=require('../helper/generate.Tokens')
class renewToken{
    
    async generateToken(req,res){
        try {
            const refreshToken = req.cookies && req.cookies.refreshToken;
            if (!refreshToken) {
                return false;
            };
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

            const storedToken = await usermodel.findOne({ refreshToken });
            if (!storedToken) return false;

            const user = await usermodel.findOne({_id:decoded.id});
            if (!user) throw Error();

           const accessToken=generateaccessToken.AccessToken(user);

           res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000
            });

        return true;

        } catch (error) {
            console.log(error);
            return false
            
        }
    }
};

module.exports=new renewToken();