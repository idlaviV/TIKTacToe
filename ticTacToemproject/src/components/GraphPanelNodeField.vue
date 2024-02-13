<script setup lang="ts">
import { computed } from 'vue'
import { type FieldType, symbol } from '../logic/FieldType'
import * as gc from '@/components/GraphConstants'
/**
 * @param x The column of the field.
 * @param y The row of the field.
 * @param fieldType The displayed value.
 */
const props = defineProps<{ x: number; y: number; fieldType: FieldType }>()
const x = props.x
const y = props.y
const label = computed(() => {
  return symbol(props.fieldType)
})

const rectx: number = gc.xOffsetRect + x * gc.rectSize
const recty: number = gc.yOffsetRect + y * gc.rectSize
const textx: number = gc.xOffsetText + x * gc.rectSize
const texty: number = gc.yOffsetText + y * gc.rectSize
</script>

<!-- The GraphPanelNodeField visualizes a single field of the gameboard. -->
<template>
  <rect
    :x="rectx"
    :y="recty"
    :width="gc.rectSize"
    :height="gc.rectSize"
    style="fill-opacity: 0; stroke-width: 0.5; stroke: white"
  />
  <text class="pixelify" text-anchor="middle" style="fill: white">
    <tspan :x="textx" :y="texty">{{ label }}</tspan>
  </text>
</template>
