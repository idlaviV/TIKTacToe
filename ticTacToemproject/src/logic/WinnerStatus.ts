import type { PlayerNumber } from './PlayerNumber'

export type WinnerStatus = PlayerNumber | -1 | null
export const drawStatus: WinnerStatus = -1
