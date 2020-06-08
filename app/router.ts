import { Application } from 'egg';

export default (app: Application) => {
	const { controller, router, jwt } = app;
	// handle user info here
	// app.passport.verify(async (ctx, user) => {
	// 	const { username, password } = user
	// 	console.log(user);
	// 	const targetUser1 = await ctx.service.user.findByUsername(username);
	// 	await db.users.findByUsername(username);
	// 	console.log(targetUser1);
	// 	const targetUser = {id: 1, username: 'miaozi',password:'123456'};
	// 	if (!targetUser) {
	// 		throw new Error('请输入正确的用户名，密码')
	// 	}

	// 	if (targetUser.password !== password) {
	// 		throw new Error('输入的密码不正确！');
	// 	}

	// 	return targetUser
	// });
	// app.passport.serializeUser(async (_, user:UserIdentity) => {
	// 	console.log('serializeUser');
	// 	console.log(user);
	// 	console.log('-------->');
	// 	return user;
	// });
	// // this user is userId passed from `serializeUser`
	// app.passport.deserializeUser(async (ctx, user) => {
	// 	console.log('deserializeUser');
	// 	console.log(ctx.user);
	// 	console.log('user--->');
	// 	console.log(user);
	// 	return user;
	// 	// user ? ctx.user : null);
	// });


	router.get('/', controller.home.index);

	// 鉴权成功后的回调页面
	router.get('/authCallback', controller.home.authCallback);

	// 渲染登录页面，用户输入账号密码
	router.post('/login', controller.home.login);
	router.post('/getInfo',jwt,controller.home.getInfo);


	router.get('/logout', controller.home.logout);

	router.get('/profile',jwt, controller.home.profile);

	// // 登录校验
	// router.post('/login', app.passport.authenticate('local', {
	// 	successRedirect: '/authCallback',
	// 	failureRedirect: '/login'
	// }));
	router.resources('users', '/users', jwt,controller.users);
	router.resources('customer', '/customer', controller.customer);
};
