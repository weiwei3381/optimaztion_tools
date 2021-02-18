# MathJS简要文档

[Math.js](https://mathjs.org/index.html)是一个用于JavaScript和Node.js的扩展数学库。它具有支持符号计算的灵活表达式解析器，大量内置函数和常量，并提供了集成的解决方案来处理不同的数据类型，例如数字，大数，复数，分数，单位和矩阵。强大且易于使用。

- 支持数字，大数，复数，分数，单位，字符串，数组和矩阵。
- 与JavaScript的内置Math库兼容。
- 包含一个灵活的表达式解析器。
- 进行符号计算。
- 带有大量内置函数和常量。
- 也可以用作命令行应用程序。
- 在任何JavaScript引擎上运行。
- 很容易扩展。
- 开源

## 安装与导入

使用npm或者yarn均可以安装:

```batch
npm install mathjs
或者
yarn add mathjs
```

使用时，如果按照ES modules的语法，写法如下：

```js
import { sqrt } from 'mathjs'

console.log(sqrt(-4).toString()) // 输出为2i
```

可以仅导入所有数值实现的函数，这样将更加轻量级，写法如下：

```js
import { sqrt } from 'mathjs/number'

console.log(sqrt(4).toString()) // 2
console.log(sqrt(-4).toString()) // NaN
```

如果按照CommonJS的语法，写法如下：

```js
const { sqrt } = require('mathjs')

console.log(sqrt(-4).toString()) // 2i
```

## 矩阵

Math.js支持多维矩阵和数组。可以创建，操纵矩阵并将其用于计算中。常规JavaScript数组以及math.js实现的矩阵类型都可以在所有相关math.js函数中互换使用。math.js支持密集和稀疏矩阵。Math.js支持两种类型的矩阵：

- Array，一个常规的JavaScript数组。可以通过嵌套数组来创建多维数组。
- Matrix，math.js的矩阵实现。一个`Matrix`对象是由常规的JavaScript对象Array派生而来，提供各种工具函数便于矩阵运算例如subset，size，resize，clone，等等。