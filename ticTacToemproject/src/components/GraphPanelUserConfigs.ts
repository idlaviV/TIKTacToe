import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import { getGuiState } from '@/logic/GuiState'
import type { TTTEdge } from '@/utils/Graph'
import { getLabelToShow, labelExport } from '@/utils/LabelExport'
import { defineConfigs, type UserConfigs } from 'v-network-graph'
import { type Ref, ref } from 'vue'

export const currentGraphType: Ref<GraphType> = ref('simpleGraph')

export type GraphType = 'simpleGraph' | 'gameGraph' | 'player1Graph' | 'player2Graph'

export const graphPanelUserConfigs: UserConfigs = defineConfigs({
  view: {
    panEnabled: true,
    zoomEnabled: true, //for debugging purposes @todo
    scalingObjects: true,
    autoPanAndZoomOnLoad: 'center-zero',
    autoPanOnResize: false
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
      color: '#aaa',
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
      color: '#aaa',
      width: (edge) => getHighlighted(edge as TTTEdge)
    }
  }
})

export const isPlayer2Graph = ref<boolean>(false)

export function setCurrentGraphType(graphType: GraphType): void {
  currentGraphType.value = graphType
}

function getHighlighted(edge: TTTEdge): number {
  if (currentGraphType.value !== 'gameGraph') {
    return isPartOfHistory(edge.numSource, edge.numTarget) ? 5 : 2
  } else {
    return 2
  }
}

function getDash(edge: TTTEdge) {
  const dashed = '4'
  const continuous = '0'

  return getLabelToShow(edge.id, currentGraphType.value) === '0' ? dashed : continuous
}

function getLabelColor(edge: TTTEdge): string {
  const simpleColor = '#aaa'
  const player1Color = '#ec4899'
  const player2Color = '#3b82f6'
  const historyColor = '#ff3131'
  const changedColor = '#47f352'

  const graphType = currentGraphType.value

  if (getGuiState().value === 'evaluation' && isPartOfHistory(edge.numSource, edge.numTarget)) {
    return historyColor
  } else if (getGuiState().value === 'postevaluation') {
    if (
      (labelExport.value[edge.id].label1Changed && graphType === 'player1Graph') ||
      (labelExport.value[edge.id].label2Changed && graphType === 'player2Graph')
    ) {
      return changedColor
    }
  }

  switch (graphType) {
    case 'gameGraph':
      return edge.height % 2 === 0 ? player1Color : player2Color
    case 'player1Graph':
      return player1Color
    case 'player2Graph':
      return player2Color
    default:
      return simpleColor
  }
}

function isPartOfHistory(source: number, target: number): boolean {
  const history: GameBoard[] = GameHandler.getInstance().getGBHandler().getHistory()
  for (let i = 0; i < history.length - 1; i++) {
    if (history[i].getNormalForm() === source && history[i + 1].getNormalForm() === target) {
      return true
    }
  }
  return false
}
