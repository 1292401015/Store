// pages/user/index.js
Page({

  data: {
    userInfo:{},
    collectNum:0
  },
  onShow(){
    const userInfo=wx.getStorageSync("userInfo");
    const collect=wx.getStorageSync("collect");
    this.setData({userInfo,collectNum:collect.length});
  },
  handleGetUserInfo(e){
    console.log(e)
    // 把用户信息存储到本地存储中
    const {userInfo} = e.detail;
    console.log(userInfo);
    wx.setStorageSync("userInfo", userInfo);
    this.onShow();
  }
})