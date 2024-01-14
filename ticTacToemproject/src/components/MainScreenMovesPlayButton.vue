<script setup lang="ts">
import { ref } from 'vue';

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
<template>
        <v-btn @click="toggleAutoplay">
            <i  class="material-icons">
                {{ playPauseButtonSymbol }}
            </i>
        </v-btn>
</template>