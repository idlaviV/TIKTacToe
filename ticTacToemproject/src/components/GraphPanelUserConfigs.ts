import { defineConfigs, type UserConfigs } from 'v-network-graph'
export const configs: UserConfigs = defineConfigs({
  view: {
    panEnabled: true,
    zoomEnabled: true,//for debugging purposes @todo
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
    }
  }
})
