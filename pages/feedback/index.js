// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab栏数据
    tabs: [
      { id: 0, title: '体验问题', isActive: true },
      { id: 1, title: '商品、商家投诉', isActive: false }
    ],
    //被选中图片数组
    chooseImgs:[],
    //文本域内容
    textValue:""
  },

  //外网图片数组
  UploadImg:[],
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
  //点击+选中图片
  handleChoose(){
    
    wx.chooseImage({
      //选中数量最多
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  //点击删除图片
  handleRemoveImg(e){
    //获取被点击的索引
    const {index} = e.currentTarget.dataset;
    ///获取data中的图片数组
    let {chooseImgs} = this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },
  //文本域的输入内容
  handleTextInput(e){
    this.setData({
      textValue:e.detail.value
    })
  },
  //表单提交
  handleFormSubmit(){
    const {textValue,chooseImgs} =this.data;
    if(!textValue.trim()){
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    ///上传文件的api
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    if(chooseImgs.length!=0){
    chooseImgs.forEach((filePath,i) => {
      wx.uploadFile({
        url: 'https://sm.ms/api/upload',
        filePath: filePath,
        name: 'smfile',
        formData: {},
        success: (result)=>{
          console.log(result);
          let url= JSON.parse(result.data);
          this.UploadImg.push(url);
          console.log(this.UploadImg);


          //所有图片上传完
          if(i===chooseImgs.length-1){
            wx.hideLoading();
            this.setData({
              textValue:"",
              chooseImgs:[]
            })
            wx.navigateBack({
              delta: 1
            });
          }
        
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    })
  }else{
    wx.hideLoading();
            this.setData({
              textValue:"",
              chooseImgs:[]
            })
            wx.navigateBack({
              delta: 1
            });
  }
  }
})