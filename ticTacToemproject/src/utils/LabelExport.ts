import type { GraphType } from '@/components/GraphPanelUserConfigs'
import type { AIPlayer } from '@/logic/AIPlayer'
import { GameHandler } from '@/logic/GameHandler'
import type { GameSettings } from '@/logic/GameSettings'
import { Player } from '@/logic/Player'
import { graphExport } from '@/utils/GraphExport'
import { type Ref, ref } from 'vue'
import type { TTTEdges } from './Graph'
import { getGuiState } from '@/logic/GuiState'

/**
 * This class holds the labels for the edges, by their id, as a tupel of two weights.
 */
export type Labels = Record<string, Label>

export const labelExport: Ref<Labels> = ref({})

/**
 * Updates the labels of the edges in the graphExport. The labels are the weights of the edges,
 * for the currently active aIs. If a player is not an AI, the label is an empty string.
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
      if (players[i].isAI()) {
        const aI = players[i] as AIPlayer
        const source: number = edges[edge].numSource
        const target: number = edges[edge].numTarget
        const label: number = aI.getVertexMap(source).get(target)!
        if (getGuiState().value === 'evaluation') {
          console.log('edges ' + edges)
          console.log('edgeSource ' + edges[edge].source + ' edgeTarget ' + edges[edge].target)
          console.log('label ' + label)
        }
        labelExport.value[edge].setLabel(i, label.toString(), changedBy === i)
      } else {
        labelExport.value[edge].setLabel(i, '')
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
  const currentLabels: string[] = labelExport.value[edgeID].labels
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
      return currentLabels[0]
    case 'player2Graph':
      return currentLabels[1]
    default:
      return ''
  }
}

export class Label {
  labels: string[]
  label1Changed: boolean = false
  label2Changed: boolean = false

  constructor(labels: string[] = ['', '']) {
    this.labels = labels
  }

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
