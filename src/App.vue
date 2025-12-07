<script setup lang="ts">
import { ref } from 'vue'
import SideMenu from '@/components/SideMenu.vue'
import MenuIcon from '@/components/icons/MenuIcon.vue'

const menuVisible = ref(false)
</script>

<template>
  <main class="relative h-screen w-screen bg-gray-50 overflow-hidden">
    <div class="flex">
      <div class="flex justify-end w-full pt-5 pr-5">
        <button @click="menuVisible = !menuVisible">
          <MenuIcon width="20" height="20" />
        </button>
      </div>
    </div>

    <div
      v-if="menuVisible"
      class="absolute inset-0 bg-black/20 z-10"
      @click="menuVisible = false"
    />
    <Transition name="menu-fade">
      <SideMenu v-show="menuVisible" class="absolute right-0 top-0 z-20" />
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
</style>
