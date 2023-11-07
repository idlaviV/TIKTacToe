import { getGameBoard } from './GameBoardHandler'

function printGameboard(): void {
  console.log(getGameBoard().toString())
}
