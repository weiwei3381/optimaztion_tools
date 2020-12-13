/**
 * 测试文件, 运行npm run test进行测试
 */

const nc = require('numeric')
const SOS = require('./sos')
const { getRandomVector, selectRandomNum } = require('./util/tools')
const tools = require('./util/tools')
console.log(SOS)

let A = [[1,2,3],[4,5,6]]
let x = [7,8,9]
console.log(nc.dot(A,x) ) // 输出为[50,122]

A = [[1,2,3]]
x = [[7,4],[8,5],[9,6]]
console.log(nc.dot(A,x) ) // 输出为[50,122]

console.log(nc.random([2,3]))
console.log(nc.random(3))
console.log(nc.random([3]))
console.log(nc.dot(nc.random([1,4]),nc.random([4])))
console.log(nc.random([4,1]))
console.log(nc.identity(5))
console.log(nc.random(5))
console.log(nc.geq(nc.random([3,4]),nc.random([3,5])))
console.log(nc.isNaN(nc.random([3,4])))
console.log(nc.pow(nc.random([4,5]),99))

console.log(nc.rep([4,5],5.5))

console.log(nc.diag([3,4,5]))
console.log(nc.dim(nc.diag([3,4,5])))
console.log(nc.sub(nc.random([5]),nc.random([5]),nc.random([5]),nc.random([5])))
console.log(nc.prettyPrint(nc.inv(nc.diag([6,7,8]))))
console.log(nc.prettyPrint(nc.log([1,2.7,100])))
console.log(nc.norm2(nc.random([4,5])))

for (let i = 0; i < 10; i++) {
  console.log(getRandomVector(4, [0, 1, 2], [4, 5, 6]))
  console.log(selectRandomNum(10,3))
  const [BF1,BF2] = nc.round(nc.add(nc.random([2]),1))
  console.log(BF1,BF2)
  console.log(nc.sub(nc.mul(nc.random([5]),2),1))
}

let b = [[1,2,3],[4,5,6],[8,8,9]]
let c = nc.clone(b)
c[0][0] = 8
console.log(nc.prettyPrint(b))
console.log(nc.prettyPrint(c))


