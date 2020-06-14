"use strict";

module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Wechat = app.model.define("wechat", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    wechat: STRING(),
    user_id: INTEGER,
    created_at: DATE,
    updated_at: DATE,
  });

  Wechat.associate = function () {
    app.model.Customer.belongsTo(app.model.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
  };

  Wechat.findByIdWithUser = async function (id, userId) {
    return await this.findOne({
      where: { id, user_id: userId },
    });
  };

  return Wechat;
};
