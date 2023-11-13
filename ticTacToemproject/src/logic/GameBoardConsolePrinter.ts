import { getGameBoard } from './GameBoardHandler'

export function printGameboard(): void {
  console.log(getGameBoard().toString())
}
