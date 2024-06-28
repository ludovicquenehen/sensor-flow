<template>
  <div class="view md:w-fit">
    <div class="text-xl text-white mb-8">Projects</div>
    <div class="flex md:flex-row flex-col gap-2 mt-4">
      <input v-model="form.label" placeholder="Label" />
      <input v-model="form.path" placeholder="Project path" />
      <input v-model="form.pathTests" placeholder="Tests path" />
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

const projects = computed(() =>
  useProjectStore.projects.sort((a, b) => a.label.localeCompare(b.label))
)
const form = ref({
  label: '',
  path: '',
  pathTests: ''
})

const columns = ref([
  {
    label: 'Label',
    class: 'w-32',
    field: 'label'
  },
  {
    label: 'Path',
    class: 'w-64 text-center',
    rowClass: 'w-64 text-center font-semibold',
    field: 'path'
  },
  {
    label: 'Path tests',
    class: 'w-64 text-center',
    rowClass: 'w-64 text-center font-semibold',
    field: 'pathTests'
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
