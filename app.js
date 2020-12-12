const numeric = require('numeric')
const SOS = require('./sos')
const { getRandomVector } = require('./util/tools')
const tools = require('./util/tools')
console.log(SOS)
for (let i = 0; i < 5; i++) {
  console.log(getRandomVector(4, [0, 1, 2], [4, 5, 6]))
}

let A = [[1,2,3],[4,5,6]]
let x = [7,8,9]
console.log(numeric.dot(A,x) ) // 输出为[50,122]

A = [[1,2,3]]
x = [[7,4],[8,5],[9,6]]
console.log(numeric.dot(A,x) ) // 输出为[50,122]

console.log(numeric.random([2,3]))
console.log(numeric.random(3))
console.log(numeric.random([3]))
console.log(numeric.dot(numeric.random([1,4]),numeric.random([4])))
console.log(numeric.random([4,1]))
console.log(numeric.identity(5))
console.log(numeric.random(5))
console.log(tools.zeros([4,5]))
console.log(tools.ones([4,5]))

