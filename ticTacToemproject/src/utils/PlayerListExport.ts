import { GameHandler } from '@/logic/GameHandler'
import type { Player } from '@/logic/Player'
import { ref, type Ref } from 'vue'

export type PlayersExport = { player: string; index: number }[]

/**
 * This object is provided to the frontend to display the list of all possible players.
 * The order of the array has to coincide with the order in GameHandler.possiblePlayers.
 */
export const Players: Ref<PlayersExport> = ref([])

export function updatePlayerList() {
  const possiblePlayers: Player[] = GameHandler.getInstance().getPossiblePlayers()
  Players.value = []
  for (const player of possiblePlayers) {
    Players.value.push({ player: player.getName(), index: possiblePlayers.indexOf(player) })
  }
}
