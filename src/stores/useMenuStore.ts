import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const isBigData = ref(false)
    const forceActiveKey = ref('')

    return { isBigData, forceActiveKey }
  },
  {
    persist: true,
  },
)
