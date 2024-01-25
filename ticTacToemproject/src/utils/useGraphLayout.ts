import dagre from '@dagrejs/dagre'
import type { Edges, Layouts, Nodes } from 'v-network-graph'
import * as gc from '@/components/GraphConstants'


/**
 * Places the nodes of the graph for a TopDown layout.
 * @param nodes The nodes of the graph
 * @param edges The edges of the graph
 * @param layouts The layout of the graph
 * @returns The last added node of the graph
 */
export function layout(nodes: Nodes, edges: Edges, layouts: Layouts): string {
  let activeNode: string = '0'
  const g = new dagre.graphlib.Graph()
  g.setGraph({
    rankdir: 'TB',
    nodesep: gc.nodesep,
    edgesep: gc.edgesep,
    ranksep: gc.ranksep
  })
  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(() => ({}))

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each of
  // our nodes.
  Object.entries(nodes).forEach(([nodeId, node]) => {
    g.setNode(nodeId, { label: node.name, width: gc.nodeSize, height: gc.nodeSize })
    if (node.active && node.name !== undefined) {
      activeNode = node.name
    }
  })

  // Add edges to the graph.
  Object.values(edges).forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  g.nodes().forEach((nodeId: string) => {
    // update node position
    const x = g.node(nodeId).x
    const y = g.node(nodeId).y
    layouts.nodes[nodeId] = { x, y }
  })
  return activeNode
}
