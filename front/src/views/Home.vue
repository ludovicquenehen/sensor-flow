<template>
  <div class="view">
    <div v-if="true" class="flex flex-col gap-8">
      <div
        v-for="project in projectHardware"
        class="border rounded-lg p-4 shadow-white/10 shadow-lg"
      >
        <div class="flex gap-1">
          <span class="font-bold">{{ project.label }}</span>
          <i v-if="project.run" class="mdi mdi-run text-yellow-600 text-xl" />
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            <div v-for="actuator in project.actuators" class="border border-plum rounded-lg p-4">
              {{ actuator.label }}
            </div>
          </div>
          <div class="flex gap-2">
            <div v-for="sensor in project.sensors" class="border border-green rounded-lg p-4">
              {{ sensor.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!useUserStore.isAdmin" class="flex flex-col text-center gap-8 mt-28">
      <i class="mdi mdi-emoticon-sad text-9xl text-orange-500" />
      <span class="text-5xl text-bold">Sorry...</span>
      <span class="text-2xl font-semibold">
        You must contact your organization admin to add you to a project or run a first test
      </span>
      <button class="button-white w-48 mx-auto">
        <a href="mailto:admin@admin.com">Contact admin</a>
      </button>
    </div>
    <div v-else class="flex flex-col text-center gap-8 mt-28">
      <i class="mdi mdi-check-circle text-9xl text-green-500" />
      <span class="text-5xl text-bold">Welcome !</span>
      <span class="text-2xl font-semibold">
        You must configure a project and run a first test to start
      </span>
      <div class="flex md:flex-row flex-col justify-center items-center gap-2">
        <button class="button-white w-48" @click="router.push('/admin/project')">
          Create first project
        </button>
        <button class="button-white w-48" @click="router.push('/admin/runner')">
          Run first test
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import useUserStore from '@/stores/use-user-store'
import useHardwaresStore from '@/stores/use-hardware-store'
import useProjectStore from '@/stores/use-project-store'

const router = useRouter()

const projectHardware = computed(() =>
  useProjectStore.projects.reduce(
    (acc, e) => ({
      ...acc,
      [e.id]: {
        ...e,
        actuators: useHardwaresStore.hardwares.filter(
          (h) => h.projectId === e.id && h.type === 'ACTUATOR'
        ),
        sensors: useHardwaresStore.hardwares.filter(
          (h) => h.projectId === e.id && h.type === 'SENSOR'
        ),
        run: !!useProjectStore.runs.find((p) => e.id == p.projectId)
      }
    }),
    {}
  )
)
</script>
<style></style>
