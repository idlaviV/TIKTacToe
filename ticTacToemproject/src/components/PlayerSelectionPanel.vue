<script setup lang="ts">
const emit = defineEmits(["startGame"])

function startGame() {
    emit("startGame");
}

</script>

<template>
    <h2>Spielerauswahl</h2>
    <v-btn v-on:click="startGame">Start Game</v-btn>
</template>