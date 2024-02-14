export const nodeSize = 40
export const nodesep = nodeSize * 2
export const edgesep = nodeSize
export const ranksep = nodeSize * 2

//Size of one small field
export const rectSize: number = 20
//Calculate the position of the top corner of the field, relative to the center
export const xOffsetRect: number = -1.5 * rectSize
export const yOffsetRect: number = -1.5 * rectSize
//Calculate the position of the first text, relative to the center
export const xOffsetText: number = -rectSize
export const yOffsetText: number = -rectSize + 5.5
//Size of whole field
export const gridSize: number = 3 * rectSize
export const tooltipPadding: number = 3
export const viewBoxAttributes: string = [
  -gridSize / 2 - tooltipPadding,
  -gridSize / 2 - tooltipPadding,
  gridSize + 2 * tooltipPadding,
  gridSize + 2 * tooltipPadding
].join(' ')
export const tootipSize = gridSize
