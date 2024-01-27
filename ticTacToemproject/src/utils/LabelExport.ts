import type { AIPlayer } from '@/logic/AIPlayer'
import { GameHandler } from '@/logic/GameHandler'
import { type Graph, graphExport } from '@/utils/GraphExport'

const aI: AIPlayer = GameHandler.getInstance().settings.player2 as AIPlayer
const graph: Graph = graphExport.value

export function updateLabels(): void {
  for (const edge in graph.edges) {
    const [source, target] = edge.split('#')
    const label: number = aI.getVertexMap(parseInt(source)).get(parseInt(target))!
    graph.edges[edge].label = label.toString()
  }
}
