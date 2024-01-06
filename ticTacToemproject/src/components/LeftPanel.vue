<script setup lang="ts">
import { GameBoard } from '@/logic/GameBoard';
import { GameBoardHandler } from '@/logic/GameBoardHandler';
import { GameHandler } from '@/logic/GameHandler';
import PlayerSelectionPanel from './PlayerSelectionPanel.vue';

const props = defineProps({
  gameHandler: GameHandler,
  gBHandler: GameBoardHandler
})
let gameIsRunning=false

function startGame() {
    console.log("Start Game")
    gameIsRunning =  true
}

function getGameHandler() {
    return props.gameHandler
}

function getGBHandler() {
    return props.gBHandler
}

</script>

<template>
<div>
    <GameBoard v-if=gameIsRunning :game-handler="getGameHandler" :g-b-handler="getGBHandler"/>
    <PlayerSelectionPanel v-else @start-game="startGame"/>
</div>
</template>