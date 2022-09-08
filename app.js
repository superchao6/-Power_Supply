//app.js
App({
  globalData: {
    device:null,
    userInfo: null,
    get_data:{"channel_1_volt_out":0,"channel_2_volt_out":0,"channel_1_cur_out":0,"channel_2_cur_out":0},
    channel_1_volt_out: 0,
    channel_2_volt_out: 0,
    channel_1_cur_out: 0,
    channel_2_cur_out: 0,
    chart_flag : false,
    deviceName : null,
    connecte : 0,
  },

  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
})