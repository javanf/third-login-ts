/*
 * @Author: Javan(www.webxiu.com.cn)
 * @Date: 2022-04-24 10:54:57
 * @LastEditTime: 2022-04-24 11:16:18
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \typescript\third-login-ts\src\gitee\index.ts
 */

const redis = require("redis");
const client = redis.createClient();

client.on('error', (err: any) => console.log('Redis Client Error', err));
  
const { requestHttp } = require('../request/index')

class gitee {
  private authorizeApi = 'https://gitee.com/oauth/authorize'

  private accessTokenApi = `https://gitee.com/oauth/token`

  private userInfoApi = `https://gitee.com/api/v5/user`

  private option: {
    appId: string;
    appkey: string;
    host: string,
    redirectUrl: string;
  };

  constructor(option: object) {
    this.option = {
      appId: '', // gitee Client ID
      appkey: '', // gitee Client secrets
      host: '', // 开发者服务器域名带http
      redirectUrl: '', // 回调地址，自动拼接host
      ...option
    };
    this.option.redirectUrl = this.option.host + this.option.redirectUrl
  }

  /**
   * 登录跳转到gitee授权，拿回code，并调用回调
   */
  login(res: Object) {
    console.log('gitee login');
    let path = `${this.authorizeApi}?client_id=${this.option.appId}&redirect_uri=${this.option.redirectUrl}&response_type=code`
    res.redirect(path);
  }
  /**
   * 回调
   * @param code 回调返回的code
   * @returns 返回登录成功的用户信息
   */
  async callback(code: String){
    const gitee_token : String = await client.get('gitee_token');
    const is_gitee_token : Boolean = await client.get('is_gitee_token');
    let data : Object = '';
    let grant_type = 'refresh_token'
    let url = `${this.accessTokenApi}?code=${code}&client_id=${this.option.appId}&redirect_uri=${this.option.redirectUrl}&client_secret=${this.option.appkey}`
    if(is_gitee_token && !gitee_token){
      grant_type = 'refresh_token'
      url += `&refresh_token=${gitee_token}`
    }
    url += `&grant_type=${grant_type}`

    let body = await requestHttp({
      method: 'post',
      url: url,
      data: data
    });

    body = JSON.parse(body);

    await client.connect();
    await client.set('gitee_token', body.refresh_token);
    await client.set('is_gitee_token', true);
    client.expire('gitee_token', 24 * 60 * 60); // 24小时自动过期

    body = await requestHttp({
      method: 'get',
      url: `${this.userInfoApi}?access_token=${body.access_token}`
    });

    body = JSON.parse(body);

    body.access_token = body.access_token
    body.refresh_token = body.refresh_token

    return body;
  }
}

module.exports = gitee