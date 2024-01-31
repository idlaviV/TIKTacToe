import type { AIPlayer } from '@/logic/AIPlayer'
import { GameHandler } from '@/logic/GameHandler'
import type { GameSettings } from '@/logic/GameSettings'
import type { Player } from '@/logic/Player'
import { graphExport } from '@/utils/GraphExport'
import type { Edges } from 'v-network-graph'
import { type Ref, ref } from 'vue'

export type Labels = Record<string, [string, string]>

export const labelExport: Ref<Labels> = ref({})

const settings: GameSettings = GameHandler.getInstance().getSettings()
const players: [Player, Player] = [settings.getPlayer(1), settings.getPlayer(2)]
const edges: Edges = graphExport.value.edges

export function updateLabels(): void {
  let aI: AIPlayer
  if (players[0].isAI()) {
    aI = players[0] as AIPlayer
    for (const edge in edges) {
      const [source, target] = [edges[edge].source, edges[edge].target]
      const label: number = aI.getVertexMap(parseInt(source)).get(parseInt(target))!
      labelExport.value[edge][0] = label.toString()
    }
  } else {
    for (const edge in edges) {
      labelExport.value[edge][0] = ''
    }
  }

  if (players[1].isAI()) {
    aI = players[1] as AIPlayer
    for (const edge in edges) {
      const [source, target] = [edges[edge].source, edges[edge].target]
      const label: number = aI.getVertexMap(parseInt(source)).get(parseInt(target))!
      labelExport.value[edge][1] = label.toString()
    }
  } else {
    for (const edge in edges) {
      labelExport.value[edge][1] = ''
    }
  }
}
