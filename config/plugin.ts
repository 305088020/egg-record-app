import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
	passport: {
		enable: true,
		package: 'egg-passport'
	},
	passportLocal: {
		enable: true,
		package: 'egg-passport-local'
	},
	nunjucks: {
		enable: true,
		package: 'egg-view-nunjucks',
	},
	sequelize: {
		enable: true,
		package: 'egg-sequelize',
	},
	cors: {
		enable: true,
		package: "egg-cors"
	},
	jwt: {
		enable: true,
		package: 'egg-jwt',
	},

};

export default plugin;
