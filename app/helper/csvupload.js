const multer=require('multer')
const path=require('path')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../uploads/csv"))
        
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const csvdata=multer({storage:storage})

module.exports=csvdata