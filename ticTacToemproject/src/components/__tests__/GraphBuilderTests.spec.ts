import { GameHandler } from "@/logic/GameHandler";
import { GraphBuilder, getBigGraph, resetBuilder } from "@/logic/GraphBuilder";
import { test ,describe, expect, beforeEach} from "vitest";
import { gameBoard1, gameBoard2100 } from "./TestUtil";
import { GameBoard } from "@/logic/GameBoard";

describe('build graph',()=>{
    beforeEach(()=>{
        GameHandler.getInstance()
        resetBuilder()
        const builder: GraphBuilder = new GraphBuilder()
        builder.buildGraph()
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
        const graph = getBigGraph()
        expect(nf1 in graph.nodes).toBeTruthy()
        expect(nf2 in graph.nodes).toBeTruthy()
        expect(edgeKey in graph.edges).toBeTruthy()
}