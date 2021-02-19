/**
 * 各种算法的通用工具方法
 * @author 小熊
 * @date 2020-12-12
 */

 const nc = require('numeric')

/**
 * 获得在lb和ub范围内的随机向量
 * 计算原理是lb + (ub - lb) * rand(0,1)
 * @param {number} dimension 向量维度大小
 * @param {number[]} lb 每个向量维度的下界
 * @param {number[]} ub 每个向量维度的上界
 */
function getRandomVector(dimension, lb, ub) {
  // 先产生一组0-1随机值rand(0,1)，作为缩放程度的随机量
  const scaleRandVec = nc.random([dimension])
  // 得到最大到最小范围的随机值, 即得到(ub-lb)
  const rangeVec = nc.sub(ub, lb)
  // 得到最终随机向量
  const randomVec = nc.add(lb, nc.mul(scaleRandVec, rangeVec));
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

function findMaxItem(items){
  const n = items.length
  let maxItem = -Infinity
  let maxItemIndex = 0
  for(let i = 0; i < n; i++){
    const item = items[i]
    if(item > maxItem){
      maxItem = item
      maxItemIndex = i
    }
  }
  return {
    value: maxItem,
    index: maxItemIndex
  }
}

function findMinItem(items){
  const n = items.length
  let minItem = Infinity
  let minItemIndex = 0
  for(let i = 0; i < n; i++){
    const item = items[i]
    if(item < minItem){
      minItem = item
      minItemIndex = i
    }
  }
  return {
    value: minItem,
    index: minItemIndex
  }
}

/**
 * 判断两个数组内的元素是否都相等，该方法只适合与字面值而非引用值，例如：
 * a = [1,2,3]，b=[2,1,3]，那么a和b是内容相等的
 * a = [1,2,3,4]，b=[2,1,3]，那么a和b是内容是不等的
 * 
 * 
 * @param {Array} array1 数组1
 * @param {Array} array2 数组2
 */
function isContentEqualArray(array1, array2){
  // 首先判断两个数组大小是否一致
  if(array1.length !== array2.length){
    return false
  }
  for(let i = 0; i < array1.length; i++){
    const item1 = array1[i]
    if(!array2.includes(item1)){
      return false
    }
  }
  return true
}

module.exports = {
  getRandomVector,
  selectRandomNum,
  findMaxItem,
  findMinItem,
  isContentEqualArray,
}