<script setup lang="ts">
    import { players } from '@/utils/PlayerListExport'
    defineProps<{
        aiWeightsSelection: number
    }>()
</script>
<template>
    <div>
        {{players[aiWeightsSelection].player}}
    </div>
</template>