import { GameBoard } from '@/logic/GameBoard'
import { GameHandler } from '@/logic/GameHandler'

export function resetGameHandler() {
  GameHandler.getInstance().destroySingleton()
}

export let maxFromAI: number
export function debugRandomizerFactory() {
  return {
    randomNumber: 0,
    maxFromAI,
    randomInteger(min: number, max: number) {
      if (min != 1) {
        throw new Error('Illegal use of randomizer')
      }
      maxFromAI = max
      return this.randomNumber
    },
    setRandomNumber(number: number) {
      this.randomNumber = number
    }
  }
}

export const gameBoard21 = new GameBoard([
  [1, 2, 0],
  [0, 0, 0],
  [0, 0, 0]
])
export const gameBoard120 = new GameBoard([
  [0, 2, 1],
  [0, 0, 0],
  [0, 0, 0]
])
export const gameBoard2100 = new GameBoard([
  [0, 0, 1],
  [2, 0, 0],
  [0, 0, 0]
])
