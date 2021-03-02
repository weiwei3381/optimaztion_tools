/**
 * ap算法（近邻传播聚类算法）的javascript实现
 * 方法来源于2007年的Science期刊论文：Clustering by Passing Messages Between Data Points
 * 比较好的参考网站：“https://blog.csdn.net/manjhok/article/details/78734025”
 * “https://www.zhihu.com/question/25384514/answer/47636054”
 * @author 小熊
 * @date 2020-12-12
 */

const nc = require('numeric')
const utils = require('../utils')
const ClusterBase = require('./clusterBase')

class ApCluster extends ClusterBase {
  /**
   * 
   * @param {Array} data 需要聚类的数据列表，数据必须在Array中，N维数据用Array进行表示，
   * 如果是一维的则是[0.32]、二维数据则是[0.44, 0.31]、三维数据则是[1.3, 2.4, 5.1]，以此类推。
   * @param {number} lamda 阻尼系数, 范围应该在(0,1)中
   */
  constructor(data, lamda = 0.75, maxIter = 100, maxStableIter = 20) {
    super(data)
    this.n = data.length  // 数据大小
    this.maxIter = maxIter // 最大迭代次数
    this.maxStableIter = maxStableIter  // 最大迭代稳定的次数
    this.lamda = lamda  // 阻尼系数，默认为0.5
    this.simiMatrix = nc.rep([this.n, this.n], 0)  // 初始化相似度矩阵，默认为0
    this.respMatrix = nc.rep([this.n, this.n], 0)  // 初始化责任矩阵，反映其他点投票给候选中心的可能性大小，是一个吸引力指标，例如r(i,k)反映数据点i发送到候选中心k的责任信息，初始均为0
    this.availMatrix = nc.rep([this.n, this.n], 0)  // 初始化可用（用作聚类中心）矩阵，反映候选中心被其他点投票之后，他作为中心的可信度大小，是用来描述点i选择点k作为其聚类中心的适合程度，初始均为0
    this.previousCenters = []  // 上一次的聚类中心
    this.curStableIter = 0  // 当前连续稳定次数
  }

  /**
   * 计算a和b之间的距离，论文中使用的是负的欧氏距离（负平方误差）
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
    return -1 * Math.pow(powSum, 0.5)

  }

  /**
   * 计算相似度矩阵，并将其赋值给this.simiMatrix
   */
  _setSimiMatrix() {
    const simiMatrix = numeric.rep([this.n, this.n], 0)  // 初始化全为0的相似度矩阵
    const allDisList = []  // 把所有的距离都存起来，以便计算中值，给距离矩阵的对角线赋值，即论文中的偏好值

    // 双循环遍历
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < i; j++) {
        if (i === j) continue  // 如果i与j相等，则跳过
        const a = this.data[i]
        const b = this.data[j]
        const dis = this._calcDistance(a, b)  // 计算负欧式距离
        // 给距离矩阵赋值，由于欧氏距离的对称性，一次可以给两个对角赋值
        simiMatrix[i][j] = dis
        simiMatrix[j][i] = dis
        allDisList.push(dis)  // 把距离放到所有距离列表中
      }
    }

    allDisList.sort((a, b) => a - b)  // 对距离列表的所有值按从大到小的顺序排序
    const middleDis = allDisList[Math.floor(allDisList.length / 2)]  // 排序后获得中值
    // 给矩阵对角线赋值
    for (let i = 0; i < this.n; i++) {
      simiMatrix[i][i] = middleDis
    }
    this.simiMatrix = simiMatrix
  }

  /**
   * AP聚类开始运行  
   */
  run() {
    // 首先计算并设置相似度矩阵
    this._setSimiMatrix()
    // 开始更新责任和可用度矩阵
    for (let i = 0; i < this.maxIter; i++) {
      console.log(`正在运行${i}/${this.maxIter}`)
      // 更新责任矩阵
      this._updateRespMatrix()
      // 更新可用度矩阵
      this._updateAvailMatrix()
      // 检查是否稳定
      this._checkStable()
      if (this.curStableIter >= this.maxStableIter) break
    }
    return this.getResult()
  }

  /**
   * 更新责任矩阵
   * r(i,k) = s(i,k) - max{a(i,k')+s(i,k')}，要求k’ != k
   * 代表i归属到聚类中心k的程度，用i和k的相似度，减去（i支持其他点是聚类中心的值+i到其他点的相似度）的最大值
   * 这个矩阵需要跟所有其他的数据点进行对比
   */
  _updateRespMatrix() {
    for (let i = 0; i < this.n; i++) {
      for (let k = 0; k < this.n; k++) {
        const aAddS = nc.add(this.availMatrix[i], this.simiMatrix[i])
        // 由于取最大值时要求k‘ != j，因此设第j个值为最小值保证它肯定不会取到
        aAddS[k] = -Number.MAX_VALUE
        // 获得对应的新责任值
        const newRespValue = this.simiMatrix[i][k] - nc.sup(aAddS)
        // 更新责任值时需要用到阻尼因子λ，更新公式是：
        // r_t = (1-λ)*r_t + λ*r_{t-1}，其中r_t是第t步的责任值，r_{t-1}是第t-1步的责任值
        this.respMatrix[i][k] = (1 - this.lamda) * newRespValue + this.lamda * this.respMatrix[i][k]
      }
    }
  }

  //todo 先算总的累积和, 再减
  _updateAvailMatrix() {
    // 获得责任矩阵的转置, 以便求r[:][i]
    const respTrans = nc.transpose(this.respMatrix)
    for (let i = 0; i < this.n; i++) {
      for (let k = 0; k < this.n; k++) {
        const r_k = respTrans[k] // 获得r(:,k)，因为不好取值，所以用转置然后取第k个
        let newAvailValue = 0  // 新的可用度值
        // 正的责任值累积和
        let positiveRespSum = 0
        if (i !== k) {  // 如果i!=k的计算方法
          for (let j = 0; j < this.n; j++) {
            if (j === i || j === k) continue
            positiveRespSum += Math.max(0, r_k[j])
          }
          newAvailValue = Math.min(0, this.respMatrix[k][k] + positiveRespSum)
        } else {  // 如果i == k
          for (let j = 0; j < this.n; j++) {
            if (j === i) continue
            positiveRespSum += Math.max(0, r_k[j])
          }
          newAvailValue = positiveRespSum
        }
        // 根据阻尼系数更新可用性矩阵
        this.availMatrix[i][k] = (1 - this.lamda) * newAvailValue + this.lamda * this.availMatrix[i][k]
      }
    }
  }

  /**
   * 检查是否稳定。
   * 一般用聚类中心是否发生变化进行检查，如果没有发生变化，说明聚类稳定，当前连续稳定值+1，
   * 否则，当前连续稳定值归零
   */
  _checkStable() {
    const centers = []  // 聚类中心列表
    // 计算责任矩阵和可用矩阵的和
    const sumMatrix = nc.add(this.respMatrix, this.availMatrix)
    // 如果累积矩阵对角元素大于0，则作为聚类中心
    for (let i = 0; i < this.n; i++) {
      if (sumMatrix[i][i] > 0) {
        centers.push(i)
      }
    }
    // 如果存在聚类中心，且这次聚类中心与上次聚类中心的内容一致，则认为是一次稳定，稳定次数+1
    if (this.previousCenters && utils.isContentEqualArray(this.previousCenters, centers)) {
      this.curStableIter += 1
    } else {
      // 出现一次不稳定，则连续稳定次数归0
      this.curStableIter = 0
    }
    this.previousCenters = centers
  }

  /**
   * 获取最后的聚类结果，最终聚类结果的格式为Map，
   * key为聚类中心的索引值（number），value为聚类数组，
   * 数组中每个元素都是一个数据的索引值（number），且包括聚类中心。
   * 例如：Map { 4 => [ 0, 1, 2, 3, 4 ], 5 => [ 5, 6, 7 ] }
   * 无论是key还是value，都是由number构成
   */
  getResult() {
    const clusterResult = new Map()
    // 首先获取聚类中心
    // 计算责任矩阵和可用矩阵的和
    const sumMatrix = nc.add(this.respMatrix, this.availMatrix)
    // 对于每个累加矩阵，找到第i行最大的值对应的列号，就是他所属的聚类中心index
    for (let i = 0; i < this.n; i++) {
      const { index } = utils.findMaxItem(sumMatrix[i])
      if(clusterResult.get(index)){
        clusterResult.get(index).push(i)
      }else{
        clusterResult.set(index, [i])
      }
    }
    return clusterResult
  }
}

module.exports = ApCluster