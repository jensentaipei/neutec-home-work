<script setup lang="ts">
defineProps<{
  isBlinking?: boolean
}>()
</script>

<template>
  <div class="base-block relative">
    <div class="absolute inset-0 bg-layer" :class="{ 'animate-blink': isBlinking }" />

    <div class="relative flex items-center justify-center size-full z-10">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.base-block {
  height: 100px;
  border: black solid 2px;
}

.bg-layer {
  background: radial-gradient(circle, rgba(113, 81, 95, 1) 81%, rgba(0, 0, 0, 1) 100%);
}

.animate-blink {
  animation: pulse-opacity 0.5s infinite ease-in-out;
}

@keyframes pulse-opacity {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
