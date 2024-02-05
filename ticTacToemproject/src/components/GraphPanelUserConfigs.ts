import { labelExport } from '@/utils/LabelExport'
import { defineConfigs, type Edge, type UserConfigs } from 'v-network-graph'
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
        dasharray: (edge) => (labelExport.value[edge.id][1] === '0' ? '4' : '0'),
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
        color: (edge) => getLabelColor(edge, graphType),
        fontSize: 15,
        background: {
          visible: false
        }
      }
    }
  })

  return configs
}

function getLabelColor(edge: Edge, graphType: GraphType) {
  const simpleColor = '#aaa'
  const player1Color = '#ec4899'
  const player2Color = '#3b82f6'

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
