const baseRepository=require('../../../helper/baseRepository');
const insurancemodel=require('../model/insurance.model');
const _ =require('lodash');
const moment=require('moment');

class insuranceRepository extends baseRepository{
    constructor(){
        super(insurancemodel)
    };

};
module.exports=new insuranceRepository();
