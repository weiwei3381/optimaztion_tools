/**
 * 各种算法的通用工具方法
 * @author 小熊
 * @date 2020-12-12
 */

 const numeric = require('numeric')

/**
 * 获得在lb和ub范围内的随机向量
 * 计算原理是lb + (ub - lb) * rand(0,1)
 * @param {number} dimension 向量维度大小
 * @param {number[]} lb 每个向量维度的下界
 * @param {number[]} ub 每个向量维度的上界
 */
function getRandomVector(dimension, lb, ub) {
  // 先产生一组0-1随机值rand(0,1)，作为缩放程度的随机量
  const scaleRandVec = numeric.random([dimension])
  // 得到最大到最小范围的随机值, 即得到(ub-lb)
  const rangeVec = numeric.sub(ub, lb)
  // 得到最终随机向量
  const randomVec = numeric.add(lb, numeric.mul(scaleRandVec, rangeVec));
  return randomVec
}

/**
 * 从[0,sum-1]中随机选择n个整数, 不得重复, 例如selectRandomNum(10,3), 返回为[0,3,7]
 * @param {number} sum 总数
 * @param {number} n 需要选择随机数的个数,不得超过总数大小
 */
function selectRandomNum(sum,n){
  const randomPosList = []
  while(1){
    const randPos = Math.floor(Math.random() * sum)  // 获得随机位置
    if(randomPosList.includes(randPos))continue  // 如果已经有了则重新获得随机位置
    randomPosList.push(randPos)
    if(randomPosList.length >= n) break  // 如果满足数量要求则跳出
  }
  return randomPosList
}

module.exports = {
  getRandomVector,
  selectRandomNum,
}