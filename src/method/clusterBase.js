/**
 * 聚类算法的基类
 */
class ClusterBase{
  /**
   * 构造方法, 子类必须调用super(data)
   * @param {Array} data 聚类数据
   */
  constructor(data){
    this.data = data
    this.dim = data[0].length  // 数据维度
  }

  run(){
    throw new Error("需实现父类的run方法运行算法!")
  }

  getResult(){
    throw new Error("需实现父类的getResult方法获得聚类结果!")
  }
}

module.exports = ClusterBase