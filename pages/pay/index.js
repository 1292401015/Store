
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js";
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },

  onShow(){
    //1 获取缓存中收货地址信息
    const address = wx.getStorageSync("address");
    //1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //1 计算全选
    //const allChecked = cart.length?cart.every(v => v.checked):false;
    //过滤后的购物车数组
    cart=cart.filter(v => v.checked);
    //1 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v => {
        totalPrice += v.num*v.goods_price;
        totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  //点击了支付的功能
  async handleOrderPay(){

    try {
    // 获取本地存储中的token
    const token = wx.getStorageSync('token');
    // 判断本地存储中有没有token
    // if (!token) {
    //   // 跳转得到授权页面
    //   wx.navigateTo({
    //     url: '/pages/auth/index',
    //   });
    // }

    //3 有token创建订单
    // 设置请求头信息
    const header = {Authorization: token};
    // 订单总价格
    const order_price = this.data.totalPrice;
    // 收货地址
    const consignee_addr = this.data.address.all;
    // 获取data中的购物车数组
    const cart = this.data.cart;
    // 订单数组
    let goods = [];

    cart.forEach(v => goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }))

    // 把订单需要传递的数据组合成一个对象
    const orderParams = {order_price,consignee_addr,goods};

    //4  调用获取订单数据接口
    const {order_number} = await request({url:"/my/orders/create",method:"POST",data:orderParams,header});

    // 发起预支付接口
    const {pay} = await request({url: '/my/orders/req_unifiedorder',method: 'post',data: {order_number}, header});

    // 调用微信自带的支付接口，把拿到的pay数据传递进去
    await requestPayment(pay);

    // 查询订单状态
    const res2 = await request({url: '/my/orders/chkOrder',method: 'post',data: {order_number}, header})
    console.log(res2,'res2')

    await showToast({title: '支付成功'});

    // 删除购物车的数据
    let newCart = wx.getStorageSync("cart");
    newCart=newCart.filter(v => !v.checked);
    // 支付成功跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/index'
    });
    } catch (error) {
      await showToast({title: '支付失败'});
      wx.navigateBack({
        // 返回上一个页面
        delta: 1
      });
    }
    
  }
})