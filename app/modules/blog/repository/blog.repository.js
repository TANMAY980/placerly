const baseRepository=require("../../../helper/baseRepository");
const blogmodel=require('../model/blog.model');
const _ = require('lodash');
const moment = require('moment');

class blogRepository extends baseRepository{
    constructor(){
        super(blogmodel)
    };

    async getAll(req) {
        try {
          let conditions = {};
          let and_clauses = [];
    
          and_clauses.push({ isDeleted: false });
    
          // Search Filter
          if (_.isObject(req.body.search) && _.has(req.body.search, "value")) {
            let searchValue = req.body.search.value.trim().replace("+", "");
            if(searchValue !==" "){
              and_clauses.push({
              $or: [
                { name: { $regex: searchValue, $options: "i" } },
                { Title: { $regex: searchValue, $options: "i" } },
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
    
          let aggregate = blogmodel.aggregate([
            { $match: conditions },
            {
              $lookup:{
                  from:"users",
                  localField:"addedby",
                  foreignField:"_id",
                  as:"userdetails"
              }
            },
            {
              $unwind:{
                preserveNullAndEmptyArrays:true,
                path:"$userdetails"              
              }
            }, 
            {
              $project: {
                _id: 1,
                name: 1,
                title: 1,
                coverImage: 1,
                description: 1,
                status: 1,
                updatedInfo: 1,
                userdetails:1,
                addedby:{$concat:["$userdetails.firstName"," ","$userdetails.lastName"]},
                createdAt:1,
              },
            },
            sortOperator,
          ]);

          
    
          let options = { page: req.body.page || 1, limit: req.body.length || 10, allowDiskUse: true};
    
          let allDatas = await blogmodel.aggregatePaginate(aggregate, options);
  
          return allDatas;
        } catch (e) {
          console.log(e);
          throw e;
        }
    };

    async getblogdetails(filter){
    try {
      const data=await blogmodel.aggregate([
        {
          $match:filter
        },
        {
          $lookup:{
            from:"users",
            localField:"addedby",
            foreignField:"_id",
            as:"userdetails"
          }
        },
        {
          $lookup:{
            from:"users",
            localField:"updatedInfo.updatedby",
            foreignField:"_id",
            as:"usereInfo"
          }
        },
        {
          $unwind:{
            preserveNullAndEmptyArrays:true,
            path:"$userdetails"
          }
        },
        {
          $unwind:{
            preserveNullAndEmptyArrays:true,
            path:"$usereInfo"
          }
        },
        {
          $project:{
            name:1,
            title:1,
            coverImage: 1,
            description: 1,
            addedby:{$concat:["$userdetails.firstName"," ","$userdetails.lastName"]},
            updatedby:{$concat:["$usereInfo.firstName"," ","$usereInfo.lastName"]},
            updatedInfo:1,
            userdetails:1,
            userinfo:1,
            status: 1,
            createdAt:1,
          },
        },
      ]);
     
      return data.length ? data[0] : null; 
      
    } catch (error) {
      throw error
    }
  };
};
module.exports=new blogRepository();