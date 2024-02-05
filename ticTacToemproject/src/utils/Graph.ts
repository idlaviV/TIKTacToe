import type { GameBoardCode } from "@/logic/Codes"
import type { FieldType } from "@/logic/FieldType"
import type { Edges , Node, Nodes} from "v-network-graph"

export class Graph {
    nodes: TTTNodes = {}
    edges: Edges = {}
  }

  export type TTTNodes = Nodes & { [key: string]: TTTNode }
/**
 * This class is a model for the visualization of a game configuration in the graph.
 */
export class TTTNode implements Node {
  // A string representation of the code of the gameboard that is visualized by this node.
  name: string
  // The code of the gameboard that is visualized by this node.
  code: GameBoardCode
  // The state of the gameboard that is visualized by this node.
  boardState: FieldType[][]
  // Whether this node is just an intermediate leaf in the graph.
  isChild: boolean
  // The level of the node in the graph. The root element has level 0.
  level: number
  // All alternative gameboards that could be played, equivalent to the gameboard that is visualized by this node.
  alternatives: FieldType[][][] = []

  constructor(
    code: GameBoardCode,
    boardState: FieldType[][],
    level: number,
    isChild: boolean = false,
    alternatives: FieldType[][][] = []
  ) {
    this.name = code.toString()
    this.code = code
    this.boardState = boardState
    this.level = level
    this.isChild = isChild
    this.alternatives = alternatives
  }
}