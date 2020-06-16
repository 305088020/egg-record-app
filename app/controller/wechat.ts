import { Controller } from "egg";

function toInt(str) {
  if (typeof str === "number") return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

export default class WechatController extends Controller {
  async index() {
    const ctx = this.ctx;
    let userId = toInt(ctx.query.userId);
    if (userId) {
      ctx.body = await ctx.model.Wechat.findAll({ where: { user_id: userId } });
    } else {
      ctx.body = await ctx.model.Wechat.findAll();
    }
  }
  async create() {
    const ctx = this.ctx;
    const { wechat, user_id } = ctx.request.body;
    const model = await ctx.model.Wechat.create({
      wechat,
      user_id,
    });
    ctx.status = 201;
    ctx.body = model;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const model = await ctx.model.Wechat.findByPk(id);
    if (!model) {
      ctx.status = 404;
      return;
    }

    const { wechat, user_id } = ctx.request.body;
    await model.update({ wechat, user_id });
    ctx.body = model;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const wechat = await ctx.model.Wechat.findByPk(id);
    if (!wechat) {
      ctx.status = 404;
      return;
    }

    await wechat.destroy();
    ctx.status = 200;
  }
}
