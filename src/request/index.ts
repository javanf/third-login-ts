/*
 * @Author: Javan(www.javanx.cn) 
 * @Date: 2022-04-Th 03:48:16 
 * @Last Modified by:   Javan(www.javanx.cn) 
 * @Last Modified time: 2022-04-Th 03:48:16 
 */

const request = require('request');

module.exports = {
  /**
   * 请求
   * @param url 请求url
   * @returns 请求结果
   */
   requestHttp(options: Object) : Promise <Object> {
    return new Promise((resolve, reject)=>{
      console.log(options)
      request(options, (err: any, httpResponse: any, body: any) => {
        if(err) {
          return reject(err)
        }
        resolve(body)
      })
    })
  }
};