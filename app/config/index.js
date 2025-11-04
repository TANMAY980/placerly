module.exports={
    appRoot:{
        env:process.env.NODE_ENV || "development",
        protocol:process.env.PROTOCOL || http,
        isProd:process.env.NODE_ENV ==="production",
        host:process.env.HOST || "localhost",
        port:process.env.PORT || "6000",
        appName:process.env.APP_NAME || "placerly",
        getAdminFolderName:process.env.ADMIN_FOLDER_NAME || 'admin',
        getUserFolderName:process.env.USER_FOLDER_NAME || 'user',
        getApiFolderName:process.env.API_FOLDER_NAME || 'api'
    }
}