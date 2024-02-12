<script setup lang="ts">
defineProps<{ autoPlay: boolean }>()
const emit = defineEmits(['update:autoPlay'])

const toggleAutoplay = () => {
  emit('update:autoPlay')
}
</script>

<!-- This button toggles auto play. The depicted icon changes accordingly. -->
<template>
  <v-btn
    v-if="autoPlay"
    v-on:click="toggleAutoplay"
    size="x-small"
    class="mx-2"
    icon="mdi-pause"
    variant="outlined"
  ></v-btn>
  <v-btn
    v-else
    v-on:click="toggleAutoplay"
    size="x-small"
    class="mx-2"
    icon="mdi-play"
    variant="outlined"
  ></v-btn>
</template>
