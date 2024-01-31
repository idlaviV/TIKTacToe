import type { AIPlayer } from '@/logic/AIPlayer'
import { GameHandler } from '@/logic/GameHandler'
import type { GameSettings } from '@/logic/GameSettings'
import type { Player } from '@/logic/Player'
import { graphExport } from '@/utils/GraphExport'
import type { Edges } from 'v-network-graph'
import { type Ref, ref } from 'vue'

export type Labels = Record<string, [string, string]>

export const labelExport: Ref<Labels> = ref({})

export function updateLabels(): void {
  const settings: GameSettings = GameHandler.getInstance().getSettings()
  const players: [Player, Player] = [settings.getPlayer(1), settings.getPlayer(2)]
  const edges: Edges = graphExport.value.edges
  let aI: AIPlayer
  
  for (const edge in edges) {
    labelExport.value[edge] = ['', '']
    for (let i = 0; i < players.length; i++) {
      if (players[i].isAI()) {
        aI = players[i] as AIPlayer
        const [source, target] = [edges[edge].source, edges[edge].target]
        const label: number = aI.getVertexMap(parseInt(source)).get(parseInt(target))!
        labelExport.value[edge][i] = label.toString()
      }
    }
  }
}
