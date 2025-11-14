const baseRepository=require('../../../helper/baseRepository');
const supportmodel=require('../model/support.queries.model');
const _ =require("lodash");
const moment=require("moment");

class supportqueriesRepository extends baseRepository{
    constructor(){
        super(supportmodel)
    };

    async getAll(req) {
        try {
          let conditions = {};
          let and_clauses = [];
    
          and_clauses.push({ isDeleted: false });
    
          // Search Filter
          if (_.isObject(req.body.search) && _.has(req.body.search, "value")) {
            let searchValue = req.body.search.value.trim().replace("+", "");
            and_clauses.push({
              $or: [
                { email: { $regex: searchValue, $options: "i" } },
                { "userDetails.contactNumber": { $regex: searchValue, $options: "i" } },
              ],
            });
          }
    
          // Date Filter
          if (req.body.startDate && req.body.endDate) {
            let startDate = moment(req.body.startDate, "YYYY-MM-DD")
              .startOf("day")
              .toDate();
            let endDate = moment(req.body.endDate, "YYYY-MM-DD")
              .endOf("day")
              .toDate();
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
    
          let aggregate = supportmodel.aggregate([
            { $match: conditions },
            {
                $lookup:{
                    from:"users",
                    localField:"userId",
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
              $project: {
                _id: 1,
                name:{$concat:["$userDetails.firstName","$userDetails.lastName"]},
                email:"$userDetails.email",
                phone:"$userDetails.contactNumber",
                queries: 1,
                description: 1,
                progressstatus: 1,
                status: 1,
                priority:1,
                resolvedby: 1,
                createdAt:1,
              },
            },
            sortOperator,
          ]);
    
          let options = { page: req.body.page || 1, limit: req.body.length || 10, allowDiskUse: true};
    
          let allDatas = await supportmodel.aggregatePaginate(aggregate, options);
          
          return allDatas;
        } catch (e) {
          console.log(e);
          throw e;
        }
    };

    async getdetailsById(filter){
      try {
        const quriesdetails=await supportmodel.aggregate([
          {
            $match:filter
          },
          {
            $lookup:{
              from:"users",
              localField:"userId",
              foreignField:"_id",
              as:"userDetails",
            }
          },{
            $unwind:{
              preserveNullAndEmptyArrays:true,
              as:"$userDetails"
            }
          },{
            $project:{
              name:{$concat:["$userDetails.firstName"," ","$userDetails.lastName"]},
              email:"$userDetails.email",
              phone:"$userDetails.contactNumber",
              queries: 1,
              description: 1,
              progressstatus: 1,
              status: 1,
              priority:1,
              resolvedby: 1,
              createdAt:1,
              
            }
          }
        ]);
        return quriesdetails.length ? quriesdetails[0] : null ;
      } catch (error) {
        throw error
      }
    };
};
module.exports=new supportqueriesRepository();