<script setup lang="ts">
import {
  VNetworkGraph,
  VEdgeLabel,
  type VNetworkGraphInstance,
  type EventHandlers
} from 'v-network-graph'
import GraphPanelNode from './GraphPanelNode.vue'
import {
  currentGraphType,
  graphPanelUserConfigs,
  isPlayer2Graph,
  setCurrentGraphType
} from '@/components/GraphPanelUserConfigs'
import { graphExport } from '@/utils/GraphExport'
import { getGuiState, useDigitalFont } from '@/logic/GuiState'
import { computed, ref, watch } from 'vue'
import { getLabelToShow } from '@/utils/LabelExport'
import * as Layout from '@/utils/useGraphLayout'
import { guiDisable } from '@/logic/GuiState'
import { GameHandler } from '@/logic/GameHandler'
import { viewBoxAttributes, tooltipSize } from './GraphConstants'

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

const config = graphPanelUserConfigs

const tooltip = ref<HTMLDivElement>()
const targetNodeId = ref<string>('')
const tooltipOpacity = ref(0) // 0 or 1
const tooltipPos = ref({ left: '0px', top: '0px' })

const targetNodePos = computed(() => {
  const nodePos = layouts.value.nodes[targetNodeId.value]
  return nodePos || { x: 0, y: 0 }
})

watch(
  () => [targetNodePos.value, tooltipOpacity.value],
  () => {
    if (!graph.value || !tooltip.value) return

    // translate coordinates: SVG -> DOM
    const domPoint = graph.value.translateFromSvgToDomCoordinates(targetNodePos.value)
    // calculates top-left position of the tooltip.
    const altCount:number = nodesForDisplay.value[targetNodeId.value].alternatives.length
    const tooltipWidth:number = altCount * tooltipSize -25
    tooltipPos.value = {
      left: domPoint.x - tooltipWidth / 2 + 'px',
      top: domPoint.y +120 - tooltipSize + 'px'
    }
  },
  { deep: true }
)

const eventHandlers: EventHandlers = {
  'node:pointerover': ({ node }) => {
    targetNodeId.value = node
    tooltipOpacity.value = 1 // show
  },
  'node:pointerout': () => {
    tooltipOpacity.value = 0 // hide
  }
}
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
        <v-switch v-model="isPlayer2Graph" label="Wechsle KI"></v-switch>
      </div>
    </div>
    <!--tooltip-->
    <div ref="tooltip" class="tooltip" :style="{ ...tooltipPos, opacity: tooltipOpacity }">
      <v-row v-if="targetNodeId !== ''" no-gutters>
        <v-col
          
          v-for="alt in graphExport.nodes[targetNodeId].alternatives"
          v-bind:key="alt.toString()"
        >
        <v-card>
          <svg :width="tooltipSize" :height="tooltipSize" :viewBox="viewBoxAttributes">
            <GraphPanelNode :state="alt" />
          </svg></v-card>
        </v-col>
      
      </v-row>
    </div>
  </div>
</template>

<style>
.graphPanel {
  position: relative;
}

#labelSwitch {
  position: absolute;
  top: 0;
  left: 20px;
  z-index: 10;
}

.graph {
  width: 100%;
  height: 100%;
  border: 1px solid #38373d;
  height: 81vh;
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
