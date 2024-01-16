import { ref, type Ref } from 'vue'
import { GameBoard, type FieldType } from '../logic/GameBoard'
import { type Nodes, type Edges } from 'v-network-graph'
import { HistoryExport } from './HistoryExport'
import { GameHandler } from '@/logic/GameHandler'
import { IsomorphismGroup } from '@/logic/IsomorphismGroup'

export class HistoryWithChildrenExport {
  nodes: Ref<Nodes> = ref({})
  edges: Ref<Edges> = ref({})
  lastCode: string = 'NotInitialized'
  historyExport: HistoryExport

  constructor(historyExport: HistoryExport) {
    this.historyExport = historyExport
  }

  initialize() {
    this.nodes.value = this.historyExport.getNodes().value
    this.edges.value = this.historyExport.getEdges().value
    this.lastCode = this.historyExport.getLastCode()
    this.addChildren()
  }

  updateHistory(gameBoard: GameBoard) {
    this.deleteChildren()
    this.historyExport.updateHistory(gameBoard)
    this.lastCode = this.historyExport.getLastCode()
    this.addChildren()
  }

  resetHistory(gameBoard: GameBoard) {
    this.historyExport.resetHistory(gameBoard)
    this.lastCode = this.historyExport.getLastCode()
    this.addChildren()
  }

  addChildren() {
    const childrenOfActiveGameBoard = GameHandler.getInstance().getPossibleNextPositions()
    const representativesOfNonequivalentGameBoards =
      IsomorphismGroup.getRepresentativesOfNonequivalentGameBoards(childrenOfActiveGameBoard)
    const representativeGameBoards: GameBoard[] = []
    childrenOfActiveGameBoard.forEach((element) => {
      if (representativesOfNonequivalentGameBoards.includes(element.getCode())) {
        representativeGameBoards.push(element)
      }
    })

    for (let index = 0; index < representativeGameBoards.length; index++) {
      let newCode: string = representativeGameBoards[index].getCode().toString()
      this.nodes.value[newCode] = {
        name: newCode,
        boardState: representativeGameBoards[index].state,
        active: false,
        isChild: true
      }
      const key: string = this.lastCode + '#' + newCode
      this.edges.value[key] = { source: this.lastCode, target: newCode }
    }
  }

  deleteChildren() {
    Object.keys(this.edges.value).forEach((element) => {
      if (
        this.nodes.value[this.edges.value[element].source].isChild ||
        this.nodes.value[this.edges.value[element].target].isChild
      ) {
        delete this.edges.value[element]
      }
    })

    Object.keys(this.nodes.value).forEach((element) => {
      if (this.nodes.value[element].isChild) {
        delete this.nodes.value[element]
      }
    })
  }

  getNodes(): Ref<Nodes> {
    return this.nodes
  }

  getEdges(): Ref<Edges> {
    return this.edges
  }
}
