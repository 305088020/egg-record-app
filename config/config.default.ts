import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1591238049296_5248';

  // add your egg config in here
  config.middleware = [];

  config.jwt = {
    secret: '123456',
  };
  // config.js
  config.cors = {
    origin: "*",
    credentials: true,
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH"
  };

  config.session = {
    key: 'TG_WEB_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true
  };

  config.security = {
    csrf: {
      enable: false,
      // useSession: true,
      // cookieName: 'csrfToken',
      // sessionName: 'csrfToken',
      // headerName: 'x-csrf-token',// 自定义请求头
    }
  };

  config.passportLocal = {
    usernameField: 'username',
    passwordField: 'password'
  };

  config.cluster = {
    listen: {
      port: process.env.PORT || 7001
    }
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'egg-sequelize-doc-unittest',
    username: 'root',
    password: 'cpsa123456',
    timezone: "+08:00", // 时区，sequelize有很多自动时间的方法，都是和时区相关的，记得设置成东8区（+08:00）
    // sequelize时间自动格式化,防止到web页面后显示成"2019-08-27T12:02:05.000Z"
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  //  the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
