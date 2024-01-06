<script setup lang="ts">
const emit = defineEmits(["startGame"])

function startGame() {
    emit("startGame");
}

const select1 = {player: 'Human'}
const select2 = {player: 'AI'}
const items = [{player: 'Human'}, {player: 'AI'}]

</script>

<template>
    <h2>Spielerauswahl</h2>
    
    <div>
        <v-select 
            v-model="select1" 
            label="Choose player 1" 
            :items=items 
            item-title="player"
        />
        vs.
        <v-select v-model="select2" 
            label="Choose player 2" 
            :items=items 
            item-title="player"
        />
    </div>
    <v-btn v-on:click="startGame">Start Game</v-btn>
</template>