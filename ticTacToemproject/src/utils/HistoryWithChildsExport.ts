import { ref, type Ref } from 'vue'
import { GameBoard, type FieldType } from '../logic/GameBoard'
import { type Nodes, type Edges } from 'v-network-graph'
import { HistoryExport } from './HistoryExport'
import { GameHandler } from '@/logic/GameHandler'
import type { forEachChild } from 'typescript'

export class HistoryWithChildsExport {
  nodes: Ref<Nodes> = ref({})
  edges: Ref<Edges> = ref({})
  lastCode: string = 'NotInitialized'
  historyExport: HistoryExport

  constructor(historyExport: HistoryExport) {
    this.historyExport = historyExport
    this.copyHistoryWithoutChilds()
    //this.addChilds() //Das muss eigentlich rein, damit direkt die ersten möglichen Kinder angezeigt werden
  }

  updateHistory(gameBoard: GameBoard) {
    this.historyExport.updateHistory(gameBoard)
    this.copyHistoryWithoutChilds()
    this.addChilds()
  }

  resetHistory(gameBoard: GameBoard) {
    this.historyExport.resetHistory(gameBoard)
    this.copyHistoryWithoutChilds()
    this.addChilds()
  }

  addChilds() {
    //hier muss ne effektivere Methode rein
    Object.keys(this.nodes.value).forEach((element) => {
      if (this.nodes.value[element].active === true) {
        const activeGameBoardCode: string = element
      }
    })
    
    const childsOfActiveGameBoard = GameHandler.getInstance()
      .getPossibleNextPositions()

    for (let index = 0; index < childsOfActiveGameBoard.length; index++) {
      let newCode: string = childsOfActiveGameBoard[index].getCode().toString()
      this.nodes.value[newCode] = { name: newCode, boardState: childsOfActiveGameBoard[index].state, active: false }
      const key: string = this.lastCode + '#' + newCode
      this.edges.value[key] = { source: this.lastCode, target: newCode }
    }
  }

  copyHistoryWithoutChilds() {
    this.nodes.value = this.historyExport.getNodes().value
    this.edges.value = this.historyExport.getEdges().value
    this.lastCode = this.historyExport.getLastCode()
  }

  getNodes(): Ref<Nodes> {
    return this.nodes
  }

  getEdges(): Ref<Edges> {
    return this.edges
  }
}
