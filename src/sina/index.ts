/*
 * @Author: your name
 * @Date: 2022-04-21 17:53:04
 * @LastEditTime: 2022-04-24 10:55:30
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \typescript\third-login-ts\src\sina\index.ts
 */
const { requestHttp } = require('../request/index')

class sina {
  private authorizeApi = 'https://api.weibo.com/oauth2/authorize'

  private accessTokenApi = `https://api.weibo.com/oauth2/access_token`

  private userInfoApi = `https://api.weibo.com/2/users/show.json`

  private option: {
    appId: string;
    appkey: string;
    host: string,
    redirectUrl: string;
  };

  constructor(option: object) {
    this.option = {
      appId: '', // sina Client ID
      appkey: '', // sina Client secrets
      host: '', // 开发者服务器域名带http
      redirectUrl: '', // 回调地址，自动拼接host
      ...option
    };
    this.option.redirectUrl = this.option.host + this.option.redirectUrl
  }

  /**
   * 登录跳转到sina授权，拿回code，并调用回调
   */
  login(res: any) {
    console.log('sina login')
    let path = `${this.authorizeApi}?client_id=${this.option.appId}&response_type=code&redirect_uri=${this.option.redirectUrl}`
    res.redirect(path)
  }
  /**
   * 回调
   * @param code 回调返回的code
   * @returns 返回登录成功的用户信息
   */
  async callback(code: String){
    let params = {
      client_id: this.option.appId,
      client_secret: this.option.appkey,
      code: code
    }
    let body = await requestHttp({
      method: 'get',
      url: `${this.accessTokenApi}?client_id=${this.option.appId}&client_secret=${this.option.appkey}&grant_type=authorization_code&redirect_uri=${this.option.redirectUrl}&code=${code}`,
    })
    body = JSON.parse(body)

    body = await requestHttp({
      method: 'get',
      url: `${this.userInfoApi}?access_token=${body.access_token}&uid=${body.uid}`
    })

    body = JSON.parse(body);

    body.access_token = body.access_token

    return body
  }
}

module.exports = sina