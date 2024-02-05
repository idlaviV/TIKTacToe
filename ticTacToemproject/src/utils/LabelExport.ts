import type { GraphType } from '@/components/GraphPanelUserConfigs'
import type { AIPlayer } from '@/logic/AIPlayer'
import { GameHandler } from '@/logic/GameHandler'
import type { GameSettings } from '@/logic/GameSettings'
import type { Player } from '@/logic/Player'
import { graphExport, type TTTEdges } from '@/utils/GraphExport'
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
  const edges: TTTEdges = graphExport.value.edges

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
        if (labelExport.value[edge][i] !== label.toString()) {
          labelExport.value[edge][i] = label.toString()
        }
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
  if (graphType === 'gameGraph') {
    const handler: GameHandler = GameHandler.getInstance()
    const currentLabels: [string, string] = labelExport.value[edgeID]
    if (handler.getNumberOfAIs() === 0) {
      return ''
    } else if (handler.getNumberOfAIs() === 1) {
      return handler.getSettings().getPlayer(1).isAI() ? currentLabels[0] : currentLabels[1]
    } else {
      return graphExport.value.edges[edgeID].height % 2 === 0 ? currentLabels[0] : currentLabels[1]
    }
  } else if (graphType === 'player1Graph') {
    return labelExport.value[edgeID][0]
  } else if (graphType === 'player2Graph') {
    return labelExport.value[edgeID][1]
  }
  return ''
}
