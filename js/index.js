/**
 * Created by 42143 on 2017/7/4.
 */
var myChart = echarts.init(document.getElementById('chart'));
var app={};
var temperature;
var humidity;

option = {
    title: {
        text: '动态数据',
        subtext: '实时更新'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#283b56'
            }
        }
    },
    legend: {
        data:['温度', '湿度']
    },
    toolbox: {
        show: true,
        feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        }
    },
    dataZoom: {
        show: false,
        start: 0,
        end: 50
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: true,
            data: (function (){
                var now = new Date();
                var res = [];
                var len = 10;
                while (len--) {
                    res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
                    now = new Date(now - 1000);
                }
                return res;
            })()
        },
        {
            type: 'category',
            boundaryGap: true,
            data: (function (){
                var res = [];
                var len = 10;
                while (len--) {
                    res.push(len + 1);
                }
                return res;
            })()
        }
    ],
    yAxis: [
        {
            type: 'value',
            scale: true,
            name: '温度',
            max: 35,
            min: 0,
            boundaryGap: [0.2, 0.2]
        },
        {
            type: 'value',
            scale: true,
            name: '湿度',
            max: 70,
            min: 0,
            boundaryGap: [0.2, 0.2]
        }
    ],
    series: [
        {
            name:'湿度',
            type:'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data:(function (){
                var res = [];
                var len = 10;
                while (len--) {
                    res.push(humidity);
                }
                return res;
            })()
        },
        {
            name:'温度',
            type:'line',
            data:(function (){
                var res = [];
                var len = 0;
                while (len < 10) {
                    res.push(temperature);
                    len++;
                }
                return res;
            })()
        }
    ],
    id:0
};

app.count = 11;
setInterval(function (){
    axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
    $.ajax({    //使用JQuery内置的Ajax方法
        type : "get",        //post请求方式
        async : true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url : "/web/getData/"+option.id,    //请求发送到ShowInfoIndexServlet处
        dataType : "json",        //返回数据形式为json
        success : function(result) {
            temperature=result.data.temperature;
            option.id=result.data.id;
            humidity=result.data.humidity;
        }
    });
    var data0 = option.series[0].data;
    var data1 = option.series[1].data;
    data0.shift();
    data0.push(humidity);
    data1.shift();
    data1.push(temperature);

    option.xAxis[0].data.shift();
    option.xAxis[0].data.push(axisData);
    option.xAxis[1].data.shift();
    option.xAxis[1].data.push(app.count++);

    myChart.setOption(option);

}, 2000);





