// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
// 引入封装好的使用promise实现请求的js文件
import { login } from '../../utils/asyncWx';
// 引入封装好的获取存储信息到本地存储的js文件
//import { setStorageToken } from '../../utils/storage';
Page({
  // 授权获取用户信息
  async handleGetUserInfo(e) {

    try {
      console.log(e)
      // 获取对应的参数
      const {encryptedData,rawData,iv,signature} = e.detail;
      // 获取登录后的code属性
      const {code} = await login();
      // 把需要传递的参数合并成一个对象
      const loginParams = {encryptedData,rawData,iv,signature,code};
      // 调用获取用户token的接口
      const {token} = await request({url: '/users/wxlogin',method: 'post',data: loginParams})
      // 把token存储到本地存储中
      wx.setStorageSync('token', token);
      //setStorageToken(token);
      // 然后跳转回支付页面
      wx.navigateBack({
        // 返回上一个页面
        delta: 1
      });      
    } catch (error) {
      console.log(error);
    }

    // 然后跳转回支付页面
    wx.navigateBack({
      // 返回上一个页面
      delta: 1
    });
  }
});
  