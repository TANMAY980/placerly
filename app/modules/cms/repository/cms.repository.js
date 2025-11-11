const baseRepository=require('../../../helper/baseRepository');
const cmsmodel=require('../model/cms.model');

class cmsRepository extends baseRepository{
    constructor(){
        super(cmsmodel)
    };
};

module.exports=new cmsRepository();