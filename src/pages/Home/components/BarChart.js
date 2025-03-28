// 柱状图组件
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

// 1. 把功能代码都放到这个组件中
// 2. 把可变部分抽象成prop 参数

const BarChart = ({ title, dataX, dataY }) => {
  const chartRef = useRef(null)
  useEffect(() => {
    // 保证dome 可用 才进行图标的渲染
    // 1. 获取渲染图标的dom 节点
    // const chartDom = document.getElementById('main')
    const chartDom = chartRef.current

    // 2. 图表初始化生成图表实例对象
    const myChart = echarts.init(chartDom)
    // 3. 准备图标参数
    const option = {
      title: {
        text: title,
      },
      xAxis: {
        type: 'category',
        data: dataX || ['Vue', 'React', 'Angular'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: dataY || [10, 40, 70],
          type: 'bar',
        },
      ],
    }

    // 4. 使用图标参数 完成图标渲染
    option && myChart.setOption(option)
  }, [title])

  return <div ref={chartRef} style={{ width: '500px', height: '400px' }}></div>
}

export default BarChart
