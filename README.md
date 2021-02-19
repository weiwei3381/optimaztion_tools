# javascript版本的优化算法、聚类算法

使用javascript实现各种优化算法，目前已经实现标准共生生物搜索（Symbiotic Organisms Search，SOS）算法，AP（Affinity Propagation）聚类算法。

## 依赖

- 数值计算库：numeric.js，相关使用方法都写在documents/numeric_tutorials.md中

## 使用

使用`npm start`既可以运行根目录的app.js，里面有实现算法的示例。

## 接口

所有聚类算法的结果为Map格式
{
  聚类中心1索引: [数据1索引, 数据2索引, 数据3索引,],
  聚类中心2索引: [数据4索引, 数据5索引, 数据6索引,]
}

## 文件结构

- src: 算法源码
  - method：存放优化算法和聚类算法类
    - sos：共生搜索算法
    - ap_cluster：AP聚类算法
  - utils：通用工具类
  - benchmark：测试数据类
  - test: 测试工具
- docs: 相关工具和算法的整理文档
- papers：相关算法的原始论文
- app.js：算法应用实例
