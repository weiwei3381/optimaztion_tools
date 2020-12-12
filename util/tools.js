/**
 * 各种算法的通用工具方法
 * @author 小熊
 * @date 2020-12-12
 */

 const numeric = require('numeric')

function zeros(size){
  const randMatrix = numeric.random(size)
  return numeric.mul(randMatrix, 0)
}

function ones(size){
  const zeroMatrix = zeros(size)
  return numeric.add(zeroMatrix, 1)
}

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
};

module.exports = {
  getRandomVector,
  zeros,
  ones
}