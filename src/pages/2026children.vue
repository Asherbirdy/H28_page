<script setup lang='ts'>
import { NSpin } from 'naive-ui'

import { fetchChildrenMeetingParticipants } from '@/hook/apis/childrenMeeting'
import type { ChildrenMeetingParticipantsResponse } from '@/types/apis/childrenMeeting'

const loading = ref(true)
const data = ref<ChildrenMeetingParticipantsResponse>([])

onMounted(async () => {
	try {
		data.value = await fetchChildrenMeetingParticipants()
	} catch (error) {
		console.error(error)
	} finally {
		loading.value = false
	}
})
</script>

<template>
  <n-spin :show="loading">
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </n-spin>
</template>
