<script setup lang="ts">
import GraphPanelNodeField from './GraphPanelNodeField.vue'
import { type Nodes } from 'v-network-graph'

defineProps<{ nodeId: string; nodes: Nodes }>()
const range = [0, 1, 2]
</script>

<template>
  <template v-for="x in range">
    <GraphPanelNodeField
      v-for="y in range"
      :key="x + '|' + y"
      :x="x"
      :y="y"
      :fieldType="nodes[nodeId].boardState[y][x]"
    />
  </template>
</template>
