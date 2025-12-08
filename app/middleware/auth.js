const bcrypt=require('bcryptjs');
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
        req.headers["authorization"] ||
        req.headers["x-access-token"] ||
        req.query?.token ||
        req.body?.token ||
        req.cookies?.accessToken;
      if (
        typeof token === "string" &&
        token.toLowerCase().startsWith("bearer ")
      ) {
        token = token.slice(7).trim();
      }

      if (!token) {
        const newToken = await renewToken.generateToken(req, res);
        if (!newToken) return res.redirect(generateUrl("user.login.page"));

        const decoded = jwt.verify(newToken, process.env.JWT_ACCESS_TOKEN);
        req.user = decoded;
        return next();
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        req.user = decoded;
        return next();
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          const newToken = await renewToken.generateToken(req, res);
          if (!newToken) return res.redirect(generateUrl("user.login.page"));

          const decoded = jwt.verify(newToken, process.env.JWT_ACCESS_TOKEN);
          req.user = decoded;
          return next();
        }

        throw err;
      }
    } catch (error) {
      return res.redirect(generateUrl("user.login.page"));
    }
  };

  async attachUser(req, res, next) {
    try {
      let token =
        req.headers["authorization"] ||req.headers["x-access-token"] ||req.query?.token ||req.body?.token ||req.cookies?.accessToken;
      if (typeof token === "string" && token.toLowerCase().startsWith("bearer")) {
        token = token.slice(7).trim();
      }
      if (!token) {
        req.user = null;
        return next(); 
      };
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        if (decoded.role !== "user") {
          req.user = null; 
          return next();
        }
        req.user = decoded;
        return next();
      } catch (err) {
        req.user = null;
        return next(); 
      }
    } catch (error) {
      req.user = null;
      return next();
    }
  };

  async isUser(req, res, next) {
    try {
      if (!req.user) {
        req.flash("error", "Failed To retrieve user info");
        return res.redirect(generateUrl("user.login.page"));
      }

      if (req.user.role === "user") {
        return next();
      }
      req.flash("error", "Access Denied");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.redirect(generateUrl("user.login.page"));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: error.message });
    }
  }

  async isAdmin(req, res, next) {
    try {
      if (!req.user) {
        req.flash("error", "Failed To retrieve user info");
        return res.redirect(generateUrl("user.login.page"));
      }

      if (req.user.role === "admin") {
        return next();
      }
      req.flash("error", "Access Denied");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.redirect(generateUrl("user.login.page"));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: error.message });
    }
  }
}
module.exports=new authentication();