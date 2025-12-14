<script setup lang="ts">
import { nextTick, ref, watch, type ComponentPublicInstance } from 'vue'
import SideMenu from '@/components/SideMenu.vue'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import GridBlock from '@/components/GridBlock.vue'
import LittleCircle from '@/components/LittleCircle.vue'
import { AnimationModeEnum } from '@/types/index.ts'

const menuVisible = ref(false)
const blinkingBlocks = [3, 5, 9]
const hasCircle = [1, 3, 7, 9]
const isBallToTarget = ref(false)
const targetPos = ref({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
const circleRefs = ref<Record<number, Element | null>>({})
const circleWaapiAniArr = ref<Animation[]>(Array(hasCircle.length).fill(null))
const circleRafIdArr = ref<number[]>(Array(hasCircle.length).fill(0))
const animateMode = ref<AnimationModeEnum>(AnimationModeEnum.CSS)

function setCircleRef(el: Element | ComponentPublicInstance | null, n: number) {
  if (el) {
    circleRefs.value[n] = '$el' in el ? (el.$el as Element) : (el as Element)
  }
}

function calculateMoves() {
  hasCircle.forEach((n) => {
    const currentCircle = circleRefs.value[n] as HTMLElement | null
    if (!currentCircle) return

    const currentRect = currentCircle.getBoundingClientRect()
    const currentX = currentRect.left + currentRect.width / 2
    const currentY = currentRect.top + currentRect.height / 2

    const deltaX = targetPos.value.x - currentX
    const deltaY = targetPos.value.y - currentY

    if (animateMode.value === AnimationModeEnum.WebAnimationsAPI) {
      const animation = currentCircle.animate(
        [{ transform: 'translate(0, 0)' }, { transform: `translate(${deltaX}px, ${deltaY}px)` }],
        {
          duration: 500,
          fill: 'forwards',
          easing: 'ease-out',
        },
      )
      circleWaapiAniArr.value[n] = animation
    } else if (animateMode.value === AnimationModeEnum.CSS) {
      currentCircle.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    } else if (animateMode.value === AnimationModeEnum.RequestAnimationFrame) {
      const duration = 500
      const startTime = performance.now()

      function animate(currentTime: number) {
        const diff = currentTime - startTime
        const progress = Math.min(diff / duration, 1)

        const x = deltaX * progress
        const y = deltaY * progress

        if (currentCircle) {
          currentCircle.style.transform = `translate(${x}px, ${y}px)`
        }

        if (progress < 1) {
          circleRafIdArr.value[n] = requestAnimationFrame(animate)
        }
      }

      circleRafIdArr.value[n] = requestAnimationFrame(animate)
    }
  })
}

watch(
  [isBallToTarget, targetPos],
  async (_newVal, _oldVal, onCleanup) => {
    let isCancelled = false

    onCleanup(() => {
      isCancelled = true
    })

    Object.values(circleRefs.value).forEach((el) => {
      if (el) {
        ;(el as HTMLElement).style.transform = ''
      }
    })
    circleWaapiAniArr.value.forEach((ani) => ani?.cancel())
    circleRafIdArr.value.forEach((id) => cancelAnimationFrame(id))

    await nextTick()
    if (isCancelled || !isBallToTarget.value) return

    calculateMoves()
  },
  { deep: true },
)
</script>

<template>
  <main class="relative h-dvh w-dvw bg-gray-50 overflow-hidden">
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
          <div
            v-for="n in 9"
            :key="n"
            class="flex items-center justify-center h-25 w-full relative"
          >
            <GridBlock :is-blinking="blinkingBlocks.includes(n)" :animate-mode="animateMode" />
            <LittleCircle
              v-if="hasCircle.includes(n)"
              :ref="(el) => setCircleRef(el, n)"
              class="absolute z-10"
              :class="{
                'animate-circle': !isBallToTarget,
                'transition-transform duration-500 ease-out will-change-transform':
                  isBallToTarget && animateMode === AnimationModeEnum.CSS,
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="menuVisible"
      class="absolute inset-0 bg-black/0 z-100"
      @click="menuVisible = false"
    />
    <Transition name="menu-fade">
      <SideMenu
        v-show="menuVisible"
        :menu-visible="menuVisible"
        class="fixed right-0 top-0 z-110"
      />
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
