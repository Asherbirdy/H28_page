<route lang="yaml">
  name: 'Index'
</route>

<script setup lang='ts'>
import { useHead } from '@vueuse/head'
import { NButton } from 'naive-ui'

useHead({
	title: '28會所 - 首頁',
	meta: [
		{
			name: 'description',
			content: '28會所活動資訊與聚會安排'
		}
	]
})

function openVideo() {
	window.open('https://www.youtube.com/watch?v=1ezKjOxflhQ', '_blank')
}
</script>

<template>
  <n-space vertical :size="16" class="p-6">
    <n-button type="primary" @click="openVideo">
      觀看影片
    </n-button>
  </n-space>
</template>
