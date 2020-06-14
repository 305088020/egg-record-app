"use strict";

module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Disease = app.model.define("disease", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    type: STRING(),
    created_at: DATE,
    updated_at: DATE,
  });

  return Disease;
};
