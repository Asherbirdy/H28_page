<script setup lang="ts">
interface DataType {
	id: string
	name: string
	time: '會前' | '會後'
	place: 'B1外' | 'B1内' | '一樓'
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
		name: 'H28連連一',
		place: 'B1外',
		time: '會前',
		subtitle: '招1',
		description: 'Strensiq',
		offsetX: 10,
		offsetY: 0,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '2',
		name: 'H28連連二',
		place: 'B1外',
		time: '會前',
		subtitle: '招2',
		description: 'qwewq qwewq',
		offsetX: -10,
		offsetY: -30,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '3',
		name: 'H28連連二',
		place: 'B1外',
		time: '會前',
		subtitle: '招3',
		description: 'qwewq qwewq',
		offsetX: -10,
		offsetY: -0,
		type: 'circle',
		size: {
			width: 0.5,
			height: 0.5
		}
	},
	{
		id: '4',
		name: '電梯',
		place: 'B1外',
		time: '會前',
		subtitle: '',
		description: 'qwewq qwewq',
		offsetX: -43,
		offsetY: -25,
		type: 'rect',
		size: {
			width: 4,
			height: 1
		}
	}
]
</script>

<template>
  <div class="page-container">
    <div class="block">
      <!-- 中心點標記 -->
      <div class="center-mark"></div>
      <!-- 名字項目 -->
      <div
        v-for="item in data"
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
  </div>
</template>

<style scoped>
.page-container {
	padding: 16px;
	max-width: 800px;
	margin: 0 auto;
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
