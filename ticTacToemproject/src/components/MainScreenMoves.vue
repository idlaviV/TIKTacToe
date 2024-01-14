<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import  PlayButton  from './MainScreenMovesPlayButton.vue'
import { ref } from 'vue';


const gameHandler = GameHandler.getInstance()
const autoPlay = ref(false)
const toggleAutoPlay = () => {
    autoPlay.value = !autoPlay.value
}



</script>

<!-- MainScreenMoves contains the control buttons for AI turns-->
<template>
    <div>
        <v-btn @click="gameHandler.performAiTurn()">
            <i class="material-icons">
                skip_next
            </i></v-btn>
        <PlayButton 
            :auto-play="autoPlay" 
            @update:auto-play="toggleAutoPlay">
        </PlayButton>
    </div>
</template>

