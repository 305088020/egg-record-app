"use strict";

module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Customer = app.model.define("customer", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    // 患者姓名
    name: STRING(30),
    // 年龄
    age: INTEGER,
    // 疾病类型
    disease: STRING(300),
    // 地区
    address: STRING(),
    // 患者微信
    wechat: STRING(),
    //客服微信
    customer_wechat: STRING(),
    deal: STRING(),
    remark: STRING(),
    date: DATE,
    user_id: INTEGER,
    created_at: DATE,
    updated_at: DATE,
    add_wechat_date: DATE,
  });

  Customer.associate = function () {
    app.model.Customer.belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
  };

  Customer.findByIdWithUser = async function (id, userId) {
    return await this.findOne({
      where: { id, user_id: userId },
    });
  };

  return Customer;
};
