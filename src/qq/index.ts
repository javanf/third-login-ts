const { requestHttp } = require('../request/index')

class qq {
  private authorizeApi = 'https://graph.qq.com/oauth2.0/authorize'

  private accessTokenApi = `https://graph.qq.com/oauth2.0/token`

  private openIdApi = `https://graph.qq.com/oauth2.0/me`

  private userInfoApi = `https://graph.qq.com/user/get_user_info`

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
    let path = `${this.authorizeApi}?response_type=code&client_id=${this.option.appId}&redirect_uri=${this.option.redirectUrl}&state=233&scope=get_user_info,get_vip_info,get_vip_rich_info`
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
      url: `${this.accessTokenApi}?grant_type=authorization_code&client_id=${this.option.appId}&client_secret=${this.option.appkey}&code=${code}&redirect_uri=${this.option.redirectUrl}`,
    })
    if(!body){
      return {
        message: '登录失败'
      }
    }
    var access_token = body.split('=')[1].split('&')[0];

    body = await requestHttp({
      method: 'get',
      url: `${this.openIdApi}?access_token=${access_token}`
    })
    var jsonStr = body.replace('callback( ','');
    jsonStr = jsonStr.replace(' );','');
    jsonStr = JSON.parse(jsonStr);
    var qqOpenid = jsonStr['openid'];

    body = await requestHttp({
      method: 'get',
      url: `${this.userInfoApi}?access_token=${access_token}&oauth_consumer_key=${this.option.appId}&openid=${qqOpenid}`
    })

    body = JSON.parse(body);

    return body
  }
}

module.exports = qq