const util = require('../../utils/util.js')

// pages/record/record.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    minDate: new Date(2023, 0, 1).getTime(),
    logs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      logs: (wx.getStorageSync('jqTime') || []).map(log => {
        return {
          date: util.formatDayTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  },
  delRecord(event){
    const index = event.currentTarget.dataset.index
    const logs = wx.getStorageSync('jqTime') || []
    logs.splice(index,1)
    wx.setStorageSync('jqTime', logs)
    this.setData({
      logs: (wx.getStorageSync('jqTime') || []).map(log => {
        return {
          date: util.formatDayTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  },
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onConfirm(event) {
    this.setData({
      show: false,
    });
    const logs = wx.getStorageSync('jqTime') || []
    logs.unshift(event.detail)
    wx.setStorageSync('jqTime', logs)
    this.data.logs.unshift(Date.now())
    this.setData({
      logs: (wx.getStorageSync('jqTime') || []).map(log => {
        return {
          date: util.formatDayTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  },
})