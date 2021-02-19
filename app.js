const nc = require('numeric')
const SOS = require('./src/method/sos')
const BBO = require('./src/method/bbo')
const CLPSO = require('./src/method/clpso')
const ApCluster = require("./src/method/ap_cluster")
const benchmark = require('./src/benchmark')

const fitnessFunc = ([x1, x2, x3]) => {
  return Math.pow(x1, 2) + Math.pow(x2, 2) + Math.pow(x3, 2)
}
// 测试能否正常导入
console.log(BBO)
console.log(CLPSO)

// 测试sos算法，传入的参数分别是问题维度（30），搜索下界（[-600，-600,...,-600]，
// 搜索上界[600,600,...,600]，优化函数。
const sos = new SOS(30, nc.rep([30],-600), nc.rep([30],600), benchmark.griewank)
sos.run()  // 运行共生算法
console.log("SOS优化算法搜索结果如下：")
console.log(sos.getResult())

// 测试AP聚类算法，传入的参数为聚类数据列表，其中列表的每一项必须为Array类型（哪怕只有1维）
const apCluster = new ApCluster([[1.1],[2.1],[3],[1.5],[1.7],[5],[6],[4.1]])
apCluster.run()  // 运行ap聚类
console.log("AP聚类结果如下：")
console.log(apCluster.getResult())