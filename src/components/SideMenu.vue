<script setup lang="ts">
import { nextTick, provide, ref, watch } from 'vue'
import MenuItem from './MenuItem.vue'
import customFetch from '@/composable/customFetch'

type MenuNode = {
  key: string
  text: string
  children?: MenuNode[]
}

const activeKey = ref('')
const menuData = ref<MenuNode[]>([])
const isBigData = ref(false)
const menuMap = new Map<string, { path: string[]; text: string }>()
const expandedKeys = ref<Set<string>>(new Set())
const forceActiveKey = ref('')
provide('expandedKeys', expandedKeys)
fetchMenuData()

function handleToggle(key: string) {
  activeKey.value = activeKey.value === key ? '' : key
}

function buildPathMap(nodes: MenuNode[], currentPath: string[] = []) {
  for (const node of nodes) {
    const newPath = [...currentPath, node.key]
    menuMap.set(node.key, { path: newPath, text: node.text })
    if (node.children && node.children.length > 0) {
      buildPathMap(node.children, newPath)
    }
  }
}

async function fetchMenuData(bigData = false) {
  const baseUrl = import.meta.env.BASE_URL
  const path = bigData ? 'BigMenuData.json' : 'MenuData.json'
  clear()
  const r = await customFetch<MenuNode[]>(baseUrl + path)
  menuData.value = r
  buildPathMap(r)
}

watch(isBigData, (newVal) => {
  fetchMenuData(newVal)
})

function clear() {
  expandedKeys.value.clear()
  menuData.value = []
  menuMap.clear()
  activeKey.value = ''
  forceActiveKey.value = ''
}

function selectKey(target: string) {
  const pathTarget = menuMap.get(target)
  if (!pathTarget) {
    return
  }

  if (pathTarget.path[0]) {
    activeKey.value = pathTarget.path[0]
  }
  expandedKeys.value = new Set(pathTarget.path)
}

watch(forceActiveKey, async (newKey) => {
  activeKey.value = ''
  expandedKeys.value.clear()

  await nextTick()
  if (newKey) {
    selectKey(newKey)
  }
})
</script>

<template>
  <div class="h-screen w-64 bg-black p-4 opacity-90 text-white overflow-auto flex flex-col gap-2">
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" v-model="isBigData" class="w-4 h-4" />
      <span>Big Data</span>
    </label>
    <select
      v-model="forceActiveKey"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    >
      <option disabled value="">select a option</option>

      <option v-for="[key, value] in menuMap" :key="key" :value="key">
        {{ value.text }}
      </option>
    </select>
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
