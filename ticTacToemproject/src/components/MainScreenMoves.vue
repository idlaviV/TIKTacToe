<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler'
import  PlayButton  from './MainScreenMovesPlayButton.vue'


const gameHandler = GameHandler.getInstance()




</script>

<!-- MainScreenMoves contains the control buttons for AI turns-->
<template>
    <div>
        <v-btn @click="gameHandler.performAiTurn()">
            <i class="material-icons">
                skip_next
            </i></v-btn>
        <PlayButton/>
    </div>
</template>

