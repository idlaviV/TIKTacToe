import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { getGuiState } from '@/logic/GuiState'
import * as Colors from '@/utils/Colors'
import type { TTTEdge } from '@/utils/Graph'
import { getLabelToShow, labelExport } from '@/utils/LabelExport'
import { defineConfigs, type UserConfigs } from 'v-network-graph'
import { type Ref, ref } from 'vue'
import { continuous, dashed, highlightedWidth, normalWidth } from './GraphConstants'

export const currentGraphType: Ref<GraphType> = ref('simpleGraph')

export type GraphType = 'simpleGraph' | 'gameGraph' | 'player1Graph' | 'player2Graph'

export const graphPanelUserConfigs: UserConfigs = defineConfigs({
  view: {
    panEnabled: true,
    zoomEnabled: false,
    scalingObjects: true,
    autoPanAndZoomOnLoad: 'center-zero',
    autoPanOnResize: true
  },
  node: {
    selectable: false,
    draggable: false,
    normal: {
      type: 'rect',
      borderRadius: 0,
      width: 65,
      height: 65
    },
    label: {
      visible: false
    }
  },
  edge: {
    normal: {
      dasharray: (edge) => getDash(edge as TTTEdge),
      color: Colors.simpleColor,
      width: (edge) => getHighlighted(edge as TTTEdge)
    },
    margin: 4,
    marker: {
      target: {
        type: 'arrow',
        width: 4,
        height: 4
      }
    },
    label: {
      color: (edge) => getLabelColor(edge as TTTEdge),
      fontSize: 15,
      background: {
        visible: false
      }
    },
    selectable: false,
    hover: {
      dasharray: (edge) => getDash(edge as TTTEdge),
      color: Colors.simpleColor,
      width: (edge) => getHighlighted(edge as TTTEdge)
    }
  }
})

export const isPlayer2Graph = ref<boolean>(false)

export function setCurrentGraphType(graphType: GraphType): void {
  currentGraphType.value = graphType
}

/**
 * This method returns the width of the edge, depending on the current graph type and if the edge is part of the history.
 * @param edge The edge to get the highlighted width for
 */
function getHighlighted(edge: TTTEdge): number {
  if (currentGraphType.value !== 'gameGraph') {
    return isPartOfHistory(edge.numSource, edge.numTarget) ? highlightedWidth : normalWidth
  } else {
    return normalWidth
  }
}

/**
 * This method returns the dash for the edge, depending on wether the label is 0 or not.
 * @param edge The edge to get the dash for
 */
function getDash(edge: TTTEdge) {
  return getLabelToShow(edge.id, currentGraphType.value) === '0' ? dashed : continuous
}

/**
 * This method returns the color for the label of the edge.
 * @param edge The edge to get the label color for
 */
function getLabelColor(edge: TTTEdge): string {
  const graphType = currentGraphType.value

  if (getGuiState().value === 'evaluation' && isPartOfHistory(edge.numSource, edge.numTarget)) {
    return Colors.historyColor
  } else if (getGuiState().value === 'postevaluation') {
    if (
      (labelExport.value[edge.id].label1Changed && graphType === 'player1Graph') ||
      (labelExport.value[edge.id].label2Changed && graphType === 'player2Graph')
    ) {
      return Colors.changedColor
    }
  }

  switch (graphType) {
    case 'gameGraph':
      return edge.height % 2 === 0 ? Colors.player1Color : Colors.player2Color
    case 'player1Graph':
      return Colors.player1Color
    case 'player2Graph':
      return Colors.player2Color
    default:
      return Colors.simpleColor
  }
}

/**
 * This method checks if the edge with the given source and target is part of the history.
 * @param source The source of the edge
 * @param target The target of the edge
 */
function isPartOfHistory(source: number, target: number): boolean {
  const history: GameBoard[] = GameHandler.getInstance().getGBHandler().getHistory()
  for (let i = 0; i < history.length - 1; i++) {
    if (history[i].getNormalForm() === source && history[i + 1].getNormalForm() === target) {
      return true
    }
  }
  return false
}

export const configsExplainGraph = defineConfigs({
  view: {
    panEnabled: false,
    zoomEnabled: false,
    scalingObjects: true,
    autoPanAndZoomOnLoad: 'center-zero',
    autoPanOnResize: true
  },
  node: {
    selectable: false,
    draggable: false,
    normal: {
      type: 'rect',
      borderRadius: 0,
      width: 65,
      height: 65
    },
    label: {
      visible: false
    }
  },
  edge: {
    normal: {
      dasharray: (edge) => {if (edge.id === '0#1'){return dashed} else {return continuous}},
      color: Colors.simpleColor,
      width: () => normalWidth
    },
    margin: 4,
    marker: {
      target: {
        type: 'arrow',
        width: 4,
        height: 4
      }
    },
    label: {
      color: () => Colors.player2Color,
      fontSize: 15,
      background: {
        visible: false
      }
    },
    selectable: false,
    hover: {
      dasharray: (edge) => {if (edge.id === '0#1'){return dashed} else {return continuous}},
      color: Colors.simpleColor,
      width: () => normalWidth
    }
  }
})
