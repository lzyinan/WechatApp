const util = require('../../utils/util.js')
const holidayList = [{
    name: "元旦",
    month: 1,
    day: 1
  },
  {
    name: "春节",
    month: 1,
    day: 1
  },
  {
    name: "清明节",
    month: 4,
    day: 4
  },
  {
    name: "劳动节",
    month: 5,
    day: 1
  },
  {
    name: "端午节",
    month: 5,
    day: 5
  },
  {
    name: "中秋节",
    month: 8,
    day: 15
  },
  {
    name: "国庆节",
    month: 10,
    day: 1
  },
];

// pages/record/record.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    holidayList: [], // 节日倒计时列表
    holidayTip: '',
    show: false,
    minDate: new Date(2023, 0, 1).getTime(),
    logs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 初始化节日倒计时
    this.initHolidayCountDown();
    // 每秒更新一次倒计时
    setInterval(() => {
      this.updateHolidayCountDown();
    }, 1000);
    this.setData({
      logs: (wx.getStorageSync('jqTime') || []).map(log => {
        return {
          date: util.formatDayTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  },
  // 初始化节日倒计时
  initHolidayCountDown: function () {
    let nowYear = new Date().getFullYear();
    let list = [];
    for (let i = 0; i < holidayList.length; i++) {
      let holiday = holidayList[i];
      let time = new Date(nowYear, holiday.month - 1, holiday.day);
      if (time < new Date()) {
        time = new Date(nowYear + 1, holiday.month - 1, holiday.day);
      }
      let countDown = this.getCountDown(time);
      list.push({
        name: holiday.name,
        time: time,
        countDown: countDown
      });
    }
    list.sort(function (a, b) {
      return a.time - b.time;
    });
    var holidayTip = '';
    list.slice(0, 1).forEach(function (element) {
      holidayTip += "距离" + element.name + ":" + element.countDown;
    });
    this.setData({
      holidayTip: holidayTip,
      holidayList: list.slice(0, 1),
    });
  },

  // 更新节日倒计时
  updateHolidayCountDown: function () {
    let list = this.data.holidayList;
    for (let i = 0; i < list.length; i++) {
      let countDown = this.getCountDown(list[i].time);
      list[i].countDown = countDown;
    }
    list.sort(function (a, b) {
      return a.countDown - b.countDown;
    });
    var holidayTip = '';
    list.slice(0, 1).forEach(function (element) {
      holidayTip += "距离" + element.name + ":" + element.countDown + "\n";
    });
    this.setData({
      holidayTip: holidayTip,
      holidayList: list.slice(0, 1),
    });
  },

  // 获取距离指定时间的倒计时
  getCountDown: function (time) {
    let diff = time.getTime() - new Date().getTime();
    if (diff <= 0) {
      return "已过期";
    }
    let day = Math.floor(diff / 86400000);
    let hour = Math.floor((diff % 86400000) / 3600000);
    let minute = Math.floor((diff % 3600000) / 60000);
    let second = Math.floor((diff % 60000) / 1000);
    return `${day}天${hour}小时${minute}分${second}秒`;
  },
  delRecord(event) {
    const index = event.currentTarget.dataset.index
    const logs = wx.getStorageSync('jqTime') || []
    logs.splice(index, 1)
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
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
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