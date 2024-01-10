<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue';
import PlayerSelectionPanel from './PlayerSelectionPanel.vue';
import { ref } from 'vue';

let gameIsRunning=ref(false)

function startGame() {
    console.log("Start Game")
    gameIsRunning.value =  true
}

</script>

<template>
<div>
    <GameBoard v-if="gameIsRunning"/>
    <PlayerSelectionPanel v-else @start-game="startGame" />
</div>
</template>