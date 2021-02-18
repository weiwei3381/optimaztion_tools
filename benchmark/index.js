/**
 * 测试函数库
 * @author 小熊
 * @date 2021-02-17
 */

const nc = require('numeric')

/**
 * 基准函数Griewank, 可传入N维向量, 获得的最小值为0
 * @param {number[]} x 向量
 */
const griewank = x => {
  const D = x.length  // 获得向量的维度
  // 根据维度获得一个序号数组, 如果D为4, 则是[1,2,3,4]
  const indexVec = nc.linspace(1,D,D)  
  // 累加项
  const sumItem = nc.sum(nc.pow(nc.sub(x,100),2))
  // 累积项
  const prodItem = nc.prod(nc.cos(nc.div(nc.sub(x,100),indexVec)))
  return (1/4000) * sumItem - prodItem + 1
}

module.exports={
  griewank
}