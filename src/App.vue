<script setup lang="ts">
import { nextTick, ref, watch, type ComponentPublicInstance } from 'vue'
import SideMenu from '@/components/SideMenu.vue'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import GridBlock from '@/components/GridBlock.vue'
import LittleCircle from '@/components/LittleCircle.vue'

const menuVisible = ref(false)
const blinkingBlocks = [3, 5, 9]
const hasCircle = [1, 3, 7, 9]
const isBallToTarget = ref(false)
const targetPos = ref({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
const blockRefs = ref<Record<number, Element | null>>({})
const circleStyles = ref<Record<number, { transform: string }>>({})
const animateMode = ref<'CSS' | 'Web Animations API' | 'requestAnimationFrame'>('CSS')

function setBlockRef(el: Element | ComponentPublicInstance | null, n: number) {
  if (el) {
    blockRefs.value[n] = '$el' in el ? (el.$el as Element) : (el as Element)
  }
}

function calculateMoves() {
  hasCircle.forEach((n) => {
    const currentBlock = blockRefs.value[n]
    if (!currentBlock) return

    const currentRect = currentBlock.getBoundingClientRect()
    const currentX = currentRect.left + currentRect.width / 2
    const currentY = currentRect.top + currentRect.height / 2

    const deltaX = targetPos.value.x - currentX
    const deltaY = targetPos.value.y - currentY

    circleStyles.value[n] = {
      transform: `translate(${deltaX}px, ${deltaY}px)`,
    }
  })
}

watch(
  [isBallToTarget, targetPos],
  async () => {
    await nextTick()

    if (!isBallToTarget.value) {
      circleStyles.value = {}
      return
    }
    calculateMoves()
  },
  { deep: true },
)
</script>

<template>
  <main class="relative h-screen w-screen bg-gray-50 overflow-hidden">
    <div class="flex flex-col h-full">
      <div class="flex justify-end w-full p-5 gap-4">
        <button @click="menuVisible = !menuVisible">
          <MenuIcon width="20" height="20" />
        </button>
      </div>
      <div class="p-2">
        <ul class="flex flex-col gap-2">
          <li>
            <div class="flex items-center gap-2">
              <span>Ball to target: </span>
              <input type="checkbox" v-model="isBallToTarget" class="w-4 h-4" />
              <span>x: </span>
              <input type="number" v-model.number="targetPos.x" class="w-20 border" />
              <span>y: </span>
              <input type="number" v-model.number="targetPos.y" class="w-20 border" />
            </div>
          </li>
          <li>
            <div class="flex">
              <span class="mr-2">Animate Mode: </span>
              <select v-model="animateMode" class="border">
                <option
                  v-for="mode in ['CSS', 'Web Animations API', 'requestAnimationFrame']"
                  :key="mode"
                  :value="mode"
                >
                  {{ mode }}
                </option>
              </select>
            </div>
          </li>
        </ul>
      </div>
      <div class="flex-1 bg-gray-200 flex items-center justify-center">
        <div class="grid grid-cols-3 gap-1 w-full p-4">
          <GridBlock
            v-for="n in 9"
            :key="n"
            :is-blinking="blinkingBlocks.includes(n)"
            :ref="(el) => setBlockRef(el, n)"
            :class="{ 'z-20!': isBallToTarget && hasCircle.includes(n) }"
            :animate-mode="animateMode"
            :style="{ zIndex: 10 - n }"
          >
            <LittleCircle
              v-if="hasCircle.includes(n)"
              :class="{
                'animate-circle': !isBallToTarget,
                'transition-transform duration-500 ease-out will-change-transform': isBallToTarget,
              }"
              :style="circleStyles[n]"
            />
          </GridBlock>
        </div>
      </div>
    </div>

    <div
      v-if="menuVisible"
      class="absolute inset-0 bg-black/0 z-100"
      @click="menuVisible = false"
    />
    <Transition name="menu-fade">
      <SideMenu v-show="menuVisible" class="fixed right-0 top-0 z-110" />
    </Transition>
  </main>
</template>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: transform 0.3s ease-in-out;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  transform: translateX(100%);
}

.animate-circle {
  animation: go-right 1s infinite ease-in-out;
}

@keyframes go-right {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(250px);
  }
}
</style>
