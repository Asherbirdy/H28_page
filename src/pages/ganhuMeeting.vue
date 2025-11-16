<route lang="yaml">
  name: 'GangHu Meeting'
</route>

<script setup lang='ts'>
import { NSpace, NCard, NSpin, NEmpty, NButton, NTag, NTabs, NTabPane, NText } from 'naive-ui'

import { fetchGanhuParticipants } from '@/hook/apis/ganhu'
import type { GanhuParticipant } from '@/types/apis/ganhu'

const participants = ref<GanhuParticipant[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Tab 狀態
const activeTab = ref('departure')

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

const getDistrictColor = (districtName: string) => {
	const colors = ['success', 'info', 'warning', 'error']
	const districts = ['一區', '二區', '三區', '四區']
	const index = districts.indexOf(districtName)
	return index !== -1 ? colors[index] : 'default'
}

const getDistrictDisplay = (districtName: string) => {
	return districtName.replace('區', '')
}

const sortByDistrict = (participantList: GanhuParticipant[]) => {
	const districtOrder = ['一區', '二區', '三區', '四區']
	return participantList.sort((a, b) => {
		const aIndex = districtOrder.indexOf(a.districtName)
		const bIndex = districtOrder.indexOf(b.districtName)
		if (aIndex !== bIndex) {
			return aIndex - bIndex
		}
		return a.name.localeCompare(b.name)
	})
}

const groupByDistrictForDisplay = (participantList: GanhuParticipant[]) => {
	const districtOrder = ['一區', '二區', '三區', '四區']
	const groups = []

	for (const district of districtOrder) {
		const districtParticipants = participantList.filter(p => p.districtName === district)
		if (districtParticipants.length > 0) {
			groups.push({
				district,
				participants: districtParticipants.sort((a, b) => a.name.localeCompare(b.name))
			})
		}
	}

	return groups
}

const getDepartureGroups = () => {
	const busParticipants = participants.value.filter(p => p.departure.includes('搭乘遊覽車'))
	const selfParticipants = participants.value.filter(p => p.departure.includes('自行前往'))

	return {
		bus: groupByDistrictForDisplay(busParticipants),
		self: groupByDistrictForDisplay(selfParticipants)
	}
}

const getAfternoonGroups = () => {
	const busParticipants = participants.value.filter(p => p.returnRide.includes('參加相調(搭遊覽車)'))
	const noneParticipants = participants.value.filter(p => p.returnRide.includes('不參加相調(自行回程)'))
	const selfParticipants = participants.value.filter(p => p.returnRide.includes('參加相調(自行前往)'))

	return {
		bus: groupByDistrictForDisplay(busParticipants),
		none: groupByDistrictForDisplay(noneParticipants),
		self: groupByDistrictForDisplay(selfParticipants)
	}
}

const currentTime = ref('')

const updateCurrentTime = () => {
	const now = new Date()
	currentTime.value = now.toLocaleString('zh-TW', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})
}

const getStatistics = computed(() => {
	// 過濾掉去程或下午程為"未選擇"的參與者
	const validParticipants = participants.value.filter(p =>
		!p.departure.includes('未選擇') && !p.returnRide.includes('未選擇')
	)

	const totalParticipants = validParticipants.length
	const children = validParticipants.filter(p => p.identity.includes('兒童')).length
	const adults = totalParticipants - children

	return {
		total: totalParticipants,
		adults,
		children
	}
})

onMounted(() => {
	loadParticipants()
	updateCurrentTime()
	// 每秒更新時間
	setInterval(updateCurrentTime, 1000)
})
</script>

<template>
  <n-space
    vertical
    :size="16"
    class="p-6"
  >
    <p>12/7 H28港湖集中主日報名</p>

    <!-- 統計時間 -->
    <n-text depth="3" style="font-size: 14px;">
      統計時間: {{ currentTime }}
    </n-text>

    <!-- 統計資訊 -->
    <n-space v-if="!loading && !error">
      <n-text>參加: {{ getStatistics.adults }} 位</n-text>
      <n-text>兒童: {{ getStatistics.children }} 位</n-text>
      <n-text>總計: {{ getStatistics.total }} 位</n-text>
    </n-space>

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
        <n-tabs
          v-model:value="activeTab"
          type="line"
          animated
        >
          <!-- 去程 Tab -->
          <n-tab-pane name="departure" tab="去程">
            <n-space vertical :size="16">
              <n-card title="去程搭乘遊覽車">
                <n-space vertical :size="8">
                  <div v-for="group in getDepartureGroups().bus" :key="group.district">
                    <n-space>
                      <n-tag
                        v-for="participant in group.participants"
                        :key="participant.name"
                        :type="getDistrictColor(participant.districtName)"
                      >
                        {{ participant.name }}
                      </n-tag>
                    </n-space>
                  </div>
                </n-space>
              </n-card>

              <n-card title="自行前往">
                <n-space vertical :size="8">
                  <div v-for="group in getDepartureGroups().self" :key="group.district">
                    <n-space>
                      <n-tag
                        v-for="participant in group.participants"
                        :key="participant.name"
                        :type="getDistrictColor(participant.districtName)"
                      >
                        {{ participant.name }}
                      </n-tag>
                    </n-space>
                  </div>
                </n-space>
              </n-card>
            </n-space>
          </n-tab-pane>

          <!-- 下午程 Tab -->
          <n-tab-pane name="afternoon" tab="下午程">
            <n-space vertical :size="16">
              <n-card title="參加相調(搭遊覽車)">
                <n-space vertical :size="8">
                  <div v-for="group in getAfternoonGroups().bus" :key="group.district">
                    <n-space>
                      <n-tag
                        v-for="participant in group.participants"
                        :key="participant.name"
                        :type="getDistrictColor(participant.districtName)"
                      >
                        {{ participant.name }}
                      </n-tag>
                    </n-space>
                  </div>
                </n-space>
              </n-card>

              <n-card title="參加相調(自行前往)">
                <n-space vertical :size="8">
                  <div v-for="group in getAfternoonGroups().self" :key="group.district">
                    <n-space>
                      <n-tag
                        v-for="participant in group.participants"
                        :key="participant.name"
                        :type="getDistrictColor(participant.districtName)"
                      >
                        {{ participant.name }}
                      </n-tag>
                    </n-space>
                  </div>
                </n-space>
              </n-card>

              <n-card title="不參加相調(自行回程)">
                <n-space vertical :size="8">
                  <div v-for="group in getAfternoonGroups().none" :key="group.district">
                    <n-space>
                      <n-tag
                        v-for="participant in group.participants"
                        :key="participant.name"
                        :type="getDistrictColor(participant.districtName)"
                      >
                        {{ participant.name }}
                      </n-tag>
                    </n-space>
                  </div>
                </n-space>
              </n-card>
            </n-space>
          </n-tab-pane>
        </n-tabs>

      </n-space>
    </n-spin>
  </n-space>
</template>
