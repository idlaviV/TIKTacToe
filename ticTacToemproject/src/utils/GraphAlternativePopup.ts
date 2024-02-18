import { computed, ref } from 'vue'
import { layouts } from './useGraphLayout'
import type { EventHandlers, FixablePosition } from 'v-network-graph'
import { tooltipOffset, tooltipSize } from '@/components/GraphConstants'
import { graphExport } from './GraphExport'
import { registerCleaningTaskPreStart } from '@/logic/GuiState'

export const tooltip = ref<HTMLDivElement>()

/**
 * targetNodeId is the node that the mouse is currently over.
 * fixedNodeId is the node that the user has clicked on to fix the tooltip.
 */
export const targetNodeId = ref<string>('')
export const fixedNodeId = ref<string>('')

/**
 * tooltipOpacity is 0 or 1, to show or hide the tooltip.
 */
export const tooltipOpacity = ref(0) // 0 or 1
export const tooltipPos = ref({ left: '0px', top: '0px' })

/**
 * If a node is fixed by the user, the overlayNodeId is the fixed node.
 * Otherwise, we use the node that the mouse is currently over.
 */
export const overlayNodeId = computed(() => {
  if (targetNodeId.value === '') {
    return fixedNodeId.value
  } else {
    return targetNodeId.value
  }
})

/**
 * Extracts the position in the GraphPanel of the node.
 */
export const targetNodePos = computed(() => {
  const nodePos = layouts.value.nodes[overlayNodeId.value]
  return nodePos || { x: 0, y: 0 }
})

/**
 * Event handlers for the graph.
 * They allow the user to hover over nodes or click on them to fix the tooltip.
 */
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

/**
 * Calculate the absolute position of the tooltip in the DOM.
 * @param nodeDomPoint The position of the node in the DOM.
 */
export function calculatePosition(nodeDomPoint: FixablePosition) {
  // calculates top-left position of the tooltip.
  const altCount: number = graphExport.value.nodes[overlayNodeId.value].alternatives.length
  const tooltipWidth: number = altCount * tooltipSize
  tooltipPos.value = {
    left: nodeDomPoint.x - tooltipWidth / 2 + 'px',
    top: nodeDomPoint.y + tooltipOffset + 'px'
  }
}

/**
 * Clean the popup before the user leaves the post-evaluationstate.
 */
function cleanPopupsBeforeStart() {
  fixedNodeId.value = ''
  targetNodeId.value = ''
  tooltipOpacity.value = 0
}

registerCleaningTaskPreStart(cleanPopupsBeforeStart)
