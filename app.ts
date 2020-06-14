// 在根目录新建一个 app.js {app_root}/app.js
// force: true  每次都覆盖数据库
// force: false 只新建没有的表
module.exports = (app) => {
  if (app.config.env === "local" || app.config.env === "unittest") {
    app.beforeStart(async () => {
      await app.model.sync({ force: false });
    });
  }
};
