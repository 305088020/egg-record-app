import { Controller } from "egg";

function toInt(str) {
  if (typeof str === "number") return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

export default class UserController extends Controller {
  async index() {
    const ctx = this.ctx;
    let currentPage = toInt(ctx.query.currentPage);
    let limit = toInt(ctx.query.limit);
    let offset = (currentPage - 1) * limit;
    const query = {
      limit: limit,
      offset: offset,
    };
    const order = ctx.query.sort;
    if (order != null) {
      query["order"] = [order.split(",")];
    } else {
      query["order"] = [["id", "DESC"]];
    }

    const count = await ctx.model.User.count(query);
    const data = await ctx.model.User.findAll(query);
    ctx.body = {
      count: count,
      data: data,
    };
    // ctx.body = await ctx.service.test.findByUsername("nihao");
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.User.findByPk(toInt(ctx.params.id));
  }

  async findByUsername(username) {
    const ctx = this.ctx;
    return ctx.model.User.findOne({ where: { username: username } });
  }

  async create() {
    const ctx = this.ctx;
    const { username, password, name, created_at } = ctx.request.body;
    const user = await ctx.model.User.create({
      username,
      password,
      name,
      created_at,
    });
    ctx.status = 201;
    ctx.body = user;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    const { username, password, name } = ctx.request.body;
    await user.update({ username, password, name });
    ctx.body = user;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    await user.destroy();
    ctx.status = 200;
  }
}
