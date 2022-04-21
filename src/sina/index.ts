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
      appId: '', // github Client ID
      appkey: '', // github Client secrets
      host: '', // 开发者服务器域名带http
      redirectUrl: '', // 回调地址，自动拼接host
      ...option
    };
    this.option.redirectUrl = this.option.host + this.option.redirectUrl
  }

  /**
   * 登录跳转到qq授权，拿回code，并调用回调
   */
  login(res: Object) {
    console.log('github login')
    let path = `${this.authorizeApi}?client_id=${this.option.appId}&response_type=code&redirect_uri=${this.option.redirectUrl}`
    res.redirect(path)
  }
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

    return body
  }
}

module.exports = qq