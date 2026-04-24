<script setup lang='ts'>
import { NSpin, NSpace, NCard, NTabs, NTabPane, NTag, NEmpty, NH2, NText, NButton, NModal, NDescriptions, NDescriptionsItem } from 'naive-ui'

import { fetchChildrenMeetingParticipants } from '@/hook/apis/childrenMeeting'
import type { ChildrenMeetingParticipant, ChildrenMeetingParticipantsResponse } from '@/types/apis/childrenMeeting'
import { GroupEnum, IdentityEnum } from '@/types/apis/childrenMeeting'

const churchKeys = ['H20', 'H21', 'H25', 'H28', 'H45', 'H48', 'H65', 'H70', 'H78'] as const

const createEmptyResponse = (): ChildrenMeetingParticipantsResponse =>
	churchKeys.reduce((acc, key) => {
		acc[key] = []
		return acc
	}, {} as ChildrenMeetingParticipantsResponse)

const loading = ref(true)
const rawData = ref<ChildrenMeetingParticipantsResponse>(createEmptyResponse())
const activeTab = ref('church')

const loadData = async () => {
	loading.value = true
	try {
		rawData.value = await fetchChildrenMeetingParticipants()
	} catch (error) {
		console.error(error)
	} finally {
		loading.value = false
	}
}

onMounted(loadData)

const participants = computed<ChildrenMeetingParticipant[]>(() => {
	const result: ChildrenMeetingParticipant[] = []
	for (const key of churchKeys) {
		for (const item of rawData.value[key] ?? []) {
			result.push({ ...item, church: item.church || key })
		}
	}
	return result
})

const isAdult = (identity: string) => identity === IdentityEnum.家長

const isGospelAdult = (identity: string) =>
	identity === IdentityEnum.家長福音朋友男 ||
	identity === IdentityEnum.家長福音朋友女

const isChild = (identity: string) =>
	identity === IdentityEnum.兒童男孩 ||
	identity === IdentityEnum.兒童女孩

const isGospelChild = (identity: string) =>
	identity === IdentityEnum.兒童福音朋友男孩 ||
	identity === IdentityEnum.兒童福音朋友女孩

const isServerOrLeader = (identity: string) =>
	identity === IdentityEnum.服事者 ||
	identity === IdentityEnum.青少年弟兄隊輔 ||
	identity === IdentityEnum.青少年姊妹隊輔 ||
	identity === IdentityEnum.大專弟兄隊輔 ||
	identity === IdentityEnum.大專姊妹隊輔

interface ChurchBreakdown {
	church: string
	adults: ChildrenMeetingParticipant[]
	gospelAdults: ChildrenMeetingParticipant[]
	children: ChildrenMeetingParticipant[]
	gospelChildren: ChildrenMeetingParticipant[]
	serversAndLeaders: ChildrenMeetingParticipant[]
	total: number
}

const churchTableData = computed<ChurchBreakdown[]>(() => {
	const map = new Map<string, ChurchBreakdown>()

	for (const p of participants.value) {
		if (!map.has(p.church)) {
			map.set(p.church, {
				church: p.church,
				adults: [],
				gospelAdults: [],
				children: [],
				gospelChildren: [],
				serversAndLeaders: [],
				total: 0
			})
		}

		const row = map.get(p.church)!
		if (isAdult(p.identity)) row.adults.push(p)
		else if (isGospelAdult(p.identity)) row.gospelAdults.push(p)
		else if (isChild(p.identity)) row.children.push(p)
		else if (isGospelChild(p.identity)) row.gospelChildren.push(p)
		else if (isServerOrLeader(p.identity)) row.serversAndLeaders.push(p)
		row.total++
	}

	const sortByName = (list: ChildrenMeetingParticipant[]) =>
		[...list].sort((a, b) => a.name.localeCompare(b.name))

	return Array.from(map.values())
		.map((row) => ({
			...row,
			adults: sortByName(row.adults),
			gospelAdults: sortByName(row.gospelAdults),
			children: sortByName(row.children),
			gospelChildren: sortByName(row.gospelChildren),
			serversAndLeaders: sortByName(row.serversAndLeaders)
		}))
		.sort((a, b) => a.church.localeCompare(b.church))
})

const churchTotals = computed(() => {
	return churchTableData.value.reduce(
		(acc, row) => ({
			adults: acc.adults + row.adults.length,
			gospelAdults: acc.gospelAdults + row.gospelAdults.length,
			children: acc.children + row.children.length,
			gospelChildren: acc.gospelChildren + row.gospelChildren.length,
			serversAndLeaders: acc.serversAndLeaders + row.serversAndLeaders.length,
			total: acc.total + row.total
		}),
		{ adults: 0, gospelAdults: 0, children: 0, gospelChildren: 0, serversAndLeaders: 0, total: 0 }
	)
})

const groupOrder = [
	GroupEnum.第一組,
	GroupEnum.第二組,
	GroupEnum.第三組,
	GroupEnum.第四組,
	GroupEnum.第五組,
	GroupEnum.第六組,
	GroupEnum.第七組,
	GroupEnum.第八組,
	GroupEnum.第九組,
	GroupEnum.第十組,
	GroupEnum.不分組
]

const groupLeader = [
	'___',
	'___',
	'___',
	'___',
	'___',
	'___',
	'___',
	'___',
	'___',
	'___',
	'___'
]

interface GroupSection {
	group: string
	leader: string
	participants: ChildrenMeetingParticipant[]
}

const selectedParticipant = ref<ChildrenMeetingParticipant | null>(null)
const showParticipantModal = ref(false)

const openParticipantModal = (participant: ChildrenMeetingParticipant) => {
	selectedParticipant.value = participant
	showParticipantModal.value = true
}

const formatDayValue = (value: string | boolean) => {
	if (typeof value === 'boolean') return value ? '是' : '否'
	return value || '-'
}

const groupedData = computed<GroupSection[]>(() => {
	const sections: GroupSection[] = []
	for (let i = 0; i < groupOrder.length; i++) {
		const group = groupOrder[i]
		const members = participants.value
			.filter((p) => p.group === group)
			.sort((a, b) => a.church.localeCompare(b.church) || a.name.localeCompare(b.name))
		if (members.length > 0) {
			sections.push({ group, leader: groupLeader[i] ?? '', participants: members })
		}
	}
	return sections
})

</script>

<template>
  <n-spin
    :show="loading"
    description="數據計算約 5~10 秒,請稍候"
  >
    <n-space
      vertical
      :size="16"
      class="p-6"
    >
      <n-space
        justify="space-between"
        align="center"
      >
        <n-h2 class="m-0">
          2026兒童品格園統計
        </n-h2>
        <n-button
          type="primary"
          size="small"
          :loading="loading"
          @click="loadData"
        >
          重新整理
        </n-button>
      </n-space>

      <n-empty
        v-if="!loading && participants.length === 0"
        description="尚無資料"
      />

      <n-tabs
        v-else
        v-model:value="activeTab"
        type="line"
        animated
      >
        <n-tab-pane name="church" tab="各會所報名">
          <n-space vertical :size="16">
            <n-card>
              <n-space :size="[16, 8]">
                <n-text>
                  家長:{{ churchTotals.adults }} 位
                </n-text>
                <n-text>
                  福音家長:{{ churchTotals.gospelAdults }} 位
                </n-text>
                <n-text>
                  兒童:{{ churchTotals.children }} 位
                </n-text>
                <n-text>
                  福音兒童:{{ churchTotals.gospelChildren }} 位
                </n-text>
                <n-text>
                  服事:{{ churchTotals.serversAndLeaders }} 位
                </n-text>
                <n-text strong>
                  總計:{{ churchTotals.total }} 人
                </n-text>
              </n-space>
            </n-card>

            <n-card
              v-for="row in churchTableData"
              :key="row.church"
              :title="`${row.church} (${row.total} 人)`"
            >
              <n-space vertical :size="8">
                <div v-if="row.adults.length">
                  <n-text strong class="block">
                    家長:{{ row.adults.length }} 位
                  </n-text>
                  <n-space :size="[6, 6]">
                    <n-tag
                      v-for="(participant, index) in row.adults"
                      :key="`${row.church}-adult-${participant.name}-${index}`"
                      :bordered="false"
                      size="small"
                      class="cursor-pointer"
                      @click="openParticipantModal(participant)"
                    >
                      {{ participant.name }}
                    </n-tag>
                  </n-space>
                </div>
                <div v-if="row.gospelAdults.length">
                  <n-text strong class="block">
                    福音家長:{{ row.gospelAdults.length }} 位
                  </n-text>
                  <n-space :size="[6, 6]">
                    <n-tag
                      v-for="(participant, index) in row.gospelAdults"
                      :key="`${row.church}-gospelAdult-${participant.name}-${index}`"
                      :bordered="false"
                      size="small"
                      class="cursor-pointer"
                      @click="openParticipantModal(participant)"
                    >
                      {{ participant.name }}
                    </n-tag>
                  </n-space>
                </div>
                <div v-if="row.children.length">
                  <n-text strong class="block">
                    兒童:{{ row.children.length }} 位
                  </n-text>
                  <n-space :size="[6, 6]">
                    <n-tag
                      v-for="(participant, index) in row.children"
                      :key="`${row.church}-child-${participant.name}-${index}`"
                      :bordered="false"
                      size="small"
                      class="cursor-pointer"
                      @click="openParticipantModal(participant)"
                    >
                      {{ participant.name }}
                    </n-tag>
                  </n-space>
                </div>
                <div v-if="row.gospelChildren.length">
                  <n-text strong class="block">
                    福音兒童:{{ row.gospelChildren.length }} 位
                  </n-text>
                  <n-space :size="[6, 6]">
                    <n-tag
                      v-for="(participant, index) in row.gospelChildren"
                      :key="`${row.church}-gospel-${participant.name}-${index}`"
                      :bordered="false"
                      size="small"
                      class="cursor-pointer"
                      @click="openParticipantModal(participant)"
                    >
                      {{ participant.name }}
                    </n-tag>
                  </n-space>
                </div>
                <div v-if="row.serversAndLeaders.length">
                  <n-text strong class="block">
                    服事:{{ row.serversAndLeaders.length }} 位
                  </n-text>
                  <n-space :size="[6, 6]">
                    <n-tag
                      v-for="(participant, index) in row.serversAndLeaders"
                      :key="`${row.church}-server-${participant.name}-${index}`"
                      :bordered="false"
                      size="small"
                      class="cursor-pointer"
                      @click="openParticipantModal(participant)"
                    >
                      {{ participant.name }}
                      <n-text depth="3" class="ml-1">
                        {{ participant.identity }}
                      </n-text>
                    </n-tag>
                  </n-space>
                </div>
              </n-space>
            </n-card>
          </n-space>
        </n-tab-pane>

        <n-tab-pane name="group" tab="分組">
          <n-space vertical :size="16">
            <n-card
              v-for="section in groupedData"
              :key="section.group"
              :title="`${section.group} (${section.participants.length} 人)`"
            >
              <n-text
                v-if="section.leader"
                depth="2"
                class="mb-2 block"
              >
                隊輔:{{ section.leader }}
              </n-text>
              <div class="grid grid-cols-2 gap-2">
                <n-tag
                  v-for="(participant, index) in section.participants"
                  :key="`${section.group}-${participant.name}-${index}`"
                  :bordered="false"
                  size="small"
                >
                  <n-text
                    depth="3"
                    class="mr-1"
                  >
                    {{ participant.church }}
                  </n-text>
                  {{ participant.name }}
                  <n-text
                    v-if="participant.grade"
                    depth="3"
                    class="ml-1"
                  >
                    {{ participant.grade }}
                  </n-text>
                </n-tag>
              </div>
            </n-card>
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </n-space>

    <n-modal
      v-model:show="showParticipantModal"
      preset="card"
      title="報名資料"
      class="max-w-lg"
    >
      <n-descriptions
        v-if="selectedParticipant"
        :column="1"
        label-placement="left"
        bordered
      >
        <n-descriptions-item label="會所">
          {{ selectedParticipant.church }}
        </n-descriptions-item>
        <n-descriptions-item label="姓名">
          {{ selectedParticipant.name }}
        </n-descriptions-item>
        <n-descriptions-item label="性別">
          {{ selectedParticipant.gender || '-' }}
        </n-descriptions-item>
        <n-descriptions-item label="身份">
          {{ selectedParticipant.identity || '-' }}
        </n-descriptions-item>
        <n-descriptions-item
          v-if="selectedParticipant.grade"
          label="年級"
        >
          {{ selectedParticipant.grade }}
        </n-descriptions-item>
        <n-descriptions-item
          v-if="selectedParticipant.school"
          label="學校"
        >
          {{ selectedParticipant.school }}
        </n-descriptions-item>
        <n-descriptions-item
          v-if="selectedParticipant.adultName"
          label="家長姓名"
        >
          {{ selectedParticipant.adultName }}
        </n-descriptions-item>
        <n-descriptions-item
          v-if="selectedParticipant.clothSize"
          label="衣服尺寸"
        >
          {{ selectedParticipant.clothSize }}
        </n-descriptions-item>
        <n-descriptions-item
          v-if="selectedParticipant.group"
          label="分組"
        >
          {{ selectedParticipant.group }}
        </n-descriptions-item>
        <n-descriptions-item label="第一天">
          {{ formatDayValue(selectedParticipant.firstDay) }}
        </n-descriptions-item>
        <n-descriptions-item label="第二天">
          {{ formatDayValue(selectedParticipant.secondDay) }}
        </n-descriptions-item>
        <n-descriptions-item
          v-if="selectedParticipant.cost"
          label="費用"
        >
          {{ selectedParticipant.cost }}
        </n-descriptions-item>
      </n-descriptions>
    </n-modal>
  </n-spin>
</template>
