<script setup lang='ts'>
import { useHead } from '@vueuse/head'
import { NSpace, NCard, NText, NSpin, NEmpty, NH2, NBackTop, NTabs, NTabPane, NTag, NFloatButton, NModal, NSelect, NResult } from 'naive-ui'

import { fetchGanhuParticipants } from '@/hook/apis/ganhu'
import type { GanhuParticipant } from '@/types/apis/ganhu'

// 設定頁面標題和 meta
useHead({
	title: '6/7港湖集中',
	// meta: [
	// 	{
	// 		name: 'description',
	// 		content: '28會所 12月7日港湖集中主日行前確認表，包含遊覽車安排與餐桌座位'
	// 	}
	// ]
})

interface BusGroup {
	busName: string
	participants: GanhuParticipant[]
}

const loading = ref(false)
const participants = ref<GanhuParticipant[]>([])
const errorMessage = ref('')

// Tab 狀態
const activeTab = ref('departure')

// 中文數字映射
const chineseNumMap: Record<string, number> = {
	'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
}

// 提取車次/桌次數字（支援中文與阿拉伯數字）
const extractNumber = (str: string): number => {
	// 先嘗試匹配中文數字
	for (const [chinese, num] of Object.entries(chineseNumMap)) {
		if (str.includes(chinese)) {
			return num
		}
	}
	// 如果沒有中文數字，嘗試匹配阿拉伯數字
	const match = str.match(/(\d+)/)
	// 沒有任何數字的車次排到最後，確保一車、二車在最上面
	return match ? parseInt(match[0]) : Number.MAX_SAFE_INTEGER
}

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
			return extractNumber(a.busName) - extractNumber(b.busName)
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
			return extractNumber(a.busName) - extractNumber(b.busName)
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

// 區域排序
const districtOrder = ['一區', '二區', '三區', '四區']

// 將同一車次的名單再依區別分組
const groupByDistrict = (list: GanhuParticipant[]) => {
	const groups: { district: string, participants: GanhuParticipant[] }[] = []

	// 先依固定區別順序
	for (const district of districtOrder) {
		const ps = list.filter(p => p.districtName === district)
		if (ps.length > 0) {
			groups.push({ district, participants: ps })
		}
	}

	// 其餘未列在順序內的區別
	const others = new Map<string, GanhuParticipant[]>()
	list.forEach(p => {
		if (!districtOrder.includes(p.districtName)) {
			if (!others.has(p.districtName)) others.set(p.districtName, [])
			others.get(p.districtName)!.push(p)
		}
	})
	others.forEach((participants, district) => groups.push({ district, participants }))

	return groups
}

const getParticipantCounts = (participants: GanhuParticipant[]) => {
	const childCount = participants.filter(p => p.identity === '12歲以下').length
	const adultCount = participants.length - childCount
	return {
		adultCount,
		childCount
	}
}

const getBusLeader = (busName: string) => {
	// if (busName.includes('一車')) return '車長：人溢、劍弘(配搭)'
	// if (busName.includes('二車')) return '車長：耀哲、仰恩(配搭)'
	if (busName.includes('一車')) return ''
	if (busName.includes('二車')) return ''
	return ''
}

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

// ===== 個人查詢（右下角浮動按鈕） =====
const showMyInfo = ref(false)
const selectedIndex = ref<number | null>(null)

// 以 index 當 value，避免同名衝突
const nameOptions = computed(() => {
	if (!Array.isArray(participants.value)) return []
	return participants.value.map((p, index) => ({
		label: p.districtName ? `${p.name}（${p.districtName}）` : p.name,
		value: index
	}))
})

const myInfo = computed(() => {
	if (selectedIndex.value === null) return null
	return participants.value[selectedIndex.value] ?? null
})

const isEmptyValue = (val?: string) => !val || val === '無' || val === '無需搭車' || val === '無用餐'

const openMyInfo = () => {
	showMyInfo.value = true
}
</script>

<template>
  <div>
    <n-tabs
      v-model:value="activeTab"
      type="segment"
      animated
      size="large"
    >
      <!-- 去程 Tab -->
      <n-tab-pane name="departure" tab="去程[東湖出發]">
        <n-space
          vertical
          :size="32"
        >
          <!-- 去程車次 -->
          <div>
        <n-space justify="center">
          <n-h2>去程[東湖->信基]</n-h2>
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
              size="large"
            >
              <template #header>
                <div class="bus-header">
                  <span>
                    {{ group.busName }} 共<span
                      :class="{ 'bus-overload': getParticipantCounts(group.participants).adultCount + getParticipantCounts(group.participants).childCount > 42 }"
                    >{{ getParticipantCounts(group.participants).adultCount + getParticipantCounts(group.participants).childCount }}</span>人<span
                      v-if="getParticipantCounts(group.participants).adultCount + getParticipantCounts(group.participants).childCount > 42"
                      class="bus-overload"
                    > 超載 {{ getParticipantCounts(group.participants).adultCount + getParticipantCounts(group.participants).childCount - 42 }} 位</span>
                  </span>
                  <span
                    v-if="getBusLeader(group.busName)"
                    class="bus-leader"
                  >{{ getBusLeader(group.busName) }}</span>
                </div>
              </template>
              <n-space vertical :size="6">
                <div
                  v-for="districtGroup in groupByDistrict(group.participants)"
                  :key="districtGroup.district"
                  class="district-row"
                >
                  <n-tag size="small" :bordered="false" type="info" class="district-label">
                    {{ districtGroup.district }}
                  </n-tag>
                  <n-text>
                    <template
                      v-for="(participant, index) in districtGroup.participants"
                      :key="participant.name"
                    >
                      <span>{{ participant.name }}{{ participant.identity === '男介朋友' || participant.identity === '女介朋友' ? '(福)' : '' }}</span>
                      <span v-if="index < districtGroup.participants.length - 1">、</span>
                    </template>
                  </n-text>
                </div>
              </n-space>
            </n-card>
          </n-space>
        </n-spin>
      </div>
        </n-space>
      </n-tab-pane>

      <!-- 去餐廳 Tab -->
      <n-tab-pane name="blend" tab="相調[信基出發]">
        <n-space
          vertical
          :size="32"
        >
          <!-- 回程相調車次 -->
      <div>
        <n-space justify="center">
          <n-h2>去餐廳[信基->餐廳]</n-h2>
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
              size="large"
            >
              <template #header>
                <div class="bus-header">
                  <span>
                    {{ group.busName }} 共<span
                      :class="{ 'bus-overload': getParticipantCounts(group.participants).adultCount + getParticipantCounts(group.participants).childCount > 42 }"
                    >{{ getParticipantCounts(group.participants).adultCount + getParticipantCounts(group.participants).childCount }}</span>人<span
                      v-if="getParticipantCounts(group.participants).adultCount + getParticipantCounts(group.participants).childCount > 42"
                      class="bus-overload"
                    > 超載 {{ getParticipantCounts(group.participants).adultCount + getParticipantCounts(group.participants).childCount - 42 }} 位</span>
                  </span>
                  <span
                    v-if="getBusLeader(group.busName)"
                    class="bus-leader"
                  >{{ getBusLeader(group.busName) }}</span>
                </div>
              </template>
              <n-space vertical :size="6">
                <div
                  v-for="districtGroup in groupByDistrict(group.participants)"
                  :key="districtGroup.district"
                  class="district-row"
                >
                  <n-tag size="small" :bordered="false" type="info" class="district-label">
                    {{ districtGroup.district }}
                  </n-tag>
                  <n-text>
                    <template
                      v-for="(participant, index) in districtGroup.participants"
                      :key="participant.name"
                    >
                      <span>{{ participant.name }}{{ participant.identity === '男介朋友' || participant.identity === '女介朋友' ? '(福)' : '' }}</span>
                      <span v-if="index < districtGroup.participants.length - 1">、</span>
                    </template>
                  </n-text>
                </div>
              </n-space>
            </n-card>
          </n-space>
        </n-spin>
      </div>
        </n-space>
      </n-tab-pane>

      <!-- 桌次名單 Tab -->
      <n-tab-pane name="table" tab="桌次名單">
        <n-space
          vertical
          :size="32"
        >
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
              size="large"
            >
              <template #header>
                <div>
                  <div>{{ group.busName }} 共{{ getParticipantCounts(group.participants).adultCount + getParticipantCounts(group.participants).childCount }}人</div>
                  <!-- <div
                    v-if="getParticipantCounts(group.participants).childCount > 0"
                    class="child-detail"
                  >
                    兒童(12歲以下):{{ getParticipantCounts(group.participants).childCount }}
                  </div> -->
                </div>
              </template>
              <n-text>
                <template
                  v-for="(participant, index) in group.participants"
                  :key="participant.name"
                >
                  <span
                    :class="{
                      'highlight-child': participant.identity === '12歲以下',
                      'highlight-friend': participant.identity === '男介朋友' || participant.identity === '女介朋友'
                    }"
                  >{{ participant.name }}{{ participant.identity === '男介朋友' || participant.identity === '女介朋友' ? '(福)' : '' }}</span>
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
      </n-tab-pane>
    </n-tabs>

    <!-- 返回頂部按鈕 -->
    <n-back-top :right="40" :bottom="80" />

    <!-- 右下角浮動按鈕：查詢個人車次/桌次 -->
    <n-float-button
      :right="40"
      :bottom="160"
      type="primary"
      :width="68"
      :height="68"
      shape="circle"
      @click="openMyInfo"
    >
      <span class="float-btn-text">查我的<br>位置在哪</span>
    </n-float-button>

    <!-- 個人資訊視窗 -->
    <n-modal
      v-model:show="showMyInfo"
      preset="card"
      title="查詢我的車次與桌次"
      :style="{ maxWidth: '420px', width: '90%' }"
      :bordered="false"
    >
      <n-space vertical :size="16">
        <n-select
          v-model:value="selectedIndex"
          :options="nameOptions"
          placeholder="請輸入或選擇你的名字"
          filterable
          clearable
          size="large"
        />

        <n-card v-if="myInfo" size="small" :bordered="true">
          <n-space vertical :size="14">
            <div class="info-name">
              {{ myInfo.name }}
              <span v-if="myInfo.districtName" class="info-district">{{ myInfo.districtName }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">去程車</span>
              <n-tag v-if="!isEmptyValue(myInfo.busGo)" type="success" :bordered="false" size="large">
                {{ myInfo.busGo }}
              </n-tag>
              <n-text v-else depth="3">無需搭車</n-text>
            </div>

            <div class="info-row">
              <span class="info-label">相調車</span>
              <n-tag v-if="!isEmptyValue(myInfo.busBlend)" type="info" :bordered="false" size="large">
                {{ myInfo.busBlend }}
              </n-tag>
              <n-text v-else depth="3">無需搭車</n-text>
            </div>

            <div class="info-row">
              <span class="info-label">桌次</span>
              <n-tag v-if="!isEmptyValue(myInfo.table)" type="warning" :bordered="false" size="large">
                {{ myInfo.table }}
              </n-tag>
              <n-text v-else depth="3">無用餐</n-text>
            </div>
          </n-space>
        </n-card>

        <n-result
          v-else
          status="info"
          title="請選擇你的名字"
          description="選擇後會顯示你的車次與桌次"
          size="small"
        />
      </n-space>
    </n-modal>
  </div>
</template>

<style scoped>
.highlight-child {
  background-color: #90EE90;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  color: green
}

.highlight-friend {
  background-color: #FFA500;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  color: #fff;
}

.child-detail {
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
  font-weight: normal;
}

.bus-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.bus-leader {
  font-size: 0.9rem;
  color: #666;
  font-weight: normal;
}

.bus-overload {
  color: #d03050;
  font-weight: 700;
}

.district-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.district-label {
  flex-shrink: 0;
  align-self: flex-start;
}

.info-name {
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-district {
  font-size: 0.85rem;
  font-weight: normal;
  color: #666;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-label {
  width: 56px;
  flex-shrink: 0;
  color: #666;
  font-size: 0.95rem;
}

.float-btn-text {
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
}
</style>
