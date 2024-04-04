<script lang="ts" setup>
import type { Shape } from './shapes'
import { Rectangle } from './shapes'

type CanvasMode = 'create' | 'select'

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null

// 图形的左上角坐标
let lastX = 0
let lastY = 0

let isDrawing = false

const currentMode = ref<CanvasMode>('create')
// 当前激活的元素
let activeElement: Shape | null = null
// 所有的元素
const allElements: Shape[] = []

onMounted(() => {
  initCanvas()
})
function clearCanvas() {
  if (!ctx || !canvas)
    return
  ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
}
function renderAllElements() {
  if (!ctx)
    return
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

  // 将画布的原点由左上角移动到中心点
  ctx.translate(width / 2, height / 2)
}
function pointerDown(e: PointerEvent) {
  lastX = e.offsetX
  lastY = e.offsetY
  if (currentMode.value === 'select')
    return checkIsHitElement(lastX, lastY)

  isDrawing = true
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
  if (activeElement)
    activeElement.isActive = false

  if (hitElement) {
    activeElement = hitElement
    hitElement.isActive = true
  }

  renderAllElements()
}

function pointMove(e: PointerEvent) {
  if (!isDrawing || !canvas)
    return

  if (!activeElement) {
    activeElement = new Rectangle(canvas, { x: lastX, y: lastY })
    allElements.push(activeElement)
  }

  (activeElement as Rectangle).width = e.clientX - lastX
  ;(activeElement as Rectangle).height = e.clientY - lastY
  renderAllElements()
}
function pointUp() {
  if (isDrawing) {
    isDrawing = false
    activeElement = null
    lastX = 0
    lastY = 0
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
    />
    <div class="fixed left-5 top-5">
      <button class="border border-red border-solid p-3" @click="switchToMode('select')">
        选择
      </button>
      <button class="border border-red border-solid p-3" @click="switchToMode('create')">
        矩形
      </button>
    </div>
  </div>
</template>

<style scoped></style>
