// app.js
App({
  globalData: {
    userInfo: null,
    // serverUrl: 'http://localhost:8088/wechatapp',
    // ngUrl: 'http://localhost:8077/file/'
    serverUrl: 'https://jinyn.top/wechatapp',
    ngUrl: 'https://jinyn.top/file/'
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
 
})
