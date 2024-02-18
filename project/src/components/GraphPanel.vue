<script setup lang="ts">
import { VNetworkGraph, VEdgeLabel, type VNetworkGraphInstance } from 'v-network-graph'
import GraphPanelNode from './GraphPanelNode.vue'
import {
  currentGraphType,
  graphPanelUserConfigs,
  isPlayer2Graph,
  setCurrentGraphType
} from '@/components/GraphPanelUserConfigs'
import { graphExport } from '@/utils/GraphExport'
import { getGuiState, useDigitalFont, registerCleaningTaskPreStart } from '@/logic/GuiState'
import { computed, ref, watch } from 'vue'
import { getLabelToShow } from '@/utils/LabelExport'
import * as Layout from '@/utils/useGraphLayout'
import { guiDisable } from '@/logic/GuiState'
import { GameHandler } from '@/logic/GameHandler'
import {
  calculatePosition,
  eventHandlers,
  targetNodePos,
  tooltip,
  tooltipOpacity
} from '@/utils/GraphAlternativePopup'
import GraphAlternativeTooltip from './GraphAlternativeTooltip.vue'
import GraphWeightToggle from './GraphWeightToggle.vue'

const layouts = Layout.layouts
const nodesForDisplay = computed(() => {
  if (guiDisable.value === 'standard') {
    return graphExport.value.nodes
  } else {
    return {}
  }
})

const edgesForDisplay = computed(() => {
  return graphExport.value.edges
})

const graphType = computed(() => {
  const guiState = getGuiState().value
  const handler = GameHandler.getInstance()
  if (guiState === 'game') {
    setCurrentGraphType('gameGraph')
  } else if (guiState === 'evaluation' || guiState === 'postevaluation') {
    if (handler.getNumberOfAIs() === 2) {
      isPlayer2Graph.value
        ? setCurrentGraphType('player2Graph')
        : setCurrentGraphType('player1Graph')
    } else if (handler.getNumberOfAIs() === 1) {
      handler.getSettings().getPlayer(1).isAI()
        ? setCurrentGraphType('player1Graph')
        : setCurrentGraphType('player2Graph')
    }
  }
  return currentGraphType
})

const graph = ref<VNetworkGraphInstance>()

/**
 * Center the GraphPanel on position (0,0).
 */
const resetPan = () => {
  const size = graph.value?.getSizes()
  if (size !== undefined && size.width !== 0 && size.height !== 0) {
    graph.value?.panTo({ x: 0, y: 0 })
    const x = size?.width! / 2
    const y = size?.height! / 2
    graph.value?.panBy({ x: x, y: y })
  }
}

registerCleaningTaskPreStart(resetPan)

const config = graphPanelUserConfigs

/**
 * Calculate the position of the tooltip when it should be shown.
 */
watch(
  () => [targetNodePos.value, tooltipOpacity.value],
  () => {
    if (!graph.value || !tooltip.value || tooltipOpacity.value == 0) return
    calculatePosition(graph.value.translateFromSvgToDomCoordinates(targetNodePos.value))
  },
  { deep: true }
)
</script>

<!-- The GraphPanel contains the visualization of the game history and the next possible moves. -->
<template>
  <div class="tooltip-wrapper">
    <div class="graphPanel">
      <v-network-graph
        ref="graph"
        id="graph"
        class="graph"
        :nodes="nodesForDisplay"
        :edges="edgesForDisplay"
        :layouts="layouts"
        :configs="config"
        :event-handlers="eventHandlers"
      >
        <template #edge-label="{ edgeId, ...slotProps }">
          <v-edge-label
            :class="`${useDigitalFont === true ? 'dogica text-s' : 'text-xl'}`"
            vertical-align="above"
            :text="getLabelToShow(edgeId, graphType.value)"
            v-bind="slotProps"
          />
        </template>
        <template #override-node="{ nodeId }">
          <GraphPanelNode :state="graphExport.nodes[nodeId].boardState" />
        </template>
      </v-network-graph>
      <div
        v-if="
          (getGuiState().value === 'evaluation' || getGuiState().value === 'postevaluation') &&
          GameHandler.getInstance().getNumberOfAIs() === 2
        "
        id="labelSwitch"
      >
        <v-card max-height="50px" class="bg-black border px-4 py-2">
          <GraphWeightToggle />
        </v-card>
      </div>
      <!--tooltip-->
      <GraphAlternativeTooltip />
      <v-btn
        id="resetPan"
        icon="mdi-image-filter-center-focus-weak"
        size="x-large"
        density="compact"
        class="mx-2 bg-black border"
        variant="text"
        v-on:click="resetPan()"
      ></v-btn>
    </div>
  </div>
</template>

<style>
.graphPanel {
  position: relative;
}

#labelSwitch {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 10;
}

#resetPan {
  position: absolute;
  top: 5px;
  right: -3px;
  z-index: 10;
}

.graph {
  width: 100%;
  height: 100%;
  border: 1px solid #38373d;
  height: 70vh;
}

.tooltip {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}

.tooltip-wrapper {
  position: relative;
}
</style>
