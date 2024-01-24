<script setup lang="ts">
import { computed } from 'vue'
import GraphPanelNodeField from './GraphPanelNodeField.vue'
import { graphExport } from '@/utils/GraphExport'

/**
 * @param node The node that this component should visualize.
 */
const props = defineProps<{ nodeId: string }>()
const range = [0, 1, 2]
const state = computed(() => {
  return graphExport.value.nodes[props.nodeId].boardState
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
      :nodeId="nodeId"
    />
  </template>
</template>
