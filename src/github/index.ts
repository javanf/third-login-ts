const { requestHttp } = require('../request/index')

class github {
  private authorizeApi = 'https://github.com/login/oauth/authorize'

  private accessTokenApi = `https://github.com/login/oauth/access_token`

  private userInfoApi = `https://api.github.com/user`

  private option: {
    appId: string;
    appkey: string;
    host: string,
    redirectUrl: string;
  };

  constructor(option: object) {
    this.option = {
      appId: '', // github Client ID
      appkey: '', // github Client secrets
      host: '', // 开发者服务器域名带http
      redirectUrl: '', // 回调地址，自动拼接host
      ...option
    };
    this.option.redirectUrl = this.option.host + this.option.redirectUrl
  }

  /**
   * 登录跳转到github授权，拿回code，并调用回调
   */
  login(res: Object) {
    console.log('github login')
    let path = `${this.authorizeApi}?client_id=${this.option.appId}`
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
      method: 'post',
      url: this.accessTokenApi,
      body: params,
      json: true
    })
    let access_token = body.access_token;
    body = await requestHttp({
      method: 'get',
      url: `${this.userInfoApi}?access_token=${access_token}`,
      headers: {
        Authorization: `token ${access_token}`,
        accept: 'application/json',
        'User-Agent': 'request'
      }
    })
    body = JSON.parse(body)

    body.access_token = access_token

    return body
  }
}

module.exports = github