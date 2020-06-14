"use strict";

module.exports = (app) => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize;

  const User = app.model.define("user", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(),
    name: STRING(),
    password: STRING(),
    admin: BOOLEAN,
    created_at: DATE,
    updated_at: DATE,
  });
  return User;
};
