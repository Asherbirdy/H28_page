<route lang="yaml">
  name: 'GangHu Meeting'
</route>

<script setup lang='ts'>
import { NSpace, NH1, NCard, NSpin, NEmpty, NButton, NText, NStatistic, NTag, NTabs, NTabPane } from 'naive-ui'

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

const getDepartureGroups = () => {
	const busParticipants = participants.value.filter(p => p.departure.includes('搭乘遊覽車'))
	const selfParticipants = participants.value.filter(p => p.departure.includes('自行前往'))

	return {
		bus: sortByDistrict(busParticipants),
		self: sortByDistrict(selfParticipants)
	}
}

const getAfternoonGroups = () => {
	const busParticipants = participants.value.filter(p => p.returnRide.includes('參加相調(搭遊覽車)'))
	const noneParticipants = participants.value.filter(p => p.returnRide.includes('不參加相調(自行回程)'))
	const selfParticipants = participants.value.filter(p => p.returnRide.includes('參加相調(自行前往)'))

	return {
		bus: sortByDistrict(busParticipants),
		none: sortByDistrict(noneParticipants),
		self: sortByDistrict(selfParticipants)
	}
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
        <n-tabs
          v-model:value="activeTab"
          type="line"
          animated
        >
          <!-- 去程 Tab -->
          <n-tab-pane name="departure" tab="去程">
            <n-space vertical :size="16">
              <n-card title="去程搭乘遊覽車">
                <n-space>
                  <n-tag
                    v-for="participant in getDepartureGroups().bus"
                    :key="participant.name"
                    :type="getDistrictColor(participant.districtName)"
                  >
                    {{ participant.name }} ({{ getDistrictDisplay(participant.districtName) }})
                  </n-tag>
                </n-space>
                <template #footer>
                  <n-text depth="3">
                    總計: {{ getDepartureGroups().bus.length }} 人
                  </n-text>
                </template>
              </n-card>

              <n-card title="自行前往">
                <n-space>
                  <n-tag
                    v-for="participant in getDepartureGroups().self"
                    :key="participant.name"
                    :type="getDistrictColor(participant.districtName)"
                  >
                    {{ participant.name }} ({{ getDistrictDisplay(participant.districtName) }})
                  </n-tag>
                </n-space>
                <template #footer>
                  <n-text depth="3">
                    總計: {{ getDepartureGroups().self.length }} 人
                  </n-text>
                </template>
              </n-card>
            </n-space>
          </n-tab-pane>

          <!-- 下午程 Tab -->
          <n-tab-pane name="afternoon" tab="下午程">
            <n-space vertical :size="16">
              <n-card title="參加相調(搭遊覽車)">
                <n-space>
                  <n-tag
                    v-for="participant in getAfternoonGroups().bus"
                    :key="participant.name"
                    :type="getDistrictColor(participant.districtName)"
                  >
                    {{ participant.name }} ({{ getDistrictDisplay(participant.districtName) }})
                  </n-tag>
                </n-space>
                <template #footer>
                  <n-text depth="3">
                    總計: {{ getAfternoonGroups().bus.length }} 人
                  </n-text>
                </template>
              </n-card>

              <n-card title="不參加相調(自行回程)">
                <n-space>
                  <n-tag
                    v-for="participant in getAfternoonGroups().none"
                    :key="participant.name"
                    :type="getDistrictColor(participant.districtName)"
                  >
                    {{ participant.name }} ({{ getDistrictDisplay(participant.districtName) }})
                  </n-tag>
                </n-space>
                <template #footer>
                  <n-text depth="3">
                    總計: {{ getAfternoonGroups().none.length }} 人
                  </n-text>
                </template>
              </n-card>

              <n-card title="參加相調(自行前往)">
                <n-space>
                  <n-tag
                    v-for="participant in getAfternoonGroups().self"
                    :key="participant.name"
                    :type="getDistrictColor(participant.districtName)"
                  >
                    {{ participant.name }} ({{ getDistrictDisplay(participant.districtName) }})
                  </n-tag>
                </n-space>
                <template #footer>
                  <n-text depth="3">
                    總計: {{ getAfternoonGroups().self.length }} 人
                  </n-text>
                </template>
              </n-card>
            </n-space>
          </n-tab-pane>
        </n-tabs>

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
