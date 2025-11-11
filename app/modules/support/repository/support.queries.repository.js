const baseRepository=require('../../../helper/baseRepository');
const supportmodel=require('../model/support.queries.model');

class supportqueriesRepository extends baseRepository{
    constructor(){
        super(supportmodel)
    };
};
module.exports=new supportqueriesRepository();