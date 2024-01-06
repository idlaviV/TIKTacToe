<script setup lang="ts">
import { GameBoard } from '@/logic/GameBoard';
import { GameBoardHandler } from '@/logic/GameBoardHandler';
import { GameHandler } from '@/logic/GameHandler';
import PlayerSelectionPanel from './PlayerSelectionPanel.vue';
import { ref } from 'vue';

defineProps({
  gameHandler: GameHandler,
  gBHandler: GameBoardHandler
})
let gameIsRunning=ref(false)

function startGame() {
    console.log("Start Game")
    gameIsRunning.value =  true
}

</script>

<template>
<div>
    <GameBoard v-if=gameIsRunning :game-handler=gameHandler :g-b-handler=gBHandler />
    <PlayerSelectionPanel v-else @start-game="startGame" />
</div>
</template>