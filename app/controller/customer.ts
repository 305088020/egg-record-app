import { Controller } from "egg";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// Load the full build.
var _ = require("lodash");

function toInt(str) {
  if (typeof str === "number") return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

export default class CustomerController extends Controller {
  // async index() {
  //   const ctx = this.ctx;
  //   const query = {
  //     limit: toInt(ctx.query.limit), offset: toInt(ctx.query.offset), include: {
  //       model: ctx.model.User
  //     }
  //   };
  //   // query['where'] = { user_id: '1' }
  //   const customers = await ctx.model.Customer.findAll(query);
  //   if (ctx.isAuthenticated()) {
  //     await ctx.render('profile.tpl', {
  //       customers: customers
  //     })
  //   } else {
  //     this.ctx.redirect('/login')
  //   }
  // }

  async index() {
    const ctx = this.ctx;
    let currentPage = toInt(ctx.query.currentPage);
    let limit = toInt(ctx.query.limit);
    let offset = (currentPage - 1) * limit;
    const query: any = {
      limit: limit,
      offset: offset,
      include: [
        {
          model: ctx.model.User,
        },
      ],
      where: {},
    };

    const where: any = {};
    if (ctx.query.user_id) {
      where["user_id"] = ctx.query.user_id;
    }
    // 患者微信，姓名
    let where1: any = null;
    if (ctx.query.searchCustomer) {
      where1 = {
        [Op.or]: [
          { name: { [Op.like]: "%" + ctx.query.searchCustomer + "%" } },
          { wechat: { [Op.like]: "%" + ctx.query.searchCustomer + "%" } },
        ],
      };
    }
    // 疾病类型
    if (ctx.query.searchDisease) {
      where.disease = { [Op.like]: "%" + ctx.query.searchDisease + "%" };
    }
    // 客服姓名
    if (ctx.query.searchUserName) {
      where.user_id = ctx.query.searchUserName;
    }
    // 客服微信
    if (ctx.query.searchUserWechat) {
      where.customer_wechat = ctx.query.searchUserWechat;
    }
    // 成交，未成交
    if (ctx.query.searchDeal) {
      where.deal = ctx.query.searchDeal;
    }
    // 备注
    if (ctx.query.searchRemark) {
      where.remark = { [Op.like]: "%" + ctx.query.searchRemark + "%" };
    }
    console.log("----start----->");
    console.log(where);
    console.log(query["where"]);
    console.log(!_.isEmpty(where));
    console.log(!_.isEmpty(where1));
    console.log("----end----->");
    if (!_.isEmpty(where)) {
      Object.assign(query.where, where);
    }
    if (where1 != null) {
      Object.assign(query.where, where1);
    }
    console.log("----start2----->");
    console.log(where1);
    console.log(where1 == null);
    console.log(where1 == undefined);
    console.log(_.isEmpty(where1));
    console.log(query["where"]);
    console.log("----end2----->");

    const order = ctx.query.sort;
    if (!_.isEmpty(order)) {
      query.order = [order.split(",")];
    } else {
      query.order = [["id", "DESC"]];
    }
    console.log(query);
    const count = await ctx.model.Customer.count(query);
    const data = await ctx.model.Customer.findAll(query);
    ctx.body = {
      count: count,
      data: data,
    };
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Customer.findByPk(toInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    const {
      name,
      age,
      customer_wechat,
      address,
      disease,
      wechat,
      deal,
      remark,
      date,
      user_id,
    } = ctx.request.body;
    console.log(name + user_id);
    // 微信一样的不能添加
    const someOneCount = await ctx.model.Customer.count({
      where: {
        wechat: wechat,
      },
    });
    if (someOneCount >= 1) {
      ctx.status = 500;
      ctx.body = { message: "已添加过" };
      return;
    }
    const customer = await ctx.model.Customer.create({
      name,
      age,
      customer_wechat,
      address,
      disease,
      wechat,
      deal,
      remark,
      date,
      user_id,
    });
    ctx.status = 201;
    ctx.body = customer;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const customer = await ctx.model.Customer.findByPk(id);
    if (!customer) {
      ctx.status = 404;
      return;
    }

    const {
      name,
      age,
      customer_wechat,
      address,
      disease,
      wechat,
      deal,
      remark,
      date,
    } = ctx.request.body;
    // 微信一样的不能添加
    const someOneCount = await ctx.model.Customer.count({
      where: {
        wechat: wechat,
        id: {
          [Op.ne]: id,
        },
      },
    });
    if (someOneCount >= 1) {
      ctx.status = 500;
      ctx.body = { message: "患者微信号重复" };
      return;
    }
    await customer.update({
      name,
      age,
      customer_wechat,
      address,
      disease,
      wechat,
      deal,
      remark,
      date,
    });
    ctx.body = customer;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const customer = await ctx.model.Customer.findByPk(id);
    if (!customer) {
      ctx.status = 404;
      return;
    }

    await customer.destroy();
    ctx.status = 200;
  }
}
