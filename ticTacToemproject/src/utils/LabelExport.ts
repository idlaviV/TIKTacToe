import type { AIPlayer } from '@/logic/AIPlayer'
import { GameHandler } from '@/logic/GameHandler'
import { graphExport } from '@/utils/GraphExport'
import type { Edges } from 'v-network-graph'

const aI: AIPlayer = GameHandler.getInstance().settings.player2 as AIPlayer
const edges: Edges = graphExport.value.edges

export function updateLabels(): void {
  for (const edge in edges) {
    const [source, target] = [edges[edge].source, edges[edge].target]
    const label: number = aI.getVertexMap(parseInt(source)).get(parseInt(target))!
    edges[edge].label = label.toString()
  }
}
