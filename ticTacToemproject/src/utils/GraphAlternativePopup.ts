import { computed, ref } from 'vue'
import { layouts } from './useGraphLayout'
import type { EventHandlers, FixablePosition } from 'v-network-graph'
import { tooltipOffset, tooltipSize } from '@/components/GraphConstants'
import { graphExport } from './GraphExport'
import { registerCleaningTaskPreStart } from '@/logic/GuiState'

export const tooltip = ref<HTMLDivElement>()

export const targetNodeId = ref<string>('')
export const fixedNodeId = ref<string>('')
export const tooltipOpacity = ref(0) // 0 or 1
export const tooltipPos = ref({ left: '0px', top: '0px' })
export const overlayNodeId = computed(() => {
  if (targetNodeId.value === '') {
    return fixedNodeId.value
  } else {
    return targetNodeId.value
  }
})

export const targetNodePos = computed(() => {
  const nodePos = layouts.value.nodes[overlayNodeId.value]
  return nodePos || { x: 0, y: 0 }
})

export const eventHandlers: EventHandlers = {
  'node:pointerover': ({ node }) => {
    targetNodeId.value = node
    tooltipOpacity.value = 1 // show
  },
  'node:pointerout': () => {
    if (fixedNodeId.value == '') {
      tooltipOpacity.value = 0 // hide
    }
    targetNodeId.value = ''
  },
  'node:click': ({ node }) => {
    if (fixedNodeId.value === node) {
      fixedNodeId.value = ''
      tooltipOpacity.value = 0 // hide
    } else {
      fixedNodeId.value = node
      tooltipOpacity.value = 1 // hide
    }
  }
}

export function calculatePosition(domPoint: FixablePosition) {
  // calculates top-left position of the tooltip.
  const altCount: number = graphExport.value.nodes[overlayNodeId.value].alternatives.length
  const tooltipWidth: number = altCount * tooltipSize
  tooltipPos.value = {
    left: domPoint.x - tooltipWidth / 2 + 'px',
    top: domPoint.y + tooltipOffset + 'px'
  }
}

function cleanPopupsBeforeStart() {
  fixedNodeId.value = ''
  targetNodeId.value = ''
  tooltipOpacity.value = 0
}

registerCleaningTaskPreStart(cleanPopupsBeforeStart)
