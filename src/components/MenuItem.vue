<script setup lang="ts">
import { ref, computed, watch } from 'vue'

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

function handleChildToggle(key: string) {
  activeChildKey.value = activeChildKey.value === key ? '' : key
}

watch(
  () => isOpen,
  (newVal) => {
    if (!newVal) {
      activeChildKey.value = ''
    }
  },
)
</script>

<template>
  <li class="list-none">
    <div
      class="flex cursor-pointer items-center justify-between rounded px-3 py-2"
      :class="{ 'is-parent': hasChildren }"
      @click="emit('toggle', item.key)"
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
