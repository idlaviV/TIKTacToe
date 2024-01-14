<script setup lang="ts">
defineProps<{ autoPlay: boolean }>()
const emit = defineEmits(['update:autoPlay'])

const toggleAutoplay = () => {
  emit('update:autoPlay')
}
</script>

<!-- This button toggles auto play. The depicted icon changes accordingly. -->
<template>
  <v-btn @click="toggleAutoplay">
    <i class="material-icons">
      <span v-if="autoPlay">pause</span>
      <span v-else>play_arrow</span>
    </i>
  </v-btn>
</template>
