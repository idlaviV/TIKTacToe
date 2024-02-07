import type { AIPlayer } from '@/logic/AIPlayer'
import { GameHandler } from '@/logic/GameHandler'
import type { GameSettings } from '@/logic/GameSettings'
import { Player } from '@/logic/Player'
import { graphExport } from '@/utils/GraphExport'
import type { Edges } from 'v-network-graph'
import { type Ref, ref } from 'vue'

/**
 * This class holds the labels for the edges, by their id, as a tupel of two weights.
 */
export type Labels = Record<string, [string, string]>

export const labelExport: Ref<Labels> = ref({})

/**
 * Updates the labels of the edges in the graphExport. The labels are the weights of the edges,
 * for the currently active aIs. If a player is not an AI, the label is an empty string.
 */
export function updateLabels(): void {
  const settings: GameSettings = GameHandler.getInstance().getSettings()
  const players: [Player, Player] = [settings.getPlayer(1), settings.getPlayer(2)]
  const edges: Edges = graphExport.value.edges

  for (const edge in edges) {
    labelExport.value[edge] = ['', '']
    for (let i = 0; i < players.length; i++) {
      if (players[i].isAI()) {
        const aI = players[i] as AIPlayer
        const [source, target] = [edges[edge].source, edges[edge].target]
        const label: number = aI.getVertexMap(parseInt(source)).get(parseInt(target))!
        labelExport.value[edge][i] = label.toString()
      }
    }
  }
}
