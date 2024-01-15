import { GameHandler } from "@/logic/GameHandler";
import type { Player } from "@/logic/Player";
import { ref, type Ref } from "vue";

export type AIListExport = {player: string, index: number}[]

export const AIList : Ref<AIListExport> = ref([])

export function updateAIList() {
    const aIs: Player[] = GameHandler.getInstance().getAIList()
    const humanPlayer = GameHandler.getInstance().getUserPlayer()
    AIList.value = []
    AIList.value.push({player: humanPlayer.getName(), index: -1})
    for (const aI of aIs) {
        AIList.value.push({player: aI.getName(), index: aIs.indexOf(aI)})
    }
}