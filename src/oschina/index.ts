/*
 * @Author: Javan(www.webxiu.com.cn)
 * @Date: 2022-04-24 10:54:57
 * @LastEditTime: 2022-04-24 11:16:18
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \typescript\third-login-ts\src\oschina\index.ts
 */

const redis = require("redis");
const client = redis.createClient();

client.on('error', (err: any) => console.log('Redis Client Error', err));
  
const { requestHttp } = require('../request/index')

class oschina {
  private authorizeApi = 'https://www.oschina.net/action/oauth2/authorize'

  private accessTokenApi = `https://www.oschina.net/action/openapi/token`

  private userInfoApi = `https://www.oschina.net/action/openapi/user`

  private option: {
    appId: string;
    appkey: string;
    host: string,
    redirectUrl: string;
  };

  constructor(option: object) {
    this.option = {
      appId: '', // oschina Client ID
      appkey: '', // oschina Client secrets
      host: '', // 开发者服务器域名带http
      redirectUrl: '', // 回调地址，自动拼接host
      ...option
    };
    this.option.redirectUrl = this.option.host + this.option.redirectUrl
  }

  /**
   * 登录跳转到oschina授权，拿回code，并调用回调
   */
  login(res: Object) {
    console.log('oschina login');
    let path = `${this.authorizeApi}?response_type=code&client_id=${this.option.appId}&state=xyz&redirect_uri=${this.option.redirectUrl}`
    res.redirect(path);
  }
  /**
   * 回调
   * @param code 回调返回的code
   * @returns 返回登录成功的用户信息
   */
  async callback(code: String){
    const oschina_token : String = await client.get('oschina_token');
    const is_oschina_token : Boolean = await client.get('is_oschina_token');
    let data : Object = '';
    let grant_type : String = 'authorization_code'
    let url = `${this.accessTokenApi}?client_id=${this.option.appId}&client_secret=${this.option.appkey}&redirect_uri=${this.option.redirectUrl}&code=${code}&dataType=json`
    if(is_oschina_token && !oschina_token){
      grant_type = 'refresh_token'
      url += `&refresh_token=${oschina_token}`
    }
    url += `&grant_type=${grant_type}`

    let body = await requestHttp({
      method: 'post',
      url: url
    });

    body = JSON.parse(body);

    await client.connect();
    await client.set('oschina_token', body.refresh_token);
    await client.set('is_oschina_token', true);
    client.expire('oschina_token', body.expires_in); // 24小时自动过期

    body = await requestHttp({
      method: 'get',
      url: `${this.userInfoApi}?access_token=${body.access_token}`
    });

    body = JSON.parse(body);

    body.access_token = body.access_token
    body.refresh_token = body.refresh_token
    body.expires_in = body.expires_in

    return body;
  }
}

module.exports = oschina