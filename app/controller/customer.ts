import { Controller } from "egg";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

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
    const query = {
      limit: limit,
      offset: offset,
      include: [
        {
          model: ctx.model.User,
        },
      ],
    };
    let where1 = {};
    if (
      ctx.query.user_id !== null &&
      typeof ctx.query.user_id !== "undefined" &&
      ctx.query.user_id !== "undefined"
    ) {
      where1["user_id"] = ctx.query.user_id;
    }

    const search = ctx.query.search;
    console.log(query);
    let where2 = {};
    if (search != null && search != "" && search !== "undefined") {
      where2 = {
        [Op.or]: [
          { name: { [Op.like]: "%" + search + "%" } },
          { wechat: { [Op.like]: "%" + search + "%" } },
        ],
      };
    }
    if (where1 || where1) {
      query["where"] = Object.assign(where1, where2);
    }

    const order = ctx.query.sort;

    if (order != null) {
      query["order"] = [order.split(",")];
    } else {
      query["order"] = [["id", "DESC"]];
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
