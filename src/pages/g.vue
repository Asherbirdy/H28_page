<route lang="yaml">
  name: 'GangHu Meeting'
</route>

<script setup lang='ts'>
import { NSpace, NCard, NSpin, NEmpty, NButton, NTag, NTabs, NTabPane, NText, NCheckbox, NCheckboxGroup } from 'naive-ui'

import { fetchGanhuParticipants } from '@/hook/apis/ganhu'
import type { GanhuParticipant } from '@/types/apis/ganhu'

const participants = ref<GanhuParticipant[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Tab 狀態
const activeTab = ref('departure')

// 區域過濾
const selectedDistricts = ref<string[]>(['一區', '二區', '三區', '四區'])
const allDistricts = ['一區', '二區', '三區', '四區']

// 統計資訊顯示開關
const showDetailedStats = ref(true)

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

const getDistrictColor = (districtName: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
	const colors: ('success' | 'info' | 'warning' | 'error')[] = ['success', 'info', 'warning', 'error']
	const districts = ['一區', '二區', '三區', '四區']
	const index = districts.indexOf(districtName)
	return index !== -1 ? colors[index] : 'default'
}

const getDistrictDisplay = (districtName: string) => {
	return districtName.replace('區', '')
}

const getParticipantLabel = (participant: GanhuParticipant) => {
	if (participant.identity === '兒童(國小以上)' || participant.identity === '兒童(國小以下)') {
		return `${participant.name} (兒)`
	}
	return participant.name
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
		if (!selectedDistricts.value.includes(district)) continue
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
	// Handle both potential spellings to be safe, or just the requested one.
	// User specifically asked for "不客前往".
	const noneParticipants = participants.value.filter(p => p.departure.includes('不克前往') || p.departure.includes('不克前往'))

	return {
		bus: groupByDistrictForDisplay(busParticipants),
		self: groupByDistrictForDisplay(selfParticipants),
		none: groupByDistrictForDisplay(noneParticipants)
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
	// 也要過濾掉去程為"不克前往"或"不客前往"的參與者
	const validParticipants = participants.value.filter(p =>
		!p.departure.includes('未選擇') &&
		!p.returnRide.includes('未選擇') &&
		!p.departure.includes('不克前往') &&
		!p.departure.includes('不克前往')
	)

	const totalParticipants = validParticipants.length
	const childrenUpper = validParticipants.filter(p => p.identity === '兒童(國小以上)').length
	const childrenLower = validParticipants.filter(p => p.identity === '兒童(國小以下)').length
	const children = childrenUpper + childrenLower
	const adults = totalParticipants - children

	// 統計福新朋友、男介、女介 - 取得名字列表
	const fuxinFriendsList = validParticipants.filter(p => p.identity.includes('福新朋友') || p.identity.includes('福音朋友')).map(p => p.name)
	const maleIntroList = validParticipants.filter(p => p.identity.includes('男介')).map(p => p.name)
	const femaleIntroList = validParticipants.filter(p => p.identity.includes('女介')).map(p => p.name)

	return {
		total: totalParticipants,
		adults,
		children,
		childrenUpper,
		childrenLower,
		fuxinFriendsList,
		maleIntroList,
		femaleIntroList
	}
})

// 計算每個分類的人數
const getCategoryCount = (groups: { district: string, participants: GanhuParticipant[] }[]) => {
	return groups.reduce((total, group) => total + group.participants.length, 0)
}

// 計算各區人數
const getDistrictStatistics = computed(() => {
	// 過濾掉去程為"未選擇"或"不克前往"的參與者
	const validParticipants = participants.value.filter(p =>
		!p.departure.includes('未選擇') &&
		!p.returnRide.includes('未選擇') &&
		!p.departure.includes('不克前往') &&
		!p.departure.includes('不克前往')
	)

	const districts = ['一區', '二區', '三區', '四區']
	return districts.map(district => {
		const districtParticipants = validParticipants.filter(p => p.districtName === district)
		const children = districtParticipants.filter(p =>
			p.identity === '兒童(國小以上)' || p.identity === '兒童(國小以下)'
		).length
		return {
			name: district,
			count: districtParticipants.length,
			children
		}
	})
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

    <!-- 區域過濾 -->
    <n-space align="center">
      <span style="font-weight: 500;">
        篩選區域:
      </span>
      <n-checkbox-group v-model:value="selectedDistricts">
        <n-checkbox
          v-for="district in allDistricts"
          :key="district"
          :value="district"
          :label="district"
        />
      </n-checkbox-group>
    </n-space>
    <p>12/7 H28港湖集中主日報名</p>
    <!-- 統計時間 -->
    <!-- <n-text depth="3" style="font-size: 14px;">
      統計時間: {{ currentTime }}
    </n-text> -->

    <!-- 統計資訊 -->
    <n-space align="center">
      <n-checkbox v-model:checked="showDetailedStats" label="統計資訊" />
      <n-space v-if="showDetailedStats && !loading && !error">
        <n-text>參加: {{ getStatistics.adults }} 位</n-text>
        <n-text>兒童: {{ getStatistics.children }} 位</n-text>
        <n-text>總計: {{ getStatistics.total }} 位</n-text>
      </n-space>
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
              <n-card :title="`搭遊覽車去信基大樓 (${getCategoryCount(getDepartureGroups().bus)}人)`">
                <n-space vertical :size="8">
                  <div v-for="group in getDepartureGroups().bus" :key="group.district">
                    <n-space>
                      <n-tag
                        v-for="participant in group.participants"
                        :key="participant.name"
                        :type="getDistrictColor(participant.districtName)"
                      >
                        {{ getParticipantLabel(participant) }}
                      </n-tag>
                    </n-space>
                  </div>
                </n-space>
              </n-card>

              <n-card :title="`自行前往信基大樓 (${getCategoryCount(getDepartureGroups().self)}人)`">
                <n-space vertical :size="8">
                  <div v-for="group in getDepartureGroups().self" :key="group.district">
                    <n-space>
                      <n-tag
                        v-for="participant in group.participants"
                        :key="participant.name"
                        :type="getDistrictColor(participant.districtName)"
                      >
                        {{ getParticipantLabel(participant) }}
                      </n-tag>
                    </n-space>
                  </div>
                </n-space>
              </n-card>

              <n-card :title="`不克前往 (${getCategoryCount(getDepartureGroups().none)}人)`">
                <n-space vertical :size="8">
                  <div v-for="group in getDepartureGroups().none" :key="group.district">
                    <n-space>
                      <n-tag
                        v-for="participant in group.participants"
                        :key="participant.name"
                        :type="getDistrictColor(participant.districtName)"
                      >
                        {{ getParticipantLabel(participant) }}
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
              <n-card :title="`參加相調(搭遊覽車) (${getCategoryCount(getAfternoonGroups().bus)}人)`">
                <n-space vertical :size="8">
                  <div v-for="group in getAfternoonGroups().bus" :key="group.district">
                    <n-space>
                      <n-tag
                        v-for="participant in group.participants"
                        :key="participant.name"
                        :type="getDistrictColor(participant.districtName)"
                      >
                        {{ getParticipantLabel(participant) }}
                      </n-tag>
                    </n-space>
                  </div>
                </n-space>
              </n-card>

              <n-card :title="`參加相調(自行前往) (${getCategoryCount(getAfternoonGroups().self)}人)`">
                <n-space vertical :size="8">
                  <div v-for="group in getAfternoonGroups().self" :key="group.district">
                    <n-space>
                      <n-tag
                        v-for="participant in group.participants"
                        :key="participant.name"
                        :type="getDistrictColor(participant.districtName)"
                      >
                        {{ getParticipantLabel(participant) }}
                      </n-tag>
                    </n-space>
                  </div>
                </n-space>
              </n-card>

              <n-card :title="`不參加相調(自行回程) (${getCategoryCount(getAfternoonGroups().none)}人)`">
                <n-space vertical :size="8">
                  <div v-for="group in getAfternoonGroups().none" :key="group.district">
                    <n-space>
                      <n-tag
                        v-for="participant in group.participants"
                        :key="participant.name"
                        :type="getDistrictColor(participant.districtName)"
                      >
                        {{ getParticipantLabel(participant) }}
                      </n-tag>
                    </n-space>
                  </div>
                </n-space>
              </n-card>
            </n-space>
          </n-tab-pane>

          <!-- 資訊 Tab -->
          <n-tab-pane name="info" tab="資訊">
            <n-card title="12/7 H28港湖集中主日報名統計資訊">
              <n-space vertical :size="12">
                <n-text>
                  參加: {{ getStatistics.adults }} 位
                </n-text>
                <n-text>
                  國小以上兒童：{{ getStatistics.childrenUpper }} 位
                </n-text>
                <n-text>
                  國小以下兒童：{{ getStatistics.childrenLower }} 位
                </n-text>
                <n-text style="font-size: 16px; font-weight: 500;">
                  總計: {{ getStatistics.total }} 位
                </n-text>

                <div>—</div>

                <div v-for="district in getDistrictStatistics" :key="district.name">
                  <n-text>{{ district.name }}：{{ district.count }} 位 (包含 {{ district.children }} 位兒童)</n-text>
                </div>

                <div>—</div>

                <n-text>
                  福音朋友
                </n-text>
                <n-text>
                  男介：{{ getStatistics.maleIntroList.length > 0 ? getStatistics.maleIntroList.join('、') : '無' }}
                </n-text>
                <n-text>
                  女介：{{ getStatistics.femaleIntroList.length > 0 ? getStatistics.femaleIntroList.join('、') : '無' }}
                </n-text>

                <div>—</div>

                <n-text>
                  搭遊覽車去信基大樓 ({{ getCategoryCount(getDepartureGroups().bus) }}人) 兩台遊覽車80人還可以坐 {{ 80 - getCategoryCount(getDepartureGroups().bus) }} 人
                </n-text>
                <n-text>
                  自行前往信基大樓 ({{ getCategoryCount(getDepartureGroups().self) }}人)
                </n-text>
                <n-text>
                  參加相調(搭遊覽車) ({{ getCategoryCount(getAfternoonGroups().bus) }}人)
                </n-text>
                <n-text>
                  參加相調(自行前往) ({{ getCategoryCount(getAfternoonGroups().self) }}人)
                </n-text>
              </n-space>
            </n-card>
          </n-tab-pane>
        </n-tabs>

      </n-space>
    </n-spin>
  </n-space>
</template>
