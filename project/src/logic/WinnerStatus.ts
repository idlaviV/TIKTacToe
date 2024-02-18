import type { PlayerNumber } from './PlayerNumber'

/**
 * Represents the status of how the game ended.
 *      null -> the game has not yet ended
 *      -1 -> the game ended in a draw
 *      PlayerNumber -> the player with the corresponding player number has won
 */
export type WinnerStatus = PlayerNumber | -1 | null
export const drawStatus: WinnerStatus = -1
