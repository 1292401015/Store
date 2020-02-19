// pages/goods_detail/index.js
// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:[],
    isCollect:false
  },

  //商品对象
  goodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    //获取上一页传过来的数据
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;

    const {goods_id} = options;
    this.getGoodsDetail(goods_id);
  },
  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({ url:"/goods/detail",data:{goods_id}});
    console.log(goodsObj);
    this.goodsInfo=goodsObj;

    //1 获取缓存中商品收藏的按钮
    let collect = wx.getStorageSync("collect") || [];
    //2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id===this.goodsInfo.goods_id);

    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),//正则表达式
        pics:goodsObj.pics
      },
      isCollect
    })
  },
  //点击轮播图放大预览
  handlePrevewImage(e){
    console.log("你好");
    //先构造要预览的图片数组
    const urls = this.goodsInfo.pics.map(v => v.pics_mid);
    //接收传递过来的URL图片
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current:current,
      urls:urls
    });
  },
  //点击加入购物车
  handleCartAdd(){
    console.log("gouwuc");
    //1 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || [];
    //2 判断商品对象是否存在数组中
    let index = cart.findIndex(v => v.goods_id===this.goodsInfo.goods_id);//遍历
    console.log(index);
    if(index===-1){
      //3 不存在 第一次添加
      this.goodsInfo.num=1;
      this.goodsInfo.checked=true;
      cart.push(this.goodsInfo);
    }else{
      //4 已经存在 执行num++
      cart[index].num++;
    }
    //5 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    //6 弹窗提是
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true
    });
  },
  handleCollect(){
    let isCollect = false;
    //1 获取缓存中商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    //2判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
    //当index不等于-1时表示已经收藏过
    if(index!=-1){
      collect.splice(index,1);
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    }else{
      collect.push(this.goodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    //4 把数组存入缓存中国
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect
    })
  }
})