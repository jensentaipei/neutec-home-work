<script setup lang="ts">
import { ref } from 'vue'
import MenuItem from './MenuItem.vue'
import customFetch from '@/composable/customFetch'

type MenuNode = {
  key: string
  text: string
  children?: MenuNode[]
}

const activeKey = ref('')
const menuData = ref<MenuNode[]>([])

fetchMenuData()

function handleToggle(key: string) {
  activeKey.value = activeKey.value === key ? '' : key
}

async function fetchMenuData() {
  const r = await customFetch<MenuNode[]>('/MenuData.json')
  menuData.value = r
}
</script>

<template>
  <div class="h-screen w-64 bg-black p-4 opacity-90 text-white">
    <ul class="list-none">
      <MenuItem
        v-for="item in menuData"
        :key="item.key"
        :item="item"
        :is-open="activeKey === item.key"
        @toggle="handleToggle"
      />
    </ul>
  </div>
</template>

<style scoped></style>
