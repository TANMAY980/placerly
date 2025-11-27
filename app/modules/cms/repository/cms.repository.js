const baseRepository=require('../../../helper/baseRepository');
const cmsmodel=require('../model/cms.model');
const moment=require('moment');
const _ = require('lodash');



class cmsRepository extends baseRepository{
    constructor(){
        super(cmsmodel)
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
                { title: { $regex: searchValue, $options: "i" } },
              ],
            });
            }
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
          };
  
          let aggregate = cmsmodel.aggregate([
            { $match: conditions },
            {
              $project: {
                _id: 1,
                title: 1,
                content:1,
                bannerImage: 1,
                status: 1,
                updatedInfo: 1,
                addedby: { $ifNull: ["$addedby", "N/A"] },
                createdAt:1,
              },
            },
            sortOperator,
          ]);
    
          let options = { page: req.body.page || 1, limit: req.body.length || 10, allowDiskUse: true};
    
          let allDatas = await cmsmodel.aggregatePaginate(aggregate, options);
          
          return allDatas;
        } catch (e) {
          console.log(e);
          throw e;
        }
    };

    async getcmsdetails(filter){
      try {
        const data=await cmsmodel.aggregate([
          {
            $match:filter
          },
          {
            $project:{
              title:1,
              content:1,
              bannerImage:1,
              status:1,
              updatedInfo: 1,
              addedby: { $ifNull: ["$addedby", "N/A"] },
              createdAt:1,
            }
          }
        ]);
        return data.length ? data[0] :null;
      } catch (error) {
        throw(error);
      }
    }
};

module.exports=new cmsRepository();