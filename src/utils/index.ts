export function screenToCanvas(canvas: HTMLCanvasElement, x: number, y: number) {
  const { width, height } = canvas
  return {
    x: x - width / 2,
    y: y - height / 2
  }
}

// 计算点到直线的距离
export function getPointToLineDistance(x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
  // 直线公式y=kx+b不适用于直线垂直于x轴的情况，所以对于直线垂直于x轴的情况单独处理
  if (x1 === x2) {
    return Math.abs(x - x1)
  }
  else {
    // y1 = k * x1 + b  // 0式
    // b = y1 - k * x1  // 1式

    // y2 = k * x2 + b    // 2式
    // y2 = k * x2 + y1 - k * x1  // 1式代入2式
    // y2 - y1 = k * x2 - k * x1
    // y2 - y1 = k * (x2 -  x1)
    const k = (y2 - y1) / (x2 - x1) // 3式

    const b = y1 - k * x1 // 3式代入0式

    return Math.abs((k * x - y + b) / Math.sqrt(1 + k * k))
  }
}
// 检查是否点击到了一条线段
export function checkIsAtSegment(x: number, y: number, x1: number, y1: number, x2: number, y2: number, dis = 10) {
  // 点到直线的距离不满足直接返回
  if (getPointToLineDistance(x, y, x1, y1, x2, y2) > dis)
    return false

  // 点到两个端点的距离
  const dis1 = getTowPointDistance(x, y, x1, y1)
  const dis2 = getTowPointDistance(x, y, x2, y2)
  // 线段两个端点的距离，也就是线段的长度
  const dis3 = getTowPointDistance(x1, y1, x2, y2)
  // 根据勾股定理计算斜边长度，也就是允许最远的距离
  const max = Math.sqrt(dis * dis + dis3 * dis3)
  // 点距离两个端点的距离都需要小于这个最远距离
  if (dis1 <= max && dis2 <= max)
    return true

  return false
}

// 计算两点之间的距离
function getTowPointDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}
// 提取出公共的绘制矩形和圆的方法
// 绘制矩形
export function drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.beginPath()
  ctx.rect(x, y, width, height)
  ctx.stroke()
}
// 绘制圆形
export function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.stroke()
}
