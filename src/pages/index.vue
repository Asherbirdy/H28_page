<route lang="yaml">
  name: 'Index'
</route>

<script setup lang='ts'>
import { useHead } from '@vueuse/head'

// 設定首頁標題
useHead({
	title: '28會所 - 首頁',
	meta: [
		{
			name: 'description',
			content: '28會所活動資訊與聚會安排'
		}
	]
})

const aaa = ref('aaaa')

</script>

<template>
  <div>
    {{ aaa }}
  </div>
</template>
