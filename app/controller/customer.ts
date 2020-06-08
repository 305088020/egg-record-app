import { Controller } from 'egg';



function toInt(str) {
  if (typeof str === 'number') return str;
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
    let offset = (currentPage - 1) * 10;
    const query = { limit: toInt(ctx.query.limit), offset: offset, };
    if (ctx.query.user_id !== null && typeof(ctx.query.user_id) !== 'undefined' && ctx.query.user_id !== 'undefined') {
      query['where'] = { user_id: ctx.query.user_id }
    }
    const order = ctx.query.sort;
    if (order != null) {
      query['order'] = [order.split(',')];
    } else {
      query['order'] = [['id', 'DESC']];
    }

    const count = await ctx.model.Customer.count(query);
    const data = await ctx.model.Customer.findAll(query);
    ctx.body = {
      count: count,
      data: data
    }
    // ctx.body = await ctx.service.test.findByUsername("nihao");

  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Customer.findByPk(toInt(ctx.params.id));
  }

  async create() {

    const ctx = this.ctx;
    const { name, age, username, address, disease, wechat, remark, date, user_id } = ctx.request.body;
    console.log(name + user_id)
    const customer = await ctx.model.Customer.create({ name, age, username, address, disease, wechat, remark, date, user_id });
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

    const { name, age, username, address, disease, wechat, remark, date } = ctx.request.body;
    await customer.update({ name, age, username, address, disease, wechat, remark, date });
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
