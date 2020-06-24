import { Controller } from "egg";

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Excel = require("exceljs");
// Load the full build.
const _ = require("lodash");

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

  async exportExcel() {
    const ctx = this.ctx;
    const query: any = {
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

    if (!_.isEmpty(where)) {
      Object.assign(query.where, where);
    }
    if (where1 != null) {
      Object.assign(query.where, where1);
    }

    const order = ctx.query.sort;
    if (!_.isEmpty(order)) {
      query.order = [order.split(",")];
    } else {
      query.order = [["id", "DESC"]];
    }
    const data = await ctx.model.Customer.findAll(query);

    // Excel
    let workBook = new Excel.Workbook();
    const sheet = workBook.addWorksheet();

    let number = 1;

    const result: any = [];
    const result2: any = [];
    await data.forEach((element) => {
      const abc = {
        id: number++,
        name: element.name,
        age: element.age,
        address: element.address,
        disease: element.disease,
        wechat: element.wechat,
        customer_wechat: element.customer_wechat,
        userName: element.user.name,
        deal: element.deal,
        remark: element.remark,
        date: element.date,
      };
      result.push(abc);
      result2.push(Object.values(abc));
    });

    // sheet.columns = [
    //   { header: "序号", key: "id", width: 5 },
    //   { header: "患者姓名", key: "name", width: 10, filterButton: true },
    //   { header: "年龄", key: "age", width: 5, filterButton: true },
    //   { header: "地区", key: "address", width: 20, filterButton: true },
    //   { header: "疾病类型", key: "disease", width: 20, filterButton: true },
    //   { header: "患者微信", key: "wechat", width: 20, filterButton: true },
    //   {
    //     header: "客服微信",
    //     key: "customer_wechat",
    //     width: 20,
    //     filterButton: true,
    //   },
    //   { header: "客服姓名", key: "userName", width: 10, filterButton: true },
    //   { header: "成交", key: "deal", width: 10, filterButton: true },
    //   { header: "备注", key: "remark", width: 50, filterButton: true },
    //   { header: "登记时间", key: "date", width: 20, filterButton: true },
    // ];

    sheet.addTable({
      name: "MyTable",
      ref: "A1",
      headerRow: true,
      columns: [
        {
          name: "序号",
          width: 5,
          style: {
            alignment: { vertical: "middle", horizontal: "left" },
          },
        },
        {
          name: "患者姓名",
          width: 10,
          filterButton: true,
          style: {
            alignment: { vertical: "middle", horizontal: "center" },
          },
        },
        {
          name: "年龄",
          width: 5,
          filterButton: true,
          style: {
            alignment: { vertical: "middle", horizontal: "center" },
          },
        },
        {
          name: "地区",
          width: 20,
          filterButton: true,
          style: {
            alignment: { vertical: "middle", horizontal: "center" },
          },
        },
        { name: "疾病类型", width: 20, filterButton: true },
        { name: "患者微信", width: 20, filterButton: true },
        {
          name: "客服微信",
          width: 20,
          filterButton: true,
        },
        { name: "客服姓名", width: 10, filterButton: true },
        { name: "成交", width: 10, filterButton: true },
        { name: "备注", width: 50, filterButton: true },
        { name: "登记时间", width: 20, filterButton: true },
      ],
      rows: Array.from(result2),
    });

    // Get Column Wrapper for second column
    sheet.getColumn(1).width = 5;
    sheet.getColumn(2).width = 10;
    sheet.getColumn(3).width = 5;
    sheet.getColumn(4).width = 20;
    sheet.getColumn(5).width = 20;
    sheet.getColumn(6).width = 20;
    sheet.getColumn(7).width = 20;
    sheet.getColumn(8).width = 10;
    sheet.getColumn(9).width = 10;
    sheet.getColumn(10).width = 50;
    sheet.getColumn(11).width = 20;

    const center = {
      vertical: "middle",
      horizontal: "center",
    };
    const row1 = sheet.getRow(1);
    row1.height = 25;
    row1.alignment = center;

    let fileName = "导出信息表.xlsx";
    ctx.response.attachment(fileName);
    ctx.status = 200;
    await workBook.xlsx.write(ctx.res);
    ctx.res.end();

    // //我们要下载excel文件，可以这样设置
    // this.ctx.attachment("导出信息表.xlsx");
    // this.ctx.type = ".xlsx";
    // //设置响应 Content-Type 通过 mime 字符串或文件扩展名。如：ctx.type = 'text/plain; charset=utf-8'; 或者 ctx.type = '.png';
    // this.ctx.body = await workBook.xlsx.writeBuffer();
    // // 这个是exceljs的方法
  }
}
