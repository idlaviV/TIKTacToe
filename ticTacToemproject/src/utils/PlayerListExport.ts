import { GameHandler } from '@/logic/GameHandler'
import type { Player } from '@/logic/Player';
import { ref, type Ref } from 'vue'

export type PlayersExport = { player: string; index: number }[]

export const Players: Ref<PlayersExport> = ref([])

export function updateAIList() {
  const possiblePlayers: Player[] = GameHandler.getInstance().getPossiblePlayers()
  Players.value = []
  for (const player of possiblePlayers) {
    Players.value.push({ player: player.getName(), index: possiblePlayers.indexOf(player) })
  }
}
