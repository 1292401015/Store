// pages/cart/index.js
/* 购物车逻辑
  1、实现收货地址按钮
    a、调用微信小程序自带的获取用户权限 wx-getSetting，判断用户进行的操作
    b、获取用户全选有scrop返回值，通过判断scrop的返回值来进行相应的操作
    c、如果scrop为true或者undefined直接获取用户的收货地址 wx-chooseAddress
    d、如果scrop为false则先打开用户权限 wx-openSetting 再打开用户收货地址 wx-chooseAddress
       把获取到的用户数据存储到本地存储中
    e、重新返回购物车页面的时候先获取本地存储中的用户收货地址信息，在页面上判断是否有收货地址
    f、如果有则将按钮替换为收货地址文字信息，如果没有则继续显示收货地址按钮
  2、实现购物车数据列表的显示
    a、在商品详情页的时候点击加入购物车的时候已经把当前购物车数据存储到内存中，并手动添加了商品数量 num 属性和选中状态 checked 属性
    b、定义一个函数来设置购物车信息 setCart
    c、获取本地存储中的购物车信息，在data中定义一个变量用来存储购物车信息，在页面上进行数据的动态渲染
    d、在data中定义一个总价格 totalPrice 和总数量 totalNum变量
    e、计算出总价格和总数量
    f、重新数据设置回setCart函数中
    e、把数据重新存储到本地存储中替换旧的数据
  3、实现购物车商品的总价格和总数量的选中变化
    a、获取商品的选中状态
    b、遍历商品数组，判断如果为选中则商品价格++和数量++
    c、重新数据设置回setCart函数中
  4、实现购物车商品的选中状态切换
    a、给复选按钮添加点击事件，添加一个自定义属性id
    b、获取商品数据数组和复选框的id
    c、给对应的商品数组身上的checked属性取反
    d、重新把数据设置回setCart函数中
  5、实现购物车商品的全选和反选
    a、获取全选状态和购物车数据数组
    b、遍历购物车数据数组，把每条数据的选中状态设置为全选按钮的选中状态
    c、把数据重新设置回setCart函数中
  6、实现购物车商品数量的增加减少和商品的删除
    a、给 + 和 - 添加点击事件，在其身上添加自定义属性opeation，+ 为 1，- 为 -1
    b、获取购物车数据数组和opeation属性
    c、进行数量的添加减少操作 cart[id].num += opration;
    d、判断当进行的操作是减少并且数量为1的时候，进行商品的删除操作
    f、使用delete将对应的商品删除
    g、把数据重新设置回setCart函数中
*/
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js";
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },

  onShow(){
    //1 获取缓存中收货地址信息
    const address = wx.getStorageSync("address");
    //1 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    //1 计算全选
    //const allChecked = cart.length?cart.every(v => v.checked):false;

    this.setData({
      address
    })
    this.setCart(cart);
  },

  //点击获取收货地址
  async handleChooseAddress(){
    try {
      //1 获取权限 状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //2 判断权限状态
      if(scopeAddress===false){
        //3 先诱导用户打开授权页面
        await openSetting();
      }

      //4 调用获去地址的api
      let address = await chooseAddress();
      address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
      console.log(address);
      //5 存入发哦缓存中
      wx.setStorageSync("address", address);
      
    } catch (error) {
      console.log(error);
    }
  },

  //商品的选中
  handleItemChange(e){
    //1获取别修改的id
    const goods_id=e.currentTarget.dataset.id;
    //2 获取购物车数组
    let {cart} = this.data;
    //3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id===goods_id);
    //4 选中状态取反
    cart[index].checked = !cart[index].checked;
    //5 重新设置后缓存中和data中
    this.setCart(cart);
  },
  //设置购物车状态 重新计算 价格等等
  setCart(cart){
    //1 计算全选
    //const allChecked = cart.length?cart.every(v => v.checked):false;
    let allChecked=true;
    //1 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice += v.num*v.goods_price;
        totalNum += v.num;
      }else{
        allChecked=false;
      }
    })
    //判断数组为空
    allChecked = cart.length!=0?allChecked:false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },
  //全选反选事件
  handleItemAllCheck(){
    //1 获取data中的数据
    let {cart,allChecked} = this.data;
    //2 修改allChecked的值
    allChecked = !allChecked;
    //3 循环修改购物车数组
    cart.forEach(v => v.checked=allChecked);
    //4 把修改厚的值到data和缓存
    this.setCart(cart);
  },
  //商品数量编辑
  async handleItemNumEdit(e){
    //1 获取传递过来的数据
    //console.log(e);
    const {operation,id} = e.currentTarget.dataset;
    //2 获取购物车数组
    let {cart} = this.data;
    //3 找到需要修改的商品索引
    const index = cart.findIndex(v => v.goods_id===id);
    //4-1 判断是否要删除
    if(cart[index].num===1 && operation===-1){
      // wx.showModal({
      //   title: '提示',
      //   content: '崽子您是否要删除！',
      //   success: (res) => {
      //     if (res.confirm) {
      //       cart.splice(index,1);
      //       this.setCart(cart);
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })

      const res =  await showModal({content:"崽子您确定要删除？"});
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      //4 进行修改数量
      cart[index].num += operation;
      //5 设置回缓存和data中
      this.setCart(cart);
    }
    
  },

  //空购物车弹窗
  async handleEmpty(){
    await showModal({content:"东西都不买还乱点什么点？"});
  },
  //点击了结算的功能
  async handlePay(){
    //判断收货地址
    const {address,totalNum} = this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    //2 判断用户选择商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"})
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})