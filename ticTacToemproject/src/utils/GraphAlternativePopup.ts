import { computed, ref } from "vue";
import { layouts } from "./useGraphLayout";

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