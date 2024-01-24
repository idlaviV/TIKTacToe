<script setup lang="ts">
import GraphPanelNodeField from './GraphPanelNodeField.vue'

/**
 * @param node The node that this component should visualize.
 */
defineProps<{ node: any }>()
const range = [0, 1, 2]
</script>

<!-- The GraphPanelNode contains the visualization of a single node of the graph, i.e. the corresponding gameboard. -->
<template>
  <template v-for="x in range">
    <GraphPanelNodeField
      v-for="y in range"
      :key="x + '|' + y"
      :x="x"
      :y="y"
      :fieldType="node.boardState[y][x]"
    />
  </template>
</template>
