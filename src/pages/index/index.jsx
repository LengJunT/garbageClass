import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'

import bannerImg from '../../public/img/banner.png'
import './index.scss'

const BaserUrl = 'http://114.115.164.189:8080'
var infoMap = {
  4: '可回收物投放要求纸类收集请注意不要混入被污染过的纸类物品，避免揉团，应展开压平叠放。牛奶盒、果汁盒、酸奶盒等饮品包装盒建议剪开后冲洗干净并压扁投放。瓶罐类物品应尽可能将容器内产品用尽或倒尽，并清理干净后投放。玻璃类物品应小心轻放，以免割伤破损，最好是袋装或者用容器装好后投放。织物类注意请勿混入脏污染物，建议叠放整齐并归类打包。',
  1: '有害垃圾投放要求废旧灯管等易破损的有害垃圾应连带包装或包裹后投放。废弃药品应连带包装一并投放。杀虫剂等压力灌装容器，应破孔后投放。易挥发物品要密封后投放。',
  2: '湿垃圾投放要求餐厨垃圾应沥干水分后再投放。流质的食物垃圾，如牛奶等，应直接倒进下水口。有包装物的湿垃圾应将包装物投放到可回收物或干垃圾后投放大块骨头、椰子壳和榴莲壳等不易生化降解的可投放到干垃圾',
  3: '干垃圾/其他垃圾 投放要求尽量沥干水分后再投放。难以辨别的垃圾应投放到干垃圾。用过的餐巾纸、尿片等由于沾有各类污迹，无回收利用价值，宜作为其他垃圾进行处理。普通一次性电池（碱性电池）基本不含重金属，宜作为其他垃圾投放。'
}
function isEmpty(val) {
  return (
    val === undefined ||
    val === null ||
    val === false ||
    val.length <= 0 || (typeof val === 'object' && !Object.getOwnPropertySymbols(val).length && !Object.getOwnPropertyNames(val).length)
  )
}
class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    queryValue: '电池',
    hots: [],
    garbageInfo: {}
  }
  componentDidMount() {
    this.query({ target: { value: '电池' } })
    this.getHot()
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { queryValue, hots = [] } = this.state
    return (
      <ScrollView className='index-page' scrollY>
        <View className="banner">
          <Image src={bannerImg} />
          <Text className="title">垃圾分类小助手</Text>
          <View className="query-box">
            <Input value={queryValue} onInput={this.change} onConfirm={this.query}></Input>
            <View className='at-icon at-icon-search query-icon'></View>
          </View>
        </View>

        {this.renderContent()}
        <View className="hot-search">
          <View class="hot-title">
            热门搜索
          </View>
          <View className="hot-content">
            {
              hots.map(item => {
                const { name, id } = item
                return <View key={id} className="hot-item" onClick={this.handleHotClick(item)}>
                  {name}
                </View>
              })
            }
          </View>
        </View>
        <View class="copyright">
          查询结果仅供参考，具体分类以归属地相关部门规定为准
        </View>
      </ScrollView>
    )
  }
  renderContent = () => {
    const { garbageInfo } = this.state
    const { name, typeName, type = 1 } = garbageInfo
    if (!isEmpty(garbageInfo)) {
      return <Fragment>
        <View className="info-content">
          {name} <br />
          <View>属于{typeName}</View>
        </View>
        <View className="info-content info">
          {
            infoMap[type]
          }
        </View>
      </Fragment>
    }
    return null
  }
  handleHotClick = (item) => (e) => {
    const data = { target: { value: item.name } }
    this.change(data)
    this.query(data)
  }
  change = (e) => {
    const value = e.target.value
    this.setState({ queryValue: value })
  }
  query = (e) => {
    console.log('query', e)
    const value = e.target.value
    Taro.request({
      url: `${BaserUrl}/rc/Record/Search?name=${value}`
    }).then(res => {
      console.log('res', res)
      const { data: body = {} } = res
      const { data } = body
      this.setState({
        garbageInfo: isEmpty(data) ? {} : data
      })
    })
  }

  getHot = () => {
    var url = BaserUrl + '/rc/Record/GetPopData'
    var that = this
    Taro.request({
      url: url
    }).then(res => {
      const { data: body = {} } = res
      const { data } = body
      if (!isEmpty(data)) {
        this.setState({
          hots: data
        })
      }
    })
  }
}

export default Index
