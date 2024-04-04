import type { Shape } from '.'
import { checkIsAtSegment, drawCircle, drawRect, screenToCanvas } from '~/utils'

export interface IRectangle {
  width?: number
  height?: number
  x: number
  y: number

}

export class Rectangle implements IRectangle, Shape {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  x: number
  y: number
  width: number
  height: number
  isActive = false
  constructor(canvas: HTMLCanvasElement, opt: IRectangle) {
    this.width = opt.width || 0
    this.height = opt.height || 0

    this.x = opt.x
    this.y = opt.y
    this.ctx = canvas.getContext('2d')!
    this.canvas = canvas
  }

  render() {
    this.ctx.beginPath()
    const canvasPos = screenToCanvas(this.canvas, this.x, this.y)
    this.ctx.rect(canvasPos.x, canvasPos.y, this.width, this.height)
    this.ctx.stroke()
    this.renderActiveState()
  }

  isHit(x0: number, y0: number): boolean {
    const { x, y, width, height } = this
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
      )
        return true
    }

    return false
  }

  // 当激活时渲染激活态
  renderActiveState() {
    if (!this.isActive)
      return

    const canvasPos = screenToCanvas(this.canvas, this.x, this.y)
    // 为了不和矩形重叠，虚线框比矩形大一圈，增加5px的内边距
    const x = canvasPos.x - 5
    const y = canvasPos.y - 5
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
