const mongoose=require('mongoose')
const MONGO_URL=`${process.env.DB_CONNECTION}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE_NAME}`
class Db{
    async DbConnection(){
        try {
            const connection=await mongoose.connect(MONGO_URL)
            if(connection){
                console.log("Database connected with the application sucessfully"); 
            }
        } catch (error) {
            console.log(error);
            
        }
    }
}
module.exports=new Db()