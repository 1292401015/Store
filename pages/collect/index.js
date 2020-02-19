// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { id: 0, title: '商品收藏', isActive: true },
      { id: 1, title: '品牌收藏', isActive: false },
      { id: 2, title: '店铺收藏', isActive: false },
      { id: 2, title: '我的足迹', isActive: false }
    ],
    collect:[]
  },
  onShow() {
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      collect
    })
  },

  // 点击tab栏切换样式
  handleTabsChange(e) {
    // console.log(e)
    // 获取当前点击元素的索引
    const { index } = e.detail;
    // 获取tabs
    const { tabs } = this.data
    tabs.forEach((e, i) => i === index ? e.isActive = true : e.isActive = false);
    // 把tabs的值重新赋值
    this.setData({
      tabs
    })
  }
})