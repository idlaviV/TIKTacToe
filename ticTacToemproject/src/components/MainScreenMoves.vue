<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler';

const gameHandler = GameHandler.getInstance()

</script>

<!-- MainScreenMoves contains the control buttons for AI turns-->
<template>
    <div>
        <v-btn @click="gameHandler.performAiTurn()"> &#9655; </v-btn>
    </div>
</template>