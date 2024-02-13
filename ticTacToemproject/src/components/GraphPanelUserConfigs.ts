import { getGameBoardFromCode } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'
import type { TTTEdge } from '@/utils/Graph'
import { getLabelToShow } from '@/utils/LabelExport'
import { defineConfigs, type UserConfigs } from 'v-network-graph'
import { type Ref, ref } from 'vue'

export const currentGraphType: Ref<GraphType> = ref('simpleGraph')

export type GraphType = 'simpleGraph' | 'gameGraph' | 'player1Graph' | 'player2Graph'

export function initializeConfig(graphType: GraphType): UserConfigs {
  currentGraphType.value = graphType
  const configs: UserConfigs = defineConfigs({
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
        dasharray: (edge) => getDash(edge as TTTEdge, graphType),
        color: '#aaa',
        width: (edge) => getHighlighted(edge as TTTEdge, graphType)
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
        color: (edge) => getLabelColor(edge as TTTEdge, graphType),
        fontSize: 15,
        background: {
          visible: false
        }
      }
    }
  })

  return configs
}

function getHighlighted(edge: TTTEdge, graphType: GraphType): number {
  const history = GameHandler.getInstance().getGBHandler().history
  if (graphType !== 'gameGraph') {
    return history.includes(getGameBoardFromCode(edge.numTarget)) &&
      history.includes(getGameBoardFromCode(edge.numSource))
      ? 5
      : 2
  } else {
    return 2
  }
}

function getDash(edge: TTTEdge, graphType: GraphType) {
  const dashed = '4'
  const continuous = '0'

  return getLabelToShow(edge.id, graphType) === '0' ? dashed : continuous
}

function getLabelColor(edge: TTTEdge, graphType: GraphType): string {
  const simpleColor = '#aaa'
  const player1Color = '#ec4899'
  const player2Color = '#3b82f6'
  const historyColor = '#ff3131'
  const changedColor = '#47f352'

  if (getHighlighted(edge, graphType) !== 2 && graphType !== 'gameGraph') {
    return historyColor
  } else if (edge.changed) {
    return changedColor
  }

  if (graphType === 'simpleGraph') {
    return simpleColor
  } else if (graphType === 'player1Graph') {
    return player1Color
  } else if (graphType === 'player2Graph') {
    return player2Color
  } else {
    return edge.height % 2 === 0 ? player1Color : player2Color
  }
}
