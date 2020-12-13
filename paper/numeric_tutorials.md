# numeric.js简要文档

## 安装numeric.js

```batch
npm install numeric
或者
yarn add numeric
```

## 构造

### 构造自定义矩阵

构造如下所示的二维矩阵：

![](https://latex.codecogs.com/svg.latex?\begin{bmatrix}%20%201%20&%203%20&%205%20\\%20%202%20&%204%20&%206%20\\\end{bmatrix})

可以使用二维数组，即`[[1,3,5],[2,4,6]]`进行构造。

### 构造自定义向量

一维数组在`numeric`中默认为**纵向量**，例如构造如下所示的向量:

![](https://latex.codecogs.com/svg.latex?\begin{bmatrix}%20%203%20\\%20%208%20\\%20%2011%20\\\end{bmatrix})

使用一维数组`[3,8,11]`即可，但是如果需要构造横向量必须要用二维向量，例如构造下面向量

![](https://latex.codecogs.com/svg.latex?\begin{bmatrix}%203%20&%208%20&%2011%20\end{bmatrix})

必须要使用`[[3,8,11]]`进行表示。

### 构造特殊矩阵（全为同一数、单位、对角、随机矩阵）

`numeric.random()`构造指定大小的(0-1)随机矩阵，必须传入向量形式，`numeric.identity`构造单位向量，传入阶数即可。全为同一数字矩阵可以使用`numeric.rep`，例如全为大小为[3,4]的全1矩阵。对角矩阵可以使用`numeric.diag`。

```js
// 构造随机矩阵和向量
numeric.random([2,3])  // 构造2*3的随机矩阵,里面每个数都是0-1的随机数
numeric.random([3])  // 构造3维随机向量

// 构造单位矩阵
numeric.identity(5)  // 构造5阶单位向量

// 构造同一数字矩阵
numeric.rep([3,4],0)  // 构造大小为[3,4]的全0矩阵
numeric.rep([2,4],1)  // 构造大小为[2,4]的全1矩阵
numeric.rep([5,5],1.8)  // 构造大小为[5,5]的全为1.8的矩阵

// 构造对角矩阵
numeric.diag([3,4,5])  // 构造对角线上是[3,4,5], 其他都是0的三阶矩阵
```

## 矩阵/向量运算

### 矩阵/向量乘法

矩阵-矩阵、矩阵-向量、向量-矩阵的乘法（product），使用`numeric.dot(A,B)`方法，其中A和B既可以是矩阵，也可以是向量。例如，有下面的矩阵乘法：

![](https://latex.codecogs.com/svg.latex?\begin{bmatrix}%20%201%20&%202%20&%203%20\\%20%204%20&%205%20&%206%20\\\end{bmatrix}\cdot\begin{bmatrix}%20%207%20\\%20%208%20\\%20%209%20\\\end{bmatrix}=\begin{bmatrix}%20%2050%20\\%20%20122%20\\\end{bmatrix})

那么用`numerical`计算的代码为：

```js
A = [[1,2,3],[4,5,6]]
x = [7,8,9]
numerical.dot(A,x)  // 输出为[50,122]
```

### 逐点操作(pointwise)

下面操作都是对矩阵每个值逐项操作

```js
numeric.add(A,x) // 矩阵A逐项加x，x既可以是标量，也可以是矩阵
numeric.add(A1,A2,A3,...) // A1+A2+A3+...
numeric.sub(A,x) // 矩阵A逐项减x，x既可以是标量，也可以是矩阵
numeric.sub(A1,A2,A3,...) // A1-A2-A3-...
numeric.mul(A,x) // 矩阵A逐项乘以x，x既可以是标量，也可以是矩阵
numeric.div(A,x) // 矩阵A逐项除以x，x既可以是标量，也可以是矩阵
numeric.abs(A)  // 逐项求绝对值

numeric.sin(A)  // 逐项求sin
numeric.cos(A)  // 逐项求cos
numeric.tan(A)  // 逐项求tan
numeric.exp(A)  // 逐项求e的a次方
numeric.log(A)  // 逐项开e方
numeric.round(A)  // 逐项四舍五入取整
numeric.ceil(A)  // 逐项向上取整
numeric.floor(A)  // 逐项向下取整
numeric.sqrt(A)  // 逐项开根号
numeric.pow(A,x)  // 逐项计算x次方
numeric.neg([1, -2, 3]) // 逐项取反, 返回[-1,2,-3]

// 获得布尔矩阵
numeric.eq(A,B)  // 判断A==B
numeric.gt(A,B)  // 判断A>B
numeric.geq(A,B)  // 判断A>=B
numeric.lt(A,B)  // 判断A<B
numeric.leq(A,B)  // 判断A<=B
numeric.isNAN(A)  // 判断A中每项是否为NAN

```

- 逐项求且`numeric.and(A,x)`：矩阵A逐项加x，x既可以是标量，也可以是矩阵。

### 布尔矩阵操作

```js
// numeric.any判断矩阵是否至少有一个true, 如果有, 则返回true
numeric.any([false, true])  // 返回true
numeric.any([0,0,false])  // 返回false

// numeric.all判断矩阵是否都是true, 如果都是则返回true
numeric.all([1,2,3]) // 返回true
numeric.all([1,0,3]) // 返回false
```

### 向量操作

#### 向量累加和累积

```js
// 对于向量a
let a = [2,3,4,5]
// 计算向量的累加
numeric.sum(a)  // 返回14
numeric.sum(A)  // 对矩阵A中所有元素求和, 返回值为number
// 计算向量的累积
numeric.prod(a)  // 返回120
```

#### 向量的二范数(模长)

对于向量`[1,2,3,4]`，向量的二范数（模长）则是用各项的平方和开方得到，即![](https://latex.codecogs.com/svg.latex?\sqrt{1^2+2^2+3^2+4^2})，可以使用`numeric.norm2([1,2,3,4])`，返回值为5.4772。

如果只需要求各项的平方和，则可以使用`numeric.norm2Squared([1,2,3,4])`，返回值为30。

## 矩阵属性

### 获得矩阵大小

`numeric.dim(A)`即可获得矩阵A的维度，返回值为数组，例如`[3,2]`。

### 获得矩阵的逆、转置

```js
numeric.inv(A)  // 获得矩阵A的逆矩阵
numeric.transpose(A)  // 获得矩阵A的转置矩阵
```

## 其他工具方法

### 生成线性数组

`numeric.linspace(A,B,n)`可以自定义生成线性空间,从A开始到B共生成n个数字，彼此间隔相同，返回值为数组，因此可以对其调用其他逐点操作方法。

### 按矩阵格式打印

`numeric.prettyPrint`可以将矩阵转成较为漂亮的形式，美中不足的是还需要调用`console.log`进行打印。

### 设置精度

`numeric.precision`为属性值, 可以将其赋值为一个数字, 例如`numeric.precision=4`则矩阵精度为4位

### 按位判断矩阵是否相等

`numeric.same(A,B)`会按位比较矩阵A和矩阵B是否相等,相等则返回true，否则返回false

### 深拷贝矩阵

`numeric.clone(A)`深拷贝矩阵A