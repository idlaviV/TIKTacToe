<script setup lang="ts">
import { isPlayer2Graph } from '@/components/GraphPanelUserConfigs'
</script>
<template>
    <v-row>
        <div class="d-flex text-xl">
            <p class="mr1 my-auto text-pink-500 font-bold">X</p>
            <v-switch 
                v-model="isPlayer2Graph"
                 class="switch-center"
                 id="myswitch" ></v-switch>
            <p class="mx-auto my-auto text-blue-500 font-bold">O</p>
        </div>
    </v-row>
    
</template>
<style>
.switch-center {
  display: flex;
  justify-content: center;
}


</style>