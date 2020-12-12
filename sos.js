/**
 * 共生生物搜索算法的javascript实现
 * @author 小熊
 * @date 2020-12-12
 */

 /**
  * 共生算法的主类
  */
class SOS{

  constructor(dimension, ub, lb, fitnessFunction){
    this.dimension = dimension  // 任务的维度
    this.ub = ub  // 搜索空间的上界
    this.lb = lb  // 搜索空间的下界
    this.fitnessFunction = fitnessFunction  // 评价函数(适应度函数)
    this.organSize = 10  // 生物体个数
    this.maxIter = 1000  // 最大迭代次数
    this._init()  // 初始化
  }

  /**
   * 私有方法
   * 共生算法进行初始化
   */
  _init(){
    // 初始化共生算法中的所有生物体
    this.organisms = []
    for(let i = 0; i < organSize; i++){
      this.organisms.push(new Organism())
    }
  }

  run(){
    for(let iter=0; iter < this.maxIter; iter++){
      
    }
  }
}

/**
 * 共生算法中的生物体类
 */
class Organism{
  constructor(dimension, ub, lb, fitnessFunction){
    this.dimension = dimension  // 任务的维度
    this.ub = ub  // 搜索空间的上界
    this.lb = lb  // 搜索空间的下界
    this.fitnessFunction = fitnessFunction  // 评价函数(适应度函数)
  }

  _init(){
    
  }
}

module.exports = SOS