/*
 * @Author: Javan(www.javanx.cn) 
 * @Date: 2022-04-Th 03:51:03 
 * @Last Modified by:   Javan(www.javanx.cn) 
 * @Last Modified time: 2022-04-Th 03:51:03 
 */
const git = require('./github/index')
const sina = require('./sina/index')
const qq = require('./qq/index')
const gitee = require('./gitee/index')
const oschina = require('./oschina/index')


module.exports = {
  git,
  sina,
  qq,
  gitee,
  oschina
}

