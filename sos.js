/**
 * 共生生物搜索算法的javascript实现
 * @author 小熊
 * @date 2020-12-12
 */

const tools = require('./util/tools')
const nc = require('numeric')

/**
 * 共生算法的主类
 */
class SOS {

  constructor(dimension, lb, ub, fitnessFunc, isMinimize = true) {
    this.dimension = dimension  // 任务的维度
    this.lb = lb  // 搜索空间的下界
    this.ub = ub  // 搜索空间的上界
    this.fitnessFunc = fitnessFunc  // 评价函数(适应度函数)
    this.isMinimize = isMinimize  // 是否最小化评价函数
    this.organSize = 10  // 生物体个数
    this.maxIter = 10000  // 最大迭代次数
    this._init()  // 初始化
  }

  /**
   * 私有方法
   * 共生算法进行初始化
   */
  _init() {
    // 初始化共生算法中的所有生物体
    this.organisms = []
    for (let i = 0; i < this.organSize; i++) {
      const x = tools.getRandomVector(this.dimension, this.lb, this.ub)
      const y = this.fitnessFunc(x)
      this.organisms.push(new Organism(x, y))
    }
    this._getBest()  // 获取当前最好的值
  }

  run() {
    for (let iter = 0; iter < this.maxIter; iter++) {
      this._mutualismPhase()
      this._commensalismPhase()
      this._parasitismPhase()
    }
    return this.best
  }

  _getBest() {
    // 如果是最小化, 则从小到大排列
    if (this.isMinimize) {
      this.organisms.sort((a, b) => a.y - b.y)
    } else {
      this.organisms.sort((a, b) => b.y - a.y)
    }
    // 将最好的存到best属性中
    this.best = {
      x: this.organisms[0].x,
      y: this.organisms[0].y,
    }
  }

  /**
   * 淘汰掉适应度低的生物体
   * @param {number} pos 老的生物体, pos表示它在生物体数组中的位置
   * @param {number[]} x_new 新生物体的x数组
   */
  _eliminate(pos, x_new) {
    const y_new = this.fitnessFunc(x_new) // 获得新个体的适应度值
    const organ = this.organisms[pos]
    // 如果新生物体的y值优于老生物体的y值
    if ((this.isMinimize && y_new < organ.y) || (!this.isMinimize && y_new > organ.y)) {
      // 替换该位置的个体
      this.organisms[pos] = new Organism(x_new, y_new)
    }
  }

  _mutualismPhase() {
    // 第一阶段: 互利互惠
    // 随机选择两个生物
    const randPosList = tools.selectRandomNum(this.organisms.length, 2)
    const organ_i = this.organisms[randPosList[0]]
    const organ_j = this.organisms[randPosList[1]]
    // 计算Mutual_Vector = (Xi+Xj)/2
    const mutualVector = nc.div(nc.add(organ_i.x, organ_j.x), 2)
    // 获得两个随机数, 随机范围为[1,2], 赋值给效益因子BF1和BF2
    const [BF1, BF2] = nc.round(nc.add(nc.random([2]), 1))
    // 计算X_i和X_j的新值
    const X_inew = this.__calNewMutual(organ_i.x, mutualVector, BF1)
    const X_jnew = this.__calNewMutual(organ_j.x, mutualVector, BF2)
    // 将新值和老值进行对比, 淘汰掉适应度低的值
    this._eliminate(randPosList[0], X_inew)
    this._eliminate(randPosList[1], X_jnew)
  }

  /**
   * 根据互惠公式计算新的生物体, X_inew=X_i+rand(0,1)⋅(X_best-Mutual_Vector⋅BF_1)
   * @param {number[]} X 老生物体的X值
   * @param {number[]} mutualVector 交互向量
   * @param {number} BF 效益因子,1或者2
   */
  __calNewMutual(X, mutualVector, BF) {
    // 获得X想要努力的部分X_try = (X_best-Mutual_Vector⋅BF_1)
    const X_try = nc.sub(this.best.x, nc.mul(mutualVector, BF))
    // X_inew=X_i+rand(0,1)⋅(X_best-Mutual_Vector⋅BF_1) = X_i+rand(0,1)⋅X_itry
    const X_new = nc.add(X, nc.mul(nc.random([this.dimension]), X_try))
    return X_new
  }


  _commensalismPhase() {
    // 第2阶段: 共生阶段
    // 随机选择两个生物
    const randPosList = tools.selectRandomNum(this.organisms.length, 2)
    const organ_i = this.organisms[randPosList[0]]
    const organ_j = this.organisms[randPosList[1]]
    // 根据X_j获得X_i的新解, 公式为: X_inew=X_i+rand(-1,1)⋅(X_best-X_j)
    const rand_11 = nc.sub(nc.mul(nc.random([this.dimension]), 2), 1)  // 获得rand(-1,1)
    const X_inew = nc.add(organ_i.x, nc.mul(rand_11, nc.sub(this.best.x, organ_j.x))) // 获得X_i的新解
    // 将新值和老值进行对比, 淘汰掉适应度低的值
    this._eliminate(randPosList[0], X_inew)
  }

  _parasitismPhase() {
    // 第3阶段:寄生阶段
    // 随机选择两个生物
    const randPosList = tools.selectRandomNum(this.organisms.length, 2)
    const organ_i = this.organisms[randPosList[0]]
    const organ_j = this.organisms[randPosList[1]]
    const mutation = organ_i.mutate(this.dimension, this.lb, this.ub)  // 获得生物体1的寄生向量
    this._eliminate(randPosList[1], mutation)
  }
}

/**
 * 共生算法中的生物体类
 */
class Organism {
  constructor(x, y) {
    this.x = x  // 生物体的x
    this.y = y  // 对应的适应度值
  }

  /**
   * 对生物体进行变异, 挑选一个随机的维度, 用随机值进行赋值
   * @param {number} dimension 解的维度
   * @param {[]number} lb 下界
   * @param {[*number]} ub 上界
   */
  mutate(dimension, lb, ub) {
    // 获得当前x的拷贝
    const mutation = nc.clone(this.x)
    // 获得一个随机的向量
    const randVec = tools.getRandomVector(dimension, lb, ub)
    // 获得1个随机的维度, 解构赋值给randomDim
    const [randomDim] = tools.selectRandomNum(dimension, 1)
    // 将这个维度进行变异
    mutation[randomDim] = randVec[randomDim]
    return mutation
  }
}

module.exports = SOS