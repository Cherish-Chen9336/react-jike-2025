import BarChart from './components/BarChart'

const dataX = ['读书', '运动', '赚钱']
const dataY = [90, 120, 320]

const Home = () => {
  return (
    <div>
      <BarChart title={'三大框架满意度'} dataX={dataX} dataY={dataY} />
      <BarChart title={'小葡萄乖乖'} />
    </div>
  )
}

export default Home
