const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext({
  useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
})
const audioCtx = wx.createWebAudioContext()
// 获取文件系统管理器
const fs = wx.getFileSystemManager()
const app = getApp();
Page({
  data: {
    recordStatus: 0,
    inputValue: '',
    toView: '',
    chatList: []
  },
  onShareAppMessage: function () {
    return {
      title: '智能语音助手',
      path: '/pages/robot/robot'
    }
  },
  inputChange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  sendMessage: function () {
    var chatList = this.data.chatList;
    var inputValue = this.data.inputValue;
    chatList.push({
      owner: 'mine',
      type: 'text',
      content: inputValue
    });
    this.setData({
      chatList: chatList,
      inputValue: '',
      toView: 'chat-' + (chatList.length - 1)
    });
    wx.showLoading({
      title: '等待应答中',
      mask: true
    })
    var that = this;
    wx.request({
      url: app.globalData.serverUrl + '/chat',
      method: "POST",
      data: {
        msg: inputValue
      },
      success: function (res) {
        var msg = "";
        if (res.data.code == 200) {
          msg = res.data.data;
        } else {
          msg = res.data.message;
        }
        chatList.push({
          owner: 'other',
          type: 'text',
          content: msg
        });
      },
      fail: function (res) {
        chatList.push({
          owner: 'other',
          type: 'text',
          content: res.data.message
        });
      },
      complete: function () {
        wx.hideLoading();
        that.setData({
          chatList: chatList,
          toView: 'chat-' + (chatList.length - 1)
        });
      }
    });
  },
  onLoad() {
    var that = this;
    recorderManager.onStop((res) => {
      wx.showLoading({
        title: '等待应答中',
        mask: true
      })
      var chatList = that.data.chatList;
      var duration = (res.duration / 1000).toFixed(1);
      wx.uploadFile({
        url: app.globalData.serverUrl + '/chatBySpeak', // 上传文件的URL
        filePath: res.tempFilePath,
        name: 'voiceFile',
        formData: {
          'voiceFile': res.tempFilePath,
          'filePath': res.tempFilePath,
          'fileSize': res.fileSize
        },
        success(res) {
          
          const obj = JSON.parse(res.data);
          console.log(app.globalData.ngUrl+obj.data.msgPath)
          if (obj.status == 500) {
            chatList.push({
              owner: 'other',
              type: 'text',
              content: obj.error
            });
          } else {
            chatList.push({
              duration: duration,
              owner: 'mine',
              type: 'voice',
              content: app.globalData.ngUrl+obj.data.msgPath
            });
            chatList.push({
              owner: 'mine',
              type: 'text',
              content: obj.data.msg
            });
            chatList.push({
              duration: (obj.data.duration / 1000).toFixed(1),
              owner: 'other',
              type: 'voice',
              content: app.globalData.ngUrl+obj.data.filePath
            });
            chatList.push({
              owner: 'other',
              type: 'text',
              content: obj.data.chatResult
            });
          }
        },
        fail(res) {
          const obj = JSON.parse(res.data);
          chatList.push({
            owner: 'other',
            type: 'text',
            content: 'error:' + obj.data
          });
        },
        complete() {
          wx.hideLoading();
          that.setData({
            chatList: chatList,
            toView: 'chat-' + (chatList.length - 1),
            recordStatus: 0
          })
        }
      })
    })
  },
  // 播放语音
  playVoice: function (e) {
    let src = e.currentTarget.dataset.src;
    innerAudioContext.src = src;
    innerAudioContext.play();
  },
  startRecord: function () {
    recorderManager.start({
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: "pcm"
    })
    this.setData({
      recordStatus: 1
    })
  },
  stopRecord: function () {
    recorderManager.stop()
  },
  onHide: function () {
    if (this.data.recordStatus == 1) {
      recorderManager.stop()
    }
  },
})