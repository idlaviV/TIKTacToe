<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import { ref } from 'vue';


const gameHandler = GameHandler.getInstance()
const autoPlay = ref(true)

const autoPlayOnSymbol = "play_arrow"
const autoPlayOffSymbol = "pause"

const playPauseButtonSymbol = ref(autoPlayOnSymbol)

const toggleAutoplay = () => {
    autoPlay.value = !autoPlay.value
    if (autoPlay.value) {
        playPauseButtonSymbol.value = autoPlayOnSymbol
    } else {
        playPauseButtonSymbol.value = autoPlayOffSymbol
    }
}



</script>

<!-- MainScreenMoves contains the control buttons for AI turns-->
<template>
    <div>
        <v-btn @click="gameHandler.performAiTurn()">
            <i class="material-icons">
                skip_next
            </i></v-btn>
        <v-btn @click="toggleAutoplay">
            <i  class="material-icons">
                {{playPauseButtonSymbol}}
            </i>
        </v-btn>
    </div>
</template>

