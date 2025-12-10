const baseRepository=require('../../../helper/baseRepository');
const utilitymodel=require('../model/utility.model');
const _ =require('lodash');
const moment=require('moment');

class utilityRepository extends baseRepository{
    constructor(){
        super(utilitymodel)
    };

};
module.exports=new utilityRepository();
