const SOS = require('./algorithm/sos')
const nc = require('numeric')
const benchmark = require('./benchmark')

const fitnessFunc = ([x1, x2, x3]) => {
  return Math.pow(x1, 2) + Math.pow(x2, 2) + Math.pow(x3, 2)
}

const sos = new SOS(30, nc.rep([30],-600), nc.rep([30],600), benchmark.griewank)
console.log(sos.run())