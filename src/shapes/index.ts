export interface Shape {
  render: () => void
  isHit: (x: number, y: number) => boolean
  renderActiveState: () => void
  isActive: boolean
  isHitActiveArea: (x: number, y: number) => ElementArea
  save: () => void
  moveBy: (dx: number, dy: number) => void
}
export type ElementArea = '' | 'body' | 'rotate' | 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft'
export * from './Rectangle'
