const SOS = require('./sos')

const fitnessFunc = ([x1, x2, x3]) => {
  return Math.pow(x1, 2) + Math.pow(x2, 2) + Math.pow(x3, 2)
}

const sos = new SOS(3, [-10, -10, -10], [10, 10, 10], fitnessFunc)
console.log(sos.run())