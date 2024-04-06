import type { Shape } from '.'
import { checkIsAtSegment, checkPointIsInRectangle, degToRad, drawCircle, drawRect, getRectangleCenter, getRotatedPoint, getTowPointDistance, screenToCanvas } from '~/utils'

export interface IRectangle {
  width?: number
  height?: number
  x: number // The x-coordinate of the upper-left corner of the rectangle, which is relative to the left-top corner of the canvas
  y: number // The y-coordinate
  startX?: number
  startY?: number
  rotate?: number
}

export class Rectangle implements IRectangle, Shape {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  x: number
  y: number
  width: number
  height: number
  startX = 0
  startY = 0
  isActive = false
  rotate = 0
  startRotate = 0
  constructor(canvas: HTMLCanvasElement, opt: IRectangle) {
    this.width = opt.width || 0
    this.height = opt.height || 0

    this.x = opt.x
    this.y = opt.y
    this.ctx = canvas.getContext('2d')!
    this.canvas = canvas
  }

  // Keep status in a certain time
  save() {
    this.startX = this.x
    this.startY = this.y
    this.startRotate = this.rotate
  }

  // Move the rectangle
  moveBy(dx: number, dy: number) {
    this.x = this.startX + dx
    this.y = this.startY + dy
  }

  rotateBy(degree: number) {
    this.rotate = this.startRotate + degree
  }

  render() {
    this.ctx.save()
    this.ctx.beginPath()
    const canvasPos = screenToCanvas(this.canvas, this.x, this.y)
    const halfWidth = this.width / 2
    const halfHeight = this.height / 2
    // Translate the center of the canvas to the center of the rectangle
    this.ctx.translate(canvasPos.x + halfWidth, canvasPos.y + halfHeight)
    this.ctx.rotate(degToRad(this.rotate))
    this.ctx.rect(-halfWidth, -halfHeight, this.width, this.height)
    this.ctx.stroke()
    this.renderActiveState()
    this.ctx.restore()
  }

  isHit(x0: number, y0: number): boolean {
    const { x, y, width, height } = this
    const center = getRectangleCenter(this)
    const rotatePoint = getRotatedPoint(x0, y0, center.x, center.y, -this.rotate)
    x0 = rotatePoint.x
    y0 = rotatePoint.y
    // 矩形四条边的线段
    const segments = [
      [x, y, x + width, y],
      [x + width, y, x + width, y + height],
      [x + width, y + height, x, y + height],
      [x, y + height, x, y]
    ]
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      if (
        checkIsAtSegment(x0, y0, segment[0], segment[1], segment[2], segment[3])
      ) {
        return true
      }
    }

    return false
  }

  // 检测是否击中了激活状态的某个区域
  isHitActiveArea(x0: number, y0: number) {
    const x = this.x - 5
    const y = this.y - 5
    const width = this.width + 10
    const height = this.height + 10
    // 反向旋转矩形的角度
    const center = getRectangleCenter(this)
    const rotatePoint = getRotatedPoint(x0, y0, center.x, center.y, -this.rotate)
    x0 = rotatePoint.x
    y0 = rotatePoint.y

    if (checkPointIsInRectangle(x0, y0, x, y, width, height)) {
      // 在中间的虚线框
      return 'body'
    } else if (getTowPointDistance(x0, y0, x + width / 2, y - 10) <= 10) {
      // 在旋转手柄
      return 'rotate'
    } else if (checkPointIsInRectangle(x0, y0, x + width, y + height, 10, 10)) {
      // 在右下角操作手柄
      return 'bottomRight'
    } else if (checkPointIsInRectangle(x0, y0, x - 10, y + height, 10, 10)) {
      // 在左下角操作手柄
      return 'bottomLeft'
    } else if (checkPointIsInRectangle(x0, y0, x + width, y - 10, 10, 10)) {
      // 在右上角操作手柄
      return 'topRight'
    } else if (checkPointIsInRectangle(x0, y0, x - 10, y - 10, 10, 10)) {
      // 在左上角操作手柄
      return 'topLeft'
    }
    return ''
  }

  onDrag(x0: number, y0: number, x1: number, y1: number) {
    this.x += x1 - x0
    this.y += y1 - y0
  }

  // 当激活时渲染激活态
  renderActiveState() {
    if (!this.isActive) return
    const halfWidth = this.width / 2
    const halfHeight = this.height / 2
    // 为了不和矩形重叠，虚线框比矩形大一圈，增加5px的内边距
    const x = -halfWidth - 5
    const y = -halfHeight - 5
    const width = this.width + 10
    const height = this.height + 10
    // 主体的虚线框
    this.ctx.save()
    this.ctx.setLineDash([5])
    drawRect(this.ctx, x, y, width, height)
    this.ctx.restore()
    // 左上角的操作手柄
    drawRect(this.ctx, x - 10, y - 10, 10, 10)
    // 右上角的操作手柄
    drawRect(this.ctx, x + width, y - 10, 10, 10)
    // 右下角的操作手柄
    drawRect(this.ctx, x + width, y + height, 10, 10)
    // 左下角的操作手柄
    drawRect(this.ctx, x - 10, y + height, 10, 10)
    // 旋转操作手柄
    drawCircle(this.ctx, x + width / 2, y - 10, 10)
  }
}
