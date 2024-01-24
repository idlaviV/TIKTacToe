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

export const gameBoard1 = new GameBoard([
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
])

export const gameBoard1rot = new GameBoard([
  [0, 0, 1],
  [0, 0, 0],
  [0, 0, 0]
])

export const gameBoard1rot2 = new GameBoard([
  [0, 0, 0],
  [0, 0, 0],
  [1, 0, 0]
])

export const gameBoard1rot3 = new GameBoard([
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 1]
])

export const gameBoard10 = new GameBoard([
  [0, 1, 0],
  [0, 0, 0],
  [0, 0, 0]
])

export const gameBoard10000 = new GameBoard([
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0]
])

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

export const gameBoardDraw = new GameBoard([
  [1, 1, 2],
  [2, 2, 1],
  [1, 2, 1]
])

export const gameBoardWinPlayer1 = new GameBoard([
  [1, 1, 1],
  [2, 2, 0],
  [0, 0, 0]
])

export const gameBoardWinPlayer2 = new GameBoard([
  [1, 1, 0],
  [2, 2, 2],
  [0, 0, 1]
])
