<script setup lang="ts">
import GraphPanelNode from './GraphPanelNode.vue'
import { overlayNodeId, tooltip, tooltipOpacity, tooltipPos } from '@/utils/GraphAlternativePopup'
import { viewBoxAttributes, tooltipSize } from './GraphConstants'
import { graphExport } from '@/utils/GraphExport'
</script>
<template>
  <div ref="tooltip" class="tooltip" :style="{ ...tooltipPos, opacity: tooltipOpacity }">
    <v-row v-if="overlayNodeId !== ''" no-gutters>
      <v-col
        v-for="alt in graphExport.nodes[overlayNodeId].alternatives"
        v-bind:key="alt.toString()"
      >
        <v-card>
          <svg :width="tooltipSize" :height="tooltipSize" :viewBox="viewBoxAttributes">
            <GraphPanelNode :state="alt" />
          </svg>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
