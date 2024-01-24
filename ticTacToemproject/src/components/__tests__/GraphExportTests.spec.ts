import type { FieldType } from "@/logic/FieldType";
import { GameBoard } from "@/logic/GameBoard";
import { GameHandler } from "@/logic/GameHandler";
import { TTTNode, activeNode, edges, nodes } from "@/utils/GraphExport";
import type { Nodes } from "v-network-graph";
import { beforeEach, describe, expect, test } from "vitest";
import { gameBoard1, gameBoard10, gameBoard10000 } from "./TestUtil";

beforeEach(()=>{
    GameHandler.getInstance()
})

describe('constructor', () => {
    test('standard constructor use', () => {
    expect(Object.keys(nodes.value).length).toEqual(4)
      checkNode(nodes.value["0"], "0", new GameBoard().state, 0)
      checkNode(nodes.value["1"], "1", gameBoard1.state, 1)
      checkNode(nodes.value["10"], "10", gameBoard10.state, 1)
      checkNode(nodes.value["10000"], "10000", gameBoard10000.state, 1)
      expect(Object.keys(edges.value).length).toEqual(3)
    })
  })

function checkNode(node:any, name:string, boardState: FieldType[][], level:number) {
    expect(node.name).toEqual(name)
    expect(node.boardState).toEqual(boardState)
    expect(node.level).toEqual(level)
}