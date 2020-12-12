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

$$
\begin{bmatrix}
  1 & 3 & 5 \\
  2 & 4 & 6 \\
\end{bmatrix}
$$

可以使用二维数组，即`[[1,3,5],[2,4,6]]`进行构造。

### 构造自定义向量

一维数组在`numeric`中默认为**纵向量**，例如构造如下所示的向量:
$$
\begin{bmatrix}
  3 \\
  8 \\
  11 \\
\end{bmatrix}
$$

使用一维数组`[3,8,11]`即可，但是如果需要构造横向量必须要用二维向量，例如构造下面向量

$$\begin{bmatrix} 3 & 8 & 11 \end{bmatrix}$$

必须要使用`[[3,8,11]]`进行表示。

### 构造特殊向量（全0、全1、单位、随机矩阵）

`numeric.random()`构造指定大小的(0-1)随机矩阵，必须传入向量形式，`numeric.identity`构造单位向量，传入阶数即可。全0和全1矩阵`numeric`没有提供方法,可以借助随机矩阵构造函数进行构造。

```js
// 构造随机矩阵和向量
numeric.random([2,3])  // 构造2*3的随机矩阵,里面每个数都是0-1的随机数
numeric.random([3])  // 构造3维随机向量

// 构造单位矩阵
numeric.identity(5)  // 构造5阶单位向量

// 构造全0矩阵
function zeros(size){
  const randMatrix = numeric.random(size)
  return numeric.mul(randMatrix, 0)
}

// 构造全1矩阵
function ones(size){
  const zeroMatrix = zeros(size)
  return numeric.add(zeroMatrix, 1)
}
```

## 矩阵运算

### 矩阵乘法

矩阵-矩阵、矩阵-向量、向量-矩阵的乘法（product），使用`numeric.dot(A,B)`方法，其中A和B既可以是矩阵，也可以是向量。例如，有下面的矩阵乘法：

$$
\begin{bmatrix}
  1 & 2 & 3 \\
  4 & 5 & 6 \\
\end{bmatrix}
\cdot
\begin{bmatrix}
  7 \\
  8 \\
  9 \\
\end{bmatrix}=
\begin{bmatrix}
  50 \\
  122 \\
\end{bmatrix}
$$

那么用`numerical`计算的代码为：

```js
A = [[1,2,3],[4,5,6]]
x = [7,8,9]
numerical.dot(A,x)  // 输出为[50,122]
```
