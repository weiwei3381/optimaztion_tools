/**
 * ap聚类测试文件
 */

const nc = require('numeric')
const ApCluster = require("./method/ap_cluster")
const tools= require("./utils")

const ap = new ApCluster([[1.1],[2.1],[3],[1.5],[1.7],[5],[6],[4.1]])

ap.run()

console.log(ap.getResult())

// console.log("打印相似度矩阵：")
// console.log(nc.prettyPrint(ap.simiMatrix))
// console.log("打印责任矩阵：")
// console.log(nc.prettyPrint(ap.respMatrix))
// console.log("打印可用矩阵：")
// console.log(nc.prettyPrint(ap.availMatrix))
