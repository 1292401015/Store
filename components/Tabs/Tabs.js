// components/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击tab栏切换样式
    handleTapsChange(e) {
      // console.log(e)
      // 获取当前点击的元素的索引
      const { index } = e.currentTarget.dataset;
      // 把索引传递给父组件
      this.triggerEvent('TabsChange', { index })
    }
  }
})
