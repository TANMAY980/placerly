const baseRepository=require('../../../helper/baseRepository');
const ordermodel=require('../model/order.model');

class OrderRepository extends baseRepository{
    constructor(){
        super(ordermodel)
    }
};
module.exports=new OrderRepository();