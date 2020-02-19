// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // tab栏数据
    tabs: [
      { id: 0, title: '综合', isActive: true },
      { id: 1, title: '销量', isActive: false },
      { id: 2, title: '价格', isActive: false }
    ],
    // 页面数据数组
    goodsList: []
  },
  // 请求分类页面数据参数
  queryParams: {
    // 搜索关键字
    query: '',
    // 分类id
    cid: '',
    // 页码
    pagenum: 1,
    // 页容量
    pagesize: 10
  },
  // 总页数
  totalPage: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取url传递的参数
    this.queryParams.cid = options.cid||""
    this.queryParams.query = options.query||""
    // 调用函数
    this.getGoodsList();
    // 请求数据前显示加载中
    wx.showLoading({
      title: '加载中',
    })
  },
  // 封装请求页面数据
  async getGoodsList() {
    // 请求分类页面的数据
    const res = await request({ url: '/goods/search', data: this.queryParams })
    // 请求到数据后停止下拉刷新
    wx.stopPullDownRefresh();
    // 请求到数据停止加载
    wx.hideLoading();
    // 计算总页数
    this.totalPage = Math.ceil(res.total / this.queryParams.pagesize);
    //console.log(this.totalPage);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
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
  },
  // 上拉加载事件
  onReachBottom() {
    // 判断有没有下一页数据
    if (this.queryParams.pagenum >= this.totalPage) {
      // 没有下一页数据，弹出提示
      wx.showToast({
        title: '没有下一页数据了'
      })
    }
    else {
      // 如果有下一页数据则页数++
      this.queryParams.pagenum++;
      // 再次请求数据
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh: function () {
    // 触发下拉刷新时执行
    // 重置页码为第一页
    this.queryParams.pagenum = 1;
    // 重置商品数组为空数组
    this.setData({
      goodsList: []
    })
    // 重新发送请求
    this.getGoodsList()
  },

})