export interface Shape {
  render: () => void
  isHit: (x: number, y: number) => boolean
  renderActiveState: () => void
  isActive: boolean
}
export * from './Rectangle'
