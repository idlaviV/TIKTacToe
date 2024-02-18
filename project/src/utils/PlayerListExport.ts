import { GameHandler } from '@/logic/GameHandler'
import type { Player } from '@/logic/Player'
import { ref, type Ref } from 'vue'

export type PlayersExport = { player: string; index: number; type: string }[]

/**
 * This object is provided to the frontend to display the list of all possible players.
 * The order of the array has to coincide with the order in GameHandler.possiblePlayers.
 * @player is the given name of the player, index is the number in GameHandler.possiblePlayers array.
 */
export const players: Ref<PlayersExport> = ref([])

/**
 * Updates the list of all possible players.
 */
export function updatePlayerList() {
  const possiblePlayers: Player[] = GameHandler.getInstance().getPossiblePlayers()
  players.value = []
  for (const player of possiblePlayers) {
    players.value.push({ player: player.getName(), index: possiblePlayers.indexOf(player), type: player.getTypeName() })
  }
}
