<template>
  <div class="view md:w-fit">
    <div class="text-xl text-white mb-8">Runs</div>
    <Table :columns="columns" :rows="projects" />
  </div>
</template>
<script setup>
import useProjectStore from '@/stores/use-project-store'
import Table from '@/components/tables/Table.vue'

const projects = computed(() =>
  useProjectStore.projects.sort((a, b) => a.label.localeCompare(b.label))
)

const columns = ref([
  {
    label: 'Project',
    class: 'w-32',
    field: 'label'
  },
  {
    class: 'w-16',
    command: {
      iconClass: 'mdi mdi-play-circle-outline',
      class: 'button-green md:w-16 w-32',
      disabled: (row) => useProjectStore.runs.find((e) => e.projectId == row.id),
      action: (row) => useProjectStore.run(row.id)
    }
  },
  {
    class: 'w-16',
    command: {
      iconClass: 'mdi mdi-stop-circle-outline',
      class: 'button-red md:w-16 w-32',
      disabled: (row) => !useProjectStore.runs.find((e) => e.projectId == row.id),
      action: (row) => useProjectStore.stop(row.id)
    }
  },
  {
    label: 'Since',
    class: 'w-16',
    field: (row) => {
      const since = useProjectStore.runs.find((e) => e.projectId == row.id)?.since
      return since ? `${Math.floor((Date.now() - since) / 1000)}s` : ''
    }
  }
])
</script>
