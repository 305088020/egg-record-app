import { Controller } from 'egg';

export default class HomeController extends Controller {

  public async index() {
  	var food = {
	    'ketchup': '5 tbsp',
	    'mustard': '1 tbsp',
	    'pickle': '0 tbsp'
	};
    const { ctx } = this;
    await ctx.render('index.tpl',{title:'nunjucks',food});
  }

  public async login () {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    const targetUser = await ctx.service.user.findByUsername(username);
    if (!targetUser) {
      throw new Error('请输入正确的用户名，密码')
    }

    if (targetUser.password !== password) {
      throw new Error('输入的密码不正确！');
    }
    
    console.log(targetUser)
    const token = app.jwt.sign({
      user:targetUser
    }, app.config.jwt.secret);
    ctx.status = 200;
    ctx.body = {token: token};

  }
  public async getInfo(){
    const { ctx } = this;
    console.log(ctx.state.user);
    ctx.body = ctx.state.user.user;
  }

  public async logout () {
    await this.ctx.logout()
    this.ctx.redirect(this.ctx.get('referer') || '/')
  }

  public async profile () {
    if (this.ctx.isAuthenticated()) {
      await this.ctx.render('profile.tpl', {
        user: this.ctx.user
      })
    } else {
      console.log('没有登录');
      this.ctx.redirect('/');
    }
  }

  public async authCallback () {
    const { ctx } = this;
    console.log('是否验证');
    console.log(ctx.isAuthenticated());
    console.log('验证用户');
    await ctx.login(ctx.user)
    console.log(ctx.user)
    ctx.status = 200;
    ctx.body = ctx.user;
  }
}
