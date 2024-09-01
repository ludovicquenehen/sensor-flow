<template>
  <div class="view md:w-fit">
    <div class="text-xl text-white mb-8">Programs</div>
    <div class="flex md:flex-row flex-col gap-2 mt-4 md:w-fit w-full">
      <input v-model="form.label" placeholder="Label" />
      <select v-model="form.projectId">
        <option disabled value="">Project</option>
        <option v-for="project in useProjectStore.projects" :value="project.id">
          {{ project.label }}
        </option>
      </select>
      <button
        :disabled="Object.values(form).some((e) => e === '')"
        class="button-green md:w-16"
        @click="useProgramsStore.add(form)"
      >
        <i class="mdi mdi-send" />
      </button>
    </div>
    <Table :columns="columns" :rows="programs" />
  </div>
</template>
<script setup>
import useProgramsStore from '@/stores/use-program-store'
import Table from '@/components/tables/Table.vue'
import useProjectStore from '@/stores/use-project-store'
import router from '@/router'

const programs = computed(() => useProgramsStore.programs.sort((a, b) => (a.id > b.id ? 1 : -1)))

const form = ref({
  label: '',
  projectId: null
})

const columns = ref([
  {
    label: 'Label',
    class: 'w-32',
    field: 'label'
  },
  {
    label: 'Project',
    class: 'w-32',
    field: (row) => useProjectStore.projects.find((e) => e.id === row.projectId)?.label
  },
  {
    class: 'w-32',
    command: {
      iconClass: 'mdi mdi-cog-outline',
      class: 'button-action w-32',
      action: (row) => openProgramModal(row.id)
    }
  },
  {
    class: 'w-32',
    command: {
      iconClass: 'mdi mdi-delete-outline',
      class: 'button-red w-32',
      action: (row) => useProgramsStore.remove(row.id)
    }
  }
])

const openProgramModal = (programId) => {
  router.push(`/admin/program-config/${programId}`)
}
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
