<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { AnimationModeEnum } from '@/types/index.ts'

const props = withDefaults(
  defineProps<{
    isBlinking?: boolean
    animateMode?: AnimationModeEnum
  }>(),
  {
    isBlinking: false,
    animateMode: AnimationModeEnum.CSS,
  },
)

const bgLayerRef = ref<HTMLElement | null>(null)
let waapiAni: Animation | null = null
let rafId: number | null = null
let currentOpacity = 0.6
let speed = 0.02
function runRafAni() {
  if (!bgLayerRef.value) return

  currentOpacity += speed

  if (currentOpacity >= 1 || currentOpacity <= 0.6) {
    speed = -speed
  }

  bgLayerRef.value.style.opacity = currentOpacity.toString()

  rafId = requestAnimationFrame(runRafAni)
}

function runWebAnimationsAPI() {
  if (!bgLayerRef.value) return

  const keyframes = [{ opacity: '1' }, { opacity: '0.6' }, { opacity: '1' }]
  const options: KeyframeAnimationOptions = {
    duration: 500,
    iterations: Infinity,
    easing: 'ease-in-out',
  }

  waapiAni = bgLayerRef.value.animate(keyframes, options)
}

function updateAnimate() {
  if (!bgLayerRef.value || !props.isBlinking) return

  if (rafId) cancelAnimationFrame(rafId)
  waapiAni?.cancel()
  currentOpacity = 0.6
  speed = 0.02

  if (props.animateMode === AnimationModeEnum.WebAnimationsAPI) {
    runWebAnimationsAPI()
  } else if (props.animateMode === AnimationModeEnum.RequestAnimationFrame) {
    runRafAni()
  }
}

onMounted(() => {
  updateAnimate()
})

watch([() => props.isBlinking, () => props.animateMode], updateAnimate)
</script>

<template>
  <div
    ref="bgLayerRef"
    class="bg-layer size-full border-2 border-black"
    :class="{ 'animate-blink': isBlinking && animateMode === 'CSS' }"
  />
</template>

<style scoped>
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
