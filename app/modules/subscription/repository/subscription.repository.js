const baseRepository=require('../../../helper/baseRepository');
const subScriptionmodel = require('../model/subscription.model');

class subscriptionRepository extends baseRepository{
    constructor(){
        super(subScriptionmodel)
    };
    
};    
module.exports=new subscriptionRepository();