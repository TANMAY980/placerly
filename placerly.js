const express=require('express');
const dotenv=require('dotenv');
const bodyParser=require('body-parser');
const session=require('express-session');
const RedisStore = require("connect-redis")(session);
const redisClient = require("./app/config/redis.config");
const path=require('path');
const{resolve,join}=require('path');
const ejs=require('ejs');
const cors=require('cors');
const flash=require('connect-flash');
const passport=require('passport');
const {swaggerui,swaggerSpec}=require('./app/helper/swagger');
const authentication=require("./app/middleware/auth");

dotenv.config({quiet: true});

const appConfig=require(resolve(join(__dirname,"./app/config","index")));
const utils=require(resolve(join(__dirname,"./app/helper","utils")));
const app=express();
const namedRouter=require('route-label')(app);

app.use(cors({
    origin:["http://localhost:7000","http://localhost:6000"],
    methods:["GET","PUT","POST","DELETE","PATCH"],
    credentials:true
}));


app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "your-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(flash());


const getProtocol=appConfig.appRoot.protocol;
const getHost=appConfig.appRoot.host;
const getPort=appConfig.appRoot.port;
const isProduction=appConfig.appRoot.isProd;
const getAdminFolderName=appConfig.appRoot.getAdminFolderName;
const getUserFolderName=appConfig.appRoot.getUserFolderName;
const getApiFolderName=appConfig.appRoot.getApiFolderName;

global.generateUrl = (route_name, route_param = {}) => namedRouter.urlFor(route_name, route_param);

app.set("view engine","ejs");
app.set("views",[join(__dirname,"./app/views"),join(__dirname,"./app/modules/")]);

app.use(bodyParser.urlencoded({limit: "50mb",extended:true,parameterLimit:50000}));
app.use(bodyParser.json({limit:"50mb"}));
app.use(express.static("./public"));

app.use(passport.initialize());
authentication.jwtauth();

const authRoutes=require('./app/routes/api/authentication.routes');
const userRoutes=require('./app/routes/api/user.routes');
app.use("/api",[authRoutes,userRoutes]);
app.use("/api-docs",swaggerui.serve,swaggerui.setup(swaggerSpec));

(async()=>{
    try {
        
        const db=require('./app/config/db.config');
        await db.DbConnection();

        const adminApiFiles=await utils._readdir(`./app/routes/${getAdminFolderName}`);
        adminApiFiles.forEach((file)=>{
            if(!file || file[0] == ".") return;
            namedRouter.use('',require(join(__dirname,file)));
        });
        
        const userApiFiles=await utils._readdir(`./app/routes/${getUserFolderName}`);
        userApiFiles.forEach((file)=>{
            if(!file || file[0]=='.')return;
            namedRouter.use("/",require(join(__dirname,file)));
        });

        namedRouter.buildRouteTable();

        if (!isProduction && process.env.SHOW_NAMED_ROUTES === "true") {
            const adminRouteList = namedRouter.getRouteTable("/admin");
            const userRouteList = namedRouter.getRouteTable("/");
       
            console.log("Route Tables:");
            console.log("Admin Folder Routes:", adminRouteList);
            console.log("User Folder Routes:", userRouteList);
        }

        app.listen(getPort,()=>{
            console.log(`Application running on ${getProtocol}://${getHost}:${getPort}`);
            
        })
    } catch (error) {
        console.log("Something went wrong",error);
        
    }
})();
