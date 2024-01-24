<script setup lang="ts">
import { computed } from 'vue'
import { type FieldType, symbol } from '../logic/FieldType'
import { graphExport } from '@/utils/GraphExport'
/**
 * @param x The column of the field.
 * @param y The row of the field.
 * @param fieldType The displayed value.
 */
const props = defineProps<{ x: number; y: number; fieldType: FieldType; nodeId: string }>()
const x = props.x
const y = props.y
//const label: string = symbol(props.fieldType)
const label = computed(() => {
  return symbol(graphExport.value.nodes[props.nodeId].boardState[props.y][props.x])
})
const xOffsetRect: number = -30
const yOffsetRect: number = -30
const xOffsetText: number = -20
const yOffsetText: number = -15
const rectSize: number = 20
const xTextAnchor: number = 10
const yTextAnchor: number = 20

const rectx: number = xOffsetRect + x * rectSize
const recty: number = yOffsetRect + y * rectSize
const textx: number = xOffsetText + x * rectSize
const texty: number = yOffsetText + y * rectSize
</script>

<!-- The GraphPanelNodeField visualizes a single field of the gameboard. -->
<template>
  <rect
    :x="rectx"
    :y="recty"
    :width="rectSize"
    :height="rectSize"
    style="fill-opacity: 0; stroke-width: 0.5; stroke: white"
  />
  <text text-anchor="middle" :x="xTextAnchor" :y="yTextAnchor" style="fill: white">
    <tspan :x="textx" :y="texty">{{ label }}</tspan>
  </text>
</template>
