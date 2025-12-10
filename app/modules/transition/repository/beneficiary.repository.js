const baseRepository=require('../../../helper/baseRepository');
const beneficiarymodel=require('../model/beneficiary.model');
const _ =require('lodash');
const moment=require('moment');

class beneficiaryRepository extends baseRepository{
    constructor(){
        super(beneficiarymodel)
    };

};
module.exports=new beneficiaryRepository();
