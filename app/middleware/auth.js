const bcrypt=require('bcryptjs');
const userRepository=require('../modules/user/repository/user.repostiroy')
const renewToken=require('../helper/renewToken');

const jwt=require('jsonwebtoken');


class authentication {
  async encrypt_password(password) {
    try {
      const salt = 10;
      const encrypt = await bcrypt.hash(password, salt);
      return encrypt || false;
    } catch (error) {
      console.log(error);
    }
  }

  async check_password(password, hashedPassword) {
    try {
      const checkpassword = await bcrypt.compare(password, hashedPassword);
      return checkpassword;
    } catch (error) {
      console.log(error);
    }
  }


  async jwtauth(req, res, next) {
    try {
      let token =
        req.body?.token ||
        req.query?.token ||
        req.headers["x-access-token"] ||
        req.headers["authorization"];

      if (typeof token === "string" && token.toLowerCase().startsWith("bearer ")) {
        token = token.slice(7).trim();
      };

      if (!token && req.cookies) {
        token = req.cookies.accessToken
      };

      if (!token) {
        const renewed = await renewToken(req, res);
        if (!renewed) {
          return res.redirect(generateUrl("user.login.page"));
        }
        return next();
      };

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

      if (!decoded || !decoded.email) {
        return res.redirect(generateUrl("user.login.page"));
      };

      const foundUser = await userRepository.getByField({ email: decoded.email });
      if (!foundUser) {
        return res.redirect(generateUrl("user.login.page"));
      };

      req.user = {
        email: decoded.email,
        id: foundUser._id,
        role: foundUser.role
      };

      return next();
    } catch (error) {
      console.error( error.message);
      return res.redirect(generateUrl("user.login.page"));
    }
}


  async isUser(req, res, next) {
    try {
      if (!req.user)
        return res.status(401).json({ status: false, message: "Unauthorized. No user found." });

      if (req.user.role === "user") {
        return next();
      }
      return res.status(403).json({ status: false, message: "Access denied. Users only routes" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: error.message });
    }
  };

  async isAdmin(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ status: false, message: "Unauthorized. No user found." });
      }

      if (req.user.role === "admin") {
        return next();
      }
      return res.status(403).json({ status: false, message: "Access denied. Admin only routes" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: error.message });
    }
  };
}
module.exports=new authentication()