<script setup lang="ts">
const data = [
	{
		id: '11',
		name: 'Strensiq',
		description: 'Strensiq',
		pName: 'Strensiq',
		number: 1,
		offsetX: 10,
		offsetY: 0
	},
	{
		id: '2',
		name: 'qwe',
		description: 'qwewq qwewq',
		pName: 'qeqwe q wewq ',
		number: 1,
		offsetX: -10,
		offsetY: -30
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
        :style="{
          left: `calc(50% + ${item.offsetX}%)`,
          top: `calc(50% - ${item.offsetY}%)`
        }"
      >
        {{ item.name }}
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
	font-size: 14px;
	color: #000;
	white-space: nowrap;
}

@media (max-width: 640px) {
	.page-container {
		padding: 12px;
	}

	.item {
		font-size: 12px;
	}

	.center-mark {
		width: 6px;
		height: 6px;
	}
}
</style>
