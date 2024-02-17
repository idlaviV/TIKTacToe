import type { GraphType } from '@/components/GraphPanelUserConfigs'
import type { AIPlayer } from '@/logic/AIPlayer'
import { GameHandler } from '@/logic/GameHandler'
import type { GameSettings } from '@/logic/GameSettings'
import { Player } from '@/logic/Player'
import { graphExport } from '@/utils/GraphExport'
import { type Ref, ref } from 'vue'
import type { TTTEdge, TTTEdges } from './Graph'

/**
 * This class holds the labels for the edges, by their id, as a tupel of two weights.
 */
export type Labels = Record<string, Label>

export const labelExport: Ref<Labels> = ref({})

/**
 * Updates the labels of the edges in the graphExport. The labels are the weights of the edges,
 * for the currently active aIs. If a player is not an AI, the label is an empty string.
 * @param edges The edges to be updated. If not given, the edges of the graphExport are used,
 * i.e. the labels of all edges currently visible in the graph are updated.
 * @param changedBy The index of the player that changed the labels, when evoked after an evaluation policy
 */
export function updateLabels(
  edges: TTTEdges = graphExport.value.edges,
  changedBy: number = -1
): void {
  const settings: GameSettings = GameHandler.getInstance().getSettings()
  const players: [Player, Player] = [settings.getPlayer(1), settings.getPlayer(2)]

  for (const edge in edges) {
    if (labelExport.value[edge] === undefined) {
      labelExport.value[edge] = new Label()
    }

    for (let i = 0; i < players.length; i++) {
      // Update the label if this is initialization (changedBy === -1) or if the player is an ai and the corresponding weight was changed
      if ((changedBy === -1 || (changedBy !== -1 && i === changedBy)) && players[i].isAI()) {
        const aI = players[i] as AIPlayer
        const source: number = edges[edge].numSource
        const target: number = edges[edge].numTarget
        const newLabel: number = aI.getVertexMap(source).get(target)!
        labelExport.value[edge].setLabel(i, newLabel.toString(), changedBy === i)
      } else if (!players[i].isAI()) {
        labelExport.value[edge].setLabel(i, '')
      }
    }
  }
}

/**
 * Calculates the label to show for the edge with the given id, depending on the current graph type.
 * @param edgeID The id of the edge for the label
 * @param graphType The current graph type
 * @returns The label to show for the edge
 */
export function getLabelToShow(edgeID: string, graphType: GraphType): string {
  const handler: GameHandler = GameHandler.getInstance()
  const currentLabels: string[] = labelExport.value[edgeID].labels
  switch (graphType) {
    case 'gameGraph':
      if (handler.getNumberOfAIs() === 0) {
        return ''
      } else {
        if (graphExport.value.edges[edgeID] === undefined) {
          console.log('Edge not found in graphExport: ' + edgeID)
          console.log('All edges:')
          for (const edge in graphExport.value.edges) {
            console.log(edge)
          }
        }
        return graphExport.value.edges[edgeID].height % 2 === 0
          ? currentLabels[0]
          : currentLabels[1]
      }
    case 'player1Graph':
      return currentLabels[0]
    case 'player2Graph':
      return currentLabels[1]
    default:
      return ''
  }
}

/**
 * This class represents the labels of an edge.
 */
export class Label {
  // The labels of the edge. Contains two entries, the label for player 1 and player 2.
  labels: string[]
  // Whether the first label has changed due to an evaluation policy
  label1Changed: boolean = false
  // Whether the second label has changed due to an evaluation policy
  label2Changed: boolean = false

  constructor(labels: string[] = ['', '']) {
    this.labels = labels
  }

  /**
   * Sets the label of the given index to the given value.
   * @param index The index of the label to set
   * @param label The value to set the label to
   * @param changed Whether the label has changed due to an evaluation policy
   */
  setLabel(index: number, label: string, changed: boolean = false): void {
    if (index < 0 || index > this.labels.length) {
      throw new Error('Index out of bounds')
    }
    this.labels[index] = label
    if (index === 0) {
      this.label1Changed = changed
    } else if (index === 1) {
      this.label2Changed = changed
    }
  }
}
