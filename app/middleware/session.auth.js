const bcrypt=require('bcryptjs');
const userRepository=require('../modules/user/repository/user.repostiroy')


class authentication {

  async encrypt_password(password) {
    try {
      const salt = 10;
      const encrypt = await bcrypt.hash(password, salt);
      return encrypt || false;
    } catch (error) {
      console.log(error);
    }
  };

  async check_password(password, hashedPassword) {
    try {
      const checkpassword = await bcrypt.compare(password, hashedPassword);
      return checkpassword;
    } catch (error) {
      console.log(error);
    }
  };

  
  async isLoggedIn(req, res, next) {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }
    next();
  }
  

  async isUser(req, res, next) {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    if (req.session.user.role !== "user") {
      return res.status(403).send("User access only");
    }

    next();
  };

  async isAdmin(req, res, next) {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    if (req.session.user.role !== "admin") {
      return res.status(403).send("Admin access only");
    }

    next();
  };


  async userlogout(req, res) {
    try {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/login");
      });
    } catch (error) {
      console.log(error);
      res.redirect("/login");
    }
  };
}
module.exports=new authentication()