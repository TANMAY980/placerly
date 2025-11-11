const baseRepository=require('../../../helper/baseRepository');
const usermodel=require('../../user/model/user.model');

class adminRepository extends baseRepository{
    constructor(){
        super(usermodel)
    };

};
module.exports=new adminRepository();
