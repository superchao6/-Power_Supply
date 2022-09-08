import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
var Chart_volt = null;
var Chart_cur = null;
var channel_1_volt=[0,0,0,0,0,0,0,0,0,0];
var channel_2_volt=[0,0,0,0,0,0,0,0,0,0];
var channel_1_cur=[0,0,0,0,0,0,0,0,0,0];
var channel_2_cur=[0,0,0,0,0,0,0,0,0,0];
// 检测接收的数据是否为json格式
function testJson(str) {
  try {
      let jsonObj = JSON.parse(str);
      if ("string" === typeof str && "object" === typeof jsonObj) {
          return true;
      }
  } catch (error) {
  }
  return false; 
}

Page({
  data: {
    ec_volt: {
      lazyLoad: true // 延迟加载
    },
    ec_cur: {
      lazyLoad: true // 延迟加载
    },
    timer:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var _this = this;
    this.getOption_volt();
    this.getOption_cur();
    this.setData({                    //每隔1s刷新一次
      timer: setInterval(function () {
        _this.getData();
    }, 1000)
    })
  },
  onShow:function(){
    if(!app.globalData.chart_flag)
    {
      Chart_volt = null;
      Chart_cur = null;
      app.globalData.chart_flag = true;
    }
  },
  onReady: function () {
    this.echartsComponnet_volt = this.selectComponent('#mychart_volt'); 
    this.echartsComponnet_cur = this.selectComponent('#mychart_cur');
  },

  // 更改Tooltip的位置，处理边界超出的情况
  setTooltipPositionfunction(point, params, dom, rect, size) {
    console.log(params, dom)
    //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
    // 更改提示框的显示位置
    let x = point[0];//
    let y = point[1];
    // size: 包括 dom 的尺寸和 echarts 容器的当前尺寸，例如：{contentSize: [width, height], viewSize: [width, height]}
    let boxWidth = size.contentSize[0];
    let big_width = size.viewSize[0];
    // let boxHeight = size.contentSize[1]; // size里面此处获取不到dom的高度，值为NAN，所以下面指定了一个固定值
    let boxHeight = 50;
    let posX = 0;//x坐标位置
    let posY = 0;//y坐标位置
    if (big_width - x < boxWidth) {//右边放不开
      posX = x - 130;
    } else {//右边放的下
      posX = x + 30;
    }

    if (y < boxHeight + 50) {//上边放不开
      posY = y + 10;
    } else {//上边放得下
      posY = y - 85;
    }
    return [posX, posY];
  },

  getData: function () {
    var return_data = app.get_data
    if(testJson(return_data)){    
      var result = JSON.parse(return_data)
      channel_1_volt.splice(9)
      channel_2_volt.splice(9)
      channel_1_cur.splice(9)
      channel_2_cur.splice(9)
      app.globalData.channel_1_volt_out = result.channel_1_volt_out
      app.globalData.channel_2_volt_out = result.channel_2_volt_out
      app.globalData.channel_1_cur_out = result.channel_1_cur_out
      app.globalData.channel_2_cur_out = result.channel_2_cur_out
      channel_1_volt.unshift(app.globalData.channel_1_volt_out)
      channel_2_volt.unshift(app.globalData.channel_2_volt_out)
      channel_1_cur.unshift(app.globalData.channel_1_cur_out)
      channel_2_cur.unshift(app.globalData.channel_2_cur_out)
    }
    //如果是第一次绘制
    if (!Chart_volt || !Chart_cur){
      this.init_echarts_volt(); //初始化图表
      this.init_echarts_cur(); //初始化图表
    }else{
      this.setOption_volt(Chart_volt); //更新数据
      this.setOption_cur(Chart_cur); //更新数据
    }
  },
  //初始化图表
  init_echarts_volt: function () {
    this.echartsComponnet_volt.init((canvas, width, height) => {
      // 初始化图表
      Chart_volt = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption_volt(Chart_volt);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart_volt;
    });
  },
  init_echarts_cur: function () {
    this.echartsComponnet_cur.init((canvas, width, height) => {
      // 初始化图表
      Chart_cur = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption_cur(Chart_cur);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart_cur;
    });
  },
  setOption_volt: function (Chart) {
    //Chart.clear();  // 清除
    Chart.setOption(this.getOption_volt());  //获取新电压数据
  },
  setOption_cur: function (Chart) {
    //Chart.clear();  // 清除
    Chart.setOption(this.getOption_cur());  //获取新电压数据
  },
  getOption_volt: function (){
    var option = {
      color: ["#37A2DA"],
      tooltip: {
        show: true,
        // confine: true,
        trigger: 'axis',
        borderWidth: 1,
        position: this.setTooltipPositionfunction
      },
      legend: {
        data: ['channel1','channel2'],
        orient: "horizontal",
        top: 0,
        // backgroundColor: '#ffffff',
        z: 10,
        itemStyle: {
          // color: "#5470c6","#5470c6"
        }
      },
      grid: {
          left: 5,//折线图距离左边距
          right: 55,//折线图距离右边距
          top: 30,//折线图距离上边距
          bottom: 10,
          containLabel: true
      },
      xAxis: {
        name: '时间/s',
        nameGap: 5,
        type: 'category',
        boundaryGap: false,
        data: [0,1, 2, 3, 4, 5, 6, 7, 8, 9],
        nameTextStyle: {
          fontSize: 16
        },
        axisLine: {
          lineStyle: {
            color: '#666666',
            type : "number"
          }
        },
        //设置x轴的样式
        axisLabel: {
          color: '#000',
          fontSize: '16',
        },
      },
      yAxis: {
        show: true,
        name: '电压/V',
        // x: 'center',
        type: 'value',
        nameTextStyle: {
          fontSize: 16
        },
        axisLine: {
          lineStyle: {
            color: '#666666',
            type : "number"
          }
        },
        splitLine: {
          lineStyle: {
            type: 'solid'
          }
        },
        //设置y轴字体样式
        axisLabel: {
          show: true,
          textStyle: {
            color: '#000',
            fontSize: '16',
          }
        },
      },
      series: [{
        name: 'channel1',
        color:'#ee6666',
        type: 'line',
        smooth: true,
        data: channel_1_volt
      },{
        name: 'channel2',
        color:'#3ba272',
        type: 'line',
        smooth: true,
        data: channel_2_volt
        }]
    };
    return option;
  },
  getOption_cur: function (){
    var option = {
      color: ["#37A2DA"],
      tooltip: {
        show: true,
        // confine: true,
        trigger: 'axis',
        borderWidth: 1,
        position: this.setTooltipPositionfunction
      },
      legend: {
        data: ['channel1','channel2'],
        orient: "horizontal",
        top: 0,
        // backgroundColor: '#ffffff',
        z: 10,
        itemStyle: {
          // color: "#5470c6","#5470c6"
        }
      },
      grid: {
          left: 5,//折线图距离左边距
          right: 55,//折线图距离右边距
          top: 30,//折线图距离上边距
          bottom: 10,
          containLabel: true
      },
      xAxis: {
        name: '时间/s',
        nameGap: 5,
        type: 'category',
        boundaryGap: false,
        data: [0,1, 2, 3, 4, 5, 6, 7, 8, 9],
        nameTextStyle: {
          fontSize: 16
        },
        axisLine: {
          lineStyle: {
            color: '#666666',
            type : "number"
          }
        },
        //设置x轴的样式
        axisLabel: {
          color: '#000',
          fontSize: '16',
        },
      },
      yAxis: {
        show: true,
        name: '电流/A',
        // x: 'center',
        type: 'value',
        nameTextStyle: {
          fontSize: 16
        },
        axisLine: {
          lineStyle: {
            color: '#666666',
            type : "number"
          }
        },
        splitLine: {
          lineStyle: {
            type: 'solid'
          }
        },
        //设置y轴字体样式
        axisLabel: {
          show: true,
          textStyle: {
            color: '#000',
            fontSize: '16',
          }
        },
      },
      series: [{
        name: 'channel1',
        color:'#ee6666',
        type: 'line',
        smooth: true,
        data: channel_1_cur
      },{
        name: 'channel2',
        color:'#3ba272',
        type: 'line',
        smooth: true,
        data: channel_2_cur
        }]
    };
    return option;
  },
  click(){
    console.log(Chart_volt)
  }
});