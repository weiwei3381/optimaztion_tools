/**
 * kmeans++算法的javascript实现
 * @author 小熊
 * @date 2021-02-27
 */

const nc = require('numeric')
const utils = require('../utils')
const ClusterBase = require('./clusterBase')

class KmeansPlus extends ClusterBase {

  /**
   * 
   * @param {Array} data 需要聚类的数据列表，数据必须在Array中，N维数据用Array进行表示，
   * 如果是一维的则是[0.32]、二维数据则是[0.44, 0.31]、三维数据则是[1.3, 2.4, 5.1]，以此类推。
   * 一个典型的data = [[1.2], [2.1], [3.1], [4.3]]
   * @param {number} k 聚类数目 
   */
  constructor(data, k) {
    super(data)
    this.k = k  // 聚类数量
    this.centerIndexList = []  // 聚类中心索引List
    this.clusterMap = null  // 聚类结果Map
  }

  /**
   * 计算a和b之间的距离，使用欧氏距离进行计算
   * 即distance = -||x_1 - x_2||^2进行计算
   * @param {Array} a 数据a
   * @param {Array} b 数据b
   */
  _calcDistance(a, b) {
    if (!a.length || !b.length || a.length !== b.length) {
      throw new Error("计算数据之间的距离时，数据不是数组，或者维度不相等")
    }
    const dim = a.length  // 获得数据维度
    let powSum = 0  // 平方和累积
    for (let i = 0; i < dim; i++) {
      powSum += Math.pow(a[i] - b[i], 2)
    }
    // 对平方和进行开方，然后取负值
    return Math.pow(powSum, 0.5)
  }

  /**
   * K-means++按照如下的思想选取K个初始聚类中心：
   * 假设已经选取了n个初始聚类中心(0<n<K)，
   * 则在选取第n+1个聚类中心时：距离当前n个聚类中心越远的点会有更高的概率被选为第n+1个聚类中心。
   * 在选取第一个聚类中心(n=1)时同样通过随机的方法。
   */
  _getInitalCenter() {
    // 聚类中心在data中的索引列表,也是最终结果
    const centerIndexList = []
    // 随机获得第一个中心
    const firstCenterIndex = utils.selectRandomNum(this.data.length, 1)
    centerIndexList.push(firstCenterIndex[0])  // 将第一个中心加入到返回List中
    // 每次多加一个中心到List中, 共需运行k-1次
    for (let i = 0; i < this.k - 1; i++) {
      const disToCentersMap = new Map()  // 每个其他点到聚类中心的最近距离表
      let sumDistance = 0  // 总距离
      // 找出离每个数据最近的聚类中心的距离
      for (let j = 0; j < this.data.length; j++) {
        if (centerIndexList.includes(j)) continue  // 如果已经是聚类中心中的索引号,则跳出
        let minDistance = Infinity  // 计算最近距离
        for (let cIndex of centerIndexList) {
          const center = this.data[cIndex]  // 聚类中心的值
          const other = this.data[j]  // 其他数据的值
          // 计算数据到聚类中心的距离
          const dis = this._calcDistance(center, other)
          if (dis < minDistance) minDistance = dis  // 替换最近距离值
        }
        disToCentersMap.set(j, minDistance)  // 每个点到聚类中心的最近距离都存到Map中
        sumDistance += minDistance  // 把距离加到总距离中
      }
      /**
       * 得到每个点在轮盘赌中的范围
       * 例如点a的距离是1, 点b的距离是2, 点c的距离是3
       * 由于距离越大, 则设为中心的概率就越大,总距离是1+2+3 = 6
       * 点a的概率是1/6, 那么在轮盘上就是[0,1/6]范围
       * 点b的概率是2/6, 那么在轮盘上就是(1/6,3/6)范围
       * 点c的概率是3/6, 那么在轮盘上就是(3/6,1)范围
       */
      const rouletteMap = new Map()  // 轮盘赌的范围
      let startPoint = 0  // 开始点为0
      for (let k of disToCentersMap.keys()) {
        const minDis = disToCentersMap.get(k)
        const range = minDis / sumDistance  // 得到轮盘赌范围
        const endPoint = startPoint + range  // 开始点 + 范围 = 结束点
        // 设置轮盘赌中每个id对应范围的索引, 最小和最大值
        rouletteMap.set(k, { index: k, min: startPoint, max: endPoint })
        startPoint = endPoint
      }
      // 根据轮盘赌的概率寻找聚类中心
      const randomNum = Math.random()  // 获取随机值
      // 遍历轮盘赌, 如果随机值处于轮盘中某个位置, 则把该位置对应索引加入聚类中心
      for (let rangeObj of rouletteMap.values()) {
        const minPoint = rangeObj.min
        const maxPoint = rangeObj.max
        if (randomNum >= minPoint && randomNum < maxPoint) {
          centerIndexList.push(rangeObj.index) // 放索引进去
          break
        }
      }
    }
    this.centerIndexList = centerIndexList  // 更新聚类中心
  }

  /**
   * 运行代码
   */
  run() {
    this._getInitalCenter()  // 选取k个初始聚类中心
    // 迭代运行30次
    for (let iter = 0; iter <= 30; iter++) {
      this._clustering()  // 聚类
      // 如果小于30次, 则调整聚类中心
        this._changeClusterCenter()
      }
    }

  /**
   * 根据聚类中心, 把数据聚类到不同的聚类中心去, 得到clusterMap
   * Map内均为索引, 例如Map { 4 => [ 0, 1, 2, 3, 4 ], 5 => [ 5, 6, 7 ] }
   * 其中index=4的数据是中心, 对应聚类含有0,1,2,3,4索引的数据
   */
  _clustering(){
    // 构造聚类Map
    const clusterMap = new Map()
    for (let centerIndex of this.centerIndexList) {
      // 初始化每个聚类中心, 以及空的数据内容
      clusterMap.set(centerIndex, [])
    }
    //将离得最近的聚类中心元素归为该聚类
    for (let i = 0; i < this.data.length; i++) {
      const d = this.data[i]  // 获得第i个数据
      // 下面找到最近距离的聚类
      let minDis = Infinity
      let nearestCenterIndex = null
      // 将每个数据与聚类中心的距离进行比较, 找到离它最近的聚类中心
      for (let centerIndex of this.centerIndexList) {
        const dis = this._calcDistance(d, this.data[centerIndex])  // 获得到聚类中心的距离
        if (dis < minDis) {
          minDis = dis
          nearestCenterIndex = centerIndex
        }
      }
      // 将该格子归到最近的中心去
      clusterMap.get(nearestCenterIndex).push(i)
    }
    this.clusterMap = clusterMap
  }

  /**
   * 修改聚类中心
   */
  _changeClusterCenter() {
    // 新的聚类中心
    const averageCenterPosList = []  // 平均中心位置列表
    for (let centerIndex of this.clusterMap.keys()) {
      // 获得对应的聚类数据索引列表
      const clusterIndexList = this.clusterMap.get(centerIndex)
      if (clusterIndexList.length === 0) {
        console.warn(`聚类索引${centerIndex}中没有元素!`)
        continue
      }
      // 根据数据维度生成0向量, nc.rep([1,3],0)即可生成[0, 0, 0]
      let sum = nc.rep([this.dim],0)
      // 将聚类格子进行累加
      for (let dataIndex of clusterIndexList) {
        const oneData = this.data[dataIndex]  // 获得一份数据
        sum = nc.add(sum, oneData)
      }
      // sum向量逐项除以数据大小, 得到平均位置, 加入列表中
      averageCenterPosList.push(nc.div(sum, clusterIndexList.length))
    }
    // 获得每个位置对应的网格中心位置
    this._placePosToCenter(averageCenterPosList)
  }

  /**
   * 根据平均的位置点, 找到聚类中心, 并更新this.centerIndexList
   * @param {Array} averagePosList 平均位置点列表
   */
  _placePosToCenter(averagePosList) {
    const centerIndexList = []  // 聚类中心索引的列表
    for (let pos of averagePosList) {
        let minDis = Infinity  // 最近的距离
        let nearestDataIndex = null // 最近数据的ID
        // 遍历数据, 找到离平均位置最近的数据
        for (let i = 0; i < this.data.length; i++) {
          if (centerIndexList.includes(i)) continue  // 如果索引已经是聚类中心了, 就跳过
          const d = this.data[i]  // 获得根据索引获得数据
            const dis = this._calcDistance(pos, d)  // 计算距离
            if (dis < minDis) {
                minDis = dis
                nearestDataIndex = i
            }
        }
        centerIndexList.push(nearestDataIndex)  // 位置列表
    }
    this.centerIndexList = centerIndexList
}

  getResult(){
    return this.clusterMap
  }
}

module.exports = KmeansPlus