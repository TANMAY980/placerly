const baseRepository=require('../../../helper/baseRepository');
const subScriptionmodel = require('../model/subscription.model');
const _ =require('lodash');
const moment=require('moment');

class subscriptionRepository extends baseRepository{
    constructor(){
        super(subScriptionmodel)
    };
    
    async getAll(req,res) {
            try {
              let conditions = {};
              let and_clauses = [];
        
              and_clauses.push({ isDeleted: false });
        
              // Search Filter
              if (_.isObject(req.body.search) && _.has(req.body.search, "value")) {
                let searchValue = req.body.search.value.trim().replace("+", "");
                if(searchValue!=" "){
                  and_clauses.push({
                  $or: [
                    { name: { $regex: searchValue, $options: "i" } },
                    { charges: { $regex: searchValue, $options: "i" } },
                  ],
                });
                }
              }
        
              // Date Filter
              if (req.body.startDate && req.body.endDate) {
                let startDate = moment(req.body.startDate, "YYYY-MM-DD").startOf("day").toDate();
                let endDate = moment(req.body.endDate, "YYYY-MM-DD").endOf("day").toDate();
                and_clauses.push({ createdAt: { $gte: startDate, $lte: endDate } });
              }
        
              // Column Filters (DataTable search)
              if (req.body.columns && req.body.columns.length) {
                let statusFilter = _.find(req.body.columns, { data: "status" });
                if (statusFilter && statusFilter.search && statusFilter.search.value) {
                  and_clauses.push({ status: statusFilter.search.value });
                }
              }
        
              if (req.body.status && req.body.status.trim() !== "") {
                and_clauses.push({ status: req.body.status.trim() });
              }
    
        
        
              conditions["$and"] = and_clauses;
        
              // Sort Operator
        
              let sortOperator = { $sort: {} };
              if (_.has(req.body, "order") && req.body.order.length) {
                for (let order of req.body.order) {
                  let sortField = req.body.columns[+order.column]?.data || "createdAt";
                  let sortOrder = order.dir === "desc" ? -1 : 1;
                  sortOperator.$sort[sortField] = sortOrder;
                }
              } else {
                sortOperator.$sort["createdAt"] = -1;
              }
        
              let aggregate = subScriptionmodel.aggregate([
                { $match: conditions },
                {
                  $lookup:{
                    from:"users",
                    localField:"addedby",
                    foreignField:"_id",
                    as:"user"
                  }
                },
                {
                  $unwind:{
                    preserveNullAndEmptyArrays:true,
                    path:"$user"
                  }
                },
                {
                  $project: {
                    _id: 1,
                    name:1,
                    charges: 1,
                    inclusions: 1,
                    duration: 1,
                    status: 1,
                    updatedInfo: 1,
                    addedby:{$concat:["$user.firstName"," ","$user.lastName"]},
                    createdAt:1,
                  },
                },
                sortOperator,
              ]);
        
              let options = { page: req.body.page || 1, limit: req.body.length || 10, allowDiskUse: true};
        
              let allDatas = await subScriptionmodel.aggregatePaginate(aggregate, options);
              
              return allDatas;
            } catch (e) {
              console.log(e);
              throw e;
            }
    };

    async getSubscriptionDetailsById(filter){
      
      try {
        const data=await subScriptionmodel.aggregate([
          {
            $match:filter,
          },
          {
            $lookup:{
              from:"users",
              localField:"updatedInfo.updatedby",
              foreignField:"_id",
              as:"userDetails"
            },
          },
          {
            $unwind:{
              preserveNullAndEmptyArrays:true,
              path:"$userDetails"
            }
          },
          {
            $project:{
                name:1,
                details:1,
                charges: 1,
                inclusions: 1,
                duration: 1,
                status: 1,
                updatedInfo: 1,
                updatedby:{$concat:["$userDetails.firstName"," ","$userDetails.lastName"]},
                addedby:{$concat:["$userDetails.firstName"," ","$userDetails.lastName"]},
                createdAt:1,
          }
        }
        ]);
        
        return data.length?data[0]:[]
      } catch (error) {
        throw(error)
      };
    };

    async getallsubscription(filter){
      try {
        const data=await subScriptionmodel.aggregate([
          {
            $match:filter
          },
          {
            $project:{
              orgname:1,
              name:1,
              details:1,
              charges:1,
              inclusions:1,
              duration:1,
            }
          }
        ])
        return data.length?data:[]
      } catch (error) {
        throw error
      }
    }

    
};    
module.exports=new subscriptionRepository();