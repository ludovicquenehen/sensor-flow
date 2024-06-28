<template>
  <div class="view md:w-fit">
    <div class="text-xl text-white mb-8">Projects</div>
    <div class="flex md:flex-row flex-col gap-2 mt-4">
      <input v-model="form.label" placeholder="Label" />
      <button
        :disabled="Object.values(form).some((e) => !e)"
        class="button-green md:w-16"
        @click="useProjectStore.add(form)"
      >
        <i class="mdi mdi-plus" />
      </button>
    </div>
    <Table :columns="columns" :rows="projects" />
  </div>
</template>
<script setup>
import useProjectStore from '@/stores/use-project-store'
import Table from '@/components/tables/Table.vue'
import useHardwareStore from '@/stores/use-hardware-store'

const projects = computed(() =>
  useProjectStore.projects.sort((a, b) => a.label.localeCompare(b.label))
)
const form = ref({
  label: '',
})

const columns = ref([
  {
    label: 'Label',
    class: 'w-32',
    field: 'label'
  },
  {
    label: 'Hardwares',
    class: 'w-72',
    field: (row) => {
			const harwaresProject = useHardwareStore.hardwares.filter(e =>  e.projectId === row.id)
      const sensors = harwaresProject.filter((e) => e.type === 'SENSOR')
      const actuators = harwaresProject.filter((e) => e.type === 'ACTUATOR')
      const switches = harwaresProject.filter((e) => e.type === 'SWITCH')
      return `${sensors.length} sensors / ${actuators.length} actuators / ${switches.length} switches`
    }
  },
  {
    class: 'w-32',
    command: {
      iconClass: 'mdi mdi-delete-outline',
      class: 'button-red w-32',
      action: (row) => useProjectStore.remove(row.id)
    }
  }
])
</script>
