<script setup lang="ts">
import { computed } from 'vue'
import GraphPanelNodeField from './GraphPanelNodeField.vue'
import type { FieldType } from '@/logic/FieldType'

/**
 * @param node The node that this component should visualize.
 */
const props = defineProps<{ state: FieldType[][] }>()
const range = [0, 1, 2]
const state = computed(() => {
  return props.state
})
</script>

<!-- The GraphPanelNode contains the visualization of a single node of the graph, i.e. the corresponding gameboard. -->
<template>
  <template v-for="x in range">
    <GraphPanelNodeField
      v-for="y in range"
      :key="x + '|' + y"
      :x="x"
      :y="y"
      :fieldType="state[y][x]"
    />
  </template>
</template>
