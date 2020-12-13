const SOS = require('./sos')
const nc = require('numeric')

const fitnessFunc = ([x1, x2, x3]) => {
  return Math.pow(x1, 2) + Math.pow(x2, 2) + Math.pow(x3, 2)
}

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

const sos = new SOS(30, nc.rep([30],-600), nc.rep([30],600), griewank)
console.log(sos.run())