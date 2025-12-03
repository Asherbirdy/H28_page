<script setup lang='ts'>
import { NSpace, NCard, NText, NSpin, NEmpty, NH1 } from 'naive-ui'

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

const busBlendGroups = computed(() => {
	// 確保 participants 是陣列
	if (!Array.isArray(participants.value)) {
		console.error('participants 不是陣列:', participants.value)
		return []
	}

	const groups = new Map<string, GanhuParticipant[]>()

	participants.value.forEach(p => {
		// 過濾掉 "無需搭車" 和 "無"
		if (p.busBlend && p.busBlend !== '無需搭車' && p.busBlend !== '無') {
			if (!groups.has(p.busBlend)) {
				groups.set(p.busBlend, [])
			}
			groups.get(p.busBlend)!.push(p)
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

const tableGroups = computed(() => {
	// 確保 participants 是陣列
	if (!Array.isArray(participants.value)) {
		console.error('participants 不是陣列:', participants.value)
		return []
	}

	const groups = new Map<string, GanhuParticipant[]>()

	participants.value.forEach(p => {
		// 過濾掉 "無"、"無用餐" 或空值
		if (p.table && p.table !== '無' && p.table !== '無用餐') {
			if (!groups.has(p.table)) {
				groups.set(p.table, [])
			}
			groups.get(p.table)!.push(p)
		}
	})

	// 中文數字映射
	const chineseNumMap: Record<string, number> = {
		'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
	}

	// 提取數字的函數
	const extractNumber = (str: string): number => {
		// 先嘗試匹配中文數字
		for (const [chinese, num] of Object.entries(chineseNumMap)) {
			if (str.includes(chinese)) {
				return num
			}
		}
		// 如果沒有中文數字，嘗試匹配阿拉伯數字
		const match = str.match(/(\d+)/)
		return match ? parseInt(match[0]) : 0
	}

	// 轉換為陣列並排序
	const result: BusGroup[] = Array.from(groups.entries())
		.map(([busName, participants]) => ({
			busName,
			participants
		}))
		.sort((a, b) => {
			// 按照桌次排序：一桌、二桌、三桌...
			const aNum = extractNumber(a.busName)
			const bNum = extractNumber(b.busName)
			return aNum - bNum
		})

	return result
})

const totalDiningCount = computed(() => {
	return tableGroups.value.reduce((total, group) => total + group.participants.length, 0)
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
    :size="32"
  >
    <!-- 去程車次 -->
    <div>
      <n-space justify="center">
        <n-h1>去信基大樓</n-h1>
      </n-space>

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
            :title="`${group.busName} (${group.participants.length}人)`"
            size="large"
          >
            <n-text>
              <template
                v-for="(participant, index) in group.participants"
                :key="participant.name"
              >
                <span
                  :class="{
                    'highlight-child': participant.identity === '兒童(國小以上)'
                      || participant.identity === '兒童(國小以下)'
                      || participant.identity === '0-3歲'
                  }"
                >{{ participant.name }}</span>
                <span v-if="index < group.participants.length - 1">
                  、
                </span>
              </template>
            </n-text>
          </n-card>
        </n-space>
      </n-spin>
    </div>

    <!-- 回程相調車次 -->
    <div>
      <n-space justify="center">
        <n-h1>去相調</n-h1>
      </n-space>

      <n-spin :show="loading">
        <template v-if="errorMessage && !loading">
          <n-empty :description="errorMessage" />
        </template>

        <template v-else-if="busBlendGroups.length === 0 && !loading">
          <n-empty description="暫無數據" />
        </template>

        <n-space
          v-else
          vertical
          :size="16"
        >
          <n-card
            v-for="group in busBlendGroups"
            :key="group.busName"
            :title="`${group.busName} (${group.participants.length}人)`"
            size="large"
          >
            <n-text>
              <template
                v-for="(participant, index) in group.participants"
                :key="participant.name"
              >
                <span
                  :class="{
                    'highlight-child': participant.identity === '兒童(國小以上)'
                      || participant.identity === '兒童(國小以下)'
                      || participant.identity === '0-3歲'
                  }"
                >{{ participant.name }}</span>
                <span v-if="index < group.participants.length - 1">
                  、
                </span>
              </template>
            </n-text>
          </n-card>
        </n-space>
      </n-spin>
    </div>

    <!-- 桌次名單 -->
    <div>
      <n-space justify="center">
        <n-h1>桌次名單 ({{ totalDiningCount }}人用餐)</n-h1>
      </n-space>

      <n-spin :show="loading">
        <template v-if="errorMessage && !loading">
          <n-empty :description="errorMessage" />
        </template>

        <template v-else-if="tableGroups.length === 0 && !loading">
          <n-empty description="暫無數據" />
        </template>

        <n-space
          v-else
          vertical
          :size="16"
        >
          <n-card
            v-for="group in tableGroups"
            :key="group.busName"
            :title="`${group.busName} (${group.participants.length}人)`"
            size="large"
          >
            <n-text>
              <template
                v-for="(participant, index) in group.participants"
                :key="participant.name"
              >
                <span
                  :class="{
                    'highlight-child': participant.identity === '兒童(國小以上)'
                      || participant.identity === '兒童(國小以下)'
                      || participant.identity === '0-3歲'
                  }"
                >{{ participant.name }}</span>
                <span v-if="index < group.participants.length - 1">
                  、
                </span>
              </template>
            </n-text>
          </n-card>
        </n-space>
      </n-spin>
    </div>
  </n-space>
</template>

<style scoped>
.highlight-child {
  background-color: #90EE90;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  color: green
}
</style>
