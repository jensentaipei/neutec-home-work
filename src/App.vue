<script setup lang="ts">
import { ref } from 'vue'
import SideMenu from '@/components/SideMenu.vue'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import GridBlock from '@/components/GridBlock.vue'
import LittleCircle from '@/components/LittleCircle.vue'

const menuVisible = ref(false)
const blinkingBlocks = [3, 5, 9]
const hasCircle = [1, 3, 7, 9]
</script>

<template>
  <main class="relative h-screen w-screen bg-gray-50 overflow-hidden">
    <div class="flex flex-col h-full">
      <div class="flex justify-end w-full p-5">
        <button @click="menuVisible = !menuVisible">
          <MenuIcon width="20" height="20" />
        </button>
      </div>
      <div class="flex-1 bg-gray-200 flex items-center justify-center">
        <div class="grid grid-cols-3 gap-1 w-full p-4">
          <GridBlock
            v-for="n in 9"
            :key="n"
            :is-blinking="blinkingBlocks.includes(n)"
            :style="{ zIndex: 10 - n }"
          >
            <LittleCircle v-if="hasCircle.includes(n)" class="animate-circle" />
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
