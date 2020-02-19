import {request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/category/index.js
Page({

  data: {
    leftMenuList:[],
    rightContent:[],
    //被点击左侧的菜单
    currentIndex:0,
    scrollTop:0
  },

  cates:[],

  onLoad: function (options) {
    //1获取本地存储中的数据
    const Cates = wx.getStorageSync("cates");
    //2判断
    if(!Cates){
      //不存在，发送请求获取数据
      this.getCates();
    }else{
      //有旧的的数据，定义过期事件 10s改成5分钟
      if(Date.now()-Cates.time>1000*10){
        //重新发送请求
        this.getCates();
      }else{
        //可以使用就数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  //获取分类数据
  async getCates(){
    // request({url:"/categories"})
    // .then(res =>{
    //   this.Cates=res.data.message;
    //   //把接口中的数据存入到本地
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates})
    //   //构建左侧的大菜单数据
    //   let leftMenuList=this.Cates.map(v =>v.cat_name);
    //   //构建右侧的商品数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList, 
    //     rightContent
    //   })
    // })

    //使用es7的async await来发送请求
    const res = await request({url:"/categories"})
    this.Cates=res;
    //把接口中的数据存入到本地
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates})
    //构建左侧的大菜单数据
    let leftMenuList=this.Cates.map(v =>v.cat_name);
    //构建右侧的商品数据
    let rightContent=this.Cates[0].children;
    this.setData({
      leftMenuList, 
      rightContent
    })
  },
  //左侧菜单点击事件
  handleItemTap(e){
    const {index}=e.currentTarget.dataset;
    //重新给右侧内容数组赋值
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent:rightContent,
      scrollTop:0
    })
  }
})