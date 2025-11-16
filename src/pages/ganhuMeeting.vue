<route lang="yaml">
  name: 'GangHu Meeting'
</route>

<script setup lang='ts'>
import { NSpace, NH1, NCard, NDataTable, NSpin, NEmpty, NButton, NText, NStatistic } from 'naive-ui'

import { fetchGanhuParticipants } from '@/hook/apis/ganhu'
import type { GanhuParticipant } from '@/types/apis/ganhu'

const participants = ref<GanhuParticipant[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadParticipants = async () => {
	loading.value = true
	error.value = null
	try {
		participants.value = await fetchGanhuParticipants()
	} catch (err) {
		error.value = '加載參與者資料失敗'
		console.error(err)
	} finally {
		loading.value = false
	}
}

const tableColumns = [
	{ title: '姓名', key: 'name' },
	{ title: '身份', key: 'identity' },
	{ title: '去程', key: 'departure' },
	{ title: '回程', key: 'returnRide' },
	{ title: '備註', key: 'notes' }
]

const getDistrictGroups = () => {
	const districts = new Map<string, GanhuParticipant[]>()

	participants.value.forEach(participant => {
		if (!districts.has(participant.districtName)) {
			districts.set(participant.districtName, [])
		}
		districts.get(participant.districtName)!.push(participant)
	})

	return Array.from(districts.entries()).map(([name, participants]) => ({
		name,
		participants: participants.sort((a, b) => a.name.localeCompare(b.name))
	})).sort((a, b) => a.name.localeCompare(b.name))
}

onMounted(() => {
	loadParticipants()
})
</script>

<template>
  <n-space
    vertical
    :size="16"
    class="p-6"
  >
    <n-h1>港湖相調會議</n-h1>

    <n-spin :show="loading">
      <n-empty v-if="error" description="載入失敗">
        <template #extra>
          <n-button @click="loadParticipants">
            重新載入
          </n-button>
        </template>
      </n-empty>

      <n-space
        v-else
        vertical
        :size="16"
      >
        <n-card
          v-for="district in getDistrictGroups()"
          :key="district.name"
          :title="district.name"
        >
          <n-data-table
            :columns="tableColumns"
            :data="district.participants"
            :pagination="false"
            size="small"
          />

          <template #footer>
            <n-text depth="3">
              總計: {{ district.participants.length }} 人
            </n-text>
          </template>
        </n-card>

        <n-card title="總統計">
          <n-statistic
            label="總參與人數"
            :value="participants.length"
            suffix="人"
          />
        </n-card>
      </n-space>
    </n-spin>
  </n-space>
</template>
