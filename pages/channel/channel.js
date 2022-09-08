const app = getApp();
Page({
  data: {
    switch_Checked_channel1:false,
    switch_Checked_channel2:false,
    current:0,
    channel_1_volt_now:0,
    channel_2_volt_now:0,
    channel_1_cur_now:0,
    channel_2_cur_now:0,
    channel_1_volt_input:0,
    channel_2_volt_input:0,
    channel_1_cur_input:0,
    channel_2_cur_input:0,
    channel_1_volt_out:0,
    channel_2_volt_out:0,
    channel_1_cur_out:0,
    channel_2_cur_out:0,
    newslist:[{id:0,text:'通道1'},
            {id:1,text:'通道2'}],
    timer:''
  },
  // 生命周期回调—监听页面加载,页面加载时触发。一个页面只会调用一次
  onLoad: function () {
    var _this = this;
    this.setData({                    //每隔0.5s刷新一次
      timer: setInterval(function () {
        _this.getData();
    }, 500)
    })
    // console.log("app.channel_1_out : " + app.globalData.channel_1_out),
    // console.log("app.channel_2_out : " + app.globalData.channel_2_out),
    // console.log("channel_1_out : " + this.data.channel_1_volt_out),
    // console.log("channel_2_out : " + this.data.channel_2_volt_out)
  },
  // 得到单片机返回的数据
  getData(){
    this.setData({
      channel_1_volt_out : app.globalData.channel_1_volt_out,
      channel_2_volt_out : app.globalData.channel_2_volt_out,
      channel_1_cur_out : app.globalData.channel_1_cur_out,
      channel_2_cur_out : app.globalData.channel_2_cur_out,
    })
  },
  // 判断选中的哪个通道
  choose_channel:function(event){
    var index = event.currentTarget.dataset.id;
    this.setData({
      current:index
    })
    console.log(this.data.current)
  },
  // 通道1的拨动开关
  switch_Change_channel1(){
      this.setData({
        switch_Checked_channel1:!this.data.switch_Checked_channel1//开关状态变换
      })
      if(this.data.switch_Checked_channel1==false)//开关关闭,限幅为零
      {
          this.setData({
            channel_1_volt_now : 0,
            channel_1_cur_now : 0,
          })
      }
     console.log("switch_Checked_channel1",this.data.switch_Checked_channel1)//打印开关状态
  },
  // 通道2的拨动开关,同通道1
  switch_Change_channel2(){
      this.setData({
        switch_Checked_channel2:!this.data.switch_Checked_channel2
      })
      if(this.data.switch_Checked_channel2 == false)
      {
          this.setData({
            channel_2_volt_now : 0,
            channel_2_cur_now : 0,
          })
      }
    console.log("switch_Checked_channel2",this.data.switch_Checked_channel2)
  },
  // 限幅电压的输入框
  input_volt_num(e){
    var num = e.detail.value;//得到输入的值
    console.log(e)//打印输入框的值
    if(this.data.current == 0){//选中通道1的页面
      if (num)//如果输入框有值,限幅电压为输入值
        this.setData({
          channel_1_volt_input : num,
        })
      else//输入框没有输入值,则认为输入零
        this.setData({
          channel_1_volt_input : 0,
        })
    }
    else if(this.data.current == 1){//选中通道2页面,同选中通道1
      if (num)
      this.setData({
        channel_2_volt_input : num,
      })
      else
      this.setData({
        channel_2_volt_input : 0,
      })
    }
  },
  // 限幅电流的输入框,同限幅电压输入框
  input_cur_num(e){
    var num = e.detail.value;
    console.log(e)
    if(this.data.current == 0){
      if (num)
      this.setData({
        channel_1_cur_input : num
      })
      else
      this.setData({
        channel_1_cur_input : 0
      })
    }
    else if(this.data.current == 1){
    if (num)
      this.setData({
        channel_2_cur_input : num
      })
      else
      this.setData({
        channel_2_cur_input : 0
      })
    }
  },
  // 确定按键
  enter(){
    var send_topic = '/gxnxgM0zbzY/' + app.globalData.deviceName +'/user/send'
    if(app.globalData.connecte != 1){
      wx.showModal({
        title: '提示',
        content: '网络连接错误，请重新输入设备名称',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.globalData.chart_flag = false,
            app.device.publish("",'{offline}')
            wx.reLaunch({
              url: '../device/device'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    if((this.data.current == 0&& this.data.switch_Checked_channel1==false)||(this.data.current == 1&& this.data.switch_Checked_channel2==false)){
      wx.showToast({
        title: '请先打开开关',
        icon: 'error',
        duration: 1500
      })
    }
    if(this.data.switch_Checked_channel1==true)//通道1的开关打开
    {
      this.setData({
        channel_1_volt_now : parseFloat(this.data.channel_1_volt_input),//通道1限幅电压显示数据
        channel_1_cur_now : parseFloat(this.data.channel_1_cur_input),//通道1限幅电流显示数据
      })
    }
    if(this.data.switch_Checked_channel2==true){//通道2的开关打开,同通道1
      this.setData({
        channel_2_volt_now : parseFloat(this.data.channel_2_volt_input),
        channel_2_cur_now : parseFloat(this.data.channel_2_cur_input),
      })
    }
    app.device.publish(send_topic, this.getPostData());//通过mqtt向主题发布消息
    // console.log(send_topic)
  },
  // 得到需要发送的json格式的数据
  getPostData(){
    var payloadJson = {
        // id: Date.now(),
        // version: "1.0",
        // params: {
          switch_channel_1: this.data.switch_Checked_channel1,//通道1开关状态
          channel_1_volt: this.data.channel_1_volt_now,//通道1的限幅电压
          channel_1_cur: this.data.channel_1_cur_now,//通道2的限幅电流

          switch_channel_2: this.data.switch_Checked_channel2,//通道2的开关状态
          channel_2_volt: this.data.channel_2_volt_now,//通道2的限幅电压
          channel_2_cur: this.data.channel_2_cur_now,//通道2的限幅电流
        // },
        // method: "thing.event.property.post",
    }
    console.log("payloadJson " + JSON.stringify(payloadJson))//打印即将发送的json数据
    return JSON.stringify(payloadJson);//返回json数据
  },

})
