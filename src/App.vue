<script lang="ts" setup>
import type { ElementArea, Shape } from './shapes'
import { Rectangle } from './shapes'
import { getRectangleCenter, getTowPointRotate } from './utils'

class CreateMode {
  type = 'create'
  isDrawing = false
}
enum ScaleDirection {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight
}
class SelectMode {
  type = 'select'
  isScaling = false
  operator: ElementArea = ''
  /**
   * 0: top-left
   * 1: top-right
   * 2: bottom-left
   * 3: bottom-right
   */
  scaleDirection: ScaleDirection = 0
}
type CanvasMode = CreateMode | SelectMode

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null

// 图形的左上角坐标
let lastX = 0
let lastY = 0

const currentMode = ref<CanvasMode>({ type: 'create', isDrawing: false })
// 当前激活的元素
let activeElement: Shape | null = null
// 所有的元素
const allElements: Shape[] = []

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', () => {
    initCanvas()
    renderAllElements()
  })
})
function isCreateMode(mode: CanvasMode): mode is CreateMode {
  return mode instanceof CreateMode
}
function isSelectMode(mode: CanvasMode): mode is SelectMode {
  return mode instanceof SelectMode
}
function clearCanvas() {
  if (!ctx || !canvas) return
  ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
}
function renderAllElements() {
  if (!ctx) return
  clearCanvas()
  allElements.forEach((el) => {
    el.render()
  })
}
function initCanvas() {
  canvas = document.getElementById('main-canvas') as HTMLCanvasElement
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = width
  canvas.height = height

  // Move the origin to the center of the canvas
  ctx.translate(width / 2, height / 2)
}
function pointerDown(e: PointerEvent) {
  lastX = e.offsetX
  lastY = e.offsetY

  if (isCreateMode(currentMode.value)) {
    currentMode.value.isDrawing = true
  } else if (isSelectMode(currentMode.value)) {
    if (activeElement) {
      const hitActiveArea = activeElement.isHitActiveArea(e.offsetX, e.offsetY)
      if (hitActiveArea) {
        currentMode.value.operator = hitActiveArea
        activeElement.save()
        return
      }
    }
    checkIsHitElement(lastX, lastY)
  }
}
// Check if the point is in any element
function checkIsHitElement(x: number, y: number) {
  let hitElement = null
  // From the last element to the first element, so that the last element is on top
  for (let i = allElements.length - 1; i >= 0; i--) {
    if (allElements[i].isHit(x, y)) {
      hitElement = allElements[i]
      break
    }
  }
  if (activeElement) {
    activeElement.isActive = false
  }
  if (hitElement) {
    activeElement = hitElement
    hitElement.isActive = true
  }
  renderAllElements()
}

function pointMove(e: PointerEvent) {
  if (!canvas) return
  if (isCreateMode(currentMode.value)) {
    if (!currentMode.value.isDrawing) {
      return
    }
    if (!activeElement) {
      activeElement = new Rectangle(canvas, { x: lastX, y: lastY })
      allElements.push(activeElement)
    }
    if (activeElement instanceof Rectangle) {
      activeElement.width = e.offsetX - lastX
      activeElement.height = e.offsetY - lastY
    } else {
      console.error('Unknown shape')
    }

    renderAllElements()
  } else if (isSelectMode(currentMode.value)) {
    if (!activeElement) return
    const dx = e.offsetX - lastX
    const dy = e.offsetY - lastY
    switch (currentMode.value.operator) {
      case 'body':
        activeElement.moveBy(dx, dy)
        break
      case 'rotate':
        if (activeElement instanceof Rectangle) {
          const center = getRectangleCenter(activeElement)
          const degree = getTowPointRotate(center.x, center.y, lastX, lastY, e.clientX, e.clientY)
          activeElement.rotateBy(degree)
        }
        break
      default:
        break
    }
    renderAllElements()
  }
}
function pointUp() {
  if (isCreateMode(currentMode.value)) {
    if (currentMode.value.isDrawing) {
      currentMode.value.isDrawing = false
      activeElement = null
      lastX = 0
      lastY = 0
    }
  } else if (isSelectMode(currentMode.value)) {
    if (currentMode.value.operator) {
      currentMode.value.operator = ''
    }
  }
}
function switchToMode(mode: CanvasMode) {
  currentMode.value = mode
}
</script>

<template>
  <div class="h-100dvh w-screen">
    <canvas
      id="main-canvas"
      class="h-full w-full border border-red border-solid"
      @pointerdown="pointerDown"
      @pointermove="pointMove"
      @pointerup="pointUp"
    ></canvas>
    <div class="fixed left-5 top-5">
      <button class="border border-red border-solid p-3" @click="switchToMode(new SelectMode())">
        选择
      </button>
      <button class="border border-red border-solid p-3" @click="switchToMode(new CreateMode())">
        矩形
      </button>
    </div>
  </div>
</template>

<style scoped></style>
