<template>
  <div class="view md:w-fit">
    <div class="text-xl text-white mb-8">Cycles</div>
    <div class="flex md:flex-row flex-col gap-2 mt-4 md:w-fit w-full">
      <input v-model="form.label" placeholder="Label" />
      <select v-model="form.programId">
        <option disabled value="">Program</option>
        <option v-for="program in useProgramStore.programs" :value="program.id">
          {{ program.label }}
        </option>
      </select>
      <input v-model="form.start" placeholder="Start" type="date" />
      <input v-model="form.end" placeholder="End" type="date" />
      <button
        :disabled="Object.values(form).some((e) => e === '')"
        class="button-green md:w-16"
        @click="useCyclesStore.add(form)"
      >
        <i class="mdi mdi-send" />
      </button>
    </div>
    <div class="flex justify-between my-6">
      <div class="flex md:flex-row flex-col md:gap-8 gap-1 md:items-center">
        <div class="flex items-center gap-2">
          <span class="flex h-8 w-20 border-2 border-white"></span>
          <span class="text-white font-semibold">Future</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="flex bg-green-light h-8 w-20 border-2 border-white"></span>
          <span class="text-white font-semibold">Active</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="flex bg-red-light h-8 w-20 border-2 border-white"></span>
          <span class="text-white font-semibold">Pasted</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="flex bg-warning-light h-8 w-20 border-2 border-white"></span>
          <span class="text-white font-semibold">End today</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="flex bg-blue-light h-8 w-20 border-2 border-white"></span>
          <span class="text-white font-semibold">Start tomorrow</span>
        </div>
      </div>
    </div>
    <Table :columns="columns" :rows="cycles" :rowClass="rowClass" />
  </div>
</template>
<script setup>
import useCyclesStore from '@/stores/use-cycle-store'
import Table from '@/components/tables/Table.vue'
import useProgramStore from '@/stores/use-program-store'
import useProjectStore from '@/stores/use-project-store'

const cycles = computed(() => useCyclesStore.cycles.sort((a, b) => (a.id > b.id ? 1 : -1)))

const form = ref({
  label: '',
  start: new Date(),
  end: null,
  programId: null
})

const rowClass = (row) => {
  let today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const todayS = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`

  today.setDate(today.getDate() + 1)
  const yearT = today.getFullYear()
  const monthT = today.getMonth() + 1
  const dayT = today.getDate()
  const tomorrowS = `${yearT}-${monthT < 10 ? '0' : ''}${monthT}-${dayT < 10 ? '0' : ''}${dayT}`
  return [
    {
      'bg-red-light': row.end < todayS,
      'bg-warning-light': row.end === todayS,
      'bg-green-light': row.start <= todayS && todayS < row.end,
      'bg-blue-light': tomorrowS === row.start
    }
  ]
}

const columns = ref([
  {
    label: 'Label',
    class: 'w-64',
    field: 'label'
  },
  {
    label: 'Project',
    class: 'w-32',
    field: (row) =>
      useProjectStore.projects.find(
        (e) => e.id === useProgramStore.programs.find((e) => e.id === row.programId)?.id
      )?.label
  },
  {
    label: 'Program',
    class: 'w-32',
    field: (row) => useProgramStore.programs.find((e) => e.id === row.programId)?.label
  },
  {
    label: 'Start',
    class: 'w-64',
    field: 'start'
  },
  {
    label: 'End',
    class: 'w-64',
    field: 'end'
  },
  {
    class: 'w-32',
    command: {
      iconClass: 'mdi mdi-delete-outline',
      class: 'button-red w-32',
      action: (row) => useCyclesStore.remove(row.id)
    }
  }
])
</script>

<style scoped>
.copy-clipboard .text {
  display: block;
}

.copy-clipboard .value {
  display: none;
}

.copy-clipboard:hover .text {
  display: none;
}

.copy-clipboard:hover .value {
  display: block;
}
</style>
