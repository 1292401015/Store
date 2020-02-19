// pages/login/index.js
Page({
  handleGetUserInfo(e){
    console.log(e)
    // 把用户信息存储到本地存储中
    const {userInfo} = e.detail;
    console.log(userInfo);
    wx.setStorageSync("userInfo", userInfo);
    // 跳转回上一个页面
    // wx.navigateBack({
    //   delta: 1
    // });
  }
})