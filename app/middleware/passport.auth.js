const bcrypt=require('bcryptjs');
const userRepository=require('../modules/user/repository/user.repostiroy')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
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
  };

  async check_password(password, hashedPassword) {
    try {
      const checkpassword = await bcrypt.compare(password, hashedPassword);
      return checkpassword;
    } catch (error) {
      console.log(error);
    }
  };

  async jwtauth() {
    try {
      const cookieExtractor = function (req) {
        return (
          req?.cookies?.admin_access_token ||
          req?.cookies?.user_access_token ||
          null
        );
      };

      const opts = {
        jwtFromRequest: ExtractJwt.fromExtractors([
          ExtractJwt.fromAuthHeaderAsBearerToken(),
          cookieExtractor,
        ]),
        secretOrKeyProvider: (req, rawJwtToken, done) => {
          try {
            const decoded = jwt.decode(rawJwtToken, { complete: true });

            if (!decoded || !decoded.payload?.type) {
              return done(new Error("Invalid token"), null);
            }

            let secret;
            if (decoded.payload.type === "access") {
              secret = process.env.JWT_ACCESS_TOKEN;
            } else if (decoded.payload.type === "refresh") {
              secret = process.env.JWT_REFRESH_TOKEN;
            } else {
              return done(new Error("Unknown token type"), null);
            }

            return done(null, secret);
          } catch (err) {
            return done(err, null);
          }
        },
      };

      passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
          try {
            const user = await userRepository.getById(jwt_payload.id);
            if (user) return done(null, user);
            return done(null, false);
          } catch (error) {
            return done(error, false);
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  async user_authenticate(req, res, next) {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        return res.redirect("/login");
      }
      if (!user) {
        return res.redirect("/login");
      }

      req.user = user;
      return next();
    })(req, res, next);
  };

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