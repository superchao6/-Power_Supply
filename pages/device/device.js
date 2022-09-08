var iot = require('../../utils/iot-sdk'); //根据自己存放的路径修改
const app = getApp();
var sdk_device = {
    "productKey": "gxnxgM0zbzY",
    "deviceName": "0", 
    "deviceSecret": "0",
    "protocol": 'wxs://gxnxgM0zbzY.iot-as-mqtt.cn-shanghai.aliyuncs.com:443',
} 
var nickNames = ["1","2"];
var deviceNames = ["test", "device_1"];
var deviceSecrets = ["27b7376d6af52e88ed5cf0b0081846ee","9dde81a27defa52ae8960eb565902d37"];
var receive_topic = '/gxnxgM0zbzY/' + sdk_device.deviceName +'/user/recevie'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName : "0",
    },
    onShow: function(){
        sdk_device.deviceName = 0,
        sdk_device.deviceSecret = 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.doConnect()
    },
    doConnect(){
        // 连接云平台
        this.device = iot.device(sdk_device);
        app.device = this.device;
        // 当连接成功进入回调
        this.device.on('connect', () => {
        console.log('连接成功....');
        app.globalData.connecte = 1;
        this.device.subscribe(receive_topic)
        });
        // 当收到云端消息下发
        this.device.on('message', (topic, payload) => {
        console.log('topic:', topic);
        if (payload) {
            console.log('payload', payload);
            console.log('payload.toString()', payload.toString());
            app.get_data = payload.toString();
            // console.log(this.get_data);
        }
        });
        // 当出现错误时回调
        this.device.on('error', (err) => {
        console.log('error:', err);
        app.globalData.connecte = -1;
        });
     },
    input_device(e){
    var Name = e.detail.value;
    // console.log(e)
        if (Name)
        this.setData({
            nickName : Name
        })
        else
        this.setData({
            nickName : 0
        })
        console.log(this.data.nickName)
    },
    sure(){
        var index = nickNames.indexOf(this.data.nickName)

        if(index>=0){
            sdk_device.deviceName = deviceNames[index],
            sdk_device.deviceSecret = deviceSecrets[index],
            console.log(sdk_device)
            this.doConnect()
            app.globalData.deviceName = deviceNames[index]
            console.log(app.globalData.deviceName)
                wx.switchTab({
                    url: "../null/null"
                })
        }
        else{
            wx.showToast({
                title: '名称错误',
                icon: 'error',
                duration: 2000
              })
            console.log("error")
        }
    },
})