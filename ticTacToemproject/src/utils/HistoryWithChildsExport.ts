import { ref, type Ref } from 'vue'
import { GameBoard, type FieldType } from '../logic/GameBoard'
import { type Nodes, type Edges } from 'v-network-graph'
import { HistoryExport } from './HistoryExport'
import { GameHandler } from '@/logic/GameHandler'
import { IsomorphismGroup } from '@/logic/IsomorphismGroup'

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
    this.deleteChilds()
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
    
    const childsOfActiveGameBoard = GameHandler.getInstance().getPossibleNextPositions()
    
    const representativesOfNonequivalentGameBoards = IsomorphismGroup.getRepresentativesOfNonequivalentGameBoards(childsOfActiveGameBoard)
    
    const representativeGameBoards: GameBoard[] = []
    childsOfActiveGameBoard.forEach(element => {
      if (representativesOfNonequivalentGameBoards.includes(element.getCode())) {
        representativeGameBoards.push(element)
      }
    });


    for (let index = 0; index < representativeGameBoards.length; index++) {
      let newCode: string = representativeGameBoards[index].getCode().toString()
      this.nodes.value[newCode] = { name: newCode, boardState: representativeGameBoards[index].state, active: false, isChild: true }
      const key: string = this.lastCode + '#' + newCode
      this.edges.value[key] = { source: this.lastCode, target: newCode }
    }
  }

  copyHistoryWithoutChilds() {
    this.nodes.value = this.historyExport.getNodes().value
    this.edges.value = this.historyExport.getEdges().value
    this.lastCode = this.historyExport.getLastCode()
  }

  deleteChilds() {
    Object.keys(this.edges.value).forEach((element) => {
      if (this.nodes.value[this.edges.value[element].source].isChild || this.nodes.value[this.edges.value[element].target].isChild) {
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
