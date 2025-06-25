import Toast from '@vant/weapp/toast/toast';
// pages/makeDecision/makeDecision.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    isAdd: false,
    tabindex: 1,
    index: 1,
    name: "",
    options: [{1:""}],
    tabs: []
  },

  onLoad() {
    var tabs = [];
    var mdMap = wx.getStorageSync('mdMap') || {};
    for (var propertyName in mdMap) {
      if (mdMap.hasOwnProperty(propertyName)) {
        tabs.unshift(propertyName)
      }
    }
    this.setData({
      tabs: tabs
    })
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  addMdMap() {
    this.setData({"isAdd":true})
  },
  delMdMap(event) {
    const map = wx.getStorageSync('mdMap') || []
    console.log(event)
  },
  saveMdMap(event){
    const name = this.data.name;
    const options = this.data.options;
    if(name.length>0){
      const map = wx.getStorageSync('mdMap') || {}
      map[name]=options;
      wx.setStorageSync('mdMap', map);
      const tabs = this.data.tabs;
      tabs.unshift(name);
      this.setData({
        "isAdd":false,
        "index":1,
        "name": "",
        "options": [{1:""}],
        "tabs": tabs
      })
    }
    Toast('你这名字不太对啊')
  },
  addTab(){
    var old=this.data.options;
    var idx = this.data.index+1;
    const option = {"idx":""}
    old.push(option);
    this.setData({
        options: old,
        index: idx
    })
  },
  change(e){
    var temp = this.data.options;
    temp[e.currentTarget.dataset.idx]=e.detail;
    this.setData({
      options: temp
    })
  },changeName(e){
    var temp = e.detail;
    this.setData({
      name: temp
    })
  }
})