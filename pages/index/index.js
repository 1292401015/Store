//引入要发送请求的方法
import {request} from "../../request/index.js";

//Page Object
Page({
  data: {
    //轮播图数组
    swiperList:[],
    //分类图数组
    catesList:[],
    //楼层数组
    floorList:[]
  },
  //options(Object)页面加载开始就会触发
  onLoad: function(options) {
  //1 发送异步请求获取轮播图数据
  // wx.request({
  //   url:'https://api.zbztb.cn/api/public/v1/home/swiperdata',
  //   success: (result) => {
  //     this.setData({
  //       swiperList:result.data.message
  //     })
  //   }
  // });

    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },

  getSwiperList(){
    request({url:'/home/swiperdata'})
    .then(result =>{
      this.setData({
        swiperList:result
      })
    })
  },

  getCatesList(){
    request({url:'/home/catitems'})
    .then(result =>{
      this.setData({
        catesList:result
      })
    })
  },

  getFloorList(){
    request({url:'/home/floordata'})
    .then(result =>{
      console.log(result);
      this.setData({
          floorList:result
      })
      //floorList.forEach(v => {v.product_list.navigator_url=v.product_list.navigator_url.slice(0,1)});
    });
    //this.floorList.forEach(v =>  v.product_list.navigator_url = v.product_list.navigator_url.slice(0, 1));
  }

});
  