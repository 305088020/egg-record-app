import { Controller } from "egg";

function toInt(str) {
  if (typeof str === "number") return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

export default class DiseaseController extends Controller {
  async index() {
    const ctx = this.ctx;
    let currentPage = toInt(ctx.query.currentPage);
    let offset = (currentPage - 1) * 10;
    const query = { limit: toInt(ctx.query.limit), offset: offset };
    const order = ctx.query.sort;
    if (order != null) {
      query["order"] = [order.split(",")];
    } else {
      query["order"] = [["id", "DESC"]];
    }

    const count = await ctx.model.Disease.count(query);
    const data = await ctx.model.Disease.findAll(query);
    ctx.body = {
      count: count,
      data: data,
    };
  }
  async list() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Disease.findAll();
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Disease.findByPk(toInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    const { type, created_at } = ctx.request.body;
    const disease = await ctx.model.Disease.create({ type, created_at });
    ctx.status = 201;
    ctx.body = disease;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const disease = await ctx.model.Disease.findByPk(id);
    if (!disease) {
      ctx.status = 404;
      return;
    }

    const { type } = ctx.request.body;
    await disease.update({ type });
    ctx.body = disease;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const disease = await ctx.model.Disease.findByPk(id);
    if (!disease) {
      ctx.status = 404;
      return;
    }

    await disease.destroy();
    ctx.status = 200;
  }
}
