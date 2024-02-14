import type { GraphType } from '@/components/GraphPanelUserConfigs'
import type { AIPlayer } from '@/logic/AIPlayer'
import { GameHandler } from '@/logic/GameHandler'
import type { GameSettings } from '@/logic/GameSettings'
import { Player } from '@/logic/Player'
import { graphExport } from '@/utils/GraphExport'
import { type Ref, ref } from 'vue'
import type { TTTEdges } from './Graph'

/**
 * This class holds the labels for the edges, by their id, as a tupel of two weights.
 */
export type Labels = Record<string, [string, string]>

export const labelExport: Ref<Labels> = ref({})

/**
 * Updates the labels of the edges in the graphExport. The labels are the weights of the edges,
 * for the currently active aIs. If a player is not an AI, the label is an empty string.
 */
export function updateLabels(edges: TTTEdges = graphExport.value.edges): void {
  const settings: GameSettings = GameHandler.getInstance().getSettings()
  const players: [Player, Player] = [settings.getPlayer(1), settings.getPlayer(2)]

  for (const edge in edges) {
    if (labelExport.value[edge] === undefined) {
      labelExport.value[edge] = ['', '']
    }

    for (let i = 0; i < players.length; i++) {
      if (players[i].isAI()) {
        const aI = players[i] as AIPlayer
        const source: number = edges[edge].numSource
        const target: number = edges[edge].numTarget
        const label: number = aI.getVertexMap(source).get(target)!

        labelExport.value[edge][i] = label.toString()
      } else {
        labelExport.value[edge][i] = ''
      }
    }
  }
}

/**
 * Calculates the label to show for the edge with the given id, depending on the current graph type.
 * @param edgeID The id of the edge for the label
 * @param graphType The current graph type
 */
export function getLabelToShow(edgeID: string, graphType: GraphType): string {
  const handler: GameHandler = GameHandler.getInstance()
  const currentLabels: [string, string] = labelExport.value[edgeID]
  switch (graphType) {
    case 'gameGraph':
      if (handler.getNumberOfAIs() === 0) {
        return ''
      } else {
        return graphExport.value.edges[edgeID].height % 2 === 0
          ? currentLabels[0]
          : currentLabels[1]
      }
    case 'player1Graph':
      return labelExport.value[edgeID][0]
    case 'player2Graph':
      return labelExport.value[edgeID][1]
    default:
      return ''
  }
}
