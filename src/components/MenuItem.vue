<script setup lang="ts">
import { ref, computed, watch, nextTick, inject, type Ref } from 'vue'
import type { MenuNode } from '@/types/index.ts'

const { item, isOpen, menuVisible } = defineProps<{
  item: MenuNode
  isOpen?: boolean
  menuVisible?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', key: string): void
}>()

const activeChildKey = ref('')
const hasChildren = computed(() => item.children && item.children.length > 0)
const expandedKeys = inject<Ref<Set<string>>>('expandedKeys')
const infoRef = ref<HTMLElement | null>(null)
const handleItemClick = inject<(key: string) => void>('handleItemClick')

function handleChildToggle(key: string) {
  activeChildKey.value = activeChildKey.value === key ? '' : key
}

async function handleClick() {
  emit('toggle', item.key)
  handleItemClick?.(item.key)
}

watch(
  () => isOpen,
  (newVal) => {
    if (!newVal) {
      activeChildKey.value = ''
    }
  },
  { immediate: true },
)

watch(
  () => [expandedKeys?.value, menuVisible],
  async () => {
    if (!expandedKeys?.value || !menuVisible) return

    if (item.children) {
      const childToOpen = item.children.find((child) => expandedKeys?.value.has(child.key))
      if (childToOpen) {
        activeChildKey.value = childToOpen.key
      }
    }
    const lastId = [...expandedKeys?.value].pop()

    if (!lastId || item.key !== lastId) return
    await nextTick()

    infoRef.value?.scrollIntoView({
      behavior: 'auto',
      inline: 'center',
      block: 'nearest',
    })
  },
  { immediate: true },
)
</script>

<template>
  <li class="list-none">
    <div
      ref="infoRef"
      class="flex cursor-pointer items-center justify-between rounded px-3 py-2 min-w-[100px]"
      :class="{ 'is-parent': hasChildren }"
      @click="handleClick"
    >
      <span class="text-base" :class="{ 'text-yellow-500': isOpen }">{{ item.text }} </span>
      <span v-if="hasChildren" class="text-xs text-gray-400">
        {{ isOpen ? '▼' : '▶' }}
      </span>
    </div>

    <ul v-if="hasChildren && isOpen" class="border-l border-gray-200 pl-4">
      <MenuItem
        v-for="child in item.children"
        :key="child.key"
        :item="child"
        :is-open="activeChildKey === child.key"
        :menu-visible="menuVisible"
        @toggle="handleChildToggle"
      />
    </ul>
  </li>
</template>
