<script setup lang="ts">
import { ref, computed, watch, nextTick, inject, type Ref } from 'vue'

interface MenuNode {
  key: string
  text: string
  children?: MenuNode[]
}

const { item, isOpen } = defineProps<{
  item: MenuNode
  isOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', key: string): void
}>()

const activeChildKey = ref('')
const hasChildren = computed(() => item.children && item.children.length > 0)
const expandedKeys = inject<Ref<Set<string>>>('expandedKeys')
const infoRef = ref<HTMLElement | null>(null)

function handleChildToggle(key: string) {
  activeChildKey.value = activeChildKey.value === key ? '' : key
}

async function handleClick(event: MouseEvent) {
  emit('toggle', item.key)

  const target = event.currentTarget as HTMLElement

  await nextTick()

  target.scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
    block: 'nearest',
  })
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
  () => expandedKeys?.value,
  async (newKeys) => {
    if (!newKeys) return

    if (item.children) {
      const childToOpen = item.children.find((child) => newKeys.has(child.key))
      if (childToOpen) {
        activeChildKey.value = childToOpen.key
      }
    }
    const lastId = [...newKeys].pop()

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
        @toggle="handleChildToggle"
      />
    </ul>
  </li>
</template>
