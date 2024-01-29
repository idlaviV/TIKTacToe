import type { AIPlayer } from '@/logic/AIPlayer'
import { GameHandler } from '@/logic/GameHandler'
import type { Player } from '@/logic/Player'
import { graphExport } from '@/utils/GraphExport'
import type { Edges } from 'v-network-graph'

const players: [Player, Player] = [GameHandler.getInstance().settings.getPlayer(1), GameHandler.getInstance().settings.getPlayer(2)]
const edges: Edges = graphExport.value.edges

export function updateLabels(): void {
  let aI: AIPlayer
  if (players[0].isAI()) {
    console.log(players[0])
    aI = players[0] as AIPlayer
  } else if (players[1].isAI()) {
    console.log(players[1])
    aI = players[1] as AIPlayer
  } else {
    return
  }
  console.log(aI)
  for (const edge in edges) {
    const [source, target] = [edges[edge].source, edges[edge].target]
    const label: number = aI.getVertexMap(parseInt(source)).get(parseInt(target))!
    edges[edge].label = label.toString()
  }
}
