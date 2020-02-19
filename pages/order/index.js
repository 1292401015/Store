// pages/order/index.js

// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs: [
      { id: 0, title: '全部', isActive: true },
      { id: 1, title: '待付款', isActive: false },
      { id: 2, title: '代发货', isActive: false },
      { id: 2, title: '退款/退货', isActive: false }
    ]
  },

  onLoad(options){
    console.log(options);
  },


  onShow(options){
    let pages= getCurrentPages();
    let currentPage = pages[pages.length-1];
    const {type} = currentPage.options;
    this.changeTitleByIndex(type-1);
  },

  //获取订单列表
  async getOrders(type){
    const res = await request({url:"/my/orders/all",data:{type}});
    this.setData({
      orders:res.orders.map(v => ({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },

  //根据标题索引激活选中
  changeTitleByIndex(index){
    // 获取tabs
    const { tabs } = this.data
    tabs.forEach((e, i) => i === index ? e.isActive = true : e.isActive = false);
    // 把tabs的值重新赋值
    this.setData({
      tabs
    })
  },
  // 点击tab栏切换样式
  handleTabsChange(e) {
    // console.log(e)
    // 获取当前点击元素的索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
  }
})