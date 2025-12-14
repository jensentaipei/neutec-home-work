<script setup lang="ts">
import { nextTick, onMounted, provide, ref, watch } from 'vue'
import MenuItem from './MenuItem.vue'
import useCustomFetch from '@/composable/useCustomFetch'
import { storeToRefs } from 'pinia'
import { useMenuStore } from '@/stores/useMenuStore'
import type { MenuNode } from '@/types/index.ts'

defineProps<{
  menuVisible: boolean
}>()

const activeKey = ref('')
const menuStore = useMenuStore()
const { isBigData, forceActiveKey } = storeToRefs(menuStore)
const menuData = ref<MenuNode[]>([])
const menuMap = new Map<string, { path: string[]; text: string }>()
const expandedKeys = ref<Set<string>>(new Set())
provide('expandedKeys', expandedKeys)

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
  const r = await useCustomFetch<MenuNode[]>(baseUrl + path)
  menuData.value = r
  buildPathMap(r)
}

watch(isBigData, (newVal) => {
  clear()
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

onMounted(async () => {
  await fetchMenuData(isBigData.value)
  handleForceSelect()
})

function handleForceSelect() {
  if (forceActiveKey.value) {
    selectKey(forceActiveKey.value)
  }
}

function handleItemClick(key: string) {
  forceActiveKey.value = key
}
provide('handleItemClick', handleItemClick)

watch(forceActiveKey, async () => {
  activeKey.value = ''
  expandedKeys.value.clear()

  await nextTick()
  handleForceSelect()
})
</script>

<template>
  <div class="h-dvh w-64 bg-black p-4 opacity-90 text-white overflow-auto flex flex-col gap-2">
    <label class="flex items-center gap-2 shrink-0">
      <input type="checkbox" v-model="isBigData" class="w-4 h-4" />
      <span>Big Data</span>
    </label>
    <select
      v-model="forceActiveKey"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 shrink-0"
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
        :menu-visible="menuVisible"
        :is-open="activeKey === item.key"
        @toggle="handleToggle"
      />
    </ul>
  </div>
</template>

<style scoped></style>
