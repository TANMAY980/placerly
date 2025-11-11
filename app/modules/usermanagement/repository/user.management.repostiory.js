const baseRepository = require("../../../helper/baseRepository");
const usermodel=require('../../user/model/user.model');
const _ = require('lodash');
const moment = require('moment');

class usermanagementRepository extends baseRepository {
  constructor() {
    super(usermodel);
  }

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
            { contactNumber: { $regex: searchValue, $options: "i" } },
            { email: { $regex: searchValue, $options: "i" } },
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

      if (req.body.subscribed && req.body.subscribed.trim() !== "") {
        const subscribedValue=req.body.subscribed === "true" ? true
            : req.body.subscribed === "false" ? false
            : req.body.subscribed;
        and_clauses.push({ subscribed: subscribedValue });
      }

      if (req.body.is_verified && req.body.is_verified !== "") {
        const verifiedValue =req.body.is_verified === "true" ? true
            : req.body.is_verified === "false" ? false
            : req.body.is_verified;
        and_clauses.push({ is_verified: verifiedValue });
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

      let aggregate = usermodel.aggregate([
        { $match: conditions },
        {
          $project: {
            _id: 1,
            name: { $concat: ["$firstName", " ", "$lastName"] },
            email: 1,
            contactNumber: 1,
            is_verified: 1,
            subscription: 1,
            subscribed: 1,
            status: 1,
            createdAt: 1,
          },
        },
        sortOperator,
      ]);

      let options = { page: req.body.page || 1, limit: req.body.length || 10, allowDiskUse: true};

      let allDatas = await usermodel.aggregatePaginate(aggregate, options);
      
      return allDatas;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };


  async getuserdetails(filter){
    try {
      const data=await usermodel.aggregate([
        {
          $match:filter
        },
        {
          $project:{
            firstName:1,
            lastName:1,
            email: 1,
            contactNumber: 1,
            is_verified: 1,
            subscription: 1,
            subscribed: 1,
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
module.exports=new usermanagementRepository();