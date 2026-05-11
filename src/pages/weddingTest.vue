<route lang="yaml">
  name: 'Wedding'
  meta:
    layout: false
</route>

<script setup lang="ts">
import { NButton, NIcon, NSpace, NSpin } from 'naive-ui'
import { fetchWeddingLive } from '@/hook/apis/ganhu'

const title = ref('')
const weddingUrl = ref('')
const apiLoading = ref(true)
const imageLoaded = ref(false)
const loading = computed(() => apiLoading.value || !imageLoaded.value)

onMounted(async () => {
  try {
    const data = await fetchWeddingLive()
    title.value = data.title
    weddingUrl.value = data.liveUrl
  } finally {
    apiLoading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="fixed inset-0 flex-center bg-white z-50">
    <n-spin size="large" />
  </div>

  <n-space v-show="!loading" vertical :size="24" align="center" class="p-6">
    <h1 class="text-3xl font-bold text-center">{{ title }}</h1>

    <a :href="weddingUrl" target="_blank" rel="noopener" class="block max-w-2xl">
      <img
        src="/wedding.jpg"
        alt="Wedding"
        class="w-full h-auto rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300"
        @load="imageLoaded = true"
        @error="imageLoaded = true"
      />
    </a>

    <n-button
      tag="a"
      :href="weddingUrl || undefined"
      target="_blank"
      rel="noopener"
      type="primary"
      size="large"
      round
      strong
      :disabled="!weddingUrl"
      class="!px-8 !h-12 !text-base shadow-lg hover:shadow-xl transition-shadow"
    >
      <template #icon>
        <n-icon>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 16.5l6-4.5l-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2z"/></svg>
        </n-icon>
      </template>
      觀看結婚影片
    </n-button>
  </n-space>
</template>
