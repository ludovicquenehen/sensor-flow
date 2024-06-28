<template>
  <div class="view md:w-fit">
    <div class="text-xl text-white mb-8">Hardwares</div>
    <div class="flex md:flex-row flex-col gap-2 mt-4 md:w-fit w-full">
      <input v-model="form.label" placeholder="Label" />
      <select v-model="form.projectId">
        <option disabled value="">Project</option>
        <option v-for="project in useProjectStore.projects" :value="project.id">
          {{ project.label }}
        </option>
      </select>
      <select v-model="form.type">
        <option disabled value="">Type</option>
        <option v-for="role in ['SENSOR', 'ACTUATOR', 'SWITCH']" :value="role">{{ role }}</option>
      </select>
      <input v-model="form.api" placeholder="API" />
      <button
        :disabled="Object.values(form).some((e) => e === '')"
        class="button-green md:w-16"
        @click="useHardwaresStore.add(form)"
      >
        <i class="mdi mdi-send" />
      </button>
    </div>
    <Table :columns="columns" :rows="hardwares" />
  </div>
</template>
<script setup>
import useHardwaresStore from '@/stores/use-hardware-store'
import Table from '@/components/tables/Table.vue'
import useProjectStore from '@/stores/use-project-store'

const hardwares = computed(() => useHardwaresStore.hardwares.sort((a, b) => (a.id > b.id ? 1 : -1)))

const form = ref({
  label: '',
  type: '',
  projectId: null,
  api: ''
})

const columns = ref([
  {
    label: 'Label',
    class: 'w-64',
    field: 'label'
  },
	{
    label: 'Project',
    class: 'w-32',
		field: (row) => useProjectStore.projects.find((e) => e.id === row.projectId)?.label
  },
  {
    label: 'Type',
    class: 'w-32 text-center',
    rowClass: (row) => [
      'w-32 text-center font-semibold',
      {
        'text-green': row.type === 'SENSOR',
        'text-plum': row.type === 'ACTUATOR',
        'text-warning': row.type === 'SWITCH'
      }
    ],
    field: 'type'
  },
	{
    label: 'API',
    class: 'w-64',
		field: 'api'
  },
  {
    class: 'w-32',
    command: {
      iconClass: 'mdi mdi-delete-outline',
      class: 'button-red w-32',
      action: (row) => useHardwaresStore.remove(row.id)
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
