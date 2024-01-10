<script setup lang="ts">

const emit = defineEmits(["startGame"])

function startGame() {
    //emit("startGame");
    console.log(select1) 
}

function foo(arg:{player:string, value:number}|null) {
    if(arg != null){
        console.log(arg.player)
    }
}

const select1 = null
const select2 = {player: 'Human', value:2}
const items = [{player: 'Human', value:2}, {player: 'AI', value:1}]

</script>

<template>
    <h2>Spielerauswahl</h2>
    
    <div>
        <v-select 
            label="Choose player 1" 
            :items=items 
            item-title="player"
            item-value="value"
            return-object
            @update:modelValue="foo"

        />
        vs.
        <v-select 
            label="Choose player 2" 
            :items=items 
            item-title="player"
            item-value="id"
            return-object
        />
    </div>
    <v-btn v-on:click="startGame">Start Game</v-btn>
</template>