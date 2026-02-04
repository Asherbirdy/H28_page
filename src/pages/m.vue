<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'

interface DataType {
	time: '會前' | '會後'
	place: 'B1外' | 'B1内' | '一樓'
	id: string
	name: string
	subtitle: string
	description: string
	offsetX: number
	offsetY: number
	type: 'circle' | 'rect'
	size: {
		width: number
		height: number
	}
}

const data: DataType[] = [
	{
		id: '1',
		name: '會議室A',
		place: 'B1外',
		time: '會前',
		subtitle: '招1',
		description: '主要會議室',
		offsetX: -40,
		offsetY: 30,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '2',
		name: '會議室B',
		place: 'B1外',
		time: '會前',
		subtitle: '招2',
		description: '次要會議室',
		offsetX: -30,
		offsetY: 30,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '3',
		name: '接待處',
		place: 'B1外',
		time: '會前',
		subtitle: '招3',
		description: '前台接待',
		offsetX: -20,
		offsetY: 30,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '4',
		name: '休息區A',
		place: 'B1外',
		time: '會前',
		subtitle: '招4',
		description: '員工休息',
		offsetX: -10,
		offsetY: 30,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '5',
		name: '會議室C',
		place: 'B1内',
		time: '會前',
		subtitle: '招5',
		description: '小型會議室',
		offsetX: 0,
		offsetY: 30,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '6',
		name: '儲藏室',
		place: 'B1内',
		time: '會前',
		subtitle: '招6',
		description: '物品存放',
		offsetX: 10,
		offsetY: 30,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '7',
		name: '茶水間',
		place: 'B1内',
		time: '會前',
		subtitle: '招7',
		description: '飲水處',
		offsetX: 20,
		offsetY: 30,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '8',
		name: '洗手間',
		place: 'B1内',
		time: '會前',
		subtitle: '招8',
		description: '衛生設施',
		offsetX: 30,
		offsetY: 30,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '9',
		name: '辦公室A',
		place: 'B1内',
		time: '會後',
		subtitle: '招9',
		description: '行政辦公',
		offsetX: 40,
		offsetY: 30,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '10',
		name: '會議室D',
		place: '一樓',
		time: '會後',
		subtitle: '招10',
		description: '大型會議室',
		offsetX: -40,
		offsetY: 0,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '11',
		name: '展示廳',
		place: '一樓',
		time: '會後',
		subtitle: '招11',
		description: '產品展示',
		offsetX: -30,
		offsetY: 0,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '12',
		name: '休息區B',
		place: '一樓',
		time: '會後',
		subtitle: '招12',
		description: '訪客休息',
		offsetX: -20,
		offsetY: 0,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '13',
		name: '培訓室',
		place: '一樓',
		time: '會後',
		subtitle: '招13',
		description: '員工培訓',
		offsetX: -10,
		offsetY: 0,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '14',
		name: '諮詢室',
		place: '一樓',
		time: '會後',
		subtitle: '招14',
		description: '客戶諮詢',
		offsetX: 0,
		offsetY: 0,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '15',
		name: '辦公室B',
		place: '一樓',
		time: '會後',
		subtitle: '招15',
		description: '業務辦公',
		offsetX: 10,
		offsetY: 0,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '16',
		name: '會議室E',
		place: 'B1外',
		time: '會後',
		subtitle: '招16',
		description: '視訊會議室',
		offsetX: 20,
		offsetY: 0,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '17',
		name: '檔案室',
		place: 'B1内',
		time: '會後',
		subtitle: '招17',
		description: '文件存檔',
		offsetX: 30,
		offsetY: 0,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '18',
		name: '打印室',
		place: 'B1内',
		time: '會後',
		subtitle: '招18',
		description: '影印列印',
		offsetX: 40,
		offsetY: 0,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '19',
		name: '休息區C',
		place: '一樓',
		time: '會前',
		subtitle: '招19',
		description: '戶外休息',
		offsetX: -40,
		offsetY: -30,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '20',
		name: '會議室F',
		place: '一樓',
		time: '會前',
		subtitle: '招20',
		description: '董事會議室',
		offsetX: -30,
		offsetY: -30,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	}
]

// 獲取所有唯一的 time 值
const uniqueTimes = computed(() => {
	const times = [...new Set(data.map(item => item.time))]
	return times.sort()
})

// 當前選中的 tab
const currentTab = ref<string>(uniqueTimes.value[0])

// 根據當前 tab 過濾數據
const filteredData = computed(() => {
	return data.filter(item => item.time === currentTab.value)
})
</script>

<template>
  <div class="page-container">
    <n-tabs
      v-model:value="currentTab"
      type="line"
      animated
    >
      <n-tab-pane
        v-for="time in uniqueTimes"
        :key="time"
        :name="time"
        :tab="time"
      >
        <div class="block">
          <!-- 中心點標記 -->
          <div class="center-mark"></div>
          <!-- 名字項目 -->
          <div
            v-for="item in filteredData"
            :key="item.id"
            class="item"
            :class="{
              'item-circle': item.type === 'circle',
              'item-rect': item.type === 'rect'
            }"
            :style="{
              left: `calc(50% + ${item.offsetX}%)`,
              top: `calc(50% - ${item.offsetY}%)`,
              ...(item.size ? {
                width: `${item.size.width * 50}px`,
                height: `${item.size.height * 50}px`
              } : {})
            }"
          >
            <div class="item-content">
              <div v-if="item.subtitle" class="item-subtitle">
                {{ item.subtitle }}
              </div>
              <div class="item-name">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>
.page-container {
	padding: 16px;
	max-width: 1200px;
	margin: 0 auto;
}

:deep(.n-tabs) {
	margin-bottom: 16px;
}

.block {
	position: relative;
	width: 100%;
	aspect-ratio: 2 / 1;
	border: 2px solid #000;
	background: #fff;
}

.center-mark {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 8px;
	height: 8px;
	background: #000;
	border-radius: 50%;
	transform: translate(-50%, -50%);
}

.item {
	position: absolute;
	transform: translate(-50%, -50%);
	font-size: 10px;
	color: #000;
	display: flex;
	align-items: center;
	justify-content: center;
}

.item-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
}

.item-subtitle {
	font-size: 8px;
	opacity: 0.7;
	white-space: nowrap;
}

.item-name {
	white-space: nowrap;
}

.item-circle {
	border: 1px solid #000;
	border-radius: 50%;
	padding: 8px 12px;
}

.item-rect {
	border: 1px solid #000;
	border-radius: 4px;
	padding: 8px;
}

@media (max-width: 640px) {
	.page-container {
		padding: 12px;
	}

	.item {
		font-size: 8px;
	}

	.center-mark {
		width: 6px;
		height: 6px;
	}
}
</style>
