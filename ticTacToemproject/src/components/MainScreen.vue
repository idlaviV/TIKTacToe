<script setup lang="ts">
import MainScreenBoard from './MainScreenBoard.vue';
import StartScreen from './StartScreen.vue';
import { ref } from 'vue';

let gameIsRunning=ref(false)

function startGame() {
    console.log("Game started (and your configuration was intentionally ignored)")
    gameIsRunning.value =  true
}

</script>

<template>
<div>
    <MainScreenBoard v-if="gameIsRunning"/>
    <StartScreen v-else @start-game="startGame" />
</div>
</template>