Page({
  data: {
    newPlayer: '',
    players: [],
    currentRound: {},
    rounds: [],
    result: []
  },

  onLoad() {
    const storedPlayers = wx.getStorageSync('players') || [];
    const storedRounds = wx.getStorageSync('rounds') || [];
    this.setData({
      players: storedPlayers,
      rounds: storedRounds
    });
  },

  onInputPlayer(e) {
    this.setData({ newPlayer: e.detail.value });
  },

  addPlayer() {
    const name = this.data.newPlayer.trim();
    if (!name || this.data.players.includes(name)) return;

    const newPlayers = [...this.data.players, name];
    this.setData({ players: newPlayers, newPlayer: '' });
    wx.setStorageSync('players', newPlayers);
  },

  onInputAmount(e) {
    const name = e.currentTarget.dataset.name;
    const value = parseFloat(e.detail.value) || 0;
    this.setData({
      currentRound: {
        ...this.data.currentRound,
        [name]: value
      }
    });
  },

  submitRound() {
    const { currentRound, players } = this.data;
    const roundData = players.map(name => ({
      name,
      amount: currentRound[name] || 0
    }));
    const updatedRounds = [roundData, ...this.data.rounds];
    this.setData({
      rounds: updatedRounds,
      currentRound: {},
      result: []
    });
    wx.setStorageSync('rounds', updatedRounds);
  },

  settle() {
    const total = {};
    this.data.players.forEach(name => total[name] = 0);
    for (let round of this.data.rounds) {
      for (let record of round) {
        total[record.name] += record.amount;
      }
    }
    const maxAmount = Math.max(...Object.values(total));
    const result = Object.entries(total).map(([name, amount]) => ({
      name,
      amount,
      highlight: amount === maxAmount
    }));
    this.setData({ result });
  },

  clearAll() {
    wx.removeStorageSync('players');
    wx.removeStorageSync('rounds');
    this.setData({
      players: [],
      rounds: [],
      result: [],
      currentRound: {},
      newPlayer: ''
    });
  },

  // ✨ 生成截图
  drawBill() {
    const ctx = wx.createCanvasContext('billCanvas', this);
    const { result } = this.data;

    ctx.setFillStyle('#ffffff');
    ctx.fillRect(0, 0, 500, 600);
    ctx.setFontSize(18);
    ctx.setFillStyle('#000000');
    ctx.fillText('打牌记账结算单', 160, 40);
    ctx.setFontSize(16);
    result.forEach((item, index) => {
      const y = 80 + index * 30;
      ctx.setFillStyle(item.highlight ? '#28a745' : '#000000');
      ctx.fillText(`${item.name}：${item.amount} 元`, 50, y);
    });

    ctx.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId: 'billCanvas',
        success: res => {
          wx.previewImage({
            urls: [res.tempFilePath]
          });
        },
        fail: err => {
          wx.showToast({ title: '生成失败', icon: 'none' });
          console.error(err);
        }
      }, this);
    });
  },

  // ✨ 分享功能（标题可定制）
  onShareAppMessage() {
    return {
      title: '快来看我的打牌账单！',
      path: '/pages/bookkeeping/bookkeeping'
    };
  }
});
