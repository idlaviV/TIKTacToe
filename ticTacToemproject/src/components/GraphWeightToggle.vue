<script setup lang="ts">
import { isPlayer2Graph } from '@/components/GraphPanelUserConfigs'
</script>
<template>
    <v-row no-gutters>
        <v-col ><p class=" text-pink-500 font-bold text-2xl">X</p></v-col>
        <v-col cols="auto"><v-switch class="-my-3 mx-1"
                v-model="isPlayer2Graph"
                 id="myswitch" ></v-switch></v-col>
        <v-col ><p class="text-blue-500 font-bold text-2xl">O</p></v-col>
            
    
    </v-row>
    
</template>
<style>



</style>