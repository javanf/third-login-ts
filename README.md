> `node` 服务端第三方登录，包括`github`、`qq`、`sina`、`gitee`、开源中国。

## 安装插件
```bash
npm install third-login-ts
```

## 调用示例
>以下已`express`为例

```js
const {qq, git, sina} = require('third-login-ts')

sina = new sina({
  appId: 'xxxx',
  appkey: 'xxxx',
  host: 'http://localhost:8001', // 后台服务接口地址 如：http://localhost:8001，部署后请用正式地址
  redirectUrl: `/sina/login/callback`
})
// 前端点击登录后服务器自己的接口地址
// 插件会重定向到sina授权
router.get("/sina/login", async (req, res) => {
  sina.login(res)
})

// 开发者自己的回调接口地址
router.get("/sina/login/callback", async (req, res) => {
  // code 为 sina 回调返回的参数
  let code = req.query.code
  // userinfo 即为授权登录的sina用户信息
  let userinfo = await sina.callback()
})



git = new git({
  appId: 'xxxx',
  appkey: 'xxxx',
  host: 'http://localhost:8001', // 后台服务接口地址 如：http://localhost:8001，部署后请用正式地址
  redirectUrl: `/github/login/callback`
})

// 前端点击登录后服务器自己的接口地址
// 插件会重定向到github授权
router.get("/github/login", async (req, res) => {
  git.login(res)
})

// 开发者自己的回调接口地址
router.get("/github/login/callback", async (req, res) => {
  // code 为 github 回调返回的参数
  let code = req.query.code
  // userinfo 即为授权登录的github用户信息
  let userinfo = await git.callback()
})

qq = new qq({
  appId: 'xxxx',
  appkey: 'xxxx',
  host: 'http://localhost:8001', // 后台服务接口地址 如：http://localhost:8001，部署后请用正式地址
  redirectUrl: `/qq/login/callback`
})

// 前端点击登录后服务器自己的接口地址
// 插件会重定向到qq授权
router.get('/qq/login', async (req, res) => {
  qq.login(res)
})
// 开发者自己的回调接口地址
router.get('/qq/login/callback', async (req, res) => {
  // code 为 qq 回调返回的参数
  let code = req.query.code
  // userinfo 即为授权登录的qq用户信息
  let userinfo = await qq.callback()
})
```

其他示例同上，`gitee`、开源中国已解决`token`刷新问题，用户信息都会在`callback`返回，且`token`一并返回