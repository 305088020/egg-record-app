import { Service } from 'egg';

/**
 * Test Service
 */
export default class Test extends Service {

  /**
   * sayHi to you
   * @param name - your name
   */
  public async sayHi(name: string) {
    return `hi, ${name}`;
  }


  public async findByUsername(username){
    const ctx = this.ctx;
     return await ctx.model.User.findOne({where:{name:username}});
  }
}
