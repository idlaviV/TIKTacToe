import { getLabelToShow } from '@/utils/LabelExport'
import { defineConfigs, type Edge, type UserConfigs } from 'v-network-graph'
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
      dasharray: (edge) => getDash(edge),
      color: '#aaa',
      width: 2
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
      color: (edge) => getLabelColor(edge),
      fontSize: 15,
      background: {
        visible: false
      }
    }
  }
})

export const isPlayer2Graph = ref<boolean>(false)

export function setCurrentGraphType(graphType: GraphType):void {
  currentGraphType.value = graphType
}

function getDash(edge: Edge) {
  const graphType = currentGraphType.value
  const dashed = '4'
  const continuous = '0'

  return getLabelToShow(edge.source + '#' + edge.target, graphType) === '0' ? dashed : continuous
}

function getLabelColor(edge: Edge) {
  const simpleColor = '#aaa'
  const player1Color = '#ec4899'
  const player2Color = '#3b82f6'

  const graphType = currentGraphType.value

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
