// 在页面的js文件中添加以下代码
import Dialog from '@vant/weapp/dialog/dialog';


Page({
  data: {
    options: [], // 存储选项的数组
    winner: null, // 存储中奖选项
    isDrawing: false // 标记是否正在抽奖
  },
  onLoad(options) {
    var key = options.key;
    var options = [];
    options = (wx.getStorageSync('mdMap') || [])[key];
    this.setData({
      options: options
    });
  },
    // 开始抽奖
  startDrawing: function () {
    if (this.data.options.length === 0) {
      // 没有选项，不进行抽奖
      return;
    }
    if (this.data.isDrawing) {
      // 正在抽奖中，不重复进行
      return;
    }
    this.setData({
      isDrawing: true
    });
    var options = this.data.options;
    var winnerIndex = Math.floor(Math.random() * options.length); // 随机选出一个中奖选项的索引
    var winner = options[winnerIndex];
    Dialog.alert({
      message: '就决定是你了→'+winner,
    }).then(() => {
      this.setData({
        isDrawing: false
      });
    });
  },
  changeOption(e){
    var temp = e.detail;
    this.setData({
      name: temp
    })
  }
})
