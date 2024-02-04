
import { AIPlayer } from "@/logic/AIPlayer";
import { EliminationPolicy } from "@/logic/EliminationPolicy";
import { GameHandler } from "@/logic/GameHandler";
import { buildGraph, getEdges, getNodes, resetBuilder } from "@/logic/GraphBuilder";
import { test ,describe, expect} from "vitest";
import { gameBoard1, gameBoard2100 } from "./TestUtil";
import { beforeEach } from "node:test";
import { GameBoard } from "@/logic/GameBoard";

describe('build graph',()=>{
    beforeEach(()=>{
        GameHandler.getInstance()
        resetBuilder()
        const ai : AIPlayer = new AIPlayer(new EliminationPolicy, "ai")
        buildGraph(ai)
    })
    test('graph contains child of gameboard',()=>{
        const board = gameBoard1
        const child = new GameBoard([[1,0,0],[0,0,0],[0,2,0]])
        console.log(getNodes())
        testForBoards(board, child)
    })
    test('graph contains some specific nodes and edges',()=>{
        const board = gameBoard2100
        const child = new GameBoard([
            [0, 0, 1],
            [2, 0, 1],
            [0, 0, 0]
          ])
        testForBoards(board, child)
        
    })
})

function testForBoards(parent:GameBoard, child:GameBoard) {
        const nf1 = parent.getNormalForm().toString()
        const nf2 = child.getNormalForm().toString()
        const edgeKey = nf1 + "#" + nf2
        console.log(getNodes()[nf1])
        expect(getNodes()[nf1].level).toEqual(2)
        expect(getNodes()[nf2].level).toEqual(3)
        expect(edgeKey in getEdges()).toBeTruthy()
}