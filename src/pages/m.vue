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

const data: DataType[] = [
	...floorOneEnv,
	...b1outEnv,
	...b1inEnv,
	{
		id: '1',
		name: '會議室A',
		place: Place.b1out,
		time: Time.front,
		title: '招1',
		description: '主要會議室',
		offsetX: -40,
		offsetY: 30,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '2',
		name: '會議室B',
		place: Place.b1out,
		time: Time.front,
		title: '招2',
		description: '次要會議室',
		offsetX: -30,
		offsetY: 30,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '3',
		name: '接待處',
		place: Place.b1out,
		time: Time.front,
		title: '招3',
		description: '前台接待',
		offsetX: -20,
		offsetY: 30,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '4',
		name: '休息區A',
		place: Place.b1out,
		time: Time.front,
		title: '招4',
		description: '員工休息',
		offsetX: -10,
		offsetY: 30,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '5',
		name: '會議室C',
		place: Place.b1in,
		time: Time.front,
		title: '招5',
		description: '小型會議室',
		offsetX: 0,
		offsetY: 30,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '6',
		name: '儲藏室',
		place: Place.b1in,
		time: Time.front,
		title: '招6',
		description: '物品存放',
		offsetX: 10,
		offsetY: 30,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '7',
		name: '茶水間',
		place: Place.b1in,
		time: Time.front,
		title: '招7',
		description: '飲水處',
		offsetX: 20,
		offsetY: 30,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '8',
		name: '洗手間',
		place: Place.b1in,
		time: Time.front,
		title: '招8',
		description: '衛生設施',
		offsetX: 30,
		offsetY: 30,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '9',
		name: '辦公室A',
		place: Place.b1in,
		time: Time.back,
		title: '招9',
		description: '行政辦公',
		offsetX: 40,
		offsetY: 30,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '10',
		name: '會議室D',
		place: Place.floor1,
		time: Time.back,
		title: '招10',
		description: '大型會議室',
		offsetX: -40,
		offsetY: 0,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '11',
		name: '展示廳',
		place: Place.floor1,
		time: Time.back,
		title: '招11',
		description: '產品展示',
		offsetX: -30,
		offsetY: 0,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '12',
		name: '休息區B',
		place: Place.floor1,
		time: Time.back,
		title: '招12',
		description: '訪客休息',
		offsetX: -20,
		offsetY: 0,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '13',
		name: '培訓室',
		place: Place.floor1,
		time: Time.back,
		title: '招13',
		description: '員工培訓',
		offsetX: -10,
		offsetY: 0,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '14',
		name: '諮詢室',
		place: Place.floor1,
		time: Time.back,
		title: '招14',
		description: '客戶諮詢',
		offsetX: 0,
		offsetY: 0,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '15',
		name: '辦公室B',
		place: Place.floor1,
		time: Time.back,
		title: '招15',
		description: '業務辦公',
		offsetX: 10,
		offsetY: 0,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '16',
		name: '會議室E',
		place: Place.b1out,
		time: Time.back,
		title: '招16',
		description: '視訊會議室',
		offsetX: 20,
		offsetY: 0,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '17',
		name: '檔案室',
		place: Place.b1in,
		time: Time.back,
		title: '招17',
		description: '文件存檔',
		offsetX: 30,
		offsetY: 0,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '18',
		name: '打印室',
		place: Place.b1in,
		time: Time.back,
		title: '招18',
		description: '影印列印',
		offsetX: 40,
		offsetY: 0,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '19',
		name: '休息區C',
		place: Place.floor1,
		time: Time.front,
		title: '招19',
		description: '戶外休息',
		offsetX: -40,
		offsetY: -30,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	},
	{
		id: '20',
		name: '會議室F',
		place: Place.floor1,
		time: Time.front,
		title: '招20',
		description: '董事會議室',
		offsetX: -30,
		offsetY: -30,
		shape: Shape.circle,
		size: {
			width: circleSize,
			height: circleSize
		}
	}
]

// 獲取所有唯一的 time 值
const uniqueTimes = computed(() => {
	const times = [
		...new Set(data
	.map(item => item.time)
	.filter((time): time is Time => time !== undefined))]
	return times.sort()
})

// 獲取所有唯一的 place 值
const uniquePlaces = computed(() => {
	const places = [...new Set(data.map(item => item.place))]
	return places
})

// 當前選中的 tab
const state = ref({
	current: uniqueTimes.value[0] || Time.front,
	place: uniquePlaces.value[0] || Place.b1out
})

const filteredData = computed(() => data.filter(item => {
		const placeMatch = item.place === state.value.place
		const timeMatch = !item.time || item.time === state.value.current
		return placeMatch && timeMatch
	}))

	const init = async () => {
		const res = await useGoogleSheetApi.ganghuMeeting()
		console.log(res)
	}


	onMounted(() => {
		init()
	})
</script>

<template>
  <div class="p-[clamp(12px,2vw,24px)] max-w-1400px mx-auto">
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
                height: `${item.size.height * 10}%`
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
