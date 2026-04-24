<script setup lang='ts'>
import type { DataTableColumns } from 'naive-ui'
import { NSpin, NSpace, NCard, NTabs, NTabPane, NDataTable, NTag, NEmpty, NH2, NText } from 'naive-ui'
import { h } from 'vue'

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

onMounted(async () => {
	try {
		rawData.value = await fetchChildrenMeetingParticipants()
	} catch (error) {
		console.error(error)
	} finally {
		loading.value = false
	}
})

const participants = computed<ChildrenMeetingParticipant[]>(() => {
	const result: ChildrenMeetingParticipant[] = []
	for (const key of churchKeys) {
		for (const item of rawData.value[key] ?? []) {
			result.push({ ...item, church: item.church || key })
		}
	}
	return result
})

const isParent = (identity: string) =>
	identity === IdentityEnum.家長 ||
	identity === IdentityEnum.家長福音朋友男 ||
	identity === IdentityEnum.家長福音朋友女

const isChild = (identity: string) =>
	identity === IdentityEnum.兒童男孩 ||
	identity === IdentityEnum.兒童女孩 ||
	identity === IdentityEnum.兒童福音朋友男孩 ||
	identity === IdentityEnum.兒童福音朋友女孩

const isServer = (identity: string) => identity === IdentityEnum.服事者

const isYouthLeader = (identity: string) =>
	identity === IdentityEnum.青少年弟兄隊輔 ||
	identity === IdentityEnum.青少年姊妹隊輔

const isCollegeLeader = (identity: string) =>
	identity === IdentityEnum.大專弟兄隊輔 ||
	identity === IdentityEnum.大專姊妹隊輔

interface ChurchRow {
	church: string
	parent: number
	child: number
	server: number
	youthLeader: number
	collegeLeader: number
	total: number
}

const churchTableData = computed<ChurchRow[]>(() => {
	const map = new Map<string, ChurchRow>()

	for (const p of participants.value) {
		if (!map.has(p.church)) {
			map.set(p.church, {
				church: p.church,
				parent: 0,
				child: 0,
				server: 0,
				youthLeader: 0,
				collegeLeader: 0,
				total: 0
			})
		}

		const row = map.get(p.church)!
		if (isParent(p.identity)) row.parent++
		else if (isChild(p.identity)) row.child++
		else if (isServer(p.identity)) row.server++
		else if (isYouthLeader(p.identity)) row.youthLeader++
		else if (isCollegeLeader(p.identity)) row.collegeLeader++
		row.total++
	}

	return Array.from(map.values()).sort((a, b) => a.church.localeCompare(b.church))
})

const churchTotals = computed(() => {
	return churchTableData.value.reduce(
		(acc, row) => ({
			parent: acc.parent + row.parent,
			child: acc.child + row.child,
			server: acc.server + row.server,
			youthLeader: acc.youthLeader + row.youthLeader,
			collegeLeader: acc.collegeLeader + row.collegeLeader,
			total: acc.total + row.total
		}),
		{ parent: 0, child: 0, server: 0, youthLeader: 0, collegeLeader: 0, total: 0 }
	)
})

const churchColumns: DataTableColumns<ChurchRow> = [
	{ title: '會所', key: 'church', fixed: 'left', width: 120 },
	{ title: '家長', key: 'parent', align: 'center' },
	{ title: '兒童', key: 'child', align: 'center' },
	{ title: '服事者', key: 'server', align: 'center' },
	{ title: '青少年隊輔', key: 'youthLeader', align: 'center' },
	{ title: '大專隊輔', key: 'collegeLeader', align: 'center' },
	{
		title: '總計',
		key: 'total',
		align: 'center',
		render: (row) => h('strong', null, row.total)
	}
]

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

interface GroupSection {
	group: string
	participants: ChildrenMeetingParticipant[]
}

const groupedData = computed<GroupSection[]>(() => {
	const sections: GroupSection[] = []
	for (const group of groupOrder) {
		const members = participants.value
			.filter((p) => p.group === group)
			.sort((a, b) => a.church.localeCompare(b.church) || a.name.localeCompare(b.name))
		if (members.length > 0) {
			sections.push({ group, participants: members })
		}
	}
	return sections
})

const getIdentityTagType = (identity: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
	if (isChild(identity)) return 'success'
	if (isParent(identity)) return 'info'
	if (isServer(identity)) return 'warning'
	if (isYouthLeader(identity) || isCollegeLeader(identity)) return 'error'
	return 'default'
}
</script>

<template>
  <n-spin :show="loading">
    <n-space
      vertical
      :size="16"
      class="p-6"
    >
      <n-h2>H28 兒童相調報名統計</n-h2>

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
        <n-tab-pane name="church" tab="各會所數據">
          <n-card>
            <n-data-table
              :columns="churchColumns"
              :data="churchTableData"
              :bordered="false"
              :single-line="false"
              size="small"
              :summary="() => ({
                church: { value: '總計', colSpan: 1 },
                parent: { value: churchTotals.parent },
                child: { value: churchTotals.child },
                server: { value: churchTotals.server },
                youthLeader: { value: churchTotals.youthLeader },
                collegeLeader: { value: churchTotals.collegeLeader },
                total: { value: churchTotals.total },
              })"
            />
          </n-card>
        </n-tab-pane>

        <n-tab-pane name="group" tab="分組">
          <n-space vertical :size="16">
            <n-card
              v-for="section in groupedData"
              :key="section.group"
              :title="`${section.group} (${section.participants.length} 人)`"
            >
              <n-space :size="[8, 8]">
                <n-tag
                  v-for="(participant, index) in section.participants"
                  :key="`${section.group}-${participant.name}-${index}`"
                  :type="getIdentityTagType(participant.identity)"
                  :bordered="false"
                >
                  <n-text
                    depth="3"
                    class="mr-1"
                  >
                    {{ participant.church }}
                  </n-text>
                  {{ participant.name }}
                </n-tag>
              </n-space>
            </n-card>
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </n-space>
  </n-spin>
</template>
