import type { GameBoard } from './GameBoard'

/**
 * A move is a tuple of an x coordinate at position '0' and a y coordinate at position '1'.
 */
export type Move = readonly [number, number]

/**
 * A tuple containing a gameboard at position '0' and the move that was made to get to it at position '1'.
 */
export type GameBoardWithPrevMove = readonly [GameBoard, Move]
