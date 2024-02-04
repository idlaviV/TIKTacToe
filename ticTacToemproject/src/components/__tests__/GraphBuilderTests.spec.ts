
import { AIPlayer } from "@/logic/AIPlayer";
import { EliminationPolicy } from "@/logic/EliminationPolicy";
import { GameHandler } from "@/logic/GameHandler";
import { buildGraph, getEdges, getNodes, resetBuilder } from "@/logic/GraphBuilder";
import { test ,describe, expect, beforeEach} from "vitest";
import { gameBoard1, gameBoard2100 } from "./TestUtil";
import { GameBoard } from "@/logic/GameBoard";

describe('build graph',()=>{
    beforeEach(()=>{
        GameHandler.getInstance()
        resetBuilder()
        const ai : AIPlayer = new AIPlayer(new EliminationPolicy, "ai")
        buildGraph(ai)
    })
    test('graph contains child of early gameboard',()=>{
        const board = gameBoard1
        const child = new GameBoard([[1,0,0],[0,0,0],[0,2,0]])
        testForBoards(board, child)
    })
    test('graph contains child of later gameboard',()=>{
        const board = gameBoard2100
        const child = new GameBoard([
            [0, 0, 1],
            [2, 0, 1],
            [0, 0, 0]
          ])
        testForBoards(board, child)
        
    })
    test('graph contains child of complex gameboard',()=>{
        const board = new GameBoard([
            [1, 2, 1],
            [2, 0, 1],
            [0, 2, 0]
          ])
        const child = new GameBoard([
            [1, 2, 1],
            [2, 1, 1],
            [0, 2, 0]
          ])
        testForBoards(board, child)
    })
})

function testForBoards(parent:GameBoard, child:GameBoard) {
        const nf1 = parent.getNormalForm().toString()
        const nf2 = child.getNormalForm().toString()
        const edgeKey = nf1 + "#" + nf2
        expect(nf1 in getNodes()).toBeTruthy()
        expect(nf2 in getNodes()).toBeTruthy()
        expect(edgeKey in getEdges()).toBeTruthy()
}