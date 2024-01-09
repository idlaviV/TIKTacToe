import type { GameBoard } from "./GameBoard"

export type Move = readonly [number, number]
export type GameBoardWithPrevMove = readonly [GameBoard, Move]
