<route lang="yaml">
  name: 'GangHu Meeting'
</route>

<script setup lang='ts'>
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
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">
      港湖相調會議
    </h1>

    <div v-if="loading" class="text-center py-8">
      <div>加載中...</div>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
      <button class="ml-4 px-4 py-2 bg-blue-500 text-white rounded" @click="loadParticipants">
        重新載入
      </button>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="district in getDistrictGroups()"
        :key="district.name"
        class="bg-white rounded-lg shadow p-4"
      >
        <h2 class="text-xl font-semibold mb-4 text-blue-600">
          {{ district.name }}
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="border p-2 text-left">
                  姓名
                </th>
                <th class="border p-2 text-left">
                  身份
                </th>
                <th class="border p-2 text-left">
                  去程
                </th>
                <th class="border p-2 text-left">
                  回程
                </th>
                <th class="border p-2 text-left">
                  備註
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="participant in district.participants" :key="participant.name">
                <td class="border p-2">
                  {{ participant.name }}
                </td>
                <td class="border p-2">
                  {{ participant.identity }}
                </td>
                <td class="border p-2">
                  {{ participant.departure }}
                </td>
                <td class="border p-2">
                  {{ participant.returnRide }}
                </td>
                <td class="border p-2">
                  {{ participant.notes }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-2 text-sm text-gray-600">
          總計: {{ district.participants.length }} 人
        </div>
      </div>

      <div class="bg-blue-50 p-4 rounded-lg">
        <h3 class="font-semibold text-lg">
          總統計
        </h3>
        <p>總參與人數: {{ participants.length }} 人</p>
      </div>
    </div>
  </div>
</template>
