const baseRepository=require('../../../helper/baseRepository');
const faqmodel=require('../model/faq.model');

class faqRepository extends baseRepository{
    constructor(){
        super(faqmodel)
    };
};
module.exports=new faqRepository();