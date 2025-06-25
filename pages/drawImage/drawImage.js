const app = getApp();
Page({
  data: {
    description: '',
    sizes: ['256x256', '512x512', '1024x1024'],
    sizeIndex: 0,
    numbers: ['1', '2', '3', '4', '5'],
    numberIndex: 0,
    loading: [true,true,true,true,true],
    imageUrlArray: []
  },
  onImageLoad: function(e){
    var loadArr = this.data.loading;
    console.log(loadArr)
    console.log(e.currentTarget.dataset.idx)
    loadArr[e.currentTarget.dataset.idx]=false;
    console.log(loadArr)
    this.setData({
      loading: loadArr
    })
  },
  onInput: function (e) {
    this.setData({
      description: e.detail.value
    })
  },
  onSizeChange: function (e) {
    this.setData({
      sizeIndex: e.detail.value
    })
  },
  onNumberChange: function (e) {
    this.setData({
      numberIndex: e.detail.value
    })
  },
  onGenerate: function () {
    var description = this.data.description;
    if (description === '') {
      wx.showToast({
        title: '描述不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var size = Number(this.data.sizeIndex) + 1;
    var num = Number(this.data.numberIndex) + 1;
    var that = this;
    wx.showLoading({
      title: '等待应答中',
      mask: true
    })
    wx.request({
      url: app.globalData.serverUrl + '/generateImg',
      method: "POST",
      data: {
        tips: description,
        size: size,
        num: num
      },
      success: function (res) {
        if (res.data.code == 200) {
          const fixedString = app.globalData.ngUrl;
          const stringArray = res.data.data;
          for (let i = 0; i < stringArray.length; i++) {
            stringArray[i] = fixedString + stringArray[i];
          }
          that.setData({
            imageUrlArray: stringArray
          });
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  onImageTap: function(e) {
    let imageUrl = e.currentTarget.dataset.source;
    var imageUrlArray = this.data.imageUrlArray;
    console.log(imageUrl)
    wx.previewImage({
      current: imageUrl,
      urls: imageUrlArray,
      success: function(res) {
        console.log('预览图片成功')
      },
      fail: function(res) {
        console.log('预览图片失败', res)
      }
    })
  }
})