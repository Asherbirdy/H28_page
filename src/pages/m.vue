<script setup lang="ts">
import { useGoogleSheetApi } from '@/hooks'
import { NTabs, NTabPane, NRadioGroup, NRadioButton } from 'naive-ui'

enum Time {
	front = '會前',
	back = '會後'
}
enum Place {
	b1out = 'B1外',
	b1in = 'B1内',
	floor1 = '一樓'
}

enum Shape {
	circle = 'circle',
	rect = 'rect'
}

const circleSize = 1

interface DataType {
	time?: Time // 可選屬性，沒有 time 表示在所有時段都顯示
	place: Place
	id: string
	name: string
	title: string
	description: string
	offsetX: number
	offsetY: number
	shape: Shape
	size: {
		width: number
		height: number
	}
}

const testOffset = ref({
	x: 0,
	y: 0
})


const floorOneEnv: DataType[] = [
	{
		id: 'elevator',
		name: '手扶梯',
		place: Place.floor1,
		title: '',
		description: '電梯',
		offsetX: -40,
		offsetY: -0,
		shape: Shape.rect,
		size: {
			width: 1,
			height: 0.5
		}
	}
]

const b1outEnv: DataType[] = [
	{
		id: 'exit1',
		name: '出口',
		place: Place.b1out,
		title: '',
		description: '出口',
		offsetX: 40,
		offsetY: -20,
		shape: Shape.rect,
		size: {
			width: 1,
			height: 0.5
		}
	}
]

const b1inEnv: DataType[] = [
	{
		id: 'exit1',
		name: '出口',
		place: Place.b1in,
		title: '',
		description: '出口',
		offsetX: 40,
		offsetY: -20,
		shape: Shape.rect,
		size: {
			width: 1,
			height: 0.5
		}
	}
]

// 檢查 URL query 是否有 test=Y
const route = useRoute()
const isTestMode = computed(() => route.query.test === 'Y')

const data = ref<DataType[]>([
	...floorOneEnv,
	...b1outEnv,
	...b1inEnv
])

// 獲取所有唯一的 time 值
const uniqueTimes = computed(() => {
	const times = [
		...new Set(data.value
	.map(item => item.time)
	.filter((time): time is Time => time !== undefined))]
	return times.sort()
})

// 獲取所有唯一的 place 值
const uniquePlaces = computed(() => {
	const places = [...new Set(data.value.map(item => item.place))]
	return places
})

// 當前選中的 tab
const state = ref({
	current: uniqueTimes.value[0] || Time.front,
	place: uniquePlaces.value[0] || Place.b1out
})

enum Test {
	id = 'test-1'	
}

// 測試數據 - 自動跟隨當前選中的時段和地點
const testData = computed<DataType>(() => ({
	id: Test.id,
	name: '測試項目',
	title: '測試',
	description: '這是測試資料',
	place: state.value.place,
	time: state.value.current,
	offsetX: testOffset.value.x,
	offsetY: testOffset.value.y,
	shape: Shape.circle,
	size: {
		width: circleSize,
		height: circleSize
	}
}))

const filteredData = computed(() => data.value.filter(item => {
		const placeMatch = item.place === state.value.place
		const timeMatch = !item.time || item.time === state.value.current
		return placeMatch && timeMatch
	}))

// 監聽 testData 的變化，更新 data 中的 testData
watch(testData, () => {
	if (isTestMode.value) {
		const testIndex = data.value.findIndex(item => item.id === Test.id)
		if (testIndex !== -1) {
			data.value[testIndex] = { ...testData.value }
		}
	}
})

const init = async () => {
	const res = await useGoogleSheetApi.ganghuMeeting()

	// 將 API 數據轉換並添加到 data 中
	if (res && Array.isArray(res)) {
		const apiData: DataType[] = res.map((item, index) => ({
			id: `api-${index}`,
			name: item.name,
			title: item.title,
			description: item.description,
			place: item.place as Place,
			time: item.time as Time | undefined,
			offsetX: item.offsetX,
			offsetY: item.offsetY,
			shape: Shape.circle,
			size: {
				width: circleSize,
				height: circleSize
			}
		}))

		// 合併環境數據和 API 數據
		data.value = [
			...floorOneEnv,
			...b1outEnv,
			...b1inEnv,
			...apiData,
			...(isTestMode.value ? [testData.value] : [])
		]
	}
}


	onMounted(() => {
		init()
		// 如果是測試模式，添加 testData 到 data
		if (isTestMode.value) {
			data.value.push(testData.value)
		}
	})

</script>

<template>
  <div class="p-[clamp(12px,2vw,24px)] max-w-1400px mx-auto">
    <div v-if="isTestMode" class="mb-4 p-4 border border-solid border-gray-300 rounded bg-gray-50">
      <div class="text-sm font-bold mb-3">測試模式 - 調整位置</div>
      <div class="flex gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">X 座標:</label>
          <input
            v-model.number="testOffset.x"
            type="number"
            class="w-24 px-2 py-1 border border-solid border-gray-300 rounded"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Y 座標:</label>
          <input
            v-model.number="testOffset.y"
            type="number"
            class="w-24 px-2 py-1 border border-solid border-gray-300 rounded"
          />
        </div>
      </div>
    </div>

    <n-tabs
      v-model:value="state.current"
      type="line"
      animated
      class="mb-[clamp(12px,2vw,20px)]"
    >
      <n-tab-pane
        v-for="time in uniqueTimes"
        :key="time"
        :name="time"
        :tab="time"
      >
        <div class="mb-[clamp(16px,2.5vw,24px)] flex justify-start">
          <n-radio-group v-model:value="state.place">
            <n-radio-button
              v-for="place in uniquePlaces"
              :key="place"
              :value="place"
            >
              {{ place }}
            </n-radio-button>
          </n-radio-group>
        </div>
        <div class="relative w-full aspect-[2/1] border-[max(1px,0.2vw)] border-solid border-black bg-white text-[clamp(8px,1vw,14px)]">
          <!-- 名字項目 -->
          <div
            v-for="item in filteredData"
            :key="item.id"
            class="absolute -translate-x-1/2 -translate-y-1/2 text-1em color-black flex items-center justify-center"
            :class="[
              item.shape === 'circle' ? 'border-[max(1px,0.1vw)] border-solid border-black rounded-full px-1.2em py-0.8em' : '',
              item.shape === 'rect' ? 'border-[max(1px,0.1vw)] border-solid border-black rounded-0.4em p-0.8em' : ''
            ]"
            :style="{
              left: `calc(50% + ${item.offsetX}%)`,
              top: `calc(50% - ${item.offsetY}%)`,
              ...(item.size ? {
                width: `${item.size.width * 5}%`,
                height: `${item.size.height * 10.5}%`
              } : {})
            }"
          >
            <div class="flex flex-col items-center gap-0.2em">
              <div v-if="item.title" class="text-1em opacity-70 whitespace-nowrap">
                {{ item.title }}
              </div>
              <div class="whitespace-nowrap">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

