const baseRepository=require('../../../helper/baseRepository');
const executormodel=require('../model/executor.model');
const _ =require('lodash');
const moment=require('moment');

class executorRepository extends baseRepository{
    constructor(){
        super(executormodel)
    };

};
module.exports=new executorRepository();
