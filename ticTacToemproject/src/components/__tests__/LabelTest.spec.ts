import { AIPlayer } from "@/logic/AIPlayer"
import { EliminationPolicy } from "@/logic/EliminationPolicy"
import { GameHandler } from "@/logic/GameHandler"
import { graphExport, initializeHistory } from "@/utils/GraphExport"
import test from "node:test"
import { describe, expect } from "vitest"

describe('updateLabel', () => {
  test('first', () => {
    console.log(graphExport.value.edges)
    const aI = new AIPlayer(new EliminationPolicy(), 'KI-Elimination')
    GameHandler.getInstance().settings.player2 = aI
    initializeHistory()
    GameHandler.getInstance().performTurn(0, 0)
    GameHandler.getInstance().performAiTurn()
    console.log(aI.getVertexMap(0))
    console.log(aI.weights)
    console.log(graphExport.value.edges)
    expect(aI.isAI()).toBeTruthy()
  })
})
