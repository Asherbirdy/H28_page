<script setup lang='ts'>
import { NSpace, NCard, NText, NSpin, NEmpty } from 'naive-ui'

import { fetchGanhuParticipants } from '@/hook/apis/ganhu'
import type { GanhuParticipant } from '@/types/apis/ganhu'

interface BusGroup {
	busName: string
	participants: GanhuParticipant[]
}

const loading = ref(false)
const participants = ref<GanhuParticipant[]>([])
const errorMessage = ref('')

const busGroups = computed(() => {
	// 確保 participants 是陣列
	if (!Array.isArray(participants.value)) {
		console.error('participants 不是陣列:', participants.value)
		return []
	}

	const groups = new Map<string, GanhuParticipant[]>()

	participants.value.forEach(p => {
		// 過濾掉 "無需搭車" 和 "無"
		if (p.busGo && p.busGo !== '無需搭車' && p.busGo !== '無') {
			if (!groups.has(p.busGo)) {
				groups.set(p.busGo, [])
			}
			groups.get(p.busGo)!.push(p)
		}
	})

	// 轉換為陣列並排序
	const result: BusGroup[] = Array.from(groups.entries())
		.map(([busName, participants]) => ({
			busName,
			participants
		}))
		.sort((a, b) => {
			// 按照車次排序：一車、二車、三車...
			const aNum = a.busName.match(/(\d+)/)?.[0] || '0'
			const bNum = b.busName.match(/(\d+)/)?.[0] || '0'
			return parseInt(aNum) - parseInt(bNum)
		})

	return result
})

const loadData = async () => {
	loading.value = true
	errorMessage.value = ''
	try {
		const data = await fetchGanhuParticipants()
		console.log('API 回傳資料:', data)

		// 檢查資料格式
		if (Array.isArray(data)) {
			participants.value = data
		} else if (data && typeof data === 'object') {
			// 如果回傳的是物件，嘗試從中提取陣列
			const possibleArray = Object.values(data).find(val => Array.isArray(val))
			if (possibleArray) {
				participants.value = possibleArray as GanhuParticipant[]
			} else {
				console.error('無法從回傳資料中找到陣列')
				errorMessage.value = '資料格式錯誤'
			}
		} else {
			console.error('未預期的資料格式:', typeof data)
			errorMessage.value = '資料格式錯誤'
		}
	} catch (error) {
		console.error('載入數據失敗:', error)
		errorMessage.value = '載入失敗，請稍後再試'
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	loadData()
})
</script>

<template>
  <n-space
    vertical
  >
    <n-h3>去程車次名單</n-h3>

    <n-spin :show="loading">
      <template v-if="errorMessage && !loading">
        <n-empty :description="errorMessage" />
      </template>

      <template v-else-if="busGroups.length === 0 && !loading">
        <n-empty description="暫無數據" />
      </template>

      <n-space
        v-else
        vertical
        :size="16"
      >
        <n-card
          v-for="group in busGroups"
          :key="group.busName"
          :title="group.busName"
          size="large"
        >
          <n-text>
            {{ group.participants.map(p => p.name).join('、') }}
          </n-text>
        </n-card>
      </n-space>
    </n-spin>
  </n-space>
</template>

<style scoped>
</style>
