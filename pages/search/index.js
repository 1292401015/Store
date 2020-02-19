// pages/search/index.js
// 引入封装好的请求数据的js文件
import { request } from '../../request/index.js';
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    isFocus:false,
    inpValue:''
  },
  timeId:-1,
  handleInput(e){
    console.log(e);
    //获取输入框的值
    const {value} = e.detail;
    //检查合法性
    if(!value.trim()){
      this.setData({
        isFocus:false
      })
      return;
    }
    this.setData({
      isFocus:true
    })
    //准备放请求获取数据
    clearTimeout(this.timeId);
    this.timeId = setTimeout(() => {
      this.qsearch(value);
    },1000)
  },
  async qsearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}});
    console.log(res);
    this.setData({
      goods:res
    })
  },
  handleCancer(){
    this.setData({
      inpValue:'',
      isFocus:false,
      goods:[]
    })
  }
})