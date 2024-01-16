<script setup lang="ts">
import { GameHandler } from '@/logic/GameHandler';
import {Players} from '@/utils/PlayerListExport'
import { ref } from 'vue';

const aIs = Players
const aiOptions = [{title: 'Elimination', index: '0'}]
const selectedAIOption = ref(0)
</script>
<template>
    <div>
        <div>
        AISelectionPanel
        <v-list>
            <v-list-item v-for="ai in aIs" :key="ai.index">
                <v-list-item-content>
                    <v-list-item-title>{{ai.player}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </div><div>
        Neue KI erzeugen
        <v-select
            label="Choose AI type"
            v-model="selectedAIOption"
            :items = "aiOptions"
            item-title="title"
            item-value="index"
        />
        <v-btn
            v-on:click="GameHandler.getInstance().createAI(selectedAIOption, 'dummy')"
        >
            Create AI
        </v-btn>
    </div>
            
    </div>
</template>